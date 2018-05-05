'use strict';
(function () {
  var ERROR_POPUP = document.querySelector('.error-popup');
  var ERROR_MESSAGE = ERROR_POPUP.querySelector('.error-popup__message');
  var ERROR_CLOSE = ERROR_POPUP.querySelector('.error-popup__close');

  var showErrorPopUp = function (error) {
    ERROR_POPUP.classList.remove('hidden');
    ERROR_MESSAGE.textContent = error;
    ERROR_CLOSE.addEventListener('click', onErrorCloseClick);
  };

  var onErrorCloseClick = function () {
    ERROR_POPUP.classList.add('hidden');
    ERROR_MESSAGE.textContent = '';
    ERROR_CLOSE.removeEventListener('click', onErrorCloseClick);
  };

  return (window.popupError = {
    showErrorPopUp: showErrorPopUp
  });
})();
