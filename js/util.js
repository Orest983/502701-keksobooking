'use strict';
(function () {
  var getRandomMinMax = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var lastTimeout;
  var debounce = function (func, timeout) {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(func, timeout);
  };

  window.util = {
    getRandomMinMax: getRandomMinMax,
    debounce: debounce
  };
})();
