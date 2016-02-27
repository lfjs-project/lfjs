import {
  escapeRegExp,
  uniqBy,
  range
} from 'lodash';

const SYMBOL_REGEXP  = /[^()\[\]\{\}\#"'`,:;\|\s]/;
const FLOAT_REGEXP   = /^[-+]?[0-9]+\.[0-9]*$/;
const INTEGER_REGEXP = /^[-+]?[0-9]+$/;
const SPACE_REGEXP   = /[\t\n\f ]/;

const SPECIAL_CHARS_MAP = {
  '!': '_BANG_',
  '%': '_PERCENT_',
  '*': '_STAR_',
  '+': '_PLUS_',
  '/': '_SLASH_',
  '<': '_LT_',
  '=': '_EQ_',
  '>': '_GT_',
  '?': '_QMARK_',
  '-': '_'
};
const SPECIAL_CHARS = Object.keys(SPECIAL_CHARS_MAP).join('');
const ANONYMOUS_FIRST_ARGUMENT_REGEXP = /^\%$/;
const ANONYMOUS_ARGUMENT_REGEXP = /^\%[0-9]?$/;
const SPECIAL_CHARS_REGEXP = new RegExp(
  `[${escapeRegExp(SPECIAL_CHARS)}]`, 'g');

function normalize(str) {
  return str
    .replace(ANONYMOUS_FIRST_ARGUMENT_REGEXP,
      () => '_PERCENT_1')
    .replace(SPECIAL_CHARS_REGEXP,
      char => SPECIAL_CHARS_MAP[char]);
}

function preprocessInput(input) {
  return input.replace(/\r\n?/g, "\n");
}

export default function parse(str) {
  let tokenizer = new Tokenizer(str);
  let tokens = tokenizer.parse();

  let tree = [list()];
  let anonymousParams = [];
  let current;

  for (let i = 0, len = tokens.length; i < len; i++) {
    let token = tokens[i];
    let chars = token.chars;

    switch (token.type) {
    // List
    case '(':
      current = list();
      push(tree, current);
      tree.unshift(current);
      break;
    // Vector
    case '[':
      current = collection('vector');
      push(tree, current);
      tree.unshift(current);
      break;
    // Map
    case '{':
      current = collection('map');
      push(tree, current);
      tree.unshift(current);
      break;
    // Set
    case '#{':
      current = collection('set');
      push(tree, current);
      tree.unshift(current);
      break;
    case ')':
    case ']':
    case '}':
      postProcessNode(tree.shift(), anonymousParams);
      break;
    // fn
    case '#(':
      current = list();
      push(tree, current);
      current.anonymous = true;
      anonymousParams.unshift(new Set());
      tree.unshift(current);
      break;
    // deref
    case '@':
      push(tree,
        list(
          identifier('deref'),
          identifier(chars)
        )
      );
      break;
    // quote
    case "'":
      push(tree,
        list(
          symbol('quote'),
          symbol(chars)
        )
      );
      break;
    // Keyword
    case ':':
      push(tree, keyword(chars));
      break;
    // String
    case '"':
      push(tree, string(chars));
      break;
    // RegExp
    case '#"':
      push(tree, regexp(chars));
      break;
    // Symbol / Number
    case 'symbol-or-number':
      if (FLOAT_REGEXP.test(chars)) {
        push(tree, float(chars));
      } else if (INTEGER_REGEXP.test(chars)) {
        push(tree, integer(chars));
      } else if (ANONYMOUS_ARGUMENT_REGEXP.test(chars)) {
        if (anonymousParams[0]) {
          anonymousParams[0].add(chars);
        } else {
          error(chars, 'not an anonymous function');
        }
        push(tree, symbol(chars));
      } else if (SYMBOL_REGEXP.test(chars)) {
        push(tree, symbol(chars));
      }
      break;
    }
  }

  return val(tree);
}

function val(tree) {
  return tree[0].value;
}

function push(tree, value) {
  val(tree).push(value);
}

function postProcessNode(node, anonymousParams) {
  switch (node.type) {
  case 'set':
    optimizeSet(node);
  case 'list':
    anonymousFnArguments(node, anonymousParams);
  }
}

function optimizeSet(node) {
  node.value = uniqBy(node.value, 'value');
}

function anonymousFnArguments(node, anonymousParams) {
  if (node.anonymous) {
    delete node.anonymous;

    let params = Array.from(anonymousParams.shift().values());
    let max = params.sort().pop();

    if (max) {
      max = parseInt(max.replace('%', ''), 10) + 1;

      params = range(1, max).map(i => identifier(`%${i}`));
    }

    node.value = [
      identifier('fn'),
      collection('vector', ...params),
      list(...node.value)
    ];
  }
}

function collection(type, ...value) {
  return {
    type: type,
    value: value
  }
}

function list(...value) {
  return {
    type: 'list',
    value: value
  }
}

function string(chars) {
  return {
    type: 'string',
    raw: `"${chars}"`,
    value: chars
  };
}

function keyword(value) {
  return {
    type: 'keyword',
    raw: `"${value}"`,
    value: value
  };
}

function regexp(value) {
  return {
    type: 'regexp',
    raw: `/${value}/`,
    value: new RegExp(value)
  };
}

function float(value) {
  return {
    type: 'float',
    raw: value,
    value: parseFloat(value, 10)
  };
}

function integer(value) {
  return {
    type: 'integer',
    raw: value,
    value: parseInt(value, 10)
  };
}

function literal(value) {
  return {
    type: 'literal',
    raw: `${value}`,
    value: value
  };
}

function identifier(value) {
  return {
    type: 'identifier',
    value: normalize(value)
  };
}

function symbol(value) {
  switch (value) {
  case 'nil':
    return literal(null);
  case 'true':
    return literal(true);
  case 'false':
    return literal(false);
  default:
    return identifier(value);
  }
}

function error(char, state) {
  throw new Error(`Invalid character "${char}" in ${state}.`);
}

class Tokenizer {
  constructor(input) {
    this.input = preprocessInput(input);
    this.char = 0;
    this.line = 1;
    this.column = 0;

    this.state = 'sexp';
    this.token = null;
  }

  parse() {
    let tokens = [], token;

    while (true) {
      token = this.lex();
      if (token === 'EOF') { break; }
      if (token) { tokens.push(token); }
    }

    return tokens;
  }

  addChar(char) {
    if (this.token && typeof this.token.chars === 'string') {
      this.token.chars += char;
    }
  }

  addLocInfo(token, line, column) {
    if (!token) { return; }

    token.firstLine = this.firstLine;
    token.firstColumn = this.firstColumn;
    token.lastLine = (line === 0) ? 0 : (line || this.line);
    token.lastColumn = (column === 0) ? 0 : (column || this.column);
  }

  lex() {
    let char = this.input.charAt(this.char++);

    if (char) {
      if (char === "\n") {
        this.line++;
        this.column = 0;
      } else {
        this.column++;
      }
      let token = this[this.state].call(this, char);
      //this.addLocInfo(token, this.line, this.column);
      return token;
    } else {
      //this.addLocInfo(this.line, this.column);
      return 'EOF';
    }
  }

  sexp(char) {
    let sharp = this.sharp;
    this.sharp = false;

    switch (char) {
    case '#':
      if (sharp) { error(char, this.state); }
      this.sharp = true;
      break;
    case '(':
      if (sharp) {
        return { type: '#(' };
      } else {
        return { type: '(' };
      }
    case '{':
      if (sharp) {
        return { type: '#{' };
      } else {
        return { type: '{' };
      }
    case '[':
    case ')':
    case '}':
    case ']':
      if (sharp) { error(char, this.state); }
      return { type: char };
    case '"':
      this.state = 'string';

      if (sharp) {
        return this.token = { type: '#"', chars: '' };
      } else {
        return this.token = { type: '"', chars: '' };
      }
    case ':':
    case '@':
    case "'":
      this.state = 'symbol';

      if (sharp) { error(char, this.state); }

      return this.token = { type: char, chars: '' };
    default:
      if (sharp) { error(char, this.state); }

      if (SYMBOL_REGEXP.test(char)) {
        this.state = 'symbol';

        return this.token = { type: 'symbol-or-number', chars: char };
      } else if (!SPACE_REGEXP.test(char)) {
        error(char, this.state);
      }
    }
  }

  string(char) {
    if (char === '"') {
      this.state = 'sexp';
    } else {
      this.addChar(char);
    }
  }

  symbol(char) {
    switch (char) {
    case ')':
    case '}':
    case ']':
      this.state = 'sexp';
      return { type: char };
    default:
      if (SPACE_REGEXP.test(char)) {
        this.state = 'sexp';
      } else if (SYMBOL_REGEXP.test(char)) {
        this.addChar(char);
      } else {
        error(char, this.state);
      }
    }
  }
}
