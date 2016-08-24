import { gt as _GT_ } from "lfjs-runtime/math";

const do_stuff = () => null;

_GT_(2, 3) ? function () {
  do_stuff();
  return do_stuff();
}() : null;