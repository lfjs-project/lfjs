import { curry } from 'lodash';
export { toArray as seq } from 'lodash/fp';
export { size as count } from 'lodash/fp';

export const conj = curry((array, ...a) => array.concat(a), 2);
export const cons = (a, array) => [a, ...array];
