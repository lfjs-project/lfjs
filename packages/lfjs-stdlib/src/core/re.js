const ITERATOR_SYMBOL = Symbol.iterator;

const re_pattern = (pattern, flags) => new RegExp(pattern, flags);
const re_matcher = (pattern, str) => new Matcher(pattern, str);
const re_matches = (re, str) => {
  let matches = re.exec(str);
  if (!matches || matches[0] !== str) { return null; }
  if (matches.length === 1) {
    return matches[0];
  } else {
    return Array.from(matches);
  }
};
const re_find = (re, str) => {
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
};
const re_seq = (re, str) => {
  return Array.from(new Matcher(re, str));
};

export {
  re_pattern,
  re_matcher,
  re_matches,
  re_find,
  re_seq
};

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

    let iterator = new Iterator(next);
    this[ITERATOR_SYMBOL] = () => iterator;
  }

  find() {
    let match = this[ITERATOR_SYMBOL]().next();
    return match.done ? null : match.value;
  }
}
