import { assert } from 'chai';

import * as r from '../src/index';
import * as d from '../src/deferred';

describe('lfjs-runtime', function() {
  describe('math', function() {
    it('#inc', function() {
      assert.equal(r.inc(1), 2);
    });

    it('#dec', function() {
      assert.equal(r.dec(2), 1);
    });

    it('#mod', function() {
      assert.equal(r.mod(5, 2), 1);
    });

    it('#pos?', function() {
      assert.equal(r.pos_QMARK_(5), true);
      assert.equal(r.pos_QMARK_(0), false);
      assert.equal(r.pos_QMARK_(-5), false);
    });

    it('#neg?', function() {
      assert.equal(r.neg_QMARK_(5), false);
      assert.equal(r.neg_QMARK_(0), false);
      assert.equal(r.neg_QMARK_(-5), true);
    });

    it('#zero?', function() {
      assert.equal(r.zero_QMARK_(5), false);
      assert.equal(r.zero_QMARK_(0), true);
      assert.equal(r.zero_QMARK_(-5), false);
      assert.equal(r.zero_QMARK_('a'), false);
    });

    it('#odd?', function() {
      assert.equal(r.odd_QMARK_(5), true);
      assert.equal(r.odd_QMARK_(0), false);
      assert.equal(r.odd_QMARK_(2), false);
      assert.equal(r.odd_QMARK_('a'), false);
    });

    it('#even?', function() {
      assert.equal(r.even_QMARK_(5), false);
      assert.equal(r.even_QMARK_(0), true);
      assert.equal(r.even_QMARK_(2), true);
      assert.equal(r.even_QMARK_('a'), false);
    });
  });

  describe('atom', function() {
    it('#atom', function() {
      assert.equal(r.deref(r.atom(5)), 5);
    });
  });

  describe('deferred', function() {
    it('#deferred?', function() {
      assert.ok(r.deferred_QMARK_(r.deferred()));
    });

    it('self', function(done) {
      let deferred = r.deferred();
      deferred('yolo');
      d.on_realized(deferred, value => {
        assert.equal(value, 'yolo');
        done();
      });
    });

    it('#success!', function(done) {
      let deferred = r.deferred();
      d.success_BANG_(deferred, 'yolo');
      d.on_realized(deferred, value => {
        assert.equal(value, 'yolo');
        done();
      });
    });

    it('#error! #catch', function(done) {
      let deferred = r.deferred();
      d.error_BANG_(deferred, 'yolo');
      d._catch(deferred, reason => {
        assert.equal(reason, 'yolo');
        done();
      });
    });

    it('#timeout! with success', function(done) {
      let deferred = d.timeout_BANG_(r.deferred(), 50);
      deferred('yolo');
      d.on_realized(deferred, value => {
        assert.equal(value, 'yolo');
        done();
      });
    });

    it('#timeout! with value', function(done) {
      let deferred = d.timeout_BANG_(r.deferred(), 50, 'yolo');
      d.on_realized(deferred, value => {
        assert.equal(value, 'yolo');
        done();
      });
    });

    it('#timeout! without value', function(done) {
      let deferred = d.timeout_BANG_(r.deferred(), 50);
      d._catch(deferred, ({ message }) => {
        assert.equal(message, 'Deferred timeout');
        done();
      });
    });

    it('#finally with error', function(done) {
      let deferred = r.deferred();
      d.error_BANG_(deferred, 'yolo');
      d._finally(deferred, reason => {
        assert.equal(reason, 'yolo');
        done();
      });
    });

    it('#finally with success', function(done) {
      let deferred = r.deferred();
      d.success_BANG_(deferred, 'yolo');
      d._finally(deferred, value => {
        assert.equal(value, 'yolo');
        done();
      });
    });
  });

  describe('array', function() {
    it('#count', function() {
      assert.equal(r.count(['a']), 1);
    });

    it('#conj', function() {
      let a = [1];
      assert.deepEqual(r.conj(a, 2, 3), [1, 2, 3]);
      assert.deepEqual(r.conj(a)(2), [1, 2]);
      assert.notDeepEqual(r.conj(a, 2), a);
    });

    it('#cons', function() {
      assert.deepEqual(r.cons(1, [2, 3]), [1, 2, 3]);
    });

    it('#seq', function() {
      let a = new Set([1,2,3]).values();
      assert.deepEqual(r.seq(a), [1, 2, 3]);
    });
  });

  describe('fn', function() {
    it('#juxt', function() {
      assert.deepEqual(r.juxt(r.inc, r.dec)(1), [2, 0]);
    });
  });
});
