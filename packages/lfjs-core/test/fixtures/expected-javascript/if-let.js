import { seq } from "lfjs-runtime/vector";
import { filter, reduce } from "lfjs-runtime/transducers";
import { add as _PLUS_, isEven as even_QMARK_ } from "lfjs-runtime/math";

const sum_even_numbers = numbers => function () {
  let nums = seq(filter(even_QMARK_, numbers));
  return nums ? reduce(_PLUS_, nums) : "No even numbers found.";
}();

sum_even_numbers([7, 5, 9]);