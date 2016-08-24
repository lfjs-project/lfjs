import {
  compose,
  filter as _filter,
  fromPairs,
  isEmpty,
  isPlainObject,
  map as _map,
  negate,
  toPairs
} from 'lodash';

import {
  isPresent,
  key,
  val
} from './lang';

import {
  conj,
  empty
} from './coll';

export function map(fn, c) {
  return _into(_map, fn, c);
}

export function filter(fn, c) {
  return _into(_filter, fn, c);
}

export function remove(fn, c) {
  return _into(_filter, negate(fn), c);
}

export function compact(c) {
  return _into(_filter, isPresent, c, 'val');
}

export function reduce() {}

export function partition() {}

export function partitionAll() {}

export function partitionBy() {}

export function mapcat() {}

export function cat() {}

export function take() {}

export function takeNth() {}

export function takeWhile() {}

export function drop() {}

export function dropWhile() {}

export function distinct(coll) {
  if (isEmpty(arguments)) {
    return () => null;
  }

  return into(empty(coll), distinct(), coll);
}

export function interpose(coll) {
  if (isEmpty(arguments)) {
    return () => null;
  }

  return into(empty(coll), interpose(), coll);
}

export function dedupe(coll) {
  if (isEmpty(arguments)) {
    return () => null;
  }

  return into(empty(coll), dedupe(), coll);
}

export function transduce(xform, f, init, coll) {
  if (arguments.length === 3) {
    return transduce(xform, f, null, coll);
  }
}

export function into(to, xform, from) {
  return transduce(xform, conj, to, from);
}

function _into(xform, fn, from, target) {
  let isHashMap = isPlainObject(from);

  if (isHashMap) {
    from = toPairs(from);

    if (target === 'val') {
      fn = compose(fn, val);
    } else if (target === 'key') {
      fn = compose(fn, key);
    }
  }

  from = xform(from, v => fn.call(null, v));

  if (isHashMap) {
    return fromPairs(from);
  }

  return from;
}
