/* global document */

import { isPlainObject, isEmpty, isString } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

export const isBrowser = (typeof document !== 'undefined');

export default function html(element) {
  return createElement(normalize(element));
}

export function component(render) {
  let Component = React.createClass({
    render() {
      return html(render(...this.props.args));
    },

    shouldComponentUpdate() {
    }
  });

  return (...args) => [Component, { args }];
}

export const {
  renderToString: renderHtml,
  renderToStaticMarkup: renderStatic
} = ReactDOMServer;

export function mount(element, selector) {
  return new Promise(resolve => {
    if (isBrowser) {
      let container = (isString(selector)) ?
        document.querySelector(selector) :
          (selector ? selector : document.body);
      ReactDOM.render(element, container, resolve);
    } else {
      resolve(renderHtml(element));
    }
  });
}

const ID_REGEXP = /#/;
const ID_OR_CLASS_REGEXP = /[#.]/g;

function normalize(element) {
  if (!Array.isArray(element)) { return element; }

  let [tagName, attrs, ...content] = element;

  if (!isString(tagName)) {
    return [tagName, attrs];
  }

  let [type, ...css] = tagName.split(ID_OR_CLASS_REGEXP);

  if (attrs && !isPlainObject(attrs)) {
    content.unshift(attrs);
    attrs = null;
  }

  if (!type) { type = 'div'; }

  let className = attrs && attrs['class'];

  if (!isEmpty(css)) {
    attrs = attrs || {};
    className = className || [];

    if (tagName.match(ID_REGEXP)) {
      attrs['id'] = css.shift();
    }

    if (!Array.isArray(className)) {
      className = [className];
    }

    className = className.concat(css);
  }

  if (!isEmpty(className)) {
    if (Array.isArray(className)) {
      className = className.join(' ');
    }

    attrs['className'] = className;
    delete attrs['class'];
  }

  content = content.map(normalize);

  return [type, attrs, ...content];
}

function createElement(element) {
  if (!Array.isArray(element)) { return element; }

  let [type, attrs, ...content] = element;

  content = content.map(createElement);

  return React.createElement(type, attrs, ...content);
}
