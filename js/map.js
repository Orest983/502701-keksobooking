'use strict';
var MAP = document.querySelector('.map');
var MAP_PINS = MAP.querySelector('.map__pins');
var MAP_FILTER_CONTAINER = MAP.querySelector('.map__filters-container');
var MAP_TEMPLATE = document.querySelector('template').content;
var MAP_PIN = MAP_TEMPLATE.querySelector('.map__pin');
var MAP_CARD = MAP_TEMPLATE.querySelector('.map__card');
var MAP_POPUP_FEATURE = MAP_TEMPLATE.querySelector('.popup__feature');
var MAP_POPUP_PHOTO = MAP_TEMPLATE.querySelector('.popup__photo');
var MAP_MAIN_PIN = MAP.querySelector('.map__pin--main');

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
var BTN_FORM_SUBMIT = AD_FORM.querySelector('.ad-form__submit');
var BTN_FORM_RESET = AD_FORM.querySelector('.ad-form__reset');
var SUCCESS_POPUP = document.querySelector('.success');

var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;

var MAP_MAIN_PIN_WIDTH = 65;
var MAP_MAIN_PIN_HEIGHT = 65;

var MAP_X_COORD_MIN = 300;
var MAP_X_COORD_MAX = 900;
var MAP_Y_COORD_MIN = 150;
var MAP_Y_COORD_MAX = 500;
var RENT_LISTING_MAX_COUNT = 8; // TODO: change on 8

var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var OFFER_TYPES = {
  flat: 'Квартира',
  palace: 'Дворец',
  house: 'Домик',
  bungalo: 'Бунгало'
};

var OFFER_ROOMS_MIN = 1;
var OFFER_ROOMS_MAX = 5;

var OFFER_GUESTS_MIN = 1;
var OFFER_GUESTS_MAX = 30;

var OFFER_CHECKIN_CHECKOUT_HOURS = ['12:00', '13:00', '14:00'];

var OFFER_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var AUTHOR_AVATARS = [
  'img/avatars/user01.png',
  'img/avatars/user02.png',
  'img/avatars/user03.png',
  'img/avatars/user04.png',
  'img/avatars/user05.png',
  'img/avatars/user06.png',
  'img/avatars/user07.png',
  'img/avatars/user08.png'
];

var OFFER_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var OFFER_MIN_PRICE = 1000;
var OFFER_MAX_PRICE = 1000000;

var getRandomMinMax = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

