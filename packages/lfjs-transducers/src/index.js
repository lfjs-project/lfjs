import {
  ary,
  compose,
  constant,
  filter as arrayFilter,
  identity,
  isEqual,
  isNil,
  isNumber,
  isPlainObject,
  isSet,
  map as arrayMap
} from 'lodash';

import {
  TRANSDUCER_INIT,
  TRANSDUCER_RESULT,
  TRANSDUCER_STEP,
  deref,
  ensureReduced,
  isReduced,
  reduced,
  unreduced
} from './-protocol';

import {
  constantSeq,
  infinitSeq,
  iterator
} from './-iterator';

import {
  add,
  empty,
  isIterator,
  isTransducer,
  merge,
  push,
  wrap
} from './-utils';

import reduceObservable, { isObservable } from './observable';
import reducePromiseArray, { isPromise } from './promise';
import LazyTransformer from './lazy-transformer';

export {
  completing,
  conj,
  empty,
  isColl,
  isSeq,
  toFn,
  toIterator
} from './-utils';

export {
  LazyTransformer,
  isObservable,
  isPromise,
  reducePromiseArray as all
};

export function defineTransducerProtocol(obj, { init, result, step }) {
  Object.assign(obj.prototype, {
    [TRANSDUCER_INIT]: init,
    [TRANSDUCER_RESULT]: result,
    [TRANSDUCER_STEP]: step
  });
}

export function seq(coll, xform) {
  if (Array.isArray(coll)) {
    return transduce(xform, push, [], coll);
  } else if (isPlainObject(coll)) {
    return transduce(xform, merge, Object.create(null), coll);
  } else if (isSet(coll)) {
    return transduce(xform, add, new Set(), coll);
  } else if (isObservable(coll)) {
    return reduceObservable(xform, coll);
  } else if (isTransducer(coll)) {
    return transduce(xform, coll, empty(coll), coll);
  } else if (isIterator(coll)) {
    return new LazyTransformer(xform, coll);
  }

  throwProtocolError('sequence', coll);
}

export function into(to, xform, from) {
  if (arguments.length === 2) {
    from = xform;
    xform = null;
  }

  if (Array.isArray(to)) {
    return _into(push, to, from, xform);
  } else if (isPlainObject(to)) {
    return _into(merge, to, from, xform);
  } else if (isSet(to)) {
    return _into(add, to, from, xform);
  } else if (isTransducer(to)) {
    return _into(to, to, from, xform);
  }

  throwProtocolError('into', to);
}

function _into(f, to, from, xform) {
  if (!xform) {
    return reduce(f, to, from);
  }

  return transduce(xform, f, to, from);
}

export function transduce(xform, f, init, coll) {
  xform = xform(wrap(f));

  if (arguments.length === 3) {
    coll = init;
    init = xform[TRANSDUCER_INIT]();
  }

  return _reduce(xform, init, coll);
}

export function reduce(f, init, coll) {
  let xform = wrap(f);

  if (arguments.length === 2) {
    coll = init;
    init = xform[TRANSDUCER_INIT]();
  }

  return _reduce(xform, init, coll);
}

function _reduce(xform, result, coll) {
  if (Array.isArray(coll)) {
    let index = -1;
    let len = coll.length;

    while (++index < len) {
      result = xform[TRANSDUCER_STEP](result, coll[index]);
      if (isReduced(result)) {
        result = deref(result);
        break;
      }
    }
    return xform[TRANSDUCER_RESULT](result);
  } else if (isPlainObject(coll) || isIterator(coll)) {
    let iter = iterator(coll);
    let val = iter.next();

    while (!val.done) {
      result = xform[TRANSDUCER_STEP](result, val.value);
      if (isReduced(result)) {
        result = deref(result);
        break;
      }
      val = iter.next();
    }
    return xform[TRANSDUCER_RESULT](result);
  }

  throwProtocolError('iterate', coll);
}

function throwProtocolError(name, coll) {
  throw new Error(`Don't know how to ${name} collection: ${coll}`);
}

class Transformer {
  constructor(xform) {
    this.xform = xform;
  }

  [TRANSDUCER_INIT]() {
    return this.xform[TRANSDUCER_INIT]();
  }
}

class TransformerWithResult extends Transformer {
  [TRANSDUCER_RESULT](v) {
    return this.xform[TRANSDUCER_RESULT](v);
  }
}

class TransformerWithFn extends TransformerWithResult {
  constructor(f, xform) {
    super(xform);
    this.f = f;
  }
}

class Map extends TransformerWithFn {
  [TRANSDUCER_STEP](res, input) {
    return this.xform[TRANSDUCER_STEP](res, this.f(input));
  }
}

/**
 *
 */
export function map(f, coll) {
  if (coll) {
    if (Array.isArray(coll)) {
      return arrayMap(coll, ary(f, 1));
    }
    return seq(coll, map(f));
  }

  return function(xform) {
    return new Map(f, xform);
  }
}

class MapIndexed extends TransformerWithFn {
  constructor(f, xform) {
    super(f, xform);
    this.i = 0;
  }

