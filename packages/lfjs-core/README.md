# LFJS Transpiler
[![Build Status](https://travis-ci.org/tchak/lfjs-transpiler.svg)](https://travis-ci.org/tchak/lfjs-transpiler)

A transpiler for Lisp Flavoured JavaScript

```javascript
transpile([{
  "type": "list",
  "value": [
    { "type": "identifier", "value": "_PLUS_" },
    { "type": "integer", "raw": '1', "value": 1 },
    { "type": "integer", "raw": "2", "value": 2 }
  ]
}]);

{
  "type": "Program",
  "body": [
    {
      "type": "ImportDeclaration",
      "specifiers": [
        {
          "type": "ImportSpecifier",
          "local": {
            "type": "Identifier",
            "name": "add"
          },
          "imported": {
            "type": "Identifier",
            "name": "add"
          }
        }
      ],
      "source": {
        "type": "StringLiteral",
        "value": "lodash/fp"
      }
    },
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "Identifier",
          "name": "add"
        },
        "arguments": [
          {
            "type": "NumericLiteral",
            "value": 1
          },
          {
            "type": "NumericLiteral",
            "value": 2
          }
        ]
      }
    }
  ],
  "directives": []
}
```

# License

Published by [tchak](https://github.com/tchak) under a permissive MIT License, see [LICENSE.md](./LICENSE.md).
