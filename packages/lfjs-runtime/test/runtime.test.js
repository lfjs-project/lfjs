import "babel-polyfill";
import { assert } from 'chai';

import _, { registry } from '../src/index';

describe('lfjs-runtime', () => {
  describe('registry', () => {
    it('create aliases', () => {
      assert.ok(registry('float_QMARK_'));
      assert.equal(registry('float_QMARK_').imported, 'isFloat');
      assert.equal(registry('float_QMARK_').module, 'lfjs-runtime/math');

      assert.ok(registry('vector_QMARK_'));
      assert.equal(registry('vector_QMARK_').imported, 'isVector');
      assert.equal(registry('vector_QMARK_').module, 'lfjs-runtime/lang');

      assert.ok(registry('_GT_'), 'gt');
      assert.equal(registry('_GT_').imported, 'gt');
      assert.equal(registry('_GT_').module, 'lfjs-runtime/math');
    });
  });

  describe('math', () => {
    it('#inc', () => {
      assert.equal(_.inc(1), 2);
    });

    it('#dec', () => {
      assert.equal(_.dec(2), 1);
    });

    it('#mod', () => {
      assert.equal(_.mod(5, 2), 1);
    });

    it('#pos?', () => {
      assert.equal(_.isPos(5), true);
      assert.equal(_.isPos(0), false);
      assert.equal(_.isPos(-5), false);
    });

    it('#neg?', () => {
      assert.equal(_.isNeg(5), false);
      assert.equal(_.isNeg(0), false);
      assert.equal(_.isNeg(-5), true);
    });

    it('#zero?', () => {
      assert.equal(_.isZero(5), false);
      assert.equal(_.isZero(0), true);
      assert.equal(_.isZero(-5), false);
      assert.equal(_.isZero('a'), false);
    });

    it('#odd?', () => {
      assert.equal(_.isOdd(5), true);
      assert.equal(_.isOdd(0), false);
      assert.equal(_.isOdd(2), false);
      assert.equal(_.isOdd('a'), false);
    });

    it('#even?', () => {
      assert.equal(_.isEven(5), false);
      assert.equal(_.isEven(0), true);
      assert.equal(_.isEven(2), true);
      assert.equal(_.isEven('a'), false);
    });
  });

  describe('set', () => {
    it('#set', () => {
      assert.deepEqual(_.set([1]), new Set([1]));
    });

    it('#join', () => {
      assert.deepEqual(_.join(_.set([1]), _.set([2])), _.set([1, 2]));
    });

    it('#disj', () => {
      assert.deepEqual(_.disj(_.set([1, 2, 3]), [1]), _.set([2, 3]));
    });
  });

  describe('atom', () => {
    it('#atom', () => {
      assert.equal(_.deref(_.atom(5)), 5);
    });

    it('#atom?', () => {
      assert.equal(_.isAtom(_.atom(5)), true);
    });

    it('#reset!', () => {
      let a = _.atom(5);
      _.reset(a, 4);
      assert.equal(_.deref(a), 4);
    });

    it('#addWatch', () => {
      let a = _.atom(5);
      let done = false;
      _.addWatch(a, 'key', (key, atom, oldVal, newVal) => {
        assert.equal(key, 'key');
        assert.equal(atom, a);
        assert.equal(oldVal, 5);
        assert.equal(newVal, 4);
        done = true;
      });
      _.reset(a, 4);
      assert.ok(done);
    });

    it('#removeWatch', () => {
      let a = _.atom(5);
      _.addWatch(a, 'key', () => {
        assert.ok(false);
      });
      _.removeWatch(a, 'key');
      _.reset(a, 4);
    });

    it('#swap!', () => {
      let a = _.atom(5);
      _.swap(a, _.inc);
      assert.equal(_.deref(a), 6);
      _.swap(a, _.add, 2);
      assert.equal(_.deref(a), 8);
    });
  });

  describe('#hash-map', () => {
    it('#hash-map', () => {

    });

    it('#merge', () => {

    });

    it('#mergeWith', () => {

    });

    it('#zipmap', () => {

    });

    it('#update', () => {

    });

    it('#updateIn', () => {

    });

    it('#find', () => {

    });

    it('#get', () => {
      assert.equal(_.get({ a: 1 }, 'a'), 1);
      assert.equal(_.get({ a: 1 }, 'b', 2), 2);
      assert.deepEqual(_.get({ a: 1 }, 'b'), null);
    });

    it('#getIn', () => {
      assert.equal(_.getIn({ a: 1 }, ['a']), 1);
      assert.equal(_.getIn({ a: 1 }, ['b'], 2), 2);
      assert.deepEqual(_.getIn({ a: 1 }, ['a', 'c']), null);
      assert.equal(_.getIn({ a: { c: 2 } }, ['a', 'c']), 2);
    });

    it('#assoc', () => {
      let a = { a: 1 };
      let a2 = { a: 1 };
      assert.deepEqual(_.assoc(a, 'b', 2), { a: 1, b: 2 });
      assert.deepEqual(a, a2);
      assert.deepEqual(_.assoc([1, 2], 1, 3), [1, 3]);
    });

    it('#dissoc', () => {
      let a = { a: 1, b: 2 };
      let a2 = { a: 1, b: 2 };
      assert.deepEqual(_.dissoc(a, 'b'), { a: 1 });
      assert.deepEqual(a, a2);
      assert.deepEqual(_.dissoc(a, 'b', 'a'), {});
      assert.deepEqual(a, a2);
    });

    it('#assocIn', () => {
      let a = { a: { b: 1 }, c: [1, { d: "yolo" }] };
      let a2 = { a: { b: 1 }, c: [1, { d: "yolo" }] };
      assert.deepEqual(_.assocIn(a, ['a', 'b'], 2), { a: { b: 2 }, c: [1, { d: "yolo" }] });
      assert.deepEqual(a, a2);
      assert.deepEqual(_.assocIn(a, ['c', 1, 'd'], "yolo2"), { a: { b: 1 }, c: [1, { d: "yolo2" }] });
      assert.deepEqual(a, a2);
      assert.deepEqual(_.assocIn(a, ['a', 'c'], 2), { a: { b: 1, c: 2 }, c: [1, { d: "yolo" }] });
      assert.deepEqual(a, a2);
    });
  });

  describe('coll', () => {
    it('#empty', () => {

    });

    it('#notEmpty', () => {

    });

    it('#isColl', () => {

    });

    it('#count', () => {
      assert.equal(_.count(['a']), 1, 'vector');
      assert.equal(_.count(new Set('a')), 1, 'set');
      assert.equal(_.count({ a: 'a' }), 1, 'hash-map');
      assert.equal(_.count("abc"), 3, 'string');
    });

    it('#conj', () => {
      let a = [1];
      assert.deepEqual(_.conj(a, 2, 3), [1, 2, 3]);
      assert.notDeepEqual(_.conj(a, 2), a);
    });

    it('#seq', () => {
      let a = new Set([1,2,3]).values();
      assert.deepEqual(_.seq(a), [1, 2, 3]);
    });

    it('#compact', () => {
      assert.deepEqual(_.compact([1, null, [], 2, '']), [1, 2], 'vector');
      assert.deepEqual(_.compact({ a: 'a', b: null, c: 1 }), { a: 'a', c: 1 }, 'hash-map');
    });
  });

  describe('vector', () => {
    it('#vec', () => {

    });

    it('#cons', () => {
      assert.deepEqual(_.cons(1, [2, 3]), [1, 2, 3]);
    });
  });

  describe('fn', () => {
    it('#juxt', () => {
      assert.deepEqual(_.juxt(_.inc, _.dec)(1), [2, 0]);
    });
  });

  describe('transducers', () => {
    it('#filter', () => {
      assert.deepEqual(_.filter(_.isOdd, [1, 2, 3, 4, 5]), [1, 3, 5]);
    });

    it('#map', () => {
      assert.deepEqual(_.map(_.isOdd, [1, 2, 3, 4, 5]), [true, false, true, false, true]);
      assert.deepEqual(_.map(([k, v]) => [k, _.isOdd(v)], { a: 1, b: 2 }), { a: true, b: false })
    });
  });
});
