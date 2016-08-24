import { registry } from 'lfjs-runtime';
import { memoize } from 'lodash';
import { identifier } from 'babel-types';

import { importModule } from '../helpers';

const RESERVED_NAMES = [
  'catch',
  'delete',
  'finally',
  'throw'
];

export default function(value, env) {
  let local = normalizeName(value);

  if (notInScope(env, local)) {
    if (isRuntime(local)) {
      let { imported, module } = registry(local);

      importModule(`${imported}:${local}`, module, env);
    } else {
      console.log(`WARNING: identifier "${local}" not defined`);
    }
  }

  return identifier(local);
}

const normalizeName = memoize(value => {
  if (RESERVED_NAMES.indexOf(value) !== -1) {
    return `_${value}`;
  }

  return value;
});

function isRuntime(id) {
  return !!registry(id);
}

function notInScope(env, id) {
  let { scope, params } = env;
  return !scope.has(id) &&
    (!params || !params.has(id));
}