  [TRANSDUCER_STEP](res, input) {
    return this.xform[TRANSDUCER_STEP](res,
      this.f(input, this.i++));
  }
}

/**
 *
 */
export function mapIndexed(f, coll) {
  if (coll) {
    if (Array.isArray(coll)) {
      return arrayMap(coll, ary(f, 2));
    }
    return seq(coll, mapIndexed(f));
  }

  return function(xform) {
    return new MapIndexed(f, xform);
  }
}

class Filter extends TransformerWithFn {
  [TRANSDUCER_STEP](res, input) {
    if (this.f(input)) {
      return this.xform[TRANSDUCER_STEP](res, input);
    }
    return res;
  }
}

/**
 *
 */
export function filter(f, coll) {
  if (coll) {
    if (Array.isArray(coll)) {
      return arrayFilter(coll, ary(f, 1));
    }
    return seq(coll, filter(f));
  }

  return function(xform) {
    return new Filter(f, xform);
  };
}

/**
 *
 */
export function remove(f, coll) {
  return filter((x) => !f(x), coll);
}

/**
 *
 */
export function keep(coll) {
  return filter((x) => !isNil(x), coll);
}

class Dedupe extends TransformerWithResult {
  constructor(xform) {
    super(xform);
    this.last = undefined;
  }

  [TRANSDUCER_STEP](result, input) {
    if (!isEqual(input, this.last)) {
      this.last = input;
      return this.xform[TRANSDUCER_STEP](result, input);
    }
    return result;
  }
}

/**
 *
 */
export function dedupe(coll) {
  if (coll) {
    return seq(coll, dedupe());
  }

  return function(xform) {
    return new Dedupe(xform);
  }
}

class TakeWhile extends TransformerWithFn {
  [TRANSDUCER_STEP](result, input) {
    if (this.f(input)) {
      return this.xform[TRANSDUCER_STEP](result, input);
    }
    return reduced(result);
  }
}

/**
 *
 */
export function takeWhile(f, coll) {
  if (coll) {
    return seq(coll, takeWhile(f));
  }

  return function(xform) {
    return new TakeWhile(f, xform);
  }
}

class Take extends TransformerWithResult {
  constructor(n, xform) {
    super(xform);
    this.n = n;
    this.i = 0;
  }

  [TRANSDUCER_STEP](result, input) {
    if (this.i < this.n) {
      result = this.xform[TRANSDUCER_STEP](result, input);
      if (this.i + 1 >= this.n) {
        // Finish reducing on the same step as the final value. TODO:
        // double-check that this doesn't break any semantics
        result = ensureReduced(result);
      }
    }
    this.i++;
    return result;
  }
}

/**
 *
 */
export function take(n, coll) {
  if (coll) {
    return seq(coll, take(n));
  }

  return function(xform) {
    return new Take(n, xform);
  }
}

class Drop extends TransformerWithResult {
  constructor(n, xform) {
    super(xform);
    this.n = n;
    this.i = 0;
  }

  [TRANSDUCER_STEP](result, input) {
    if (this.i++ < this.n) {
      return result;
    }
    return this.xform[TRANSDUCER_STEP](result, input);
  }
}

/**
 *
 */
export function drop(n, coll) {
  if (coll) {
    return seq(coll, drop(n));
  }

  return function(xform) {
    return new Drop(n, xform);
  }
}

class DropWhile extends TransformerWithFn {
  constructor(f, xform) {
    super(f, xform);
    this.dropping = true;
  }

  [TRANSDUCER_STEP](result, input) {
    if (this.dropping) {
      if (this.f(input)) {
        return result;
      } else {
        this.dropping = false;
      }
    }
    return this.xform[TRANSDUCER_STEP](result, input);
  }
}

/**
 *
 */
export function dropWhile(f, coll) {
  if (coll) {
    return seq(coll, dropWhile(f));
  }

  return function(xform) {
    return new DropWhile(f, xform);
  }
}

class Partition extends TransformerWithResult {
  constructor(n, step, xform) {
    super(xform);
    this.n = n;
    this.step = step;
    this.i = 0;
    this.part = new Array(n);
  }

  [TRANSDUCER_STEP](result, input) {
    this.part[this.i] = input;
    this.i += 1;
    if (this.i === this.n) {
      let out = this.part.slice(0, this.n);
      this.part = new Array(this.n);
      this.i = 0;
      return this.xform[TRANSDUCER_STEP](result, out);
    }
    return result;
  }
}

/**
 *
 */
export function partition(n, step, coll) {
  if (!isNumber(step)) {
    coll = step;
    step = undefined;
  }

  if (isNil(step)) { step = n; }

  if (coll) {
    return seq(coll, partition(n, step));
  }

  return function(xform) {
    return new Partition(n, step, xform);
  };
}

class PartitionAll extends Transformer {
  constructor(n, step, xform) {
    super(xform);
    this.n = n;
    this.step = step;
    this.i = 0;
    this.part = new Array(n);
  }

