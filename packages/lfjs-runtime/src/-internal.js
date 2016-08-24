/* global Promise */

import { cast } from './promise';
import { isString } from 'lodash';

export function _throw(error) {
  if (isString(error)) {
    error = new Error(error);
  }

  throw error;
}

export function _promise(body) {
  return new Promise((resolve, reject) => {
    try {
      body(resolve, reject);
    } catch (e) {
      reject(e);
    }
  });
}

export function _then(promise, body) {
  return cast(promise).then(body);
}

export function _catch(promise, body) {
  return cast(promise).catch(body);
}

export function _finally(promise, body) {
  return cast(promise).then(body, body);
}
