export { toArray as seq } from 'lodash/fp';
export { size as count } from 'lodash/fp';

export const conj = (array, ...a) => array.concat(a);
export const unshift = (array, ...a) => a.concat(array);
