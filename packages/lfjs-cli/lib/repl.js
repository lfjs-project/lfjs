"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (context) {
  _repl2.default.start({
    prompt: "> ",
    input: process.stdin,
    output: process.stdout,
    eval: _eval(context),
    useGlobal: true,
    ignoreUndefined: true
  });
};

var _repl = require("repl");

var _repl2 = _interopRequireDefault(_repl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _eval(context) {
  return function (code, _, filename, callback) {
    var err = undefined;
    var result = undefined;

    try {
      if (code[0] === "(" && code[code.length - 1] === ")") {
        code = code.slice(1, -1); // remove "(" and ")"
      }

      result = context.eval(code, filename);
    } catch (e) {
      err = e;
    }

    callback(err, result);
  };
}