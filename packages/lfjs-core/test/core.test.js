/* global __dirname */
import {
  readFileSync,
  writeFileSync,
  existsSync
} from 'fs';
import { kebabCase, times, uniq } from 'lodash';
import { assert } from 'chai';

import { transform } from '../src/index';
import { registry } from 'lfjs-runtime';

describe('lfjs-core', () => {
  describe('declarations', () => {
    test('empty', '');
    test('def vector', '(def a ["a" :a 1 true nil])');
    test('def set', '(def a #{1 2 3})');
    test('def map', '(def a {:key 1})');
    test('def with doc', '(def a "This is an A." "a")');
    test('defn', '(defn a [x] (map inc x))');
    test('defn no body', '(defn a [])');
    test('defn with doc', '(defn a "Increment all the things." [x] (map inc x))');
    test('keyword / integer as fn', '(:a {:a 1}) (2 [1 2 3])');
    test('doc', '(def a "This is an A." "a") (doc a)');
    test('meta', '(def a "This is an A." "a") (meta a)');
    test('defc', '(defc text-input [value] [:input { :type :text :value value }])');
  });

  describe('invocations', () => {
    test('simple invocation', '(+ 1 2) (- 3 0) (pos? 3)');
    test('predicates', '(def a []) (vector? a) (filter odd? a)');
    test('floats', '(partition-by floor [6.1 4.2 6.3])');
    test('println', '(println "hello")');
  });

  describe('let', () => {
    test('let', '(let [i 0 count 0] (+ i (inc count))) (count [])');
    test('if-let');
  });

  describe('control flow', () => {
    test('if', '(if (> 2 3) "a")');
    test('if else', '(if (> 2 3) "a" "b")');
    test('if-not', '(if-not (> 2 3) "a" "b")');
    test('do', '(defn do-stuff []) (do (do-stuff) (do-stuff))');
    test('when', '(defn do-stuff []) (when (> 2 3) (do-stuff) (do-stuff))');
  });

  describe('loop', () => {
    test('loop');
    test('while', '(def a (atom 10)) (while (pos? @a) (swap! a dec))');
  });

  describe('modules', () => {
    test('export', '(def a []) (export a)');
    test('import', '(import a :from "mylib/a")');
  });

  describe('exceptions', () => {
    test('throw', '(throw "Error!")');
  });

  describe('class', () => {
    test('class', '(class Model (defmethod save [x] x) (defmethod update []))');
    //test('class extends', '(class Model :extends Base (defmethod save [x] x) (defmethod update []))');
  });

  describe('predicates', () => {
    test('nil?', '(nil? nil)');
    test('vector?', '(vector? [])');
    test('set?', '(set? #{})');
    test('hash-map?', '(hash-map? {})');
    test('true?', '(true? true)');
    test('false?', '(false? false)');
    test('number?', '(number? 1)');
    test('string?', '(string? "abc")');
    test('empty?', '(empty? [])');
    test('fn?', '(fn? inc)');
    test('integer?', '(integer? 1)');
    test('float?', '(float? 1.1)');
  });

  describe('runtime', () => {
    let ARGS = Array.from('xyzij');
    let statements = [];
    let vars = new Set();
    function varByArity(i) {
      let x = ARGS[i];
      vars.add(x);
      return x;
    }
    registry.forEach((name, meta) => {
      if (meta.name) {
        statements.push(`(${[meta.name, ...times(meta.arity, varByArity)].join(' ')})`);
      }
    });
    let args = Array.from(vars).map(x => `(def ${x} nil)`);
    statements = [...args, ...uniq(statements)].join("\n");
    test('runtime', statements);
  });
});

function test(name, source) {
  let filename = kebabCase(name
    .replace('?', '-qmark')
    .replace('!', '-bang'));

  if (arguments.length === 1) {
    source = readFileSync(path('actual', filename, 'lfjs'), 'utf-8');
  }

  let { ast: outputAST, code: outputCode } = transform(source);

  let expectedAST = {};
  let expectedCode = '';

  let filepathAST = path('expected-ast', filename);
  let filepathCode = path('expected-javascript', filename, 'js');

  if (existsSync(filepathAST)) {
    expectedAST = JSON.parse(readFileSync(filepathAST, 'utf-8') || '{}');
  } else {
    writeFileSync(filepathAST, JSON.stringify(outputAST, null, 2), 'utf-8');
  }

  if (existsSync(filepathCode)) {
    expectedCode = readFileSync(filepathCode, 'utf-8');
  } else {
    writeFileSync(filepathCode, outputCode, 'utf-8');
  }

  outputCode = normalizeLines(outputCode);
  expectedCode = normalizeLines(expectedCode);

  it (name, () => {
    assert.deepEqual(outputAST, expectedAST, 'ast should match');
    assert.deepEqual(outputCode, expectedCode, 'code should match');
  });
}

function normalizeLines(str) {
  return str.trimRight().replace(/\r\n/g, '\n');
}

function path(dir, filename, ext='json') {
  return __dirname + `/fixtures/${dir}/${filename}.${ext}`
}
