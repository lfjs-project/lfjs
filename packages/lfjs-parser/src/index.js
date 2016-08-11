import Set from 'core-js/library/fn/set';

import {
  uniqBy,
  range
} from 'lodash';

import Tokenizer, { invalidCharacterError } from './tokenizer';
import normalize from './normalize';

const SYMBOL_REGEXP  = /[^()\[\]\{\}\#"'`,:;\|\s]/;
const FLOAT_REGEXP   = /^[-+]?[0-9]+\.[0-9]*$/;
const INTEGER_REGEXP = /^[-+]?[0-9]+$/;
const ANONYMOUS_ARGUMENT_REGEXP = /^\%[0-9]?$/;

export default function parse(str) {
  let tokens = new Tokenizer(str).parse();
  let tree = [list()];
  let anonymousParams = [];
  let current;

  for (let i = 0, len = tokens.length; i < len; i++) {
    let token = tokens[i];
    let chars = token.chars;

    switch (token.type) {
    // List
    case '(':
      current = list();
      push(tree, current);
      tree.unshift(current);
      break;
    // Vector
    case '[':
      current = ESNode('vector', []);
      push(tree, current);
      tree.unshift(current);
      break;
    // Map
    case '{':
      current = ESNode('map', []);
      push(tree, current);
      tree.unshift(current);
      break;
    // Set
    case '#{':
      current = ESNode('set', []);
      push(tree, current);
      tree.unshift(current);
      break;
    case ')':
    case ']':
    case '}':
      postProcessNode(tree.shift(), anonymousParams);
      break;
    // fn
    case '#(':
      current = list();
      push(tree, current);
      current.anonymous = true;
      anonymousParams.unshift(new Set());
      tree.unshift(current);
      break;
    // deref
    case '@':
      push(tree,
        list(
          identifier('deref'),
          identifier(chars)
        )
      );
      break;
    // quote
    case "'":
      push(tree,
        list(
          symbol('quote'),
          symbol(chars)
        )
      );
      break;
    // Keyword
    case ':':
      push(tree, keyword(chars));
      break;
    // String
    case '"':
      push(tree, string(chars));
      break;
    // RegExp
    case '#"':
      push(tree, regexp(chars));
      break;
    // Symbol / Number
    case 'symbol-or-number':
      if (FLOAT_REGEXP.test(chars)) {
        push(tree, float(chars));
      } else if (INTEGER_REGEXP.test(chars)) {
        push(tree, integer(chars));
      } else if (ANONYMOUS_ARGUMENT_REGEXP.test(chars)) {
        if (anonymousParams[0]) {
          anonymousParams[0].add(chars);
        } else {
          invalidCharacterError(chars, 'not an anonymous function');
        }
        push(tree, symbol(chars));
      } else if (SYMBOL_REGEXP.test(chars)) {
        push(tree, symbol(chars));
      }
      break;
    }
  }

  return val(tree);
}

function val(tree) {
  return tree[0].value;
}

function push(tree, value) {
  val(tree).push(value);
}

function postProcessNode(node, anonymousParams) {
  switch (node.type) {
  case 'set':
    optimizeSet(node);
  case 'list':
    anonymousFnArguments(node, anonymousParams);
  }
}

function optimizeSet(node) {
  node.value = uniqBy(node.value, 'value');
}

function anonymousFnArguments(node, anonymousParams) {
  if (node.anonymous) {
    delete node.anonymous;

    let params = Array.from(anonymousParams.shift().values());
    let max = params.sort().pop();

    if (max) {
      max = parseInt(max.replace('%', ''), 10) + 1;

      params = range(1, max).map(i => identifier(`%${i}`));
    }

    node.value = [
      identifier('fn'),
      ESNode('vector', params),
      list(...node.value)
    ];
  }
}

function ESNode(type, value, raw = null) {
  let node = { type, value };

  if (raw) { node.raw = raw; }

  return node;
}

function list(...value) {
  return ESNode('list', value);
}

function string(chars) {
  return ESNode('string', chars, `"${chars}"`);
}

function keyword(value) {
  return ESNode('keyword', value, `"${value}"`);
}

function regexp(value) {
  return ESNode('regexp', new RegExp(value), `/${value}/`);
}

function float(value) {
  return ESNode('float', parseFloat(value, 10), value);
}

function integer(value) {
  return ESNode('integer', parseInt(value, 10), value);
}

function literal(value) {
  return ESNode('literal', value, `${value}`);
}

function identifier(value) {
  return ESNode('identifier', normalize(value));
}

function symbol(value) {
  switch (value) {
  case 'nil':
    return literal(null);
  case 'true':
    return literal(true);
  case 'false':
    return literal(false);
  default:
    return identifier(value);
  }
}
