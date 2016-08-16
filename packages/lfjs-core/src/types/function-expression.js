import {
  blockStatement,
  functionExpression
} from 'babel-types';

import expressionStatement from './expression-statement';

export default function(id, params, body) {
  return functionExpression(id, params || [],
    blockStatement(
      expressionStatement(body, true)
    ));
}
