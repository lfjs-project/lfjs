import fs from 'fs';
import Set from 'core-js/library/fn/set';
import { transformFromAst as babelTransformFromAst } from "babel-core";
import generate from 'babel-generator';
import parse from 'lfjs-parser';

import program from './ast/program';

export default function transform(code, options = {}) {
  return transformFromAst(parse(code), options);
}

export function transformFile(filename, options = {}, callback) {
  fs.readFile(filename, function(err, code) {
    if (err) {
      callback(err, null);
    } else {
      options.filename = filename;
      callback(null, transform(code, options));
    }
  });
}

export function transformFileSync(filename, options = {}) {
  options.filename = filename;
  return transform(fs.readFileSync(filename, "utf8"), options);
}

export const VERSION = '0.1.0';

export function transformFromAst(tree, options = {}) {
  let env = options.env || createEnv();

  env.imports = Object.create(null);

  let result = { env, ast: program(tree, env) };
  let resultWithCode;

  if (options.babel) {
    let filename = options.filename;

    resultWithCode = babelTransformFromAst(result.ast, null, {
      filename: filename,
      presets: ['es2015'],
      plugins: ['lodash']
    });
  } else {
    resultWithCode = generate(result.ast);
  }

  return Object.assign(result, resultWithCode);
}

function createEnv() {
  return {
    meta: Object.create(null),
    imports: Object.create(null),
    scope: new Set()
  };
}
