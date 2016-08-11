const SYMBOL_REGEXP  = /[^()\[\]\{\}\#"'`,:;\|\s]/;
const SPACE_REGEXP   = /[\t\n\f ]/;

function preprocessInput(input) {
  return input.replace(/\r\n?/g, "\n");
}

export default class Tokenizer {
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
      if (sharp) { invalidCharacterError(char, this.state); }
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
      if (sharp) { invalidCharacterError(char, this.state); }
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

      if (sharp) { invalidCharacterError(char, this.state); }

      return this.token = { type: char, chars: '' };
    default:
      if (sharp) { invalidCharacterError(char, this.state); }

      if (SYMBOL_REGEXP.test(char)) {
        this.state = 'symbol';

        return this.token = { type: 'symbol-or-number', chars: char };
      } else if (!SPACE_REGEXP.test(char)) {
        invalidCharacterError(char, this.state);
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
        invalidCharacterError(char, this.state);
      }
    }
  }
}

export function invalidCharacterError(char, state) {
  throw new Error(`Invalid character "${char}" in ${state}.`);
}
