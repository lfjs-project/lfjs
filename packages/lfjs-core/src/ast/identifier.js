import lodash from 'lodash/fp';
import { camelCase, memoize } from 'lodash';
import { identifier } from 'babel-types';

import { importModule } from '../helpers';

const QMARK_REGEXP = /_QMARK_$/;
const MAPPING = {
  '_PLUS_': 'add',
  '_EQ_': 'isEqual'
};

export default function(value, env) {
  let id = value;
  let normalized = normalizeName(value);

  if (notInScope(env, id) && isLodash(normalized)) {
    id = normalized;
  }

  if (notInScope(env, id)) {
    let moduleName = 'lfjs/core';

    if (isLodash(id)) {
      moduleName = 'lodash/fp';
    }

    importModule(id, moduleName, env);
  }

  return identifier(id);
}

const normalizeName = memoize(value => {
  if (value.match(QMARK_REGEXP)) {
    value = `is_${value}`.replace(QMARK_REGEXP, '');
  }
  value = MAPPING[value] || value;
  return camelCase(value);
});

function isLodash(id) {
  return typeof lodash[id] === 'function';
}

function notInScope(env, id) {
  let { scope, params } = env;
  return !scope.has(id) &&
    (!params || !params.has(id));
}
