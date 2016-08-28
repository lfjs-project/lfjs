import {
  isFunction
} from 'lodash';

import {
  TRANSDUCER_INIT,
  TRANSDUCER_RESULT,
  TRANSDUCER_STEP
} from './-protocol';

import {
  transduce
} from './index';

export default function reducePromiseArray(coll, xform) {
  if (Array.isArray(coll)) {
    coll = Promise.all(coll);

    if (xform) {
      return coll.then(coll => transduce(
        xform,
        builder,
        [], coll));
    }

    return coll;
  }

  return null;
}

export function isPromise(obj) {
  return obj && isFunction(obj.then);
}

const builder ={
  [TRANSDUCER_INIT]() {
      return [];
  },
  [TRANSDUCER_RESULT](result) {
    return Promise.all(result);
  },
  [TRANSDUCER_STEP](result, input) {
    result.push(input);
    return result;
  }
};
