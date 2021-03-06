'use strict';
(function () {
  var MAP_PIN = window.map.MAP_TEMPLATE.querySelector('.map__pin');
  var MAP_PINS = document.querySelector('.map__pins');
  var MAP_MAIN_PIN = document.querySelector('.map__pin--main');
  var MAP_MAIN_PIN_START_Y = 570;
  var MAP_MAIN_PIN_START_X = 375;

  var getMainPinInitialAddress = function () {
    var x = Math.round(MAP_MAIN_PIN.offsetLeft + MAP_MAIN_PIN.offsetWidth / 2);
    var y = Math.round(MAP_MAIN_PIN.offsetTop + MAP_MAIN_PIN.offsetHeight / 2);
    return x + ', ' + y;
  };
  var setMainPinToInitialPosition = function () {
    MAP_MAIN_PIN.style.top = MAP_MAIN_PIN_START_X + 'px';
    MAP_MAIN_PIN.style.left = MAP_MAIN_PIN_START_Y + 'px';
  };
  var getMainPinRealAddress = function () {
    var x = Math.round(MAP_MAIN_PIN.offsetLeft + MAP_MAIN_PIN.offsetWidth / 2);
    var y = Math.round(MAP_MAIN_PIN.offsetTop + MAP_MAIN_PIN.offsetHeight);
    return x + ', ' + y;
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
      var pin = pinTemplate.cloneNode(true);
      pin.dataset['offerId'] = i;
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

  // pins event handlers
  var onMapManinPinMouseDown = function (evt) {
    evt.preventDefault();
    var start = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onDocumentMouseMove = function (evtMove) {
      var scrollY = window.scrollY;
      var shift = {
        x: start.x - evtMove.clientX,
        y: start.y - evtMove.clientY
      };

      start.x = evtMove.clientX;
      start.y = evtMove.clientY;

      if (
        !(
          start.x <= window.map.MAP_X_COORD_MIN ||
          start.x >= window.map.MAP_X_COORD_MAX
        )
      ) {
        MAP_MAIN_PIN.style.left = MAP_MAIN_PIN.offsetLeft - shift.x + 'px';
      }

      if (
        !(
          start.y + scrollY <= window.map.MAP_Y_COORD_MIN ||
          start.y + scrollY >= window.map.MAP_Y_COORD_MAX
        )
      ) {
        MAP_MAIN_PIN.style.top = MAP_MAIN_PIN.offsetTop - shift.y + 'px';
      }

      window.form.setInputAddressValue(getMainPinInitialAddress());
    };

    var onDocumentMouseUp = function () {
      document.removeEventListener('mouseup', onDocumentMouseUp);
      document.removeEventListener('mousemove', onDocumentMouseMove);
    };

    document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('mousemove', onDocumentMouseMove);
  };
  var onMainPinMouseUp = function () {
    var pinAddress = getMainPinRealAddress();
    window.form.setInputAddressValue(pinAddress);
    window.map.enableMap();
    window.form.enableAdForm();
    window.form.enableFormFieldsets();
    MAP_PINS.appendChild(generatePins(window.data.offers));
  };
  var onPinClick = function (evt) {
    var offer;
    var target = evt.target.closest('.map__pin');
    if (target && !target.classList.contains('map__pin--main')) {
      offer = target.dataset['offerId'];
      window.offerCard.closeOfferPopup();
      window.offerCard.showOfferPopup(window.data.offers[offer]);
    }
  };

  // pins event handlers
  MAP_PINS.addEventListener('click', onPinClick);
  MAP_MAIN_PIN.addEventListener('mouseup', onMainPinMouseUp);
  MAP_MAIN_PIN.addEventListener('mousedown', onMapManinPinMouseDown);
  return (window.pins = {
    getMainPinInitialAddress: getMainPinInitialAddress,
    getMainPinRealAddress: getMainPinRealAddress,
    setMainPinToInitialPosition: setMainPinToInitialPosition,
    removePins: removePins,
    setPinOffsetX: setPinOffsetX,
    setPinOffsetY: setPinOffsetY,
    generatePins: generatePins
  });
})();
