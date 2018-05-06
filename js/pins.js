'use strict';
(function () {
  var MAP_PIN = window.map.MAP_TEMPLATE.querySelector('.map__pin');
  var MAP_PINS = document.querySelector('.map__pins');
  var MAP_MAIN_PIN = document.querySelector('.map__pin--main');
  var MAP_MAIN_PIN_START_Y = 570;
  var MAP_MAIN_PIN_START_X = 375;
  var MAP_MAIN_PIN_MIN_X = '0px';
  var MAP_MAIN_PIN_MAX_X =
    window.map.MAP_X_COORD_MAX - window.map.MAP_MAIN_PIN_WIDTH / 2 - 1 + 'px';
  var MAP_MAIN_PIN_MIN_Y =
    window.map.MAP_Y_COORD_MIN - window.map.MAP_MAIN_PIN_HEIGHT + 1 + 'px';
  var MAP_MAIN_PIN_MAX_Y =
    window.map.MAP_Y_COORD_MAX - window.map.MAP_MAIN_PIN_HEIGHT - 1 + 'px';
  var MAX_PINS_COUNT = 5;

  var getMainPinInitialAddress = function () {
    var x = Math.round(MAP_MAIN_PIN.offsetLeft + MAP_MAIN_PIN.offsetWidth / 2);
    var y = Math.round(MAP_MAIN_PIN.offsetTop + MAP_MAIN_PIN.offsetHeight / 2);
    return x + ', ' + y;
  };

  var setMainPinToInitialPosition = function () {
    MAP_MAIN_PIN.style.top = MAP_MAIN_PIN_START_X + 'px';
    MAP_MAIN_PIN.style.left = MAP_MAIN_PIN_START_Y + 'px';
  };

  var getMainPinX = function () {
    return Math.round(MAP_MAIN_PIN.offsetLeft + MAP_MAIN_PIN.offsetWidth / 2);
  };

  var getMainPinY = function () {
    return Math.round(MAP_MAIN_PIN.offsetTop + MAP_MAIN_PIN.offsetHeight);
  };

  var getMainPinRealAddress = function () {
    return getMainPinX() + ', ' + getMainPinY();
  };

  var setPinOffsetX = function (x, width) {
    return x - width / 2;
  };

  var setPinOffsetY = function (y, height) {
    return y - height;
  };

  var generatePins = function (ads) {
    var pinTemplate = MAP_PIN;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      if (i === MAX_PINS_COUNT) {
        break;
      }
      var pin = pinTemplate.cloneNode(true);
      pin.dataset['offerId'] = ads[i].id;
      pin.style.left =
        setPinOffsetX(ads[i].location.x, window.map.MAP_PIN_WIDTH) + 'px';
      pin.style.top =
        setPinOffsetY(ads[i].location.y, window.map.MAP_PIN_HEIGHT) + 'px';
      pin.querySelector('img').src = ads[i].author.avatar;
      pin.querySelector('img').alt = ads[i].offer.title;
      fragment.appendChild(pin);
    }
    return fragment;
  };

  var removePins = function () {
    var pins = window.map.MAP.querySelectorAll('.map__pin');
    for (var i = 0; i < pins.length; i++) {
      var pin = pins[i];
      if (pin.classList.contains('map__pin--main') === false) {
        pin.remove();
      }
    }
  };

  var onMapMainPinMouseDown = function (evt) {
    evt.preventDefault();
    var start = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onDocumentMouseMove = function (evtMove) {
      var shift = {
        x: start.x - evtMove.clientX,
        y: start.y - evtMove.clientY
      };

      start.x = evtMove.clientX;
      start.y = evtMove.clientY;

      var pinX = getMainPinX();
      if (
        !(
          pinX <= window.map.MAP_X_COORD_MIN ||
          pinX >= window.map.MAP_X_COORD_MAX
        )
      ) {
        MAP_MAIN_PIN.style.left = MAP_MAIN_PIN.offsetLeft - shift.x + 'px';
      } else if (pinX <= window.map.MAP_X_COORD_MIN) {
        MAP_MAIN_PIN.style.left = MAP_MAIN_PIN_MIN_X;
      } else if (pinX >= window.map.MAP_X_COORD_MAX) {
        MAP_MAIN_PIN.style.left = MAP_MAIN_PIN_MAX_X;
      }

      var pinY = getMainPinY();

      if (
        !(
          pinY <= window.map.MAP_Y_COORD_MIN ||
          pinY >= window.map.MAP_Y_COORD_MAX
        )
      ) {
        MAP_MAIN_PIN.style.top = MAP_MAIN_PIN.offsetTop - shift.y + 'px';
      } else if (pinY <= window.map.MAP_Y_COORD_MIN) {
        MAP_MAIN_PIN.style.top = MAP_MAIN_PIN_MIN_Y;
      } else if (pinY >= window.map.MAP_Y_COORD_MAX) {
        MAP_MAIN_PIN.style.top = MAP_MAIN_PIN_MAX_Y;
      }

      window.form.setInputAddressValue(getMainPinRealAddress());
    };

    var onDocumentMouseUp = function () {
      document.removeEventListener('mouseup', onDocumentMouseUp);
      document.removeEventListener('mousemove', onDocumentMouseMove);
    };

    document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('mousemove', onDocumentMouseMove);
  };

  var onMainPinMouseUp = function (evt) {
    if (evt.keyCode && evt.keyCode !== window.filter.ENTER_KEY) {
      return;
    }

    if (window.map.MAP.classList.contains('map--faded')) {
      var pinAddress = getMainPinRealAddress();
      window.form.setInputAddressValue(pinAddress);
      window.map.enableMap();
      window.form.enableAdForm();
      window.form.enableFormFieldsets();

      var onLoad = function (data) {
        if (!window.offers) {
          window.offers = window.data.generateOffers(JSON.parse(data));
        }

        var pins = generatePins(window.offers);
        MAP_PINS.appendChild(pins);
        window.filter.enableFilter();
      };
      window.backend.getData(onLoad, window.popupError.showErrorPopUp);
    }
  };

  var onPinClick = function (evt) {
    var target = evt.target.closest('.map__pin');
    if (target && !target.classList.contains('map__pin--main')) {
      var offer = target.dataset['offerId'];
      window.offerCard.showOfferPopup(window.offers[offer]);
    }
  };

  MAP_PINS.addEventListener('click', onPinClick);
  MAP_MAIN_PIN.addEventListener('mouseup', onMainPinMouseUp);
  MAP_MAIN_PIN.addEventListener('keydown', onMainPinMouseUp);
  MAP_MAIN_PIN.addEventListener('mousedown', onMapMainPinMouseDown);

  return (window.pins = {
    MAP_PINS: MAP_PINS,
    getMainPinInitialAddress: getMainPinInitialAddress,
    getMainPinRealAddress: getMainPinRealAddress,
    setMainPinToInitialPosition: setMainPinToInitialPosition,
    removePins: removePins,
    setPinOffsetX: setPinOffsetX,
    setPinOffsetY: setPinOffsetY,
    generatePins: generatePins
  });
})();
