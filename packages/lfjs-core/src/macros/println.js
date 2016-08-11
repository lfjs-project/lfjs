import {
  identifier,
  memberExpression
} from 'babel-types';

export default function(nodes) {
  return {
    type: 'list',
    value: [
      memberExpression(
        identifier('console'),
        identifier('log')
      ),
      ...nodes
    ]
  };
}
