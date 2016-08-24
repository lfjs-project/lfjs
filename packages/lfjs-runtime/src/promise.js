/* global Promise */

import { isError } from 'lodash';

const { all, resolve, reject } = Promise;
const _cast = Promise.cast || resolve;

export function isPromise(value) {
  return value && (
    value.constructor === Promise ||
    typeof value.then === 'function'
  );
}

export function cast(value, label) {
  if (isError(value)) {
    return reject(value, label);
  }

  return _cast(value, label);
}

export function chain(promise, ...args) {
  return args.reduce(
    (promise, fn) => promise.then(result => fn.call(null, result)),
    cast(promise)
  );
}

export function zipall(...args) {
  return all(args.map(cast));
}
