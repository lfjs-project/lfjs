import {
  TRANSDUCER_RESULT,
  TRANSDUCER_STEP,
  unreduced
} from './-protocol';

import {
  iterator
} from './-iterator';

export default class LazyTransformer {
  constructor(xform, coll) {
    this.iter = iterator(coll);
    this.items = [];
    this.xform = xform(stepper);
    //this.stepper = new Stepper(xform);
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    this[TRANSDUCER_STEP]();

    if (this.items.length) {
      return {
        value: this.items.pop(),
        done: false
      };
    } else {
      return { done: true };
    }
  }

  [TRANSDUCER_STEP]() {
    if (!this.items.length) {
      //this.stepper[TRANSDUCER_STEP](this);

      let len = this.items.length;
      while (this.items.length === len) {
        let n = this.iter.next();
        // if (n.done || isReduced(n.value)) {
        //   // finalize
        //   this.xform[TRANSDUCER_RESULT](this);
        //   break;
        // }

        // step
        this.xform[TRANSDUCER_STEP](this, n.value);
      }
    }
  }
}

// class Stepper {
//   constructor(xform) {
//     this.xform = xform(stepper);
//   }

//   [TRANSDUCER_STEP](lt) {
//     let len = lt.items.length;
//     while (lt.items.length === len) {
//       let n = lt.iter.next();
//       if (n.done || isReduced(n.value)) {
//         // finalize
//         this.xform[TRANSDUCER_RESULT](this);
//         break;
//       }

//       // step
//       this.xform[TRANSDUCER_STEP](lt, n.value);
//     }
//   }
// }

const stepper = {
  [TRANSDUCER_RESULT]: unreduced,
  [TRANSDUCER_STEP]: (lt, x) => {
    lt.items.unshift(x);
    return lt;
  }
};
