export {
  isArray as isVector,
  isDate,
  isEqual,
  isFunction as isFn,
  isSet,
  isString,
  isNumber
} from 'lodash';

import {
  isEmpty,
  isNil,
  isPlainObject,
  last,
  toArray
} from 'lodash';

export {
  isNil,
  isPlainObject as isHashMap
};

import { isColl } from './coll';

export function isBlank(v) {
  switch (typeof v) {
  case 'object':
  case 'string':
    return isEmpty(v);
  default:
    return isNil(v);
  }
}

export function isPresent(v) {
  return !isBlank(v);
}

export function val(pair) {
  return pair[1];
}

export function key([key]) {
  return key;
}

export function assert(expr, message) {
  if (!expr) {
    throw new Error(message || `Assert failed: ${expr}`);
  }
}

export function isTrue(v) {
  return v === true;
}

export function isFalse(v) {
  return v === false;
}

export function typeOf(v) {
  let type = typeof v;
  switch (type) {
  case 'string':
  case 'number':
  case 'function':
  case 'boolean':
  case 'symbol':
    return type;
  default:
    if (isNil(v)) {
      return 'nil';
    } else if (Array.isArray(v)) {
      return 'vector';
    } else if (isPlainObject(v)) {
      return 'hash-map'
    }
  }
}

export function println(...args) {
  console.log(...args);
  return args[0];
}

export function apply(fn, ...args) {
  let args2 = last(args);

  assert(isColl(args2), `apply: first argument must be a collection, was ${typeOf(args2)}.`);

  return fn(...args.concat(toArray(args2)));
}
