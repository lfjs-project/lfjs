import {
  chunk,
  head,
  last,
  tail,
  isEmpty,
  flatten,
  toPairs
} from 'lodash';

import {
  arrowFunctionExpression,
  blockStatement,
  callExpression,
  classBody,
  classDeclaration,
  classMethod,
  conditionalExpression,
  identifier,
  nullLiteral,
  stringLiteral,
  variableDeclaration,
  variableDeclarator
} from 'babel-types';

import functionExpression from './function-expression';
import objectExpression from './object-expression';
import expressionStatement from './expression-statement';

import { importModule, nodeToAST, arrayToAST } from '../helpers';

export default function(nodes, env) {
  let [id, ...args] = nodes;

  switch (id.value) {
  case 'def':
    return def(head(args), tail(args), env);
  case 'fn':
    return fn(args, env);
  case 'if':
    return ifElse(env, head(args), ...tail(args));
  case 'let':
    env = createLocalScope(env);
    return iife([
      bindings(head(args), env),
      last(args)
    ], env);
  case 'do':
    return iife(args, env);
  case 'loop':
    return loop(head(args), tail(args), env);
  case 'import':
    importModule(`${head(args).value}:${head(args).value}`, last(args).value, env);
    return null;
  case 'export':
    env.exportDefault = head(args).value;
    return null;
  case 'doc':
    return doc(head(args).value, env);
  case 'meta':
    return meta(head(args).value, env);
  case 'class':
    return _class(head(args), tail(args), env);
  case 'defmethod':
    return method(head(args), tail(args), env);
  default:
    return callExpression(
      nodeToAST(id, env), arrayToAST(args, env)
    );
  }
}

function _class(id, body, env) {
  env.scope.add(id.value);

  return classDeclaration(
    nodeToAST(id, env),
    null,
    classBody(arrayToAST(body, env)),
    []
  );
}

function doc(id, env) {
  let meta = env.meta[id];

  if (meta && meta.doc) {
    return stringLiteral(meta.doc);
  } else {
    return nullLiteral();
  }
}

function meta(id, env) {
  let meta = env.meta[id];

  if (meta) {
    meta = toPairs(meta).map(([id, value]) => [identifier(id), stringLiteral(value)])
    return objectExpression(arrayToAST(flatten(meta), env));
  } else {
    return nullLiteral();
  }
}

function method(key, args, env) {
  let [{ value: params }, body] = args;

  env = Object.assign({}, env, { params: new Set() });

  return classMethod(
    'method',
    identifier(key.value),
    toArgs(params, env),
    blockStatement(
      expressionStatement(
        nodeToAST(body, env), true
      )
    ),
    false, false);
}

function fn(args, env) {
  let [{ value: params }, body] = args;

  env = Object.assign({}, env, { params: new Set() });

  return arrowFunctionExpression(
    toArgs(params, env),
    nodeToAST(body, env)
  );
}

function toArgs(args, env) {
  args.forEach(id => env.params.add(id.value));
  return arrayToAST(args, env);
}

function def(id, args, env) {
  let [doc, value] = args.length === 2 ? args : [null, args[0]];

  if (doc) {
    env.meta[id.value] = { doc: doc.value };
  }

  return variableDeclaration('const',
    [variable(id, value, env)]
  );
}

function variable(id, value, env) {
  env.scope.add(id.value);

  return variableDeclarator(
    nodeToAST(id, env),
    nodeToAST(value, env)
  );
}

function ifElse(env, test, consequent, alternate) {
  return conditionalExpression(
    nodeToAST(test, env),
    nodeToAST(consequent, env),
    alternate ? nodeToAST(alternate, env) : nullLiteral()
  );
}

function iife(body, env) {
  return callExpression(
    functionExpression(null, [],
      arrayToAST(body, env)), []);
}

function bindings(args, env) {
  return variableDeclaration('let',
    chunk(args.value, 2)
      .map(([id, value]) => variable(id, value, env))
  );
}

function createLocalScope(env) {
  let scope = new Set(Array.from(env.scope));
  return Object.assign({}, env, { scope });
}

function loop(args, body, env) {
  let params = args.value
    .filter((value, i) => i%2 === 0);

  if (isEmpty(params)) {
    return loopBody([], arrayToAST(body, env));
  }

  return iife([
    bindings(args, env),
    loopBody(
      arrayToAST(params, env),
      arrayToAST(body, env)
    )
  ], env);
}

function loopBody(params, body) {
  return callExpression(
    functionExpression(
      identifier('__loop'),
      params,
      body
    ),
    params
  );
}
