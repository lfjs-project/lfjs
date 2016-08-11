'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _module = require('module');

var _module2 = _interopRequireDefault(_module);

var _util = require('util');

var _lodash = require('lodash');

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

var _repl = require('./repl');

var _repl2 = _interopRequireDefault(_repl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var program = new _commander2.default.Command("babel-node");

program.option("-e, --eval [script]", "Evaluate script");
program.option("-p, --print [code]", "Evaluate script and print result");

var pkg = require("../package.json");
program.version(pkg.version);
program.usage("[options] [ -e script | script.js ] [arguments]");
program.parse(process.argv);

var context = new _context2.default();

if (program.eval || program.print) {
  var code = program.eval;
  if (!code || code === true) code = program.print;

  global.__filename = "[eval]";
  global.__dirname = process.cwd();

  var module = new _module2.default(global.__filename);
  module.filename = global.__filename;
  module.paths = _module2.default._nodeModulePaths(global.__dirname);

  global.exports = module.exports;
  global.module = module;
  global.require = module.require.bind(module);

  var result = context.eval(code, global.__filename);
  if (program.print) {
    var output = (0, _lodash.isString)(result) ? result : (0, _util.inspect)(result);
    process.stdout.write(output + "\n");
  }
} else {
  (0, _repl2.default)(context);
}