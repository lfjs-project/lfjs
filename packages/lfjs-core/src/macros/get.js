export default function(nodes, node) {
  return {
    type: 'list',
    value: [
      {
        type: 'identifier',
        value: 'get'
      },
      node,
      ...nodes
    ]
  };
}
