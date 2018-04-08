'use strict';
var MAP = document.querySelector('.map');
var MAP_PINS = MAP.querySelector('.map__pins');
var MAP_FILTER_CONTAINER = MAP.querySelector('.map__filters-container');
var MAP_TEMPLATE = document.querySelector('template').content;
var MAP_PIN = MAP_TEMPLATE.querySelector('.map__pin');
var MAP_CARD = MAP_TEMPLATE.querySelector('.map__card');
var MAP_POPUP_FEATURES = MAP_TEMPLATE.querySelector('.popup__features');
var MAP_POPUP_FEATURE = MAP_TEMPLATE.querySelector('.popup__feature');
var MAP_POPUP_PHOTO = MAP_TEMPLATE.querySelector('.popup__photo');

var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;

var MAP_X_COORD_MIN = 300;
var MAP_X_COORD_MAX = 900;
var MAP_Y_COORD_MIN = 150;
var MAP_Y_COORD_MAX = 500;
var ADS_MAX_NUMBER = 8;

var AD_TITLES = [
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
  квартира: 'flat',
  дворец: 'palace',
  домик: 'house',
  бунгало: 'bungalo'
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

var getObjectKeyByValue = function (obj, key) {
  var invertObj = {};
  var objKey = Object.keys(obj);
  var objValue = Object.values(obj);
  for (var i = 0; i < objKey.length; i++) {
    invertObj[objValue[i]] = objKey[i];
  }
  return invertObj[key];
};

var changeRoomWordEnding = function (quantity) {
  var quantityString = quantity.toString();
  var lastChar = quantityString.charAt(quantityString.length - 1);
  var wordEnding;

  switch (lastChar) {
    case '1':
      wordEnding = 'а';
      break;
    case '2':
    case '3':
    case '4':
      wordEnding = 'ы';
      break;
    default:
      wordEnding = '';
  }
  return 'комнат' + wordEnding;
};

var changeGuestsWordEnding = function (quantity) {
  var quantityString = quantity.toString();
  var lastChar = quantityString.charAt(quantityString.length - 1);
  var wordEnding;

  switch (lastChar) {
    case '1':
      wordEnding = 'я';
      break;
    default:
      wordEnding = 'ей';
  }
  return 'гост' + wordEnding;
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
  if (!title) {
    return searchResult;
  }
  for (var type in OFFER_TYPES) {
    if (OFFER_TYPES.hasOwnProperty(type)) {
      if (title.search(type) !== -1) {
        searchResult = OFFER_TYPES[type];
        break;
      }
    }
  }
  return searchResult;
};

var generateFeaturesList = function (arrFeatures) {
  var fragment = document.createDocumentFragment();
  var item = MAP_POPUP_FEATURE;
  for (var i = 0; i < arrFeatures.length; i++) {
    item = item.cloneNode(true);
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
    fragment.appendChild(item);
  }
  return fragment;
};

var generateRandomAds = function () {
  var ad;
  var ads = [];
  var locationX;
  var locationY;
  var offerAddres;
  var photosShuffled;
  var arTitles = shuffleArray(AD_TITLES);
  var avatarImages = shuffleArray(AUTHOR_AVATARS);

  for (var i = 0; i < ADS_MAX_NUMBER; i++) {
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

var pinOffsetX = function (x) {
  return x - MAP_PIN_WIDTH / 2;
};

var pinOffsetY = function (y) {
  return y - MAP_PIN_HEIGHT;
};

var generatePins = function (ads) {
  var pin = MAP_PIN;
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    pin = pin.cloneNode(true);
    pin.style.left = pinOffsetX(ads[i].location.x) + 'px';
    pin.style.top = pinOffsetY(ads[i].location.y) + 'px';
    pin.querySelector('img').src = ads[i].author.avatar;
    fragment.appendChild(pin);
  }
  return fragment;
};

var generateMapCard = function (ad) {
  var mapCard = MAP_CARD.cloneNode(true);
  mapCard.querySelector('.popup__title').textContent = ad.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = ad.offer.address;
  mapCard.querySelector('.popup__text--price').textContent =
    ad.offer.price + '₽/ночь';
  mapCard.querySelector('.popup__type').textContent = getObjectKeyByValue(
      OFFER_TYPES,
      ad.offer.type
  );
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

// Generate random ads array with 8 objects;
var ads = generateRandomAds();
var ad = ads[0];

MAP.classList.remove('map--faded');
MAP_PINS.appendChild(generatePins(ads));
MAP.insertBefore(generateMapCard(ad), MAP_FILTER_CONTAINER);
