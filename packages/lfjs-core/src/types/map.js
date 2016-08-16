import { arrayToAST } from '../helpers';
import objectExpression from './object-expression';

export default function(nodes, env) {
  return objectExpression(arrayToAST(nodes, env));
}
