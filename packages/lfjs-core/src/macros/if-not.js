import { reverse } from 'lodash';

export default function(nodes) {
  let [head, ...tail] = nodes;

  return {
    type: 'list',
    value: [
      {
        type: 'identifier',
        value: 'if'
      },
      head,
      ...reverse(tail)
    ]
  };
}
