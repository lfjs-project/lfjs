import { inc, lt as _LT_ } from "lfjs-runtime/math";
import { println } from "lfjs-runtime/lang";

(function () {
  let i = 0;
  return function __loop(i) {
    return _LT_(i, 5) ? function () {
      println(i);
      return __loop(inc(i));
    }() : null;
  }(i);
})();