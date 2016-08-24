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
  'add':      '_PLUS_',
  'divide':   '_SLASH_',
  'gt':       '_GT_',
  'gte':      '_GT__EQ_',
  'has':      'contains_QMARK_',
  'isEqual':  '_EQ_',
  'lt':       '_LT_',
  'lte':      '_LT__EQ_',
  'multiply': '_STAR_',
  'reset':    'reset_BANG_',
  'subtract': '_',
  'swap':     'swap_BANG_'
};

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

function isPublicKey([key, { imported }]) {
  return MAPPING[imported] || !key.match(PRIVATE_REGEXP);
}

function needsAlias(key) {
  return aliasName(key) !== key;
}

function annotate(name, module, publicOnly = true) {
  let pairs = entries(module)
    .filter(compose(isFunction, val))
    .map(compose((id => [id, {
      imported: id,
      module: `lfjs-runtime/${name}`
    }]), key));

  let aliases = pairs
    .filter(compose(needsAlias, key))
    .map(([key, entry]) => [aliasName(key), entry]);

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
        imported: 'component',
        module: 'lfjs-html'
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
