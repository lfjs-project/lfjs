import {
  isEmpty,
  toArray,
  isSet,
  clone
} from 'lodash';

import { assert, typeOf } from './lang';

export function disj(s, ...args) {
  assert(isSet(s), `disj: first argument must be a set, was ${typeOf(s)}.`);

  s = clone(s);

  args.map(toArray).forEach(a => s.delete(a));

  return s;
}

export function join(s, ...args) {
  assert(isSet(s), `join: first argument must be a set, was ${typeOf(s)}.`);

  s = clone(s);

  args.map(toArray).forEach(a => s.add(a));

  return s;
}

export function set(seq) {
  if (isEmpty(seq)) {
    return new Set();
  } else {
    return new Set(toArray(seq));
  }
}
