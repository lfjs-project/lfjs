import { identifier } from 'babel-types';

export default function(nodes) {
  return {
    type: 'list',
    value: [
      identifier('__loop'),
      ...nodes
    ]
  };
}
