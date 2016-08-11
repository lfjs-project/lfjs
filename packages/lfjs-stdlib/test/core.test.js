import { assert } from 'chai';

import {
  inc,
  dec,
  mod,
  atom,
  deref,
  push,
  unshift
} from '../src/index';

describe('#core', function() {
  it('inc', function() {
    assert.equal(inc(1), 2);
  });

  it('dec', function() {
    assert.equal(dec(2), 1);
  });

  it('mod', function() {
    assert.equal(mod(5, 2), 1);
  });

  it('atom', function() {
    assert.equal(deref(atom(5)), 5);
  });

  it('push', function() {
    let a = [1];
    assert.deepEqual(push(a, 2), [1, 2]);
    assert.notEqual(push(a, 2), a);
  });

  it('unshift', function() {
    let a = [1];
    assert.deepEqual(unshift(a, 2), [2, 1]);
    assert.notEqual(unshift(a, 2), a);
  });
});
