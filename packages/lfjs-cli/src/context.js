import vm from 'vm';
import transform from 'lfjs-core';

export default class Context {
  eval(code, filename) {
    code = code.trim();
    if (!code) return undefined;

    let options = { babel: true };

    if (this.env) {
      options.env = this.env;
    }

    let result = transform(code, options);

    this.env = result.env;

    code = result.code.replace(/"use strict";/, '');

    return vm.runInThisContext(code, {
      filename: filename
    });
  }
}
