export default function(nodes) {
  return {
    type: 'list',
    value: [
      {
        type: 'identifier',
        value: 'loop'
      },
      {
        type: 'vector',
        value: []
      },
      {
        type: 'list',
        value: [
          {
            type: 'identifier',
            value: 'when'
          },
          ...nodes,
          {
            type: 'list',
            value: [
              {
                type: 'identifier',
                value: 'recur'
              }
            ]
          }
        ]
      }
    ]
  };
}
