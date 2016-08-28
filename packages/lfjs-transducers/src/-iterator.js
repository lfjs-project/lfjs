import {
  isFunction,
  constant,
  isPlainObject,
  toPairs
} from 'lodash';

export function iterator(coll) {
  let iter = coll[Symbol.iterator];

  if (iter) {
    return iter.call(coll);
  } else if (isFunction(coll.next)) {
    // Basic duck typing to accept an ill-formed iterator that doesn't
    // conform to the iterator protocol (all iterators should have the
    // @@iterator method and return themselves, but some engines don't
    // have that on generators like older v8)
    return new Iterator(() => coll.next());
  } else if (Array.isArray(coll)) {
    return new ArrayIterator(coll);
  } else if (isPlainObject(coll)) {
    return new ObjectIterator(coll);
  }
}

export function lazySeq(fn) {
  return new Iterator(fn);
}

export function infinitSeq(fn) {
  return new InfinitIterator(fn);
}

export function constantSeq(value) {
  return infinitSeq(constant(value));
}

class BaseIterator {
  [Symbol.iterator]() {
    return this;
  }

  toString() {
    return '[Iterator]';
  }
}

class Iterator extends BaseIterator {
  constructor(next) {
    super();
    this.next = next;
  }
}

class InfinitIterator extends BaseIterator {
  constructor(fn) {
    super();
    this.fn = fn;
  }

  next() {
    return {
      value: this.fn(),
      done: false
    };
  }
}

class ArrayIterator extends BaseIterator {
  constructor(arr) {
    super();
    this.arr = arr;
    this.index = 0;
  }

  next() {
    if (this.index < this.arr.length) {
      return {
        value: this.arr[this.index++],
        done: false
      };
    }

    return { done: true };
  }
}

class ObjectIterator extends ArrayIterator {
  constructor(obj) {
    super(toPairs(obj));
  }
}
