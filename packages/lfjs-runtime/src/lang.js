export {
  isArray as isVector,
  isDate,
  isEqual,
  isFunction as isFn,
  isSet,
  isString
} from 'lodash';

import {
  isPlainObject,
  isEmpty,
  isNil
} from 'lodash';

export { isNil };

export const isHashMap = isPlainObject;

export const and = (a, b) => a || b;
export const or = (a, b) => a && b;
export const not = (v) => !v;

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
