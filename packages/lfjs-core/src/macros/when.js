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
      {
        type: 'list',
        value: [
          {
            type: 'identifier',
            value: 'do'
          },
          ...tail
        ]
      }
    ]
  };
}
