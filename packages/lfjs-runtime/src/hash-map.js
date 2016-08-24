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

const NOT_SET = 'NOT_SET';
const EMPTY_HASH_MAP = Object.create(null);

export {
  keys,
  values as vals
} from 'lodash';

import { assert, typeOf } from './lang';
import { isEven } from './math';

export function merge(m, ...args) {
  switch (arguments.length) {
  case 0:
    return EMPTY_HASH_MAP;
  case 1:
    return m;
  default:
    assert(isPlainObject(m), `merge: first argument must be a hash-map, was ${typeOf(m)}.`);
    return Object.assign(Object.create(null), m, ...args);
  }
}

export function mergeWith(/* m, fn, ...args */) {
}

export function zipmap(keys, vals) {
  assert(Array.isArray(keys), `zipmap: first argument must be a vector, was ${typeOf(keys)}.`);
  assert(Array.isArray(vals), `zipmap: second argument must be a vector, was ${typeOf(vals)}.`);
  assert(keys.length === vals.length, `zipmap: first and second arguments must be vectors of the same length.`);

  return merge(fromPairs(zip(keys, vals)));
}

export function get(m, key, notFound = null) {
  assert(isIndex(key), `get: second argument must be a keyword or an int, was ${typeOf(key)}.`);

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

  let updatedValue = updateInDeepMap(
    m,
    path[Symbol.iterator](),
    isEmpty(args) ? fn : curry(fn, args.length + 1)(...args)
  );

  return updatedValue === NOT_SET ? null : updatedValue;
}

export function find(m, key) {
  assert(isIndex(key), `find: second argument must be a keyword or an int, was ${typeOf(key)}.`);

  return _find(toPairs(m), ([k]) => `${k}` === `${key}`);
}

export { zip };

function isIndex(key) {
  return isString(key) || isInteger(key);
}

function updateInDeepMap(existing, keyPathIter, updater) {
  let isNotSet = existing === NOT_SET;
  let step = keyPathIter.next();
  if (step.done) {
    let existingValue = isNotSet ? null : existing;
    let newValue = updater(existingValue);
    return newValue === existingValue ? existing : newValue;
  }
  let key = step.value;
  let nextExisting = isNotSet ? NOT_SET : _get(existing, key, NOT_SET);
  let nextUpdated = updateInDeepMap(
    nextExisting,
    keyPathIter,
    updater
  );

  if (nextUpdated === nextExisting) {
    return existing;
  } else {
    return assoc(isNotSet ? merge() : existing,
      key, nextUpdated);
  }
}
