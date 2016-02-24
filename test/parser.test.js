import { assert } from 'chai';

import parse from '../src/index';

describe('#parse', function() {
  it('should parse an empty string', function() {
    assert.deepEqual(parse(''), []);
  });

  describe('literals', function() {
    it('string', function() {
      assert.deepEqual(parse('"yolo"'), [{
        type: 'string',
        raw: '"yolo"',
        value: 'yolo'
      }]);
    });

    it('string with spaces', function() {
      assert.deepEqual(parse('"hello world  "'), [{
        type: 'string',
        raw: '"hello world  "',
        value: 'hello world  '
      }]);
    });

    it('string with special characters', function() {
      assert.deepEqual(parse('"hello [world] # -> ()"'), [{
        type: 'string',
        raw: '"hello [world] # -> ()"',
        value: 'hello [world] # -> ()'
      }]);
    });

    it('multiline string', function() {
      assert.deepEqual(parse(`"hello
world"`), [{
          type: 'string',
          raw: '"hello\nworld"',
          value: 'hello\nworld'
      }]);
    });

    describe('number', function() {
      it('integer', function() {
        assert.deepEqual(parse('1'), [{
          type: 'integer',
          raw: '1',
          value: 1
        }]);
      });

      it('float', function() {
        assert.deepEqual(parse('1.1'), [{
          type: 'float',
          raw: '1.1',
          value: 1.1
        }]);
      });
    });

    describe('boolean', function() {
      it('true', function() {
        assert.deepEqual(parse('true'), [{
          type: 'literal',
          raw: 'true',
          value: true
        }]);
      });

      it('false', function() {
        assert.deepEqual(parse('false'), [{
          type: 'literal',
          raw: 'false',
          value: false
        }]);
      });
    });

    it('nil', function() {
      assert.deepEqual(parse('nil'), [{
        type: 'literal',
        raw: 'null',
        value: null
      }]);
    });
  });

  describe('symbols', function() {
    it('identifier', function() {
      assert.deepEqual(parse('yolo'), [{
        type: 'identifier',
        value: 'yolo'
      }]);
    });

    it('identifier with special character', function() {
      assert.deepEqual(parse('yolo->'), [{
        type: 'identifier',
        value: 'yolo__GT_'
      }]);
    });

    it('special characters', function() {
      let chars = {
        '!': 'BANG',
        '%': 'PERCENT',
        '*': 'STAR',
        '+': 'PLUS',
        '/': 'SLASH',
        '<': 'LT',
        '=': 'EQ',
        '>': 'GT',
        '?': 'QMARK'
      }

      for (let key in chars) {
        assert.deepEqual(parse(key), [{
          type: 'identifier',
          value: `_${chars[key]}_`
        }]);
      }
    });
  });

  it('keyword', function() {
    assert.deepEqual(parse(':yolo'), [{
      type: 'keyword',
      raw: '"yolo"',
      value: 'yolo'
    }]);
  });

  it('regexp', function() {
    assert.deepEqual(parse('#".*"'), [{
      type: 'regexp',
      raw: '/.*/',
      value: new RegExp('.*')
    }]);
  });

  describe('list', function() {
    it('with literals', function() {
      assert.deepEqual(parse('(1 "yolo" true)'), [{
        type: 'list',
        value: [
          { type: 'integer', raw: '1', value: 1 },
          { type: 'string', raw: '"yolo"', value: 'yolo' },
          { type: 'literal', raw: 'true', value: true }
        ]
      }]);
    });

    it('with identifier', function() {
      assert.deepEqual(parse('(map "yolo")'), [{
        type: 'list',
        value: [
          { type: 'identifier', value: 'map' },
          { type: 'string', raw: '"yolo"', value: 'yolo' }
        ]
      }]);
    });

    it('with list', function() {
      assert.deepEqual(parse('(map (filter "yolo"))'), [{
        type: 'list',
        value: [
          { type: 'identifier', value: 'map' },
          { type: 'list', value: [
            { type: 'identifier', value: 'filter' },
            { type: 'string', raw: '"yolo"', value: 'yolo' }
          ]}
        ]
      }]);
    });
  });

  describe('vector', function() {
    it('with literals', function() {
      assert.deepEqual(parse('[1 "yolo" true]'), [{
        type: 'vector',
        value: [
          { type: 'integer', raw: '1', value: 1 },
          { type: 'string', raw: '"yolo"', value: 'yolo' },
          { type: 'literal', raw: 'true', value: true }
        ]
      }]);
    });
  });

  describe('set', function() {
    it('with literals', function() {
      assert.deepEqual(parse('#{1 "yolo" true}'), [{
        type: 'set',
        value: [
          { type: 'integer', raw: '1', value: 1 },
          { type: 'string', raw: '"yolo"', value: 'yolo' },
          { type: 'literal', raw: 'true', value: true }
        ]
      }]);
    });

    it('with uniq literals', function() {
      assert.deepEqual(parse('#{1 "yolo" true 1 2 1}'), [{
        type: 'set',
        value: [
          { type: 'integer', raw: '1', value: 1 },
          { type: 'string', raw: '"yolo"', value: 'yolo' },
          { type: 'literal', raw: 'true', value: true },
          { type: 'integer', raw: '2', value: 2 }
        ]
      }]);
    });
  });

  describe('map', function() {
    it('with literals', function() {
      assert.deepEqual(parse('{:a 1 :b "yolo" :c true}'), [{
        type: 'map',
        value: [
          { type: 'keyword', raw: '"a"', value: 'a' },
          { type: 'integer', raw: '1', value: 1 },
          { type: 'keyword', raw: '"b"', value: 'b' },
          { type: 'string', raw: '"yolo"', value: 'yolo' },
          { type: 'keyword', raw: '"c"', value: 'c' },
          { type: 'literal', raw: 'true', value: true }
        ]
      }]);
    });
  });

  describe('anonymous fn', function() {
    it('one argument', function() {
      assert.deepEqual(parse('#(+ % 2)'), [{
        type: 'list',
        value: [
          { type: 'identifier', value: 'fn' },
          { type: 'vector', value: [
            { type: 'identifier', value: '_PERCENT_' }
          ]},
          { type: 'list', value: [
            { type: 'identifier', value: '_PLUS_' },
            { type: 'identifier', value: '_PERCENT_' },
            { type: 'integer', raw: '2', value: 2 }
          ]}
        ]
      }]);
    });
  });

  it('quoted identifier', function() {
    assert.deepEqual(parse("'hello"), [{
      type: 'list',
      value: [
        { type: 'identifier', value: 'quote' },
        { type: 'identifier', value: 'hello' }
      ]
    }]);
  });

  it('derefered identifier', function() {
    assert.deepEqual(parse("@hello"), [{
      type: 'list',
      value: [
        { type: 'identifier', value: 'deref' },
        { type: 'identifier', value: 'hello' }
      ]
    }]);
  });

  describe('errors', () => {
    it('in a(', () => {
      assert.throws(() => parse("a("),
        'Invalid character "(" in symbol');
    });

    it('in #a', () => {
      assert.throws(() => parse("#a"),
        'Invalid character "a" in sexp');
    });

    it('in #:', () => {
      assert.throws(() => parse("#:"),
        'Invalid character ":" in symbol');
    });

    it('in #@', () => {
      assert.throws(() => parse("#@"),
        'Invalid character "@" in symbol');
    });
  });
});
