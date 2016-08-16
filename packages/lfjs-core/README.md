# lfjs-core

> LFJS compiler core

## Install

```
$ npm install lfjs-core
```

## Usage

```js
import lfjs from 'lfjs-core';

const code = `(+ 1 2)`;
const result = lfjs.transform(code, { /* options */ });

result.code; // Generated code
result.map; // Sourcemap
result.ast; // AST
```

```javascript
lfjs.transformFromAst([{
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

For more in depth documentation see: http://lfjs.io/docs/usage/api/
