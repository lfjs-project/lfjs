# lfjs-register

The require hook will bind itself to node's require and automatically compile files on the fly.

## Install

```
$ npm install lfjs-register
```

## Usage

```js
require("lfjs-register");
```

All subsequent files required by node with the extensions `.lfjs` and `.cljs` will be transformed by LFJS.

See [documentation](http://lfjs.io/docs/usage/require/) for details.
