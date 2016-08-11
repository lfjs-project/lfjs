(function () {
  try {
    throw new Error("error!");
  } catch (e) {
    return "yolo!";
  }
})();