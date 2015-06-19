angular.module('portfolioApp')
  .directive('onFinishRender', function ($compile) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var classArray = [],
          currentClass,
          gradient,
          titleContainer,
          authorContainer,
          title,
          author,
          symbolScope = scope.books.bookSymbol,
          symbolContainer,
          titleTop,
          titleHeight,
          authorTop,
          symbolSpace,
          color,
          weight,
          family,
          size,
          pages = scope.books.pages,
          width,
          height,
          bookTop;
        for (var i = 0; i < 7; i++) {
          if (i === 0) {
            currentClass = Math.floor((Math.random() * 7) + 1);
          } else if (i === 2) {
            currentClass = Math.floor((Math.random() * 3) + 1);
          } else if (i === 3) {
            currentClass = Math.floor((Math.random() * 8) + 20);
          } else if (i === 4) {
            currentClass = Math.floor(pages / 4);
          } else if (i === 5) {
            currentClass = Math.floor((Math.random() * 100) + 450);
          } else {
            currentClass = Math.floor((Math.random() * 2) + 1);
          }
          classArray.push(currentClass);
        }
        color = classArray[0];
        weight = classArray[1];
        family = classArray[2];
        size = classArray[3];
        width = classArray[4];
        height = classArray[5];
        gradient = scope.gradient;
        titleContainer = scope.titleContainer;
        authorContainer = scope.authorContainer;
        bookTop = Math.floor(600 - height);
        element.addClass('color-' + color).css({'margin-top': bookTop, 'min-width': width, 'height': height});
        gradient.css('height', height);
        titleContainer.css('font-size', size).addClass('font-weight-' + weight + ' ' + 'font-family-' + family);
        authorContainer.css('font-size', size).addClass('font-weight-' + weight + ' ' + 'font-family-' + family);
        title = scope.title;
        author = scope.author;
        titleHeight = title.height();
        titleTop = title.prop('offsetTop');
        authorTop = author.prop('offsetTop');
        symbolSpace = Math.floor((authorTop - (titleTop + titleHeight)) / 2);
        symbolContainer = scope.symbol;
        symbolContainer.css({'height': symbolSpace}).addClass(symbolScope);
        scope.openBook = function () {
          element.addClass('scale');
        };
      }
    };
  });
