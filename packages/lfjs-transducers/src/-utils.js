import {
  TRANSDUCER_INIT,
  TRANSDUCER_RESULT,
  TRANSDUCER_STEP
} from './-protocol';

import {
  iterator
} from './-iterator';

import LazyTransformer from './lazy-transformer';

import {
  isPlainObject,
  isFunction,
  isSet,
  constant,
  identity
} from 'lodash';

export function isTransducer(xform) {
  return xform && isFunction(xform[TRANSDUCER_STEP]);
}

export function isColl(coll) {
  return Array.isArray(coll)
    || isPlainObject(coll)
    || isSet(coll)
    || isSeq(coll);
}

export function isSeq(obj) {
  return obj instanceof LazyTransformer;
}

export function isIterator(obj) {
  // Accept ill-formed iterators that don't conform to the
  // protocol by accepting just next()
  return obj && (obj[Symbol.iterator] || isFunction(obj.next));
}

export function wrap(f) {
  return isFunction(f) ? transformer(f) : f;
}

export function transformer(f) {
  return {
    [TRANSDUCER_INIT]: constant(null),
    [TRANSDUCER_RESULT]: identity,
    [TRANSDUCER_STEP]: f
  };
}

export function toIterator(xform, coll) {
  if (!xform) {
    return iterator(coll);
  }
  return new LazyTransformer(xform, coll);
}

export function toFn(xform, builder) {
  xform = xform(wrap(builder));
  return xform[TRANSDUCER_STEP].bind(xform);
}

export function push(ary, x) {
  if (arguments.length === 1) { return ary; }
  ary.push(x);
  return ary;
}

export function add(set, x) {
  if (arguments.length === 1) { return set; }
  set.add(x);
  return set;
}

export function merge(obj, x) {
  if (arguments.length === 1) { return obj; }
  if (Array.isArray(x)) {
    obj[x[0]] = x[1];
  } else {
    Object.assign(obj, x);
  }
  return obj;
}

export function conj(obj, ...args) {
  switch (arguments.length) {
  case 0:
    return [];
  case 1:
    return obj;
  default:
    if (Array.isArray(obj)) {
      args.forEach(x => push(obj, x));
    } else if (isSet(obj)) {
      args.forEach(x => add(obj, x));
    } else {
      args.forEach(x => merge(obj, x));
    }

    return obj;
  }
}

export function completing(f, cf = identity) {
  return function(x, y) {
    switch (arguments.length) {
    case 0:
      return f();
    case 1:
      return cf(x);
    default:
      return f(x, y);
    }
  };
}

export function empty(coll) {
  if (Array.isArray(coll)) {
    return [];
  } else if (isPlainObject(coll)) {
    return Object.create(null);
  } else if (isSet(coll)) {
    return new Set();
  } else if (coll && coll[TRANSDUCER_INIT]) {
    return coll[TRANSDUCER_INIT]();
  } else if (coll && coll.constructor) {
    return new coll.constructor();
  }

  return null;
}