  [TRANSDUCER_RESULT](v) {
    if (this.i > 0) {
      return unreduced(this.xform[TRANSDUCER_STEP](v, this.part.slice(0, this.i)));
    }
    return this.xform[TRANSDUCER_RESULT](v);
  }

  [TRANSDUCER_STEP](result, input) {
    this.part[this.i] = input;
    this.i += 1;
    if (this.i === this.n) {
      let out = this.part.slice(0, this.n);
      this.part = new Array(this.n);
      this.i = 0;
      return this.xform[TRANSDUCER_STEP](result, out);
    }
    return result;
  }
}

/**
 *
 */
export function partitionAll(n, step, coll) {
  if (!isNumber(step)) {
    coll = step;
    step = undefined;
  }

  if (isNil(step)) { step = n; }

  if (coll) {
    return seq(coll, partitionAll(n, step));
  }

  return function(xform) {
    return new PartitionAll(n, step, xform);
  };
}

const NOTHING = {};

class PartitionBy extends Transformer {
  constructor(f, xform) {
    super(xform);
    this.f = f;
    this.part = [];
    this.last = NOTHING;
  }

  [TRANSDUCER_RESULT](v) {
    let l = this.part.length;

    if (l > 0) {
      return unreduced(this.xform[TRANSDUCER_STEP](v, this.part.slice(0, l)));
    }

    return this.xform[TRANSDUCER_RESULT](v);
  }

  [TRANSDUCER_STEP](result, input) {
    let current = this.f(input);

    if (isEqual(current, this.last) || this.last === NOTHING) {
      this.part.push(input);
    } else {
      result = this.xform[TRANSDUCER_STEP](result, this.part);
      this.part = [input];
    }

    this.last = current;
    return result;
  }
}

/**
 *
 */
export function partitionBy(f, coll) {
  if (coll) {
    return seq(coll, partitionBy(f));
  }

  return function(xform) {
    return new PartitionBy(f, xform);
  };
}

class Interpose extends TransformerWithResult {
  constructor(sep, xform) {
    super(xform);
    this.sep = sep;
    this.started = false;
  }

  [TRANSDUCER_STEP](result, input) {
    if (this.started) {
      let withSep = this.xform[TRANSDUCER_STEP](result, this.sep);

      if (isReduced(withSep)) {
        return withSep;
      } else {
        return this.xform[TRANSDUCER_STEP](withSep, input);
      }
    } else {
      this.started = true;
      return this.xform[TRANSDUCER_STEP](result, input);
    }
  }
}

/**
 * Returns a new collection containing elements of the given
 * collection, separated by the specified separator. Returns a
 * transducer if a collection is not provided.
 */
export function interpose(separator, coll) {
  if (coll) {
    return seq(coll, interpose(separator));
  }

  return function(xform) {
    return new Interpose(separator, xform);
  };
}

class TakeNth extends TransformerWithResult {
  constructor(n, xform) {
    super(xform);
    this.n = n;
    this.i = -1;
  }

  [TRANSDUCER_STEP](result, input) {
    this.i += 1;
    if (this.i % this.n === 0) {
      return this.xform[TRANSDUCER_STEP](result, input);
    }
    return result;
  }
}

function preservingReduced(xform) {
  return {
    [TRANSDUCER_INIT]() {
      return xform[TRANSDUCER_INIT]();
    },
    [TRANSDUCER_RESULT](result) {
      return result;
    },
    [TRANSDUCER_STEP](result, input) {
      let ret = xform[TRANSDUCER_STEP](result, input);

      if (isReduced(ret)) {
        return reduced(ret);
      } else {
        return ret;
      }
    }
  };
}

/**
 * Returns a new collection of every nth element of the given
 * collection. Returns a transducer if a collection is not provided.
 */
export function takeNth(nth, coll) {
  if (coll) {
    return seq(coll, takeNth(nth));
  }

  return function(xform) {
    return new TakeNth(nth, xform);
  };
}

class Cat extends TransformerWithResult {
  constructor(xform) {
    super(preservingReduced(xform));
  }

  [TRANSDUCER_STEP](result, input) {
    return reduce(this.xform, result, input);
  }
}

/**
 * Returns a new collection of every nth element of the given
 * collection. Returns a transducer if a collection is not provided.
 */
export function cat(coll) {
  if (coll) {
    return seq(coll, cat());
  }

  return function(xform) {
    return new Cat(xform);
  };
}

/**
 * Returns a new collection of every nth element of the given
 * collection. Returns a transducer if a collection is not provided.
 */
export function mapcat(f, coll) {
  if (coll) {
    return seq(coll, mapcat(f));
  }

  return compose(map(f), cat());
}

export function repeatedly(n, fn) {
  let infinit = arguments.length === 1;

  if (infinit) { fn = n; }
  let s = seq(infinitSeq(fn), map(identity));

  if (infinit) { return s; }

  return into([], take(n), s);
}

export function repeat(n, arg) {
  if (arguments.length === 1) {
    return repeatedly(constant(n));
  }

  return repeatedly(n, constant(arg));
}

export function cycle(coll) {
  return seq(constantSeq(coll), cat());
}
