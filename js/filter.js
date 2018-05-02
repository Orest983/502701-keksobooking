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

  var filterValue = {
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

  var onLoad = function (data) {
    var offers = filterOffers(JSON.parse(data));
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
    if (filterValue.features.length) {
      res = data.filter(function (it) {
        var index;
        for (var i = 0; i < filterValue.features.length; i++) {
          index = it.offer.features.indexOf(filterValue.features[i]);
          if (index === -1) {
            break;
          }
        }
        return index === -1 ? false : true;
      });
    }
    return res;
  };
  var filterSelect = function (data) {
    var res = data;
    var filters = ['type', 'rooms', 'guests'];
    filters.forEach(function (filter) {
      if (filterValue[filter] !== 'any') {
        res = data.filter(function (it) {
          return it.offer[filter] === filterValue[filter];
        });
      }
    });
    return res;
  };
  var filterPrice = function (data) {
    var price = {
      low: 10000,
      high: 50000
    };
    return data.filter(function (elem) {
      switch (filterValue.price) {
        case 'low':
          return elem.offer.price < price.low;
        case 'middle':
          return elem.offer.price > price.low && elem.offer.price < price.high;
        case 'high':
          return elem.offer.price >= price.high;
        default:
          return true;
      }
    });
  };

  var filterOffers = function (data) {
    var res = data;
    res = filterSelect(res);
    res = filterPrice(res);
    res = filterFeatures(res);
    res = res.slice(0, FILTER_MAX_RESULT);
    return res;
  };

  var setFilterValue = function (evt) {
    var target = evt.target;
    var key = target.id.split(/-/)[1];

    if (target.tagName === 'SELECT') {
      filterValue[key] = isNaN(parseInt(target.value, 10))
        ? target.value
        : parseInt(target.value, 10);
    } else {
      if (target.checked) {
        filterValue.features.push(key);
      } else {
        filterValue.features.splice(filterValue.features.indexOf(key), 1);
      }
    }
  };

  var onFilterChange = function (evt) {
    var filterChangeEvt = evt;
    return window.util.debounce(function () {
      setFilterValue(filterChangeEvt);
      window.backend.getData(onLoad, window.popupError.showErrorPopUp);
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
