import { atom, deref, swap as swap_BANG_ } from "lfjs-runtime/atom";
import { dec, isPos as pos_QMARK_ } from "lfjs-runtime/math";
const a = atom(10);

(function __loop() {
  return pos_QMARK_(deref(a)) ? function () {
    swap_BANG_(a, dec);
    return __loop();
  }() : null;
})();