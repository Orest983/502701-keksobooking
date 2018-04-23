'use strict';
(function () {
  var MAP_TEMPLATE = document.querySelector('template').content;
  var MAP_CARD = MAP_TEMPLATE.querySelector('.map__card');
  var MAP_POPUP_FEATURE = MAP_TEMPLATE.querySelector('.popup__feature');
  var MAP_POPUP_PHOTO = MAP_TEMPLATE.querySelector('.popup__photo');
  var MAP_FILTER_CONTAINER = document.querySelector('.map__filters-container');

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

    return mapCard;
  };
  var showOfferPopup = function (offer) {
    var closePopup;
    window.map.MAP.insertBefore(generateMapCard(offer), MAP_FILTER_CONTAINER);
    closePopup = document.querySelector('.popup__close');
    closePopup.addEventListener('click', onPopUpCloseClick);
  };
  var closeOfferPopup = function () {
    var popup = document.querySelector('.popup');
    if (popup) {
      popup.remove();
    }
  };

  var onPopUpCloseClick = function () {
    var offer = document.querySelector('.popup');
    closeOfferPopup(offer);
  };

  return (window.offerCard = {
    showOfferPopup: showOfferPopup,
    closeOfferPopup: closeOfferPopup
  });
})();
