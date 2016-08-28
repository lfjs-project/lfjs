import {
  isFunction
} from 'lodash';

import {
  isReduced,
  deref,
  TRANSDUCER_INIT,
  TRANSDUCER_RESULT,
  TRANSDUCER_STEP
} from './-protocol';

export default function reduceObservable(xform, source) {
  return new source.constructor(observer => source.subscribe(
      new TransduceObserver(xform, observer)));
}

export function isObservable(obj) {
  return obj && isFunction(obj.subscribe);
}

class TransduceObserver {
  constructor(xform, observer) {
    this.xform = xform(transformForObserver(observer));
    this._observer = observer;
  }

  start(subscription) {
    this._subscription = subscription;
  }

  next(input) {
    let observer = this._observer;

    if (observer.closed) { return; }

    try {
      observer = this.xform[TRANSDUCER_STEP](observer, input);

      if (isReduced(observer)) {
        observer = deref(observer);
        this._subscription.unsubscribe();
        this.xform[TRANSDUCER_RESULT](observer);
      }
    } catch (e) {
      observer.error(e);
    }
  }

  error(e) {
    this._observer.error(e);
  }

  complete() {
    this.xform[TRANSDUCER_RESULT](this._observer);
  }
}

function transformForObserver(o) {
  return {
    [TRANSDUCER_INIT]() {
      return o;
    },
    [TRANSDUCER_STEP](obs, input) {
      obs.next(input);
      return obs;
    },
    [TRANSDUCER_RESULT](obs) {
      obs.complete();
      return obs;
    }
  };
}
