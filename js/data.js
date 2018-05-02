'use strict';
(function () {
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
  var RENT_LISTING_MAX_COUNT = 5;

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
  var generateRandomOffers = function () {
    var ad;
    var ads = [];
    var locationX;
    var locationY;
    var offerAddres;
    var photosShuffled;
    var arTitles = window.util.shuffleArray(OFFER_TITLES);
    var avatarImages = window.util.shuffleArray(AUTHOR_AVATARS);

    for (var i = 0; i < RENT_LISTING_MAX_COUNT; i++) {
      ad = {};
      locationX = window.util.getRandomMinMax(
          window.map.MAP_X_COORD_MIN,
          window.map.MAP_X_COORD_MAX
      );
      locationY = window.util.getRandomMinMax(
          window.map.MAP_Y_COORD_MIN,
          window.map.MAP_Y_COORD_MAX
      );
      offerAddres = locationX + ', ' + locationY;
      photosShuffled = window.util.shuffleArray(OFFER_PHOTOS);

      ad['author'] = {
        avatar: avatarImages[i]
      };
      ad['offer'] = {
        title: arTitles[i],
        address: offerAddres,
        price: window.util.getRandomMinMax(OFFER_MIN_PRICE, OFFER_MAX_PRICE),
        type: getOfferTypeByOfferTitle(arTitles[i]),
        rooms: window.util.getRandomMinMax(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
        guests: window.util.getRandomMinMax(OFFER_GUESTS_MIN, OFFER_GUESTS_MAX),
        checkin:
          OFFER_CHECKIN_CHECKOUT_HOURS[
              window.util.getRandomMinMax(
                  0,
                  OFFER_CHECKIN_CHECKOUT_HOURS.length - 1
              )
          ],
        checkout:
          OFFER_CHECKIN_CHECKOUT_HOURS[
              window.util.getRandomMinMax(
                  0,
                  OFFER_CHECKIN_CHECKOUT_HOURS.length - 1
              )
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
  var getRandomLenghtOfFeatures = function () {
    return OFFER_FEATURES.slice(
        window.util.getRandomMinMax(0, OFFER_FEATURES.length - 1)
    );
  };
  var generateOffers = function (data) {
    var ad;
    var ads = [];
    for (var i = 0; i < RENT_LISTING_MAX_COUNT; i++) {
      ad = {};
      ad['author'] = {
        avatar: data[i].author.avatar
      };
      ad['offer'] = {
        title: data[i].offer.title,
        address: data[i].offer.address,
        price: data[i].offer.price,
        type: data[i].offer.type,
        rooms: data[i].offer.rooms,
        guests: data[i].offer.guests,
        checkin: data[i].offer.checkin,
        checkout: data[i].offer.checkout,
        features: data[i].offer.features,
        description: data[i].offer.description,
        photos: data[i].offer.photos
      };
      ad['location'] = {
        x: data[i].location.x,
        y: data[i].location.y
      };
      ads[i] = ad;
    }
    return ads;
  };

  return (window.data = {
    OFFER_TYPES: OFFER_TYPES,
    generateOffers: generateOffers,
    generateRandomOffers: generateRandomOffers
  });
})();
