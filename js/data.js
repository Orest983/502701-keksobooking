'use strict';
(function () {
  var OFFER_TYPES = {
    flat: 'Квартира',
    palace: 'Дворец',
    house: 'Домик',
    bungalo: 'Бунгало'
  };

  var generateOffers = function (data) {
    var offers = [];
    data.forEach(function (item, i) {
      var offer = {};
      offer['id'] = i;
      offer['author'] = {
        avatar: item.author.avatar
      };
      offer['offer'] = {
        title: item.offer.title,
        address: item.offer.address,
        price: item.offer.price,
        type: item.offer.type,
        rooms: item.offer.rooms,
        guests: item.offer.guests,
        checkin: item.offer.checkin,
        checkout: item.offer.checkout,
        features: item.offer.features,
        description: item.offer.description,
        photos: item.offer.photos
      };
      offer['location'] = {
        x: item.location.x,
        y: item.location.y
      };
      offers.push(offer);
    });
    return offers;
  };

  return (window.data = {
    OFFER_TYPES: OFFER_TYPES,
    generateOffers: generateOffers
  });
})();
