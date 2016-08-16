import { map } from "lodash/fp";
import { inc } from "lfjs-runtime";

(function () {
  try {
    return map(inc, [1, 2]);
  } catch (e) {}
})();