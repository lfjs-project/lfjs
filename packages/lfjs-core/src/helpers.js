import { compact, find, matches } from 'lodash';

import {
  booleanLiteral,
  isNode,
  nullLiteral,
  numericLiteral,
  regExpLiteral,
  stringLiteral
} from 'babel-types';

import identifier from './types/identifier';
import list from './types/list';
import map from './types/map';
import set from './types/set';
import vector from './types/vector';

import _when from './macros/when';
import _while from './macros/while';
import defn from './macros/defn';
import get from './macros/get';
import ifLet from './macros/if-let';
import ifNot from './macros/if-not';
import println from './macros/println';
import recur from './macros/recur';

const macros = [];

export function registerMacro(pattern, fn) {
  macros.push(Object.assign(
    Object.assign({ type: 'identifier' }, pattern),
    { fn: fn }));
}

registerMacro({ value: 'defn' }, defn);
registerMacro({ value: 'if_let' }, ifLet);
registerMacro({ value: 'if_not' }, ifNot);
registerMacro({ value: 'println' }, println);
registerMacro({ value: 'recur' }, recur);
registerMacro({ value: 'when' }, _when);
registerMacro({ value: 'while' }, _while);
registerMacro({ type: 'integer' }, get);
registerMacro({ type: 'keyword' }, get);

export function nodeToAST(node, env) {
  if (isNode(node)) { return node; }
  if (!node) { return nullLiteral(); }

  let { type, value } = node;
  switch (type) {
  case 'list':
    return list(value, env);
  case 'vector':
    return vector(value, env);
  case 'set':
    return set(value, env);
  case 'map':
    return map(value, env);
  case 'identifier':
    return identifier(value, env);
  case 'keyword':
  case 'string':
    return stringLiteral(value);
  case 'regexp':
    return regExpLiteral(value);
  case 'float':
  case 'integer':
    return numericLiteral(value);
  case 'literal':
    switch (value) {
    case true:
    case false:
      return booleanLiteral(value);
    case null:
      return nullLiteral();
    }
  }
}

export function expandMacros(nodes) {
  return nodes.map(expandMacro);
}

function expandMacro(node) {
  if (node.type === 'list') {
    let [head, ...tail] = node.value;
    let { type, value } = head;
    let pattern = { type };

    if (type === 'identifier') {
      pattern.value = value;
    }

    let macro = find(macros, matches(pattern));

    if (macro) {
      node = macro.fn(tail, head);
    }
  }

  if (Array.isArray(node.value)) {
    node.value = expandMacros(node.value);
  }

  return node;
}

export function arrayToAST(nodes, env) {
  return compact(nodes.map(node => nodeToAST(node, env)));
}

export function importModule(id, moduleName, env) {
  let module = env.imports[moduleName] || new Set();

  env.imports[moduleName] = module;
  module.add(id);
}
