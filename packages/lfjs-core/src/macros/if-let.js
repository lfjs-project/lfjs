export default function(nodes) {
  let [head, ...tail] = nodes;

  return {
    type: 'list',
    value: [
      {
        type: 'identifier',
        value: 'let'
      },
      head,
      {
        type: 'list',
        value: [
          {
            type: 'identifier',
            value: 'if'
          },
          head.value[0],
          ...tail
        ]
      }
    ]
  };
}
