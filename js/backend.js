'use strict';
(function () {
  var Code = {
    SUCCESS: 200,
    FOUND: 302,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  };

  var ErrorMessage = {
    400: 'Плохой запрос',
    404: 'Страница не найдена',
    500: 'Ошибка сервера',
    timeout:
      'Превышено время ожидания ответа сервера, \n\r повторите запрос позднее'
  };

  var REQUEST_TIMEOUT = 2000;

  var load = function (url, type, data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseData = 'json';
    xhr.timeout = REQUEST_TIMEOUT;
    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case Code.SUCCESS:
        case Code.FOUND:
          onLoad(xhr.response);
          break;
        case Code.BAD_REQUEST:
          error = ErrorMessage[Code.BAD_REQUEST];
          break;
        case Code.NOT_FOUND:
          error = ErrorMessage[Code.NOT_FOUND];
          break;
        case Code.SERVER_ERROR:
          error = ErrorMessage[Code.SERVER_ERROR];
          break;
        default:
          error = 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('timeout', function () {
      var error = ErrorMessage.timeout;
      window.popupError.showErrorPopUp(error);
    });

    xhr.open(type, url);
    xhr.send(data);
  };

  var getData = function (onLoad, onError) {
    var url = 'https://js.dump.academy/keksobooking/data';
    var data = '';
    load(url, 'GET', data, onLoad, onError);
  };

  var sendData = function (data, onLoad, onError) {
    var url = 'https://js.dump.academy/keksobooking';
    load(url, 'POST', data, onLoad, onError);
  };

  return (window.backend = {
    getData: getData,
    sendData: sendData
  });
})();
