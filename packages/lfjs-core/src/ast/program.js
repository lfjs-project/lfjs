import { compact, flatten, isEmpty, toPairs } from 'lodash';

import {
  program,
  importDeclaration,
  identifier,
  importSpecifier,
  stringLiteral,
  exportDefaultDeclaration
} from 'babel-types';

import expressionStatement from '../helpers/expression-statement';
import { arrayToAST, expandMacros } from '../helpers';

export default function(body, env) {
  body = expandMacros(body);
  body = arrayToAST(body, env);

  let { imports, exportDefault } = env;

  let expressions = compact(flatten([
    importDeclarationsFrom(toPairs(imports)),
    expressionStatement(body, false),
    exportDefault ? exportDefaultDeclaration(identifier(exportDefault)) : null
  ]));

  return program(expressions);
}

function importDeclarationsFrom(imports) {
  if (!isEmpty(imports)) {
    return imports.map(([moduleName, imports]) => {
      return importDeclaration(
        toArray(imports).sort().map(name => importSpecifier(
          identifier(name),
          identifier(name)
        )),
        stringLiteral(moduleName)
      );
    });
  }
}

function toArray(iterable) {
  return Array.from(iterable.values());
}
