'use strict';
(function () {
  if (!HTMLFormElement.prototype.reportValidity) {
    HTMLFormElement.prototype.reportValidity = function () {
      var submitButtons = this.querySelectorAll('button, input[type=submit]');
      for (var i = 0; i < submitButtons.length; i++) {
        // Filter out <button type="button">, as querySelectorAll can't
        // handle :not filtering
        if (submitButtons[i].type === 'submit') {
          submitButtons[i].click();
          return;
        }
      }
    };
  }
})();
