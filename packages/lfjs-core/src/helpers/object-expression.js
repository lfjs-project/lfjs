import { chunk } from 'lodash';

import {
  objectExpression,
  objectProperty
} from 'babel-types';

export default function(properties) {
  return objectExpression(
    chunk(properties, 2)
      .map(([key, value]) => objectProperty(key, value))
  );
}
