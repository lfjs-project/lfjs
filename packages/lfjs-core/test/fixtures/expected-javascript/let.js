import { add as _PLUS_, inc } from "lfjs-runtime/math";
import { count } from "lfjs-runtime/coll";

(function () {
  let i = 0,
      count = 0;
  return _PLUS_(i, inc(count));
})();

count([]);