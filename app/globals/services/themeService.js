angular.module('portfolioApp')
  .service('themeService', function ($document) {
    var sheets = document.styleSheets,
        sheetsLength = sheets.length,
        themeSheet = sheets[sheetsLength - 1];

    this.setPrimaryColor = function (color) {
      themeSheet.insertRule("'.themed {background-color:' + color + '}'", 1);
    }


  });
