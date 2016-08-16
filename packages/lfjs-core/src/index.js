import { readFileSync } from 'fs';
import { readFile } from 'mz/fs';
import { transformFromAst as babelTransformFromAst } from 'babel-core';
import generate from 'babel-generator';
import parse from 'lfjs-parser';

import program from './types/program';

export function transform(code, options = {}) {
  return transformFromAst(parse(code), options);
}

export function transformFile(filename, options = {}) {
  return readFile(filename)
    .then(code => transform(code, { filename, ...options }));
}

export function transformFileSync(filename, options = {}) {
  return transform(readFileSync(filename, 'utf8'), { filename, ...options });
}

export const VERSION = '0.1.0';

export function transformFromAst(tree, options = {}) {
  let env = options.env || createEnv();

  env.imports = Object.create(null);

  let result = { env, ast: program(tree, env) };
  let resultWithCode;

  if (options.babel) {
    let { filename } = options;

    resultWithCode = babelTransformFromAst(result.ast, null, {
      filename,
      presets: ['es2015'],
      plugins: [
        'lodash',
        'transform-object-rest-spread'
      ]
    });
  } else {
    resultWithCode = generate(result.ast);
  }

  return Object.assign(result, resultWithCode);
}

export default {
  transform,
  transformFile,
  transformFileSync,
  transformFromAst
};

function createEnv() {
  return {
    meta: Object.create(null),
    imports: Object.create(null),
    scope: new Set()
  };
}
