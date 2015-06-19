angular.module('portfolioApp')
  .controller('BookcaseCtrl', function ($scope, Auth, $location, $q, Ref, $timeout) {
    $scope.bookcase = [
      {
        "title": "Ender's Game",
        "author": "Orson Scott Card",
        "pages": "500",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Lord of the Rings",
        "author": "J.R.R. Tolkien",
        "pages": "1000",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "Moby Dick",
        "author": "Herman Melville",
        "pages": "450",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Ready Player One",
        "author": "Ernest Cline",
        "pages": "450",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "The Hunger Games",
        "author": "Suzanne Collins",
        "pages": "465",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Ender's Game",
        "author": "Orson Scott Card",
        "pages": "500",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Lord of the Rings",
        "author": "J.R.R. Tolkien",
        "pages": "1000",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "Moby Dick",
        "author": "Herman Melville",
        "pages": "450",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Ready Player One",
        "author": "Ernest Cline",
        "pages": "450",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "The Hunger Games",
        "author": "Suzanne Collins",
        "pages": "465",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Ender's Game",
        "author": "Orson Scott Card",
        "pages": "500",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Lord of the Rings",
        "author": "J.R.R. Tolkien",
        "pages": "1000",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "Moby Dick",
        "author": "Herman Melville",
        "pages": "450",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Ready Player One",
        "author": "Ernest Cline",
        "pages": "450",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "The Hunger Games",
        "author": "Suzanne Collins",
        "pages": "465",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Ender's Game",
        "author": "Orson Scott Card",
        "pages": "500",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Lord of the Rings",
        "author": "J.R.R. Tolkien",
        "pages": "1000",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "Moby Dick",
        "author": "Herman Melville",
        "pages": "450",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Ready Player One",
        "author": "Ernest Cline",
        "pages": "450",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "The Hunger Games",
        "author": "Suzanne Collins",
        "pages": "465",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Ender's Game",
        "author": "Orson Scott Card",
        "pages": "500",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Lord of the Rings",
        "author": "J.R.R. Tolkien",
        "pages": "1000",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "Moby Dick",
        "author": "Herman Melville",
        "pages": "450",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Ready Player One",
        "author": "Ernest Cline",
        "pages": "450",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "The Hunger Games",
        "author": "Suzanne Collins",
        "pages": "465",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Ender's Game",
        "author": "Orson Scott Card",
        "pages": "500",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Lord of the Rings",
        "author": "J.R.R. Tolkien",
        "pages": "1000",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "Moby Dick",
        "author": "Herman Melville",
        "pages": "450",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Ready Player One",
        "author": "Ernest Cline",
        "pages": "450",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "The Hunger Games",
        "author": "Suzanne Collins",
        "pages": "465",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Ender's Game",
        "author": "Orson Scott Card",
        "pages": "500",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Lord of the Rings",
        "author": "J.R.R. Tolkien",
        "pages": "1000",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "Moby Dick",
        "author": "Herman Melville",
        "pages": "450",
        "bookSymbol": "icon-mandala1"
      },
      {
        "title": "Ready Player One",
        "author": "Ernest Cline",
        "pages": "450",
        "bookSymbol": "icon-celtic1"
      },
      {
        "title": "The Hunger Games",
        "author": "Suzanne Collins",
        "pages": "465",
        "bookSymbol": "icon-mandala1"
      }
    ]
  });
