import { error_BANG_ } from "lfjs/core";

(function () {
  try {
    return error_BANG_();
  } catch (e) {
    return "yolo!";
  }
})();