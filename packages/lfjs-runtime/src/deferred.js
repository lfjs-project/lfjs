import Promise from 'any-promise';
import { isUndefined } from 'lodash/fp';

const { all, resolve, reject } = Promise;
const _cast = Promise.cast || resolve;
const PROMISE_SYMBOL = Symbol.for('promise');

export { resolve, reject }

export function deferred() {
  let deferred;

  let promise = new Promise((resolve, reject) => {
    deferred = Object.assign(resolve, { reject });
  });

  deferred[PROMISE_SYMBOL] = promise;

  return deferred;
}

export function deferred_QMARK_(deferred) {
  return isPromise(deferred) || isDeferred(deferred);
}

export function chain(deferred, ...args) {
  return args.reduce(
    (deferred, fn) => cast(deferred).then(fn),
    deferred
  );
}

export function cast(value, label) {
  if (isDeferred(value)) {
    return value[PROMISE_SYMBOL];
  }

  return _cast(value, label);
}

export function on_realized(deferred, callback) {
  return cast(deferred).then(callback);
}

export function _catch(deferred, callback) {
  return cast(deferred).catch(callback);
}

export function _finally(deferred, callback) {
  return cast(deferred).then(callback, callback);
}

export function timeout_BANG_(deferred, delay, value) {
  assertDeferred(deferred, 'timeout!');

  setTimeout(() => {
    if (isUndefined(value)) {
      deferred.reject(new TimeoutError('Deferred timeout'));
    } else {
      deferred(value);
    }
  }, delay);

  return deferred;
}

export function success_BANG_(deferred, value, label) {
  assertDeferred(deferred, 'success!');

  deferred(value, label);

  return deferred;
}

export function error_BANG_(deferred, reason, label) {
  assertDeferred(deferred, 'error!');

  deferred.reject(reason, label);

  return deferred;
}

export function zip(...args) {
  return all(args.map(cast));
}

class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
  }
}

function assertDeferred(value, operation) {
  if (!isDeferred(value)) {
    throw new Error(`Trying to ${operation} a non deferred object`);
  }
}

function isPromise(value) {
  return value && (
    value.constructor === Promise ||
    typeof value.then === 'function'
  );
}

function isDeferred(value) {
  return isPromise(value && value[PROMISE_SYMBOL]);
}
