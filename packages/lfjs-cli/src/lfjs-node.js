import pathIsAbsolute from 'path-is-absolute';
import path from 'path';
import commander from 'commander';
import Module from 'module';
import { inspect } from 'util';
import { isString } from 'lodash';

import 'lfjs-register';

import Context from './context';
import repl from './repl';

let program = new commander.Command("babel-node");

program.option("-e, --eval [script]", "Evaluate script");
program.option("-p, --print [code]", "Evaluate script and print result");

let pkg = require("../package.json");
program.version(pkg.version);
program.usage("[options] [ -e script | script.js ] [arguments]");
program.parse(process.argv);

const context = new Context();

if (program.eval || program.print) {
  let code = program.eval;
  if (!code || code === true) code = program.print;

  global.__filename = "[eval]";
  global.__dirname = process.cwd();

  let module = new Module(global.__filename);
  module.filename = global.__filename;
  module.paths    = Module._nodeModulePaths(global.__dirname);

  global.exports = module.exports;
  global.module  = module;
  global.require = module.require.bind(module);

  let result = context.eval(code, global.__filename);
  if (program.print) {
    let output = isString(result) ? result : inspect(result);
    process.stdout.write(output + "\n");
  }
} else {
  if (program.args.length) {
    let args = process.argv.slice(2);

    args.reduce((i, arg) => {
      if (arg[0] === "-") {
        let parsedArg = program[arg.slice(2)];
        if (parsedArg && parsedArg !== true) {
          return i;
        }

        return i+1;
      } else {
        return i+1;
      }
    }, 0);
    //args = args.slice(i);

    // make the filename absolute
    let filename = args[0];
    if (!pathIsAbsolute(filename)) {
      args[0] = path.join(process.cwd(), filename);
    }

    // add back on node and concat the sliced args
    process.argv = ["node"].concat(args);
    process.execArgv.unshift(__filename);

    Module.runMain();
  } else {
    repl(context);
  }
}
