'use strict';
(function () {
  var getRandomMinMax = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  };
  var shuffleArray = function (arr) {
    var i = arr.length;
    var j;
    var temp;
    var shuffledArray = arr;
    while (--i > 0) {
      j = getRandomMinMax(0, i);
      temp = shuffledArray[j];
      shuffledArray[j] = shuffledArray[i];
      shuffledArray[i] = temp;
    }
    return arr;
  };

  window.util = {
    getRandomMinMax: getRandomMinMax,
    shuffleArray: shuffleArray
  };
})();
