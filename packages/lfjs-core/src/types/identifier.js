import lodash from 'lodash/fp';
import * as runtime from 'lfjs-runtime';
import { camelCase, memoize } from 'lodash';
import { identifier } from 'babel-types';

import { importModule } from '../helpers';

const QMARK_REGEXP = /_QMARK_$/;
const LODASH_MAPPING = {
  '_PLUS_':          'add',
  '_':               'subtract',
  '_STAR_':          'multiply',
  '_SLASH_':         'divide',
  '_EQ_':            'isEqual',
  'contains_QMARK_': 'includes',
  'comp':            'compose',
  '_GT_':            'gt',
  '_LT_':            'lt',
  '_GT__EQ_':        'gte',
  '_LT__EQ_':        'lte'
};

const CORE_MAPPING = {
  'try': '_try',
  'catch': '_catch',
  'throw': '_throw',
  'delete': '_delete'
};

export default function(value, env) {
  let id = normalizeCoreName(value);
  let normalized = normalizeLodashName(value);

  if (notInScope(env, id)) {
    if (isLodash(normalized)) {
      importModule(normalized, 'lodash/fp', env);
      return identifier(normalized);
    } else if (isRuntime(id)) {
      importModule(id, 'lfjs-runtime', env);
    } else if (id === 'component') {
      importModule(id, 'lfjs-html', env);
    } else {
      console.log(`WARNING: identifier "${id}" not defined`);
    }
  }

  return identifier(id);
}

const normalizeLodashName = memoize(value => {
  value = LODASH_MAPPING[value] || value;
  if (value.match(QMARK_REGEXP)) {
    value = `is_${value}`.replace(QMARK_REGEXP, '');
  }
  return camelCase(value);
});

const normalizeCoreName = memoize(value => {
  value = CORE_MAPPING[value] || value;
  return value;
});

function isLodash(id) {
  return typeof lodash[id] === 'function';
}

function isRuntime(id) {
  return typeof runtime[id] === 'function';
}

function notInScope(env, id) {
  let { scope, params } = env;
  return !scope.has(id) &&
    (!params || !params.has(id));
}
