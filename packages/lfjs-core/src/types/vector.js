import { arrayExpression } from 'babel-types';

import { arrayToAST } from '../helpers';

export default function(nodes, env) {
  return arrayExpression(
    arrayToAST(nodes, env)
  );
}
