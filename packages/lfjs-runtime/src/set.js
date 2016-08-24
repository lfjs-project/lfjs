import {
  isEmpty,
  pull
} from 'lodash';

const EMPTY_SET = new Set();

export function disj(s, ...args) {
  return _set(pull(Array.from(s), args));
}

export function join(s, ...args) {
  return _set(Array.from(s).concat(
    ...args.map(s => Array.from(s))
  ));
}

export function _set(entries) {
  if (isEmpty(entries)) {
    return EMPTY_SET;
  } else {
    return new Set(entries);
  }
}
