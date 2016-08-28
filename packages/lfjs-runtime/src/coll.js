export {
  clone,
  has,
  range,
  size as count,
  sortBy
} from 'lodash';

import {
  compose,
  isEmpty,
  isPlainObject,
  isSet,
  toArray,
  toPairs
} from 'lodash';

import {
  isPresent,
  val
} from './lang';

import {
  hashMap,
  merge
} from './hash-map';

import { set } from './set';

import { filter } from './transducers';

export { isEmpty };

export function isColl(coll) {
  return Array.isArray(coll)
    || isPlainObject(coll)
    || isSet(coll);
}

export function seq(coll) {
  if (isPlainObject(coll)) {
    return toPairs(coll);
  }

  return toArray(coll);
}

export function empty(c) {
  if (Array.isArray(c)) {
    return [];
  } else if (isSet(c)) {
    return set();
  } else if (isPlainObject(c)) {
    return hashMap();
  }

  return null;
}

export function notEmpty(c) {
  if (isEmpty(c)) {
    return null;
  }

  return c;
}

export function conj(c, ...args) {
  switch (arguments.length) {
  case 0:
    return [];
  case 1:
    return c;
  default:
    if (Array.isArray(c)) {
      return c.concat(args);
    } else if (isSet(c)) {
      return set(Array.from(c).concat(args));
    } else if (isPlainObject(c)) {
      return merge(c, ...args);
    }
  }

  return [];
}

export function cons(a, seq) {
  return [a, ...seq];
}

export function compact(c) {
  let fn = isPresent;

  if (isPlainObject(c)) {
    fn = compose(isPresent, val);
  }

  return filter(fn, c);
}
