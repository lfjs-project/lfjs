import { _throw } from "lfjs-runtime";

(function () {
  try {
    return _throw("Error!");
  } catch (e) {
    return "yolo!";
  }
})();