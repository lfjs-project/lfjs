'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _lfjsTranspiler = require('lfjs-transpiler');

var _lfjsTranspiler2 = _interopRequireDefault(_lfjsTranspiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Context = function () {
  function Context() {
    _classCallCheck(this, Context);
  }

  _createClass(Context, [{
    key: 'eval',
    value: function _eval(code, filename) {
      code = code.trim();
      if (!code) return undefined;

      var options = { transform: true };

      if (this.env) {
        options.env = this.env;
      }

      var result = (0, _lfjsTranspiler2.default)(code, options);

      this.env = result.env;

      code = result.code.replace(/"use strict";/, '');

      return _vm2.default.runInThisContext(code, {
        filename: filename
      });
    }
  }]);

  return Context;
}();

exports.default = Context;