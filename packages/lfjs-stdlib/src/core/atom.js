import { isUndefined } from 'lodash';

const atom        = (v)     => new Atom(v);
const reset_BANG_ = (a, v)  => a.reset(v);
const swap_BANG_  = (a, fn) => a.swap(fn);
const deref       = (a)     => a.deref();

export { atom, reset_BANG_, swap_BANG_, deref };
export default atom;

function defaultValidate() { return true; }

class Atom {
  constructor(value, options={}) {
    this.validate = options.validate || defaultValidate;
    this.reset(value);
  }

  deref() {
    return this.value;
  }

  reset(value) {
    if (this.validate(value)) {
      this.value = isUndefined(value) ? null : value;
    } else {
      throw(new Error(`Invalid value ${value}`));
    }
    return this.value;
  }

  swap(fn, ...args) {
    let value = fn(this.value, ...args);
    return this.reset(value);
  }

  toString() {
    return this.deref().toString();
  }
}
