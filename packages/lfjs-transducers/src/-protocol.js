export const TRANSDUCER_INIT = Symbol.for('transducer/init');
export const TRANSDUCER_RESULT = Symbol.for('transducer/result');
export const TRANSDUCER_STEP = Symbol.for('transducer/step');

const TRANSDUCER_REDUCED = Symbol.for('transducer/reduced');
const TRANSDUCER_VALUE = Symbol.for('transducer/value');

/**
 *
 */
class Reduced {
  constructor(value) {
    this[TRANSDUCER_REDUCED] = true;
    this[TRANSDUCER_VALUE] = value;
  }
}

/**
 *
 */
export function isReduced(x) {
  return (x instanceof Reduced) || (x && x[TRANSDUCER_REDUCED]);
}

/**
 *
 */
export function reduced(value) {
  return new Reduced(value);
}

/**
 * This is for tranforms that call their nested transforms when
 * performing completion (like "partition"), to avoid signaling
 * termination after already completing.
 */
export function unreduced(value) {
  return isReduced(value) ? deref(value) : value;
}

/**
 *
 */
export function deref(x) {
  return x[TRANSDUCER_VALUE];
}

/**
 * This is for transforms that may call their nested transforms before
 * Reduced-wrapping the result (e.g. "take"), to avoid nested Reduced.
 */
export function ensureReduced(value) {
  return isReduced(value) ? value : reduced(value);
}
