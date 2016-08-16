import {
  arrayExpression,
  newExpression,
  identifier
} from 'babel-types';

import { arrayToAST } from '../helpers';

export default function(nodes, env) {
  return newExpression(
    identifier('Set'),
    [arrayExpression(arrayToAST(nodes, env))]
  );
}
