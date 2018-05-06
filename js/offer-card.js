'use strict';
(function () {
  var MAP_TEMPLATE = document.querySelector('.template').content;
  var MAP_CARD = MAP_TEMPLATE.querySelector('.map__card');

  var MAP_POPUP_FEATURE = MAP_TEMPLATE.querySelector('.popup__feature');
  var MAP_POPUP_PHOTO = MAP_TEMPLATE.querySelector('.popup__photo');
  var MAP_FILTER_CONTAINER = document.querySelector('.map__filters-container');
  var currentOfferPopup = null;

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

  var generateFeaturesList = function (features) {
    var fragment = document.createDocumentFragment();
    features.forEach(function (feature) {
      var item = MAP_POPUP_FEATURE.cloneNode(true);
      item.classList.add('popup__feature--' + feature);
      fragment.appendChild(item);
    });
    return fragment;
  };

  var generatePopupPhotos = function (photos) {
    var fragment = document.createDocumentFragment();
    photos.forEach(function (photo, i) {
      var item = MAP_POPUP_PHOTO.cloneNode(true);
      item.src = photo;
      item.alt = 'фото ' + i;
      fragment.appendChild(item);
    });
    return fragment;
  };

  var generateMapCard = function (ad) {
    var mapCard = MAP_CARD.cloneNode(true);
    mapCard.querySelector('.popup__title').textContent = ad.offer.title;
    mapCard.querySelector('.popup__text--address').textContent =
      ad.offer.address;
    mapCard.querySelector('.popup__text--price').textContent =
      ad.offer.price + '₽/ночь';
    mapCard.querySelector('.popup__type').textContent =
      window.data.OFFER_TYPES[ad.offer.type];
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

    mapCard
        .querySelector('.popup__close')
        .addEventListener('click', onPopUpCloseClick);

    document.addEventListener('keydown', onDocumentEscKeydown);
    return mapCard;
  };

  var showOfferPopup = function (offer) {
    closeOfferPopup();
    currentOfferPopup = generateMapCard(offer);
    window.map.MAP.insertBefore(currentOfferPopup, MAP_FILTER_CONTAINER);
  };

  var closeOfferPopup = function () {
    if (currentOfferPopup) {
      currentOfferPopup.remove();
      document.removeEventListener('keydown', onDocumentEscKeydown);
    }
  };

  var onDocumentEscKeydown = function (evt) {
    if (evt.keyCode === window.util.Key.ESCAPE) {
      closeOfferPopup();
    }
  };

  var onPopUpCloseClick = function () {
    closeOfferPopup();
  };

  return (window.offerCard = {
    showOfferPopup: showOfferPopup,
    closeOfferPopup: closeOfferPopup
  });
})();
