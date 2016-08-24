export {
  toArray as seq,
  head,
  head as first,
  tail,
  tail as rest
} from 'lodash';

export const cons = (arg, v) => [arg, ...v];
export const pop = (v) => v.slice(0, -1);
export const last = (v) => v.slice(-1);
export const nth = (v, n) => v[n];
export const reverse = (v) => [].concat(v).reverse();
