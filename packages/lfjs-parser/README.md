# LFJS Parser
[![Build Status](https://travis-ci.org/tchak/lfjs-parser.svg)](https://travis-ci.org/tchak/lfjs-parser)

A parser for Lisp Flavoured JavaScript

```javascript
parse('(+ 1 2)');

[{
  "type": "list",
  "value": [
    { "type": "identifier", "value": "_PLUS_" },
    { "type": "integer", "raw": '1', "value": 1 },
    { "type": "integer", "raw": "2", "value": 2 }
  ]
}]
```
# License

Published by [tchak](https://github.com/tchak) under a permissive MIT License, see [LICENSE.md](./LICENSE.md).
