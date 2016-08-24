export {
  clone,
  has,
  range,
  size as count
} from 'lodash';

import {
  isEmpty,
  isPlainObject,
  isSet
} from 'lodash';

import { merge } from './hash-map';
import { _set } from './set';

const EMPTY_ARRAY = [];

export function empty(c) {
  if (Array.isArray(c)) {
    return EMPTY_ARRAY;
  } else if (isSet(c)) {
    return _set();
  } else if (isPlainObject(c)) {
    return merge();
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
  if (Array.isArray(c)) {
    return c.concat(args);
  } else if (isSet(c)) {
    return _set(Array.from(c).concat(args));
  } else if (isPlainObject(c)) {
    merge(c, ...args);
  }

  return null;
}

export { isEmpty };
