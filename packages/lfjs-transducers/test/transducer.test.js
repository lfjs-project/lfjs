import { assert } from 'chai';

import Observable from "zen-observable";
import Immutable from 'immutable';
import { compose, add } from 'lodash';

import {
  conj,

  into,
  seq,
  transduce,
  all,

  toIterator,
  toFn,

  LazyTransformer,
  repeat,
  repeatedly,
  cycle,

  map,
  mapIndexed,
  filter,
  remove,
  cat,
  mapcat,
  keep,
  dedupe,
  take,
  takeWhile,
  drop,
  dropWhile,
  partition,
  partitionAll,
  partitionBy,
  interpose,
  takeNth,

  defineTransducerProtocol
} from '../src/index';

var num = 5;

// utility

function second(x) {
  return x[1];
}

defineTransducerProtocol(Immutable.List, {
  init() {
    return Immutable.List().asMutable();
  },

  result(lst) {
    return lst.asImmutable();
  },

  step(lst, x) {
    return lst.push(x);
  }
});

function eql(x, y) {
  assert.deepEqual(x, y);
}

function immutEql(src, dest) {
  eql(src.toJS(), dest.toJS());
}

describe('lfjs-transducers', () => {
  it('conj should work', () => {
    eql(conj([1, 2, 3], 4), [1, 2, 3, 4]);
    eql(conj({ x: 1, y: 2 }, { z: 3 }),
        { x: 1, y: 2, z: 3 });
    eql(conj({ x: 1, y: 2 }, ['z', 3]),
        { x: 1, y: 2, z: 3 });
  });

  it('transformer protocol should work', () => {
    let vec = Immutable.List.of(1, 2, 3);

    immutEql(vec[Symbol.for('transducer/init')](), Immutable.List());
    immutEql(vec[Symbol.for('transducer/step')](vec, 4), Immutable.List.of(1, 2, 3, 4));
  });

  it('map should work', () => {
    eql(map(x => x + 1, [1, 2, 3, 4]),
        [2, 3, 4, 5]);
    eql(map(x => [x[0], x[1] + 1], { x: 1, y: 2 }),
        { x: 2, y: 3 });
    eql(map(x => x + num, [1, 2, 3, 4]),
        [6, 7, 8, 9]);
    eql(seq([1, 2, 3, 4], map(x => x + num)),
        [6, 7, 8, 9]);

    immutEql(map(x => x + 1, Immutable.List.of(1, 2, 3, 4)),
             Immutable.List.of(2, 3, 4, 5));

    eql(transduce(map(x => x * 2),
                  add,
                  0,
                  [1, 2, 3]),
        12);
  });

  it('mapIndexed should work', () => {
    // eql(mapIndexed((x, i) => i, { x: 1, y: 2 }),
    //     [0, 1]);
    eql(mapIndexed((x, i) => i, [1, 2, 3, 4]),
        [0, 1, 2, 3]);

    eql(seq([1, 2, 3, 4], mapIndexed((x, i) => x + i)),
        [1, 3, 5, 7]);
  });

  it('filter should work', () => {
    eql(filter(x => x % 2 === 0, [1, 2, 3, 4]),
        [2, 4]);
    eql(filter(x => x[1] % 2 === 0, { x: 1, y: 2 }),
        { y: 2 });
    // eql(filter((x, i) => i !== 0, [1, 2, 3, 4]),
    //     [2, 3, 4]);
    eql(filter(x => x >= num, [4, 5, 6]),
        [5, 6]);

    immutEql(filter(x => x % 2 === 0, Immutable.List.of(1, 2, 3, 4)),
             Immutable.List.of(2, 4));

    eql(transduce(filter(x => x % 2 === 0),
                  add,
                  0,
                  [1, 2, 3]),
        2);
  });

  it('remove should work', () => {
    eql(remove(x => x % 2 === 0, [1, 2, 3, 4]),
        [1, 3]);
    eql(remove(x => x[1] % 2 === 0, { x: 1, y: 2 }),
        { x: 1 });
    eql(remove(x => x < num, [4, 5, 6]),
        [5, 6]);

    immutEql(remove(x => x % 2 === 0, Immutable.List.of(1, 2, 3, 4)),
             Immutable.List.of(1, 3));

    eql(transduce(remove(x => x % 2 ===0),
                  add,
                  0,
                  [1, 2, 3]),
        4);
  });

  it('dedupe should work', () => {
    eql(into([], dedupe(), [1, 2, 2, 3, 3, 3, 5]),
        [1, 2, 3, 5])
  });

  it('keep should work', () => {
    eql(into([], keep(), [1, 2, undefined, null, false, 5]),
        [1, 2, false, 5])
  });

  it('take should work', () => {
    eql(take(2, [1, 2, 3, 4]), [1, 2])
    eql(take(10, [1, 2, 3, 4]), [1, 2, 3, 4])

    immutEql(take(2, Immutable.List.of(1, 2, 3, 4)),
             Immutable.List.of(1, 2))

    eql(into([], take(2), [1, 2, 3, 4]),
        [1, 2]);
  });

  it('takeWhile should work', () => {
    function lt(n) {
      return function(x) {
        return x < n;
      }
    }

    eql(takeWhile(lt(3), [1, 2, 3, 2]), [1, 2]);
    eql(takeWhile(lt(10), [1, 2, 3, 4]), [1, 2, 3, 4])
    eql(takeWhile(x => x < num, [4, 5, 6]), [4]);

    immutEql(takeWhile(lt(3), Immutable.List.of(1, 2, 3, 2)),
             Immutable.List.of(1, 2))

    eql(into([], takeWhile(lt(3)), [1, 2, 3, 2]),
        [1, 2]);
  });

  it('drop should work', () => {
    eql(drop(2, [1, 2, 3, 4]), [3, 4])
    eql(drop(10, [1, 2, 3, 4]), [])

    immutEql(drop(2, Immutable.List.of(1, 2, 3, 4)),
             Immutable.List.of(3, 4))

    eql(into([], drop(2), [1, 2, 3, 4]),
        [3, 4]);
  });

  it('dropWhile should work', () => {
    function lt(n) {
      return function(x) {
        return x < n;
      }
    }

    eql(dropWhile(lt(3), [1, 2, 3, 2]), [3, 2]);
    eql(dropWhile(lt(10), [1, 2, 3, 4]), []);
    eql(dropWhile(x => x < num, [4, 5, 6]),
        [5, 6]);

    immutEql(dropWhile(lt(3), Immutable.List.of(1, 2, 3, 2)),
             Immutable.List.of(3, 2));

    eql(into([], dropWhile(lt(3)), [1, 2, 3, 2]),
        [3, 2]);
  });

  it('partition should work', () => {
    eql(partition(2, [1, 2, 3, 4]), [[1, 2], [3, 4]]);
    eql(partition(3, [1, 2, 3, 4]), [[1, 2, 3]]);
    eql(partition(2, [1, 2, 3, 4, 5]), [[1, 2], [3, 4]]);

    immutEql(partition(2, Immutable.List.of(1, 2, 3, 4)),
             Immutable.List.of(
               Immutable.List.of(1, 2),
               Immutable.List.of(3, 4)
             ));
    immutEql(partition(2, Immutable.List.of(1, 2, 3, 4, 5)),
             Immutable.List.of(
               Immutable.List.of(1, 2),
               Immutable.List.of(3, 4)
             ));

    eql(into([], partition(2), [1, 2, 3, 4]), [[1, 2], [3, 4]]);
    eql(into([], partition(2), [1, 2, 3, 4, 5]), [[1, 2], [3, 4]]);

    // These 2 are tests for "ensure_unreduced" case
    eql(into([], compose(partition(2), take(2)),
             [1, 2, 3, 4, 5]),
        [[1, 2], [3, 4]]);
    eql(into([], compose(partition(2), take(3)),
             [1, 2, 3, 4, 5, 6, 7, 8]),
        [[1, 2], [3, 4], [5, 6]]);
  });

  it('partitionAll should work', () => {
    eql(partitionAll(2, [1, 2, 3, 4]), [[1, 2], [3, 4]]);
    eql(partitionAll(2, [1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]]);

    immutEql(partitionAll(2, Immutable.List.of(1, 2, 3, 4)),
             Immutable.List.of(
               Immutable.List.of(1, 2),
               Immutable.List.of(3, 4)
             ));
    immutEql(partitionAll(2, Immutable.List.of(1, 2, 3, 4, 5)),
             Immutable.List.of(
               Immutable.List.of(1, 2),
               Immutable.List.of(3, 4),
               Immutable.List.of(5)
             ));

    eql(into([], partitionAll(2), [1, 2, 3, 4]), [[1, 2], [3, 4]]);
    eql(into([], partitionAll(2), [1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]]);

    // These 2 are tests for "ensure_unreduced" case
    eql(into([], compose(partitionAll(2), take(2)),
             [1, 2, 3, 4, 5]),
        [[1, 2], [3, 4]]);
    eql(into([], compose(partitionAll(2), take(3)),
             [1, 2, 3, 4, 5]),
        [[1, 2], [3, 4], [5]]);
  });

  it("partitionBy should work", () => {
    var type = (x) => typeof x;

    eql(partitionBy(type, ["a", "b", 1, 2, "c", true, false, undefined]),
        [["a", "b"], [1, 2], ["c"], [true, false], [undefined]]);
    immutEql(partitionBy(type, Immutable.List.of("a", "b", 1, 2, "c", true, false, undefined)),
             Immutable.List.of(["a", "b"], [1, 2], ["c"], [true, false], [undefined]));

    // These 2 are tests for "ensure_unreduced" case
    eql(into([], compose(partitionBy(type), take(4)),
             ["a", "b", 1, 2, "c", true, false, undefined]),
        [["a", "b"], [1, 2], ["c"], [true, false]]);
    eql(into([], compose(partitionBy(type), take(5)),
             ["a", "b", 1, 2, "c", true, false, undefined]),
        [["a", "b"], [1, 2], ["c"], [true, false], [undefined]]);
  });

  it("interpose should work", () => {
    eql(interpose(null, [1, 2, 3]), [1, null, 2, null, 3]);
    immutEql(interpose(undefined, Immutable.List.of(1, 2, 3)),
             Immutable.List.of(1, undefined, 2, undefined, 3));

    eql(interpose(null, []), []);
    immutEql(interpose(null, Immutable.List()), Immutable.List());

    // Test early-termination handling
    eql(into([], compose(interpose(null), take(4)),
             [1, 2, 3]),
        [1, null, 2, null]);
    eql(into([], compose(interpose(null), take(3)),
             [1, 2, 3]),
        [1, null, 2]);
  });

  // it("repeat should work", () => {
  //   eql(repeat([1, 2, 3], 2), [1, 1, 2, 2, 3, 3]);
  //   immutEql(repeat(Immutable.List.of(1, 2), 3),
  //            Immutable.List.of(1, 1, 1, 2, 2, 2));

  //   eql(repeat([], 2), []);
  //   immutEql(repeat(Immutable.List(), 3), Immutable.List());

  //   eql(repeat([1, 2, 3], 0), []);
  //   eql(repeat([1, 2, 3], 1), [1, 2, 3]);

  //   // Test early-termination handling
  //   eql(into([], compose(repeat(2), take(3)),
  //            [1, 2, 3]),
  //       [1, 1, 2]);
  //   eql(into([], compose(repeat(3), take(2)),
  //            [1, 2, 3]),
  //       [1, 1]);
  // });


  it("takeNth should work", () => {
    eql(takeNth(2, [1, 2, 3, 4]), [1, 3]);
    immutEql(takeNth(2, Immutable.List.of(1, 2, 3, 4, 5)),
             Immutable.List.of(1, 3, 5));

    eql(takeNth(2, []), []);
    immutEql(takeNth(3, Immutable.List()), Immutable.List());

    eql(takeNth(1, [1, 2, 3]), [1, 2, 3]);
  });

  it('cat should work', () => {
    eql(
      into([], cat(), [[1, 2], [3, 4]]),
      [1, 2, 3, 4]
    );

    immutEql(into(Immutable.List(),
                  cat(),
                  Immutable.fromJS([[1, 2], [3, 4]])),
             Immutable.List.of(1, 2, 3, 4));
  });

  it('mapcat should work', () => {
    eql(into([],
             mapcat(arr => map(x => x + 1, arr)),
             [[1, 2], [3, 4]]),
        [2, 3, 4, 5]);

    eql(into([],
             mapcat(arr => map(x => x + num, arr)),
             [[1, 2], [3, 4]]),
        [6, 7, 8, 9]);
  });

  it('into should work', () => {
    eql(into([], map(x => x + 1), [1, 2, 3, 4]),
        [2, 3, 4, 5]);
    eql(into([], map(x => x[1] + 1), { x: 10, y: 20 }),
        [11, 21]);
    eql(into({}, map(x => [x[0], x[1] + 1]), { x: 10, y: 20 }),
        { x: 11, y: 21 });
    eql(into({}, map(x => ['foo' + x, x * 2]), [1, 2]),
        { foo1: 2, foo2: 4 });

    eql(into([1, 2, 3], map(x => x + 1), [7, 8, 9]),
        [1, 2, 3, 8, 9, 10]);

    eql(into([], { a: 2, b: 3 }), [["a", 2], ["b", 3]]);

    immutEql(into(Immutable.List(), map(x => x + 1), [1, 2, 3]),
             Immutable.List.of(2, 3, 4));
  });

  it('seq should work', () => {
    eql(seq([1, 2, 3, 4], map(x => x + 1)),
        [2, 3, 4, 5]);
    eql(seq({ x: 10, y: 20 }, map(x => [x[0], x[1] + 1])),
        { x: 11, y: 21 });

    immutEql(seq(Immutable.List.of(1, 2, 3), map(x => x + 1)),
             Immutable.List.of(2, 3, 4));
  });

  it('transduce and compose should work', () => {
    eql(transduce(compose(
                    map(x => x + 1),
                    filter(x => x % 2 === 0)
                  ),
                  conj,
                  [],
                  [1, 2, 3, 4]),
        [2, 4])

    eql(transduce(compose(
                    map(second),
                    map(x => x + 1)
                  ),
                  conj,
                  [],
                  { x: 1, y: 2 }),
        [2, 3])

    eql(transduce(compose(
                    map(second),
                    map(x => x + 1),
                    map(x => ['foo' + x, x])
                  ),
                  conj,
                  {},
                  { x: 1, y: 2 }),
        { foo2: 2, foo3: 3 })

    immutEql(transduce(compose(
                         map(x => x + 1),
                         filter(x => x % 2 === 0)
                       ),
                       Immutable.List.prototype,
                       Immutable.List(),
                       Immutable.List.of(1, 2, 3, 4)),
             Immutable.List.of(2, 4));

    eql(into([], compose(map(x => [x, x * 2]),
                         cat(),
                         filter(x => x > 2)),
             [1, 2, 3, 4]),
        [4, 3, 6, 4, 8]);
  });

  it('into vector should work', () => {
    let nums = {
      i: 0,
      next() {
        return {
          value: this.i++,
          done: false
        };
      },
    };

    eql(into([], [1, 2, 3]), [1, 2, 3]);
    eql(into([], take(3), [1, 2, 3, 4]),
        [1, 2, 3]);
    eql(into([], take(6), nums),
        [0, 1, 2, 3, 4, 5]);
  });

  it('into hash-map should work', () => {
    eql(into({}, [['foo', 1], ['bar', 2]]),
        { foo: 1, bar: 2 });
    eql(into({}, map(kv => [kv[0], kv[1] + 1]), { foo: 1, bar: 2 }),
        { foo: 2, bar: 3 });
  });

  it('transducer->fn', () => {
    eql([1, 2, 3].reduce(toFn(map(x => x + 1), conj), []),
      [2, 3, 4]);
  });

  it('iter should work', () => {
    let nums = {
      i: 0,
      next() {
        return {
          value: this.i++,
          done: false
        };
      },
    };

    let lt = toIterator(map(x => x * 2), nums);
    assert.instanceOf(lt, LazyTransformer);
    eql(into([], take(5), lt), [0, 2, 4, 6, 8]);

    let nums2 = {
      i: 0,
      next() {
        return {
          value: this.i++,
          done: false
        };
      },
    };

    lt = toIterator(take(5), nums2);
    assert.instanceOf(lt, LazyTransformer);
    //eql(into([], lt), [0, 1, 2, 3, 4]);
  });

  it('all should work', (done) => {
    let array = [1, 2, 3, 4].map(x => Promise.resolve(x));

    all([
      all(array, take(3)).then(res => {
        eql(res, [1, 2, 3]);
      }),
      all(array, map(x => Promise.resolve(x + 1))).then(res => {
        eql(res, [2, 3, 4, 5]);
      })
    ]).then(() => done(), done);
  });

  it('seq take with observable should work', (done) => {
    let array = Observable.from([1, 2, 3, 4, 5]);
    let res = [];

    seq(array, take(3)).subscribe({
      next(x) { res.push(x); },
      complete() {
        eql(res, [1, 2, 3]);
        done();
      }
    });
  });

  it('seq map with observable should work', (done) => {
    let array = Observable.from([1, 2, 3, 4]);
    let res = [];

    seq(array, map(x => x + 1)).subscribe({
      next(x) { res.push(x); },
      complete() {
        eql(res, [2, 3, 4, 5]);
        done();
      }
    });
  });

  it('#repeat', () => {
    eql(repeat(4, 'x'),
      ['x', 'x', 'x', 'x']);
    eql(
      into([], take(4), repeat('x')),
      ['x', 'x', 'x', 'x']);
  });

  it('#repeatedly', () => {
    let i = 0;
    let inc = () => i++;
    eql(repeatedly(4, () => inc()),
      [0, 1, 2, 3]);
    eql(
      into([], take(4), repeatedly(() => inc())),
      [4, 5, 6, 7]);
  });

  it('#cycle', () => {
    eql(
      into([], take(5), cycle(["a", "b"])),
      ["a", "b", "a", "b", "a"]);
  });
});
