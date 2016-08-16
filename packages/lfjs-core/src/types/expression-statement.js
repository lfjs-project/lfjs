import { initial, last } from 'lodash';

import {
  expressionStatement,
  isVariableDeclaration,
  isThrowStatement,
  returnStatement,
  isTryStatement
} from 'babel-types';

function needsWrappedStatement(body) {
  return isVariableDeclaration(body) ||
    isThrowStatement(body) ||
    isTryStatement(body);
}

function wrappedExpressionStatement(body) {
  if (needsWrappedStatement(body)) {
    return body;
  } else {
    return expressionStatement(body);
  }
}

function wrappedReturnStatement(body) {
  if (isVariableDeclaration(body)) {
    return [
      body,
      returnStatement(body.declarations[0].id)
    ];
  } else if (isTryStatement(body)) {
    return body;
  } else {
    return returnStatement(body);
  }
}

export default function(body, implicitReturn=false) {
  if (!Array.isArray(body)) { body = [body]; }

  let lastNode = last(body);

  body = initial(body).map(wrappedExpressionStatement);

  if (lastNode) {
    if (implicitReturn) {
      body.push(wrappedReturnStatement(lastNode));
    } else {
      body.push(wrappedExpressionStatement(lastNode));
    }
  }

  return body;
}
