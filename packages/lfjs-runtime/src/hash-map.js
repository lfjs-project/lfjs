import {
  chunk,
  clone,
  curry,
  difference,
  find as _find,
  fromPairs,
  get as _get,
  isEmpty,
  isFunction,
  isInteger,
  isPlainObject,
  isString,
  set,
  toPairs,
  zip
} from 'lodash';

export {
  keys,
  values as vals
} from 'lodash';

import { assert, typeOf } from './lang';
import { isEven } from './math';

export function hashMap() {
  return Object.create(null);
}

export function merge(m, ...args) {
  switch (arguments.length) {
  case 0:
    return null;
  case 1:
    return m;
  default:
    if (Array.isArray(m)) {
      return m.concat(...args);
    } else if (isPlainObject(m)) {
      return Object.assign(Object.create(null), m, ...args);
    }
    assert(false, `merge: first argument must be a vector or a hash-map, was ${typeOf(m)}.`);
  }
}

export function mergeWith(/* m, fn, ...args */) {
}

export function zipmap(keys, vals) {
  assert(Array.isArray(keys), `zipmap: first argument must be a vector, was ${typeOf(keys)}.`);
  assert(Array.isArray(vals), `zipmap: second argument must be a vector, was ${typeOf(vals)}.`);
  assert(keys.length === vals.length, `zipmap: first and second arguments must be vectors of the same length.`);

  return fromPairs(zip(keys, vals));
}

export function get(m, key, notFound = null) {
  assert(isIndex(key), `get: second argument must be a keyword a string or an int, was ${typeOf(key)}.`);

  return _get(m, key, notFound);
}

export function getIn(m, path, notFound = null) {
  assert(Array.isArray(path), `getIn: second argument must be a vector, was ${typeOf(path)}.`);

  return _get(m, path, notFound);
}

export function assoc(m, ...pairs) {
  assert(isEven(pairs.length), `assoc: must provide an even number of arguments.`);

  if (Array.isArray(m)) {
    return chunk(pairs, 2)
      .reduce((m, [i, v]) => set(m, i, v), clone(m));
  } else {
    return merge(m, fromPairs(chunk(pairs, 2)));
  }
}

export function dissoc(m, ...keys) {
  assert(isPlainObject(m), `dissoc: first argument must be a hash-map, was ${typeOf(m)}.`);

  return fromPairs(
    difference(Object.keys(m), keys)
    .map(key => [key, m[key]])
  );
}

export function update(m, key, fn, ...args) {
  assert(isIndex(key), `update: second argument must be a keyword or an int, was ${typeOf(key)}.`);
  assert(isFunction(fn), `update: third argument must be a function, was ${typeOf(fn)}.`);

  return assoc(m, key, fn(m[key], ...args));
}

export function assocIn(m, path, value) {
  return updateIn(m, path, () => value);
}

export function updateIn(m, path, fn, ...args) {
  assert(Array.isArray(path), `updateIn: second argument must be a vector, was ${typeOf(path)}.`);
  assert(isFunction(fn), `updateIn: third argument must be a function, was ${typeOf(fn)}.`);

  return _updateIn(
    m,
    path[Symbol.iterator](),
    isEmpty(args) ? fn : curry(fn, args.length + 1)(...args)
  );
}

export function find(m, key) {
  assert(isIndex(key), `find: second argument must be a keyword or an int, was ${typeOf(key)}.`);

  return _find(toPairs(m), ([k]) => `${k}` === `${key}`);
}

export { zip };

function isIndex(key) {
  return isString(key) || isInteger(key);
}

function _updateIn(existingValue, keyPathIter, fn) {
  let step = keyPathIter.next();
  if (step.done) {
    let newValue = fn(existingValue);

    if (newValue === existingValue) {
      return existingValue;
    } else {
      return  newValue;
    }
  }
  let key = step.value;
  let nextExistingValue = _get(existingValue, key, null);
  let nextUpdatedValue = _updateIn(nextExistingValue, keyPathIter, fn);

  if (nextUpdatedValue === nextExistingValue) {
    return existingValue;
  } else {
    return assoc(existingValue || hashMap(), key, nextUpdatedValue);
  }
}
