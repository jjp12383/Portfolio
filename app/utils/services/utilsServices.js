angular.module('portfolioApp')
  .service('utils', function () {

    this.getElementOffset = function (element) {
      var de = document.documentElement;
      var box = element.getBoundingClientRect();
      var top = box.top + window.pageYOffset - de.clientTop;
      var left = box.left + window.pageXOffset - de.clientLeft;
      return { top: top, left: left };
    }

  });
