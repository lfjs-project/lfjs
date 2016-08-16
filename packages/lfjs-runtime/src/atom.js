import { isUndefined } from 'lodash';

const atom        = (value)     => new Atom(value);
const reset_BANG_ = (atom, value)  => atom.reset(value);
const swap_BANG_  = (atom, fn) => atom.swap(fn);
const deref       = (atom)     => atom.value;

export { atom, reset_BANG_, swap_BANG_, deref };

function defaultValidate() { return true; }

class Atom {
  constructor(value, options={}) {
    this.validate = options.validate || defaultValidate;
    this.reset(value);
  }

  reset(value) {
    if (this.validate(value)) {
      this.value = isUndefined(value) ? null : value;
    } else {
      throw new Error(`Invalid value ${value}`);
    }
    return deref(this);
  }

  swap(fn, ...args) {
    let value = fn(deref(value), ...args);
    return this.reset(value);
  }

  toString() {
    return deref(this).toString();
  }
}
