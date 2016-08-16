import { compact } from 'lodash';

export default function(nodes) {
  let [id, doc, ...tail] = nodes;

  if (doc.type !== 'string') {
    tail = [doc, ...tail];
    doc = null;
  }

  return {
    type: 'list',
    value: [
      {
        type: 'identifier',
        value: 'def'
      },
      ...compact([id, doc]),
      {
        type: 'list',
        value: [
          {
            type: 'identifier',
            value: 'fn'
          },
          ...tail
        ]
      }
    ]
  };
}
