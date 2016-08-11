/* global __dirname */
import fs from 'fs';
import { kebabCase } from 'lodash';

import { assert } from 'chai';

import transform from '../src/index';

describe('#transform', () => {
  describe('declarations', () => {
    test('empty', '');
    test('def vector', '(def a ["a" :a 1 true nil])');
    test('def set', '(def a #{1 2 3})');
    test('def map', '(def a {:key 1})');
    test('def with doc', '(def a "This is an A." "a")');
    test('defn', '(defn a [x] (map inc x))');
    test('defn with doc', '(defn a "Increment all the things." [x] (map inc x))');
    test('keyword / integer as fn', '(:a {:a 1}) (2 [1 2 3])');
    test('doc', '(def a "This is an A." "a") (doc a)');
    test('meta', '(def a "This is an A." "a") (meta a)');
  });

  describe('invocations', () => {
    test('simple invocation', '(+ 1 2) (- 3 0)');
    test('predicates', '(def a []) (array? a) (filter odd? a)');
    test('floats', '(group-by floor [6.1 4.2 6.3])');
    test('println', '(println "hello")');
  });

  describe('let', () => {
    test('let', '(let [i 0 index 0] (+ i (inc index))) (index)');
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
    test('throw', '(throw "error!")');
    test('throw try catch', '(try (throw "error!") (catch "yolo!"))');
    test('try catch', '(try (error!) (catch "yolo!"))');
  })
});

function test(name, source) {
  let filename = kebabCase(name);

  if (arguments.length === 1) {
    source = fs.readFileSync(path('actual', filename, 'lfjs'), 'utf-8');
  }

  let { ast: outputAST, code: outputCode } = transform(source);

  let expectedAST = {};
  let expectedCode = '';

  let filepathAST = path('expected-ast', filename);
  let filepathCode = path('expected-javascript', filename, 'js');

  if (fs.existsSync(filepathAST)) {
    expectedAST = JSON.parse(fs.readFileSync(filepathAST, 'utf-8') || '{}');
  } else {
    fs.writeFileSync(filepathAST, JSON.stringify(outputAST, null, 2), 'utf-8');
  }

  if (fs.existsSync(filepathCode)) {
    expectedCode = fs.readFileSync(filepathCode, 'utf-8');
  } else {
    fs.writeFileSync(filepathCode, outputCode, 'utf-8');
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
