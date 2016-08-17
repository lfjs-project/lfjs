import { assert } from 'chai';
import html, { component, render_static } from '../src/index';

describe('lfjs-html', function() {
  describe('tag', function() {
    test('<p>hello</p>', ['p', "hello"]);
    test('<p class="a">hello</p>',
      ['p', { class: "a" }, "hello"]);
    test('<p class="a b">hello</p>',
      ['p', { class: "a b" }, "hello"]);
    test('<p class="a b">hello</p>',
      ['p', { class: ["a", "b"] }, "hello"]);
    test('<p class="a b c d">hello</p>',
      ['p.c.d', { class: ["a", "b"] }, "hello"]);
    test('<div class="a b">hello</div>',
      ['.b', { class: "a" }, "hello"]);
    test('<div id="a" class="c b">hello</div>',
      ['#a.b', { class: "c" }, "hello"]);
    test('<p>hello world <b>!</b></p>',
      ['p', "hello ", "world ", ["b", "!"]]);
  });

  describe('children', function() {
    test('<ul><li>1</li><li>2</li></ul>',
      ['ul', ...[1,2].map(n => ['li', n])]);
  });

  describe('component', function() {
    let input = component((label, value) => [
      '.input-field',
      ['label', label],
      ['input', {
        type: 'text',
        value: value
      }]
    ]);

    test('<form><div class="input-field"><label>name</label><input type="text" value="hello"/></div></form>',
      ['form', null, input("name", "hello")]);
  });
});

function test(expected, source) {
  let element = html(source);
  let markup = render_static(element);

  it(expected, () => {
    assert.equal(markup, expected, 'markup shold match');
  });
}
