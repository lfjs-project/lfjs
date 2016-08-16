import { lt } from "lodash/fp";
import { inc } from "lfjs-runtime";

(function () {
  let i = 0;
  return function __loop(i) {
    return lt(i, 5) ? function () {
      console.log(i);
      return __loop(inc(i));
    }() : null;
  }(i);
})();
