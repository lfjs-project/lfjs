const ITERATOR_SYMBOL = Symbol.iterator;

export function rePattern(pattern, flags) {
  return new RegExp(pattern, flags);
}

export function reMatcher(pattern, str) {
  return new Matcher(pattern, str);
}

export function reMatches(re, str) {
  let matches = re.exec(str);
  if (!matches || matches[0] !== str) { return null; }
  if (matches.length === 1) {
    return matches[0];
  } else {
    return Array.from(matches);
  }
}

export function reFind(re, str) {
  if (re instanceof Matcher) {
    return re.find();
  } else {
    let matches = re.exec(str);
    if (!matches) { return null; }
    if (matches.length === 1) {
      return matches[0];
    } else {
      return Array.from(matches);
    }
  }
}

export function reSeq(re, str) {
  return Array.from(new Matcher(re, str));
}

class Iterator {
  constructor(next) {
    this.next = next;
  }

  toString() {
    return '[Iterator]';
  }
}

Iterator.prototype[ITERATOR_SYMBOL] = function() { return this; };

class Matcher {
  constructor(re, str) {
    function next() {
      let matches = re.exec(str);
      if (matches && matches.length > 0) {
        str = str.slice(str.search(re) + matches[0].length);
        return { value: matches[0], done: false };
      } else {
        return { value: null, done: true };
      }
    }

    this[ITERATOR_SYMBOL] = () => new Iterator(next);
  }

  find() {
    if (!this._iterator) {
      this._iterator = this[ITERATOR_SYMBOL]();
    }

    let match = this._iterator.next();

    if (match.done) {
      delete this._iterator;
      return null;
    }

    return match.value;
  }
}
