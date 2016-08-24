export {
  isInteger,
  gt,
  lt,
  gte,
  lte,
  add,
  subtract,
  multiply,
  divide
} from 'lodash';

import { isNumber } from 'lodash';

export { isNumber };

export function isPos(n) {
  return isNumber(n) && n > 0;
}

export function isNeg(n) {
  return isNumber(n) && n < 0;
}

export function isZero(n) {
  return isNumber(n) && n === 0;
}

export function isEven(n) {
  return isNumber(n) && n % 2 == 0;
}

export function isOdd(n) {
  return isNumber(n) && n % 2 !== 0;
}

export function dec(a) {
  return a - 1;
}

export function inc(a) {
  return a + 1;
}

export function mod(a, b) {
  return (a % b + b) % b;
}

export function isFloat(n) {
 return n === +n && n !== (n|0);
}

export function floor() {}
