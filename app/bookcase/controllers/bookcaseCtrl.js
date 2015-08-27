angular.module('portfolioApp')
  .controller('BookcaseCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, smoothScroll) {

    //declare required info for Google Books API
    var clientId = '593402419166-erjcp6bvv5gpl0rm7aqbn3jk9jk1gbfc.apps.googleusercontent.com';
    var apiKey = 'AIzaSyCU6YhNt0KoiWixIdTMKR2XLlj8WNFQPWU';
    var scopes = 'https://www.googleapis.com/auth/books';

    //declare initial interval variable used in shelf scrolling
    var interval;

    //set app's api key and trigger authorization
    function handleClientLoad(queryType, searchString) {
      gapi.client.setApiKey(apiKey);
      window.setTimeout(checkAuth(queryType, searchString),1);
    };

    //get authorization
    function checkAuth(queryType, searchString) {
      $scope.queryType = queryType;
      $scope.searchString = searchString;
      gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
    }

    //make api call if authorized
    function handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        if($scope.queryType === 'myLibrary') {
          getMyLibrary();
        } else {
          searchBooks();
        }
      }
    }

    //manual authorization
    function handleAuthClick(event) {
      gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
      return false;
    }

    //search Google Books
    function searchBooks() {
      gapi.client.load('books', 'v1').then(function() {
        var request = gapi.client.books.volumes.list({                      //build search request for Google Books, restricting returned fields for performance optimization
          'q': $scope.searchString,
          'startIndex': 0,
          'maxResults': 40
        });
        request.then(function (resp) {
          if(resp.result.items) {
            $scope.totalShelves = [
              {
                title: 'Google Books',
                id: 1,
                volumes: resp.result.items
              }
            ];
            for(var a in $scope.totalShelves[0].volumes) {                    //loop through author array and reformat as string
              if($scope.totalShelves[0].volumes[a].volumeInfo.authors) {
                var stringAuthors = $scope.totalShelves[0].volumes[a].volumeInfo.authors.toString();
                stringAuthors = stringAuthors.replace(',', ', ');
                stringAuthors = stringAuthors.replace(',  ', ', ');
                $scope.totalShelves[0].volumes[a].volumeInfo.authors = stringAuthors;
              }
            }
          } else {
            $scope.totalShelves = [
              {
                title: 'No Books Found',
                id: 1,
                volumes: 0
              }
            ];
          }

          $scope.$apply();
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message);
        });
      });
    }

    //retrieve MyBookList
    function getMyLibrary() {
      gapi.client.load('books', 'v1').then(function() {                                   //load Google Books
        var request = gapi.client.books.mylibrary.bookshelves.list({                      //build request for user's shelves, restricting returned fields for performance optimization
          'userId': 'me',
          'fields': 'items(id,selfLink,title,volumeCount)'
        });
        request.then(function(resp) {
          $scope.totalShelves = resp.result.items;                                        //bind returned shelves array
        }, function(reason) {
          console.log('Error: ' + reason.result.error.message);
        }).then(function () {

          //loops through each shelf in the array, only moving to next after the http call for that shelves books is finished
          function processNext(shelf) {
            if(shelf < $scope.totalShelves.length - 1) {
              shelf++;

              var currentShelf = $scope.totalShelves[shelf].id;                           //declare current shelf id
              if($scope.totalShelves[shelf].id !== 9) {
                var getVolumes = gapi.client.books.mylibrary.bookshelves.volumes.list({   //build request for shelf's books
                  'userId': 'me',
                  'shelf': currentShelf
                });
                getVolumes.then(function (volumes) {
                  if(volumes.result.items) {                                              //if shelf has books...
                    $scope.totalShelves[shelf].volumes = volumes.result.items;            //add array of books to the current shelf's scope object
                    for(var a in $scope.totalShelves[shelf].volumes) {                    //loop through author array and reformat as string
                      if($scope.totalShelves[shelf].volumes[a].volumeInfo.authors) {
                        var stringAuthors = $scope.totalShelves[shelf].volumes[a].volumeInfo.authors.toString();
                        stringAuthors = stringAuthors.replace(',', ', ');
                        stringAuthors = stringAuthors.replace(',  ', ', ');
                        $scope.totalShelves[shelf].volumes[a].volumeInfo.authors = stringAuthors;
                      }
                    }
                  } else {                                                                //...else set shelf volumes to 0
                    $scope.totalShelves[shelf].volumes = 0;
                  }
                  $scope.$apply();                                                        //update scope
                  processNext(shelf);                                                     //process next
                });
              } else {
                processNext(shelf);
              }
            }
          }

          processNext(-1);
        });
      });
    }

    /*function$timeout(function() {
      handleClientLoad('myBookShelves');
    },100);*/

    $scope.getMyLibrary = function () {
      handleClientLoad('myLibrary');
    }

    $scope.searchBooks = function() {
      var searchString = '';
      if($scope.bookTitle && $scope.bookTitle !== '') {
        searchString += 'intitle:' + $scope.bookTitle;
      }
      if($scope.bookAuthor && $scope.bookAuthor !== '') {
        if($scope.bookTitle && $scope.bookTitle !== '') {
          searchString += '+inauthor:' + $scope.bookAuthor;
        } else {
          searchString += 'inauthor:' + $scope.bookAuthor;
        }
      }
      if($scope.bookSubject && $scope.bookSubject !== '') {
        if($scope.bookAuthor && $scope.bookAuthor !== '') {
          searchString += '+subject:' + $scope.bookSubject;
        } else {
          searchString += 'subject:' + $scope.bookSubject;
        }
      }

      handleClientLoad('searchBooks', searchString);
    }

    //open new tab to Google Books listing page
    $scope.openBook = function (book) {
      var bookLink = angular.element('<a href="' + book.volumeInfo.previewLink + '" target="_blank"></a>');
      bookLink[0].click();
      bookLink.remove();
    };

    //scroll shelf left or right
    $scope.scrollShelf = function (event, action, id) {
      var shelf = document.getElementById('shelf' + id);

      if(action === 'right') {
        interval = window.setInterval(function(){
          shelf.scrollLeft += 10;
        }, 10);
      } else {
        interval = window.setInterval(function(){
          shelf.scrollLeft = shelf.scrollLeft - 10;
        }, 10);
      }
    };

    //stop scrolling shelf
    $scope.stopScroll = function () {
      window.clearInterval(interval);
    };

    //scroll to specific shelf
    $scope.setShelf = function (id) {
      var element = document.getElementById('shelf' + id);
      var options = {
        duration: 700,
        easing: 'easeInQuad'
      }
      smoothScroll(element, options);
    }

    /*//dummy data
    $scope.totalShelves = [
      {
        title: 'My Google EBooks',
        id: 1,
        volumes: [
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          }
        ]
      },
      {
        title: 'For Sale',
        id: 2,
        volumes: [
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          }
        ]
      },
      {
        title: 'Wishlist',
        id: 3,
        volumes: [
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          }
        ]
      },
      {
        title: "Don't Like",
        id: 4,
        volumes: [
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          }
        ]
      },
      {
        title: 'Favorites',
        id: 5,
        volumes: [
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          },
          {
            "volumeInfo": {
              "title": "Ender's Game",
              "authors": "Orson Scott Card"
            }
          }
        ]
      }
    ];*/

  });