var getRandomLenghtOfFeatures = function () {
  return OFFER_FEATURES.slice(getRandomMinMax(0, OFFER_FEATURES.length - 1));
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

var getOfferTypeByOfferTitle = function (title) {
  var searchResult = 'Type is undefined';
  var offerTypesKeys = Object.keys(OFFER_TYPES);
  for (var i = 0; i < offerTypesKeys.length; i++) {
    var type = OFFER_TYPES[offerTypesKeys[i]];
    if (title.search(type.toLowerCase()) !== -1) {
      searchResult = offerTypesKeys[i];
      break;
    }
  }
  return searchResult;
};

var generateFeaturesList = function (arrFeatures) {
  var fragment = document.createDocumentFragment();
  var featureTemplate = MAP_POPUP_FEATURE;
  for (var i = 0; i < arrFeatures.length; i++) {
    var item = featureTemplate.cloneNode(true);
    item.classList.add('popup__feature--' + arrFeatures[i]);
    fragment.appendChild(item);
  }
  return fragment;
};

var generatePopupPhotos = function (arrPhotos) {
  var fragment = document.createDocumentFragment();
  var item = MAP_POPUP_PHOTO;
  for (var i = 0; i < arrPhotos.length; i++) {
    item = item.cloneNode(true);
    item.src = arrPhotos[i];
    item.alt = 'фото ' + i;
    fragment.appendChild(item);
  }
  return fragment;
};

var generateRandomOffers = function () {
  var ad;
  var ads = [];
  var locationX;
  var locationY;
  var offerAddres;
  var photosShuffled;
  var arTitles = shuffleArray(OFFER_TITLES);
  var avatarImages = shuffleArray(AUTHOR_AVATARS);

  for (var i = 0; i < RENT_LISTING_MAX_COUNT; i++) {
    ad = {};
    locationX = getRandomMinMax(MAP_X_COORD_MIN, MAP_X_COORD_MAX);
    locationY = getRandomMinMax(MAP_Y_COORD_MIN, MAP_Y_COORD_MAX);
    offerAddres = locationX + ', ' + locationY;
    photosShuffled = shuffleArray(OFFER_PHOTOS);

    ad['author'] = {
      avatar: avatarImages[i]
    };
    ad['offer'] = {
      title: arTitles[i],
      address: offerAddres,
      price: getRandomMinMax(OFFER_MIN_PRICE, OFFER_MAX_PRICE),
      type: getOfferTypeByOfferTitle(arTitles[i]),
      rooms: getRandomMinMax(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
      guests: getRandomMinMax(OFFER_GUESTS_MIN, OFFER_GUESTS_MAX),
      checkin:
        OFFER_CHECKIN_CHECKOUT_HOURS[
            getRandomMinMax(0, OFFER_CHECKIN_CHECKOUT_HOURS.length - 1)
        ],
      checkout:
        OFFER_CHECKIN_CHECKOUT_HOURS[
            getRandomMinMax(0, OFFER_CHECKIN_CHECKOUT_HOURS.length - 1)
        ],
      features: getRandomLenghtOfFeatures(),
      description: '',
      photos: photosShuffled
    };
    ad['location'] = {
      x: locationX,
      y: locationY
    };

    ads[i] = ad;
  }

  return ads;
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
    pin.style.left = setPinOffsetX(ads[i].location.x, MAP_PIN_WIDTH) + 'px';
    pin.style.top = setPinOffsetY(ads[i].location.y, MAP_PIN_HEIGHT) + 'px';
    pin.querySelector('img').src = ads[i].author.avatar;
    pin.querySelector('img').alt = ads[i].offer.title;
    fragment.appendChild(pin);
  }
  return fragment;
};

var changeRoomWordEnding = function (quantity) {
  var onesOfANumber = quantity % 10;
  var wordEnding;

  switch (onesOfANumber) {
    case 1:
      wordEnding = 'а';
      break;
    case 2:
    case 3:
    case 4:
      wordEnding = 'ы';
      break;
    default:
      wordEnding = '';
  }
  return 'комнат' + wordEnding;
};

var changeGuestsWordEnding = function (quantity) {
  var onesOfANumber = quantity % 10;
  var wordEnding;

  switch (onesOfANumber) {
    case 1:
      wordEnding = 'я';
      break;
    default:
      wordEnding = 'ей';
  }
  return 'гост' + wordEnding;
};

var generateMapCard = function (ad) {
  var mapCard = MAP_CARD.cloneNode(true);
  mapCard.querySelector('.popup__title').textContent = ad.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = ad.offer.address;
  mapCard.querySelector('.popup__text--price').textContent =
    ad.offer.price + '₽/ночь';
  mapCard.querySelector('.popup__type').textContent =
    OFFER_TYPES[ad.offer.type];
  mapCard.querySelector('.popup__text--capacity').textContent =
    ad.offer.rooms +
    ' ' +
    changeRoomWordEnding(ad.offer.rooms) +
    ' для ' +
    ad.offer.guests +
    ' ' +
    changeGuestsWordEnding(ad.offer.guests);
  mapCard.querySelector('.popup__text--time').textContent =
    'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  mapCard.querySelector('.popup__features').innerHTML = '';
  mapCard
      .querySelector('.popup__features')
      .appendChild(generateFeaturesList(ad.offer.features));

  mapCard.querySelector('.popup__description').textContent =
    ad.offer.description;

  mapCard.querySelector('.popup__photos').innerHTML = '';
  mapCard
      .querySelector('.popup__photos')
      .appendChild(generatePopupPhotos(ad.offer.photos));
  mapCard.querySelector('.popup__avatar').src = ad.author.avatar;

  return mapCard;
};

// disable map
var disableMap = function () {
  MAP.classList.add('map--faded');
};

// enableMap
var enableMap = function () {
  MAP.classList.remove('map--faded');
};

// disnable ad form
var disableAdForm = function () {
  AD_FORM.classList.add('ad-form--disabled');
};

// enable ad form
var enableAdForm = function () {
  AD_FORM.classList.remove('ad-form--disabled');
};

// disable form inputs
var disableFormFieldsets = function () {
  for (var i = 0; i < AD_FIELDSETS.length; i++) {
    AD_FIELDSETS[i].disabled = true;
  }
};

// enable form inputs
var enableFormFieldsets = function () {
  for (var i = 0; i < AD_FIELDSETS.length; i++) {
    AD_FIELDSETS[i].disabled = false;
  }
};

var getInitialPinAddress = function () {
  var x = parseInt(MAP_MAIN_PIN.style.left, 10);
  var y = parseInt(MAP_MAIN_PIN.style.top, 10);
  return x + ', ' + y;
};

// get pin address
var getPinAddress = function (mouseX, mouseY, width, height) {
  var x = setPinOffsetX(mouseX, width);
  var y = setPinOffsetY(mouseY, height) + window.scrollY;
  return x + ', ' + y;
};

// set intput address value
var setInputAddressValue = function (address) {
  INPUT_ADDRESS.value = address;
};

var showOfferPopup = function (offer) {
  var closePopup;
  MAP.insertBefore(generateMapCard(offer), MAP_FILTER_CONTAINER);
  closePopup = document.querySelector('.popup__close');
  closePopup.addEventListener('click', onPopUpCloseClick);
};

var closeOfferPopup = function () {
  var popup = document.querySelector('.popup');
  if (popup) {
    popup.remove();
  }
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

var getRoomNumber = function () {
  return parseInt(SELECT_ROOM_NUMBER.value, 10);
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

var setAppInitialState = function () {
  var textInputs = AD_FORM.querySelectorAll('input[type="text"]');
  INPUT_PRICE.value = '';

  for (var i = 0; i < textInputs.length; i++) {
    removeErrorClass(textInputs[i]);
  }

  disableMap();
  disableAdForm();
  closeOfferPopup();
  removePins();
  setInputAddressValue(getInitialPinAddress());
  // TODO: Refactor
  setTimeout(disableFormFieldsets, 500);
};

var removePins = function () {
  var pins = MAP.querySelectorAll('.map__pin');
  for (var i = 0; i < pins.length; i++) {
    var pin = pins[i];
    if (pin.classList.contains('map__pin--main') === false) {
      pin.remove();
    }
  }
};

// event handlers
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

var onMainPinMouseUp = function (evt) {
  var x = evt.clientX;
  var y = evt.clientY;
  var pinAddress = getPinAddress(x, y, MAP_MAIN_PIN_WIDTH, MAP_MAIN_PIN_HEIGHT);
  setInputAddressValue(pinAddress);
  enableMap();
  enableAdForm();
  enableFormFieldsets();
  MAP_PINS.appendChild(generatePins(offers));
};

var onPinClick = function (evt) {
  var offer;
  var target = evt.target.closest('.map__pin');
  if (target && !target.classList.contains('map__pin--main')) {
    offer = target.dataset['offerId'];
    closeOfferPopup();
    showOfferPopup(offers[offer]);
  }
};

var onPopUpCloseClick = function () {
  var offer = document.querySelector('.popup');
  closeOfferPopup(offer);
};

var onFormSubmitBtnClick = function (evt) {
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

var onFormResetBtnClick = function () {
  setAppInitialState();
};

// event listeners
MAP_PINS.addEventListener('click', onPinClick);
MAP_MAIN_PIN.addEventListener('mouseup', onMainPinMouseUp);
SELECT_TIMEIN.addEventListener('change', onTimeinChange);
SELECT_TIMEOUT.addEventListener('change', onTimeoutChange);
SELECT_CAPACITY.addEventListener('change', onCapacityChange);
SELECT_ROOM_NUMBER.addEventListener('change', onRoomNumberChange);
SELECT_TYPE.addEventListener('change', onTypeChange);
INPUT_TITLE.addEventListener('input', onTitleInput);
INPUT_PRICE.addEventListener('input', onPriceInput);
INPUT_TITLE.addEventListener('blur', onTitleBlur);
INPUT_PRICE.addEventListener('blur', onPriceBlur);
BTN_FORM_SUBMIT.addEventListener('click', onFormSubmitBtnClick);
BTN_FORM_RESET.addEventListener('click', onFormResetBtnClick);

setInputAddressValue(getInitialPinAddress());
disableFormFieldsets();
var offers = generateRandomOffers();
