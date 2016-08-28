/* global chai define requirejs window */

window.process = {
  env: {
    NODE_ENV: 'test'
  }
};

define('chai', ['exports'], function (exports) {
  exports.assert = chai.assert;
});

requirejs('lfjs-fetch/test');
requirejs('lfjs-html/test');
requirejs('lfjs-parser/test');
requirejs('lfjs-runtime/test');
