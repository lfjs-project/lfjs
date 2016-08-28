import {
  isEqual,
  isUndefined
} from 'lodash';

export function atom(value) {
  return new Atom(value);
}

export function isAtom(atom) {
  return atom instanceof Atom;
}

export function deref(atom) {
  return atom._value;
}

export function reset(atom, value) {
  return atom.reset(value);
}

export function swap(atom, fn, ...args) {
  return atom.reset(fn(deref(atom), ...args));
}

export function compareAndSet(atom, oldVal, newVal) {
  if (isEqual(oldVal, deref(atom))) {
    atom.reset(newVal);
    return true;
  }

  return false;
}

export function addWatch(atom, key, fn) {
  atom._watchers.set(key, fn);
  return atom;
}

export function removeWatch(atom, key) {
  atom._watchers.delete(key);
  return atom;
}

export function setValidator(atom, validator) {
  atom._validator = isUndefined(validator) ? null : validator;
  return null;
}

export function getValidator(atom) {
  return atom._validator;
}

class Atom {
  constructor(value, { validator } = {}) {
    setValidator(this, validator);
    this._watchers = new Map();
    this.reset(value);
  }

  reset(value) {
    value = isUndefined(value) ? null : value;

    let validator = getValidator(this);

    if (!validator || validator(value)) {
      let oldVal = this._value;

      this._value = value;
      this._watchers.forEach((fn, key) => {
        fn(key, this, oldVal, value);
      });

      return value;
    }

    throw new Error(`Invalid value ${value}`);
  }

  toString() {
    return this._value.toString();
  }
}
