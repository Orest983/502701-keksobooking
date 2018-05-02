'use strict';
(function () {
  var FILTER = document.querySelector('.map__filters');
  var SELECT = FILTER.querySelectorAll('select');
  var CHECKBOX = FILTER.querySelectorAll('input[type="checkbox"]');
  var FILTER_TIMEOUT = 500;
  var FILTER_MAX_RESULT = 5;
  var Message = {
    noResult: 'Совпадений не найдено, смягчите условия поиска!'
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
  };
  var enableFilter = function () {
    for (var i = 0; i < FILTER.elements.length; i++) {
      FILTER.elements[i].disabled = false;
    }
  };

  var applyFilter = function (data) {
    var offers = filterOffers(data);
    var pins = window.pins.generatePins(offers);
    window.offerCard.closeOfferPopup();
    window.pins.removePins();
    window.pins.MAP_PINS.appendChild(pins);
    if (!offers.length) {
      window.popupError.showErrorPopUp(Message.noResult);
    }
  };

  var filterFeatures = function (data) {
    var res = data;
    if (filterCriteria.features.length) {
      res = data.filter(function (it) {
        var index;
        for (var i = 0; i < filterCriteria.features.length; i++) {
          index = it.offer.features.indexOf(filterCriteria.features[i]);
          if (index === -1) {
            break;
          }
        }
        return index !== -1;
      });
    }
    return res;
  };
  var filterSelect = function (data) {
    var res = data;
    var filters = ['type', 'rooms', 'guests'];
    filters.forEach(function (filter) {
      if (filterCriteria[filter] !== 'any') {
        res = res.filter(function (it) {
          return it.offer[filter] === filterCriteria[filter];
        });
      }
    });
    return res;
  };
  var filterPrice = function (data) {
    var Price = {
      low: 10000,
      high: 50000
    };
    return data.filter(function (elem) {
      switch (filterCriteria.price) {
        case 'low':
          return elem.offer.price <= Price.low;
        case 'middle':
          return elem.offer.price > Price.low && elem.offer.price < Price.high;
        case 'high':
          return elem.offer.price >= Price.high;
        default:
          return true;
      }
    });
  };

  var filterOffers = function (data) {
    var res;
    res = filterSelect(data);
    res = filterPrice(res);
    res = filterFeatures(res);
    res = res.slice(0, FILTER_MAX_RESULT);
    return res;
  };

  var setfilterCriteria = function (evt) {
    var target = evt.target;
    var key = target.id.split(/-/)[1];
    var features = filterCriteria.features;

    if (target.tagName === 'SELECT') {
      filterCriteria[key] = Number.isNaN(parseInt(target.value, 10))
        ? target.value
        : parseInt(target.value, 10);
    } else {
      if (target.checked) {
        features.push(key);
      } else {
        features.splice(features.indexOf(key), 1);
      }
    }
  };

  var onFilterChange = function (evt) {
    return window.util.debounce(function () {
      setfilterCriteria(evt);
      applyFilter(window.offers);
    }, FILTER_TIMEOUT);
  };

  for (var i = 0; i < SELECT.length; i++) {
    SELECT[i].addEventListener('change', onFilterChange);
  }

  for (var j = 0; j < CHECKBOX.length; j++) {
    CHECKBOX[j].addEventListener('change', onFilterChange);
  }

  return (window.filter = {
    disableFliter: disableFliter,
    enableFilter: enableFilter
  });
})();
