import { even_QMARK_, seq } from "lfjs/core";
import { add, filter, reduce } from "lodash/fp";

const sum_even_numbers = numbers => function () {
  let nums = seq(filter(even_QMARK_, numbers));
  return nums ? reduce(add, nums) : "No even numbers found.";
}();

sum_even_numbers([7, 5, 9]);