/* global chai define requirejs window */

window.process = {
  env: {
    NODE_ENV: 'test'
  }
};

define('chai', ['exports'], function (exports) {
  exports.assert = chai.assert;
});

requirejs('lfjs-html/test');
