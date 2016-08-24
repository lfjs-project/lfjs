export {
  compose as comp,
  curry,
  memoize,
  once,
  partial
} from 'lodash';

export const juxt = (...fns) => (v) => fns.map(fn => fn.call(null, v));
