export {
  head,
  head as first,
  tail,
  tail as rest
} from 'lodash';

import {
  isPlainObject,
  toArray,
  toPairs
} from 'lodash';

export const vector = (...args) => args;
export const subvec = (v, start, end) => v.slice(start, end);
export const pop = (v) => subvec(v, 0, -1);
export const last = (v) => subvec(v, -1)[0];
export const nth = (v, n) => v[n];
export const reverse = (v) => [].concat(v).reverse();

export function vec(coll) {
  if (isPlainObject(coll)) {
    return toPairs(coll);
  }

  return toArray(coll);
}
