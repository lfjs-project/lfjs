import { arrayToAST } from '../helpers';
import objectExpression from '../helpers/object-expression';

export default function(nodes, env) {
  return objectExpression(arrayToAST(nodes, env));
}
