# lfjs-parser

> LFJS parser

## Install

```
$ npm install lfjs-parser
```

## Usage

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
