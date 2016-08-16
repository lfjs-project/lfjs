import { _throw } from "lfjs-runtime";

const error_BANG_ = () => _throw("Error!");

(function () {
  try {
    return error_BANG_();
  } catch (e) {
    return "yolo!";
  }
})();