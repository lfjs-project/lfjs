import { isUndefined } from 'lodash';

const REF_SYMBOL = Symbol('ref');

export const atom   = (value) => new Atom(value);
export const isAtom = (atom) => atom instanceof Atom;
export const reset  = (atom, value) => atom.reset(value);
export const swap   = (atom, fn) => atom.swap(fn);
export const deref  = (atom) => atom[REF_SYMBOL];

function defaultValidate() { return true; }

class Atom {
  constructor(value, options = {}) {
    this.validate = options.validate || defaultValidate;
    this.reset(value);
  }

  reset(value) {
    if (this.validate.call(null, value)) {
      this[REF_SYMBOL] = isUndefined(value) ? null : value;
    } else {
      throw new Error(`Invalid value ${value}`);
    }
    return deref(this);
  }

  swap(fn, ...args) {
    let value = fn.call(null, deref(value), ...args);
    return this.reset(value);
  }

  toString() {
    return deref(this).toString();
  }
}
