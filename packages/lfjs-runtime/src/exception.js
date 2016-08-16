export function _try(try_expression, catch_expression) {
  if (catch_expression && !catch_expression._isCatchExpression) {
    _throw('Catch expression of wrong type.');
  }
  try {
    return try_expression();
  } catch (e) {
    if (catch_expression) {
      catch_expression(e);
    }
  }
}

export function _catch(catch_expression) {
  catch_expression._isCatchExpression = true;
  return catch_expression;
}

export function _throw(error) {
  if (typeof error === 'string') {
    error = new Error(error);
  }

  throw error;
}
