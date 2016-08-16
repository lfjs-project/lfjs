import { atom, dec, deref, pos_QMARK_, swap_BANG_ } from "lfjs-runtime";
const a = atom(10);

(function __loop() {
  return pos_QMARK_(deref(a)) ? function () {
    swap_BANG_(a, dec);
    return __loop();
  }() : null;
})();
