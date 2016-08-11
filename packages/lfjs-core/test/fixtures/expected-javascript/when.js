import { gt } from "lodash/fp";

const do_stuff = () => null;

gt(2, 3) ? function () {
  do_stuff();
  return do_stuff();
}() : null;
