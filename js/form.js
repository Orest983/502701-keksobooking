'use strict';
(function () {
  var AD_FORM = document.querySelector('.ad-form');
  var AD_FIELDSETS = AD_FORM.querySelectorAll('fieldset');
  var INPUT_ADDRESS = AD_FORM.querySelector('#address');
  var SELECT_TIMEIN = AD_FORM.querySelector('#timein');
  var SELECT_TIMEOUT = AD_FORM.querySelector('#timeout');
  var SELECT_ROOM_NUMBER = AD_FORM.querySelector('#room_number');
  var SELECT_CAPACITY = AD_FORM.querySelector('#capacity');
  var SELECT_TYPE = AD_FORM.querySelector('#type');
  var INPUT_PRICE = AD_FORM.querySelector('#price');
  var INPUT_TITLE = AD_FORM.querySelector('#title');
  var SUCCESS_POPUP = document.querySelector('.success');

  // form js functions
  var setAppInitialState = function () {
    var textInputs = AD_FORM.querySelectorAll('input');

    for (var i = 0; i < textInputs.length; i++) {
      removeErrorClass(textInputs[i]);
    }
    window.pins.setMainPinToInitialPosition();
    setInputAddressValue(window.pins.getMainPinInitialAddress());

    disableAdForm();
    window.offerCard.closeOfferPopup();
    window.pins.removePins();
    window.map.disableMap();
    // TODO: Refactor
    setTimeout(window.form.disableFormFieldsets, 500);
  };

  var disableAdForm = function () {
    AD_FORM.classList.add('ad-form--disabled');
  };
  var enableAdForm = function () {
    AD_FORM.classList.remove('ad-form--disabled');
  };
  var disableFormFieldsets = function () {
    for (var i = 0; i < AD_FIELDSETS.length; i++) {
      AD_FIELDSETS[i].disabled = true;
    }
  };
  var enableFormFieldsets = function () {
    for (var i = 0; i < AD_FIELDSETS.length; i++) {
      AD_FIELDSETS[i].disabled = false;
    }
  };
  var setInputAddressValue = function (address) {
    INPUT_ADDRESS.value = address;
  };
  var syncronizeCheckinCheckoutInput = function (evt) {
    var val = evt.target.value;
    SELECT_TIMEIN.querySelector('option[value="' + val + '"]').selected = true;
    SELECT_TIMEOUT.querySelector('option[value="' + val + '"]').selected = true;
  };
  var showError = function (field) {
    if (field.checkValidity() === false) {
      field.reportValidity();
    }
  };
  var toggleErrorClass = function (elem) {
    return elem.checkValidity() ? removeErrorClass(elem) : addErrorClass(elem);
  };
  var addErrorClass = function (elem) {
    elem.classList.add('error');
  };
  var removeErrorClass = function (elem) {
    elem.classList.remove('error');
  };
  var getRoomNumber = function () {
    return parseInt(SELECT_ROOM_NUMBER.value, 10);
  };

  // form.js event handlers
  var onTitleInput = function () {
    showError(INPUT_TITLE);
  };
  var onPriceInput = function () {
    showError(INPUT_PRICE);
  };
  var onTitleBlur = function () {
    toggleErrorClass(INPUT_TITLE);
  };
  var onPriceBlur = function () {
    toggleErrorClass(INPUT_PRICE);
  };
  var onTypeChange = function (evt) {
    var target = evt.target;
    var val = target.value;
    var minPrice = target.querySelector('option[value="' + val + '"]').dataset
        .min;
    INPUT_PRICE.placeholder = minPrice;
    INPUT_PRICE.min = minPrice;
    showError(INPUT_PRICE);
    toggleErrorClass(INPUT_PRICE);
  };
  var onCapacityChange = function () {
    var roomNumber = getRoomNumber();
    var capacity = parseInt(SELECT_CAPACITY.value, 10);

    if (roomNumber === 1 && capacity !== 1) {
      SELECT_CAPACITY.setCustomValidity('1 комната — «для 1 гостя»');
    } else if (roomNumber === 2 && (capacity === 0 || capacity === 3)) {
      SELECT_CAPACITY.setCustomValidity(
          '2 комнаты — «для 2 гостей» или «для 1 гостя»'
      );
    } else if (roomNumber === 3 && capacity === 0) {
      SELECT_CAPACITY.setCustomValidity(
          '3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»'
      );
    } else if (roomNumber === 100 && capacity !== 0) {
      SELECT_CAPACITY.setCustomValidity('100 комнат — «не для гостей»');
    } else {
      SELECT_CAPACITY.setCustomValidity('');
    }
    showError(SELECT_CAPACITY);
  };
  var onRoomNumberChange = function () {
    showError(SELECT_CAPACITY);
    onCapacityChange();
  };
  var onTimeinChange = function (evt) {
    syncronizeCheckinCheckoutInput(evt);
  };
  var onTimeoutChange = function (evt) {
    syncronizeCheckinCheckoutInput(evt);
  };
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    if (AD_FORM.checkValidity()) {
      SUCCESS_POPUP.classList.remove('hidden');
      setAppInitialState();
    } else {
      var inputs = AD_FORM.querySelectorAll('input[type="text"]');
      for (var i = 0; i < inputs.length; i++) {
        toggleErrorClass(inputs[i]);
      }
    }
  };
  var onFormReset = function (evt) {
    evt.preventDefault();
    evt.currentTarget.reset();
    setAppInitialState();
  };

  // form.js event listeners
  SELECT_TIMEIN.addEventListener('change', onTimeinChange);
  SELECT_TIMEOUT.addEventListener('change', onTimeoutChange);
  SELECT_CAPACITY.addEventListener('change', onCapacityChange);
  SELECT_ROOM_NUMBER.addEventListener('change', onRoomNumberChange);
  SELECT_TYPE.addEventListener('change', onTypeChange);
  INPUT_TITLE.addEventListener('input', onTitleInput);
  INPUT_PRICE.addEventListener('input', onPriceInput);
  INPUT_TITLE.addEventListener('blur', onTitleBlur);
  INPUT_PRICE.addEventListener('blur', onPriceBlur);
  AD_FORM.addEventListener('reset', onFormReset);
  AD_FORM.addEventListener('submit', onFormSubmit);

  window.form = {
    enableAdForm: enableAdForm,
    disableFormFieldsets: disableFormFieldsets,
    enableFormFieldsets: enableFormFieldsets,
    setInputAddressValue: setInputAddressValue
  };
})();
