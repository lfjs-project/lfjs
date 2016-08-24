import { inc, lt as _LT_ } from "lfjs-runtime/math";

(function () {
  let i = 0;
  return function __loop(i) {
    return _LT_(i, 5) ? function () {
      console.log(i);
      return __loop(inc(i));
    }() : null;
  }(i);
})();