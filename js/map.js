'use strict';
(function () {
  var MAP = document.querySelector('.map');
  var MAP_TEMPLATE = document.querySelector('template').content;
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var MAP_MAIN_PIN_WIDTH = 65;
  var MAP_MAIN_PIN_HEIGHT = 65;
  var MAP_X_COORD_MIN = MAP_MAIN_PIN_WIDTH / 2;
  var MAP_X_COORD_MAX = MAP.offsetWidth - MAP_MAIN_PIN_WIDTH / 2;
  var MAP_Y_COORD_MIN = 150;
  var MAP_Y_COORD_MAX = 500;

  var disableMap = function () {
    MAP.classList.add('map--faded');
  };

  var enableMap = function () {
    MAP.classList.remove('map--faded');
  };

  return (window.map = {
    MAP: MAP,
    MAP_TEMPLATE: MAP_TEMPLATE,
    MAP_X_COORD_MIN: MAP_X_COORD_MIN,
    MAP_X_COORD_MAX: MAP_X_COORD_MAX,
    MAP_Y_COORD_MIN: MAP_Y_COORD_MIN,
    MAP_Y_COORD_MAX: MAP_Y_COORD_MAX,
    MAP_PIN_WIDTH: MAP_PIN_WIDTH,
    MAP_PIN_HEIGHT: MAP_PIN_HEIGHT,
    MAP_MAIN_PIN_WIDTH: MAP_MAIN_PIN_WIDTH,
    MAP_MAIN_PIN_HEIGHT: MAP_MAIN_PIN_HEIGHT,
    disableMap: disableMap,
    enableMap: enableMap
  });
})();
