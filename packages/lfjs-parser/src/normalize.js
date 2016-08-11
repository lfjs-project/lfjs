import { escapeRegExp } from 'lodash';

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
//const ANONYMOUS_ARGUMENT_REGEXP = /^\%[0-9]?$/;
const SPECIAL_CHARS_REGEXP = new RegExp(
  `[${escapeRegExp(SPECIAL_CHARS)}]`, 'g');

export default function normalize(str) {
  return str
    .replace(ANONYMOUS_FIRST_ARGUMENT_REGEXP,
      () => '_PERCENT_1')
    .replace(SPECIAL_CHARS_REGEXP,
      char => SPECIAL_CHARS_MAP[char]);
}
