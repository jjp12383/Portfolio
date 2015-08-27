//directive for building the book spines in the virtual bookcase

angular.module('portfolioApp')
  .directive('onFinishRender', function ($compile, $timeout, $rootScope) {
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
          symbolContainer,
          titleTop,
          titleHeight,
          authorTop,
          symbol,
          symbolSpace,
          color,
          weight,
          family,
          size,
          width,
          height,
          bookTop;

        //calculates each of the attributes of a given book using randomization to make each book unique
        for (var i = 0; i < 7; i++) {
          if (i === 0) {
            currentClass = Math.floor((Math.random() * 7) + 1); //color of the book spine
          } else if (i === 2) {
            currentClass = Math.floor((Math.random() * 5) + 1); //font weight of the title and author
          } else if (i === 3) {
            currentClass = Math.floor((Math.random() * 8) + 20); //font family of the title and author
          } else if (i === 4) {
            currentClass = Math.floor((Math.random() * 50) + 75); //font size of the title and author
          } else if (i === 5) {
            currentClass = Math.floor((Math.random() * 100) + 400); //height of the spine
          } else {
            currentClass = Math.floor((Math.random() * 12) + 1); //symbol in the middle of the spine
          }
          classArray.push(currentClass); //push calculated attribute to the classArray
        }
        color = classArray[0];
        weight = classArray[1];
        family = classArray[2];
        size = classArray[3];
        width = classArray[4];
        height = classArray[5];
        symbol = classArray[6];
        gradient = scope.gradient;                                            //sets the gradient of the spine
        titleContainer = scope.titleContainer;                                //sets the title container element
        authorContainer = scope.authorContainer;                              //sets the author container element
        bookTop = Math.floor(550 - height);                                   //sets the margin-top style of the book.
                                                                              // This aligns each book to the bottom of the shelf by subtracting the height of book from the total height of the shelf

        element.addClass('color-' + color).css({                              //Set color class, margin-top, min-width, and height of book
          'margin-top': bookTop,
          'min-width': width,
          'height': height
        });
        gradient.css('height', height);                                       //set height of gradient overlay to the height of the book
        titleContainer.css('font-size', size)                                 //set font size, font-weight, font-family of title
          .addClass('font-weight-' + weight + ' ' + 'font-family-' + family);
        authorContainer.css('font-size', size)                                //set font size, font-weight, font-family of author
          .addClass('font-weight-' + weight + ' ' + 'font-family-' + family);
        title = scope.title;                                                  //bind title
        author = scope.author;                                                //bind author
        titleHeight = title.height();                                         //set height of title
        titleTop = title.prop('offsetTop');                                   //set top of title
        authorTop = author.prop('offsetTop');                                 //set top of author
        symbolSpace = Math.floor((authorTop - (titleTop + titleHeight)) / 2); //find remaining available space for center symbol based on height of title and author
        symbolContainer = scope.symbol;                                       //bind symbol
        symbolContainer.css({'height': symbolSpace})                          //set calculated symbol height and class
          .addClass('icon-book-symbol-' + symbol);
      }
    };
  })

  //directive to build out shelf based on how many books are listed

  .directive('shelf', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        //watch for number of books to change
        scope.$watch(function () {
          var books = element.find(angular.element(document.querySelectorAll('.book-spine'))),     //declare books on shelf
              shelf = element.parent().find(angular.element(document.querySelectorAll('.shelf'))), //declare scroll area parent container of books
              shelfWidth = 0;                                                                      //set initial width to 0
          for(var i in books) {                                                                    //loop through books
            if(books[i].clientWidth && books[i].className.indexOf('book-spine') > -1) {            //add the width of the book to the shelfWidth variable
              shelfWidth = shelfWidth + books[i].getBoundingClientRect().width;
            }
          }
          element.css('width', Math.round(shelfWidth) + 100);                                      //set width of shelf based on total width of books
        })
      }
    }
  });
