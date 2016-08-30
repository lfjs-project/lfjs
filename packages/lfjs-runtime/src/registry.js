import * as atom from './atom';
import * as coll from './coll';
import * as fn from './fn';
import * as hashMap from './hash-map';
import * as internal from './-internal';
import * as lang from './lang';
import * as math from './math';
import * as set from './set';
import * as string from './string';
import * as transducers from './transducers';
import * as vector from './vector';

import {
  compose,
  entries,
  fromPairs,
  isFunction,
  memoize,
  once,
  snakeCase
} from 'lodash';

import { key, val } from './lang';

const MAPPING = {
  'add':           '_PLUS_',
  'divide':        '_SLASH_',
  'gt':            '_GT_',
  'gte':           '_GT__EQ_',
  'has':           'contains_QMARK_',
  'isEqual':       '_EQ_',
  'lt':            '_LT_',
  'lte':           '_LT__EQ_',
  'multiply':      '_STAR_',
  'reset':         'reset_BANG_',
  'subtract':      '_',
  'swap':          'swap_BANG_',
  'compareAndSet': 'compare_and_set_BANG_',
  'setValidator':  'set_validator_BANG_'
};

const SPECIAL_CHARS_MAP = {
  '_BANG_':    '!',
  '_PERCENT_': '%',
  '_STAR_':    '*',
  '_PLUS_':    '+',
  '_SLASH_':   '/',
  '_LT_':      '<',
  '_EQ_':      '=',
  '_GT_':      '>',
  '_QMARK_':   '?',
  '_':         '-'
};

const SPECIAL_CHARS = Object.keys(SPECIAL_CHARS_MAP);

const PREDICATE_REGEXP = /^is_/;
const PRIVATE_REGEXP = /^_/;

const aliasName = memoize((key) => {
  if (MAPPING[key]) {
    return MAPPING[key];
  }

  key = snakeCase(key);

  if (key.match(PREDICATE_REGEXP)) {
    return `${key.replace(PREDICATE_REGEXP, '')}_QMARK_`;
  }

  return key;
});

function normalizedName(str) {
  return SPECIAL_CHARS
    .reduce((str, key) => {
      return str.replace(
        new RegExp(key, 'g'),
        SPECIAL_CHARS_MAP[key]
      );
    }, str);
}

function isPublicKey([key, { imported }]) {
  return MAPPING[imported] || !key.match(PRIVATE_REGEXP);
}

function needsAlias(key) {
  return aliasName(key) !== key;
}

function aliasEntry([key, entry]) {
  key = aliasName(key);
  entry.name = normalizedName(key);
  return [key, entry];
}

function annotate(name, module, publicOnly = true) {
  let pairs = entries(module)
    .filter(compose(isFunction, val))
    .map(([id, fn]) => [id, {
      imported: id,
      module: `lfjs-runtime/${name}`,
      arity: fn.length,
      name: normalizedName(id)
    }]);

  let aliases = pairs
    .filter(compose(needsAlias, key))
    .map(aliasEntry);

  pairs = pairs.concat(aliases);

  if (publicOnly) {
    pairs = pairs.filter(isPublicKey);
  }

  return fromPairs(pairs);
}

const runtime = Object.create(null);

const factory = once(function() {
  Object.assign(
    runtime,
    {
      component: {
        name: 'component',
        imported: 'component',
        module: 'lfjs-html',
        arity: 1
      }
    },
    annotate('-internal', internal, false),
    annotate('atom', atom),
    annotate('coll', coll),
    annotate('fn', fn),
    annotate('hash-map', hashMap),
    annotate('lang', lang),
    annotate('math', math),
    annotate('set', set),
    annotate('string', string),
    annotate('transducers', transducers),
    annotate('vector', vector)
  );
});

export default function registry(id) {
  factory();
  return runtime[id];
}

registry.forEach = (callback) => {
  factory();
  entries(runtime)
    .forEach(([name, meta]) => callback(name, meta));
};
