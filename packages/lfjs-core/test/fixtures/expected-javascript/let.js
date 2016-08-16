import { add } from "lodash/fp";
import { count, inc } from "lfjs-runtime";

(function () {
  let i = 0,
      count = 0;
  return add(i, inc(count));
})();

count([]);
