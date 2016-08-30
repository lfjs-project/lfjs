import * as atom from './atom';
import * as coll from './coll';
import * as fn from './fn';
import * as hashMap from './hash-map';
import * as lang from './lang';
import * as math from './math';
import * as set from './set';
import * as string from './string';
import * as transducers from './transducers';
import * as vector from './vector';

export { default as registry } from './registry';

export default Object.assign(
  Object.create(null),
  atom,
  coll,
  fn,
  hashMap,
  lang,
  math,
  set,
  string,
  transducers,
  vector
);
