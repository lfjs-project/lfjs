const config = { Promise, setTimeout };

export function deferred() {
  let resolve, reject;

  let promise = new config.Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return { resolve, reject, promise };
}

export function configure( { Promise, setTimeout }) {
  if (Promise) { config.Promise = Promise; }
  if (setTimeout) { config.setTimeout = setTimeout; }
}

export default deferred;

export const resolve = config.Promise.resolve;
export const reject = config.Promise.reject;

const _cast = config.Promise.cast || resolve;
const { all } = config.Promise;

export function deferred_QMARK_(deferred) {
  return isPromise(deferred) || isDefer(deferred);
}

export function cast(value, label) {
  if (isDefer(value)) {
    return value.promise;
  }

  return _cast(value, label);
}

export function then(deferred, resolve, reject) {
  return cast(deferred).then(resolve, reject);
}

export function catch_BANG_(deferred, reject) {
  return cast(deferred).catch(reject);
}

export function finally_BANG_(deferred, callback) {
  return cast(deferred).finally(callback);
}

export function timeout_BANG_(deferred, delay, value) {
  let hasValue = arguments.length === 3;

  return new config.Promise((resolve, reject) => {
    then(deferred, resolve, reject);

    setTimeout(() => {
      if (hasValue) {
        resolve(value);
      } else {
        reject(new TimeoutError('Deferred timeout'));
      }
    }, delay);
  });
}

export function zip(...args) {
  return all(args.map(cast));
}

export function success_BANG_(deferred, value, label) {
  assertDefer(deferred, 'resolve');
  deferred.resolve(value, label);
}

export function error_BANG_(deferred, reason, label) {
  assertDefer(deferred, 'reject');
  deferred.reject(reason, label);
}

export function chain(deferred, ...args) {
  return args.reduce(
    (deferred, fn) => cast(deferred).then(fn),
    deferred
  );
}

class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
  }
}

function assertDefer(value, operation) {
  if (!isDefer(value)) {
    throw new Error(`Trying to ${operation} a non deferred object`);
  }
}

function isPromise(value) {
  return value && (
    value.constructor === config.Promise ||
    typeof value.then === 'function'
  );
}

function isDefer(value) {
  return isPromise(value && value.promise);
}
