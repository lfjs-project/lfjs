import { add } from "lodash/fp";
import { inc, index } from "lfjs/core";

(function () {
  let i = 0,
      index = 0;
  return add(i, inc(index));
})();

index();