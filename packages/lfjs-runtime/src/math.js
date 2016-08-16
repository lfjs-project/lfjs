import { isNumber } from 'lodash/fp';

export function pos_QMARK_(n) {
  return isNumber(n) && n > 0;
}

export function neg_QMARK_(n) {
  return isNumber(n) && n < 0;
}

export function zero_QMARK_(n) {
  return isNumber(n) && n === 0;
}

export function even_QMARK_(n) {
  return isNumber(n) && n % 2 == 0;
}

export function odd_QMARK_(n) {
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

export function float_QMARK_(n) {
 return n === +n && n !== (n|0);
}
