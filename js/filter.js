'use strict';
(function () {
  var FILTER = document.querySelector('.map__filters');
  var FILTER_TIMEOUT = 500;
  var FILTER_MAX_RESULT = 5;
  var Message = {
    NO_RESULT: 'Совпадений не найдено, смягчите условия поиска!'
  };
  var ENTER_KEY = 13;
  var FILTER_SELECT_TYPES = ['type', 'rooms', 'guests'];

  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  var filterCriteria = {
    type: 'any',
    rooms: 'any',
    guests: 'any',
    price: 'any',
    features: []
  };

  var disableFliter = function () {
    for (var i = 0; i < FILTER.elements.length; i++) {
      FILTER.elements[i].disabled = true;
    }
    FILTER.removeEventListener('change', onFilterChange);
    FILTER.removeEventListener('keydown', onFilterChange);
  };

  var enableFilter = function () {
    for (var i = 0; i < FILTER.elements.length; i++) {
      FILTER.elements[i].disabled = false;
    }
    FILTER.addEventListener('change', onFilterChange);
    FILTER.addEventListener('keydown', onFilterChange);
  };

  var applyFilter = function (offers) {
    var filtredOffers = filterOffers(offers);
    window.offerCard.closeOfferPopup();
    window.pins.removePins();
    if (filtredOffers.length === 0) {
      window.popupError.showErrorPopUp(Message.NO_RESULT);
    } else {
      var pins = window.pins.generatePins(filtredOffers);
      window.pins.MAP_PINS.appendChild(pins);
    }
  };

  var filterFeatures = function (offers) {
    return filterCriteria.features.length
      ? offers.filter(function (offerItem) {
        return filterCriteria.features.every(function (feature) {
          return offerItem.offer.features.indexOf(feature) !== -1;
        });
      })
      : offers;
  };

  var filterSelect = function (offers) {
    return FILTER_SELECT_TYPES.reduce(function (acc, currentFilter) {
      return filterCriteria[currentFilter] === 'any'
        ? acc
        : acc.filter(function (it) {
          return it.offer[currentFilter] === filterCriteria[currentFilter];
        });
    }, offers);
  };

  var filterPrice = function (offers) {
    return offers.filter(function (elem) {
      switch (filterCriteria.price) {
        case 'low':
          return elem.offer.price <= Price.LOW;
        case 'middle':
          return elem.offer.price > Price.LOW && elem.offer.price < Price.HIGH;
        case 'high':
          return elem.offer.price >= Price.HIGH;
        default:
          return true;
      }
    });
  };

  var filterOffers = function (offers) {
    var res = filterSelect(offers);
    res = filterPrice(res);
    res = filterFeatures(res);
    return res.slice(0, FILTER_MAX_RESULT);
  };

  var setFilterCriteria = function (targetNode) {
    var key = targetNode.id.split(/-/)[1];
    var features = filterCriteria.features;

    if (targetNode.tagName === 'SELECT') {
      filterCriteria[key] = Number.isNaN(parseInt(targetNode.value, 10))
        ? targetNode.value
        : parseInt(targetNode.value, 10);
    } else {
      if (targetNode.checked) {
        features.push(key);
      } else {
        features.splice(features.indexOf(key), 1);
      }
    }
  };
  var onFilterChange = function (evt) {
    var target = evt.target;
    if (
      target.classList.contains('map__checkbox') &&
      evt.keyCode === ENTER_KEY
    ) {
      target.checked = !target.checked;
    }
    return window.util.debounce(function () {
      setFilterCriteria(target);
      applyFilter(window.offers);
    }, FILTER_TIMEOUT);
  };

  return (window.filter = {
    disableFliter: disableFliter,
    enableFilter: enableFilter,
    ENTER_KEY: ENTER_KEY
  });
})();
