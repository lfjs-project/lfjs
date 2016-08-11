import repl from 'repl';

export default function(context) {
  repl.start({
    prompt: '> ',
    input: process.stdin,
    output: process.stdout,
    eval: _eval(context),
    useGlobal: true,
    ignoreUndefined: true
  });
}

function _eval(context) {
  return function(code, _, filename, callback) {
    let err;
    let result;

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
