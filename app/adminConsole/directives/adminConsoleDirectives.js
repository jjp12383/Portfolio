angular.module('portfolioApp')
  .directive('adminWindow', function ($window, $document) {
    return {
      restrict: 'AE',
      transclude: true,
      templateUrl: 'adminConsole/partials/adminWindowPartial.html',
      scope: {
        data: "=",
        index: "="
      },
      replace: true,
      link: function (scope, element, $parent) {

        if(!scope.data.max) {
          defaultSize();
        } else {
          maximize();
        }

        element.click(function () {
          angular.element(document.querySelectorAll(".admin-window")).css("z-index", "0");
          element.css("z-index", "5000");
        });

        element.on("mousedown", function () {
          element.on("mousemove", function () {
            var mouseMove = handleMouseMove(),
                windowW = angular.element(window).width();
            if(mouseMove.mouseX === windowW - 1) {
              element.addClass('half-screen');
              element.css({
                width: '50vw',
                height: 'calc(100vh - 102px)',
                left: windowW / 2,
                top: '51px'
              });
              scope.data.halfScreen = true;
            } else if (mouseMove.mouseX === 1) {
              element.css({
                width: '50vw',
                height: 'calc(100vh - 102px)',
                left:0,
                top: '51px'
              });
              scope.data.halfScreen = true;
            }
          });
        });

        function maximize() {
          element.addClass('maximized');
          element.css({'height': '100vh', 'width': '100vw', 'top': 0, left: 0, 'z-index': 5000});
        }

        function defaultSize() {
          element.css({'height': scope.data.height, 'width': scope.data.width, 'top': scope.data.top + '%', 'left': scope.data.left + '%'});
          setTimeout(function () {
            element.removeClass('maximized');
          }, 400)
        }

        function handleMouseMove(event) {
          var dot, eventDoc, doc, body, pageX, pageY;

          event = event || window.event; // IE-ism

          // If pageX/Y aren't available and clientX/Y are,
          // calculate pageX/Y - logic taken from jQuery.
          // (This is to support old IE)
          if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
          }

          return {
            mouseX: event.pageX,
            mouseY: event.pageY
          }
        }

        scope.minimizeWindow = function () {
          if(scope.data.open) {
            scope.data.open = false;
            scope.data.max = false;
            var windowTab = angular.element(document.querySelectorAll("#windowTab" + scope.data.createDate)),
                windowTabTop = windowTab[0].getBoundingClientRect().top,
                windowTabLeft = windowTab[0].getBoundingClientRect().left,
                windowTabHeight = windowTab.css('height'),
                windowTabWidth = windowTab.css('width');
            element.addClass('minimized');
            windowTab.css('z-index', 0);
            element.css({
              'height': 50,
              'width': 50,
              'z-index': 1000,
              'border-radius': '25px'
            });
            setTimeout(function () {
              element.css({
                'top': windowTabTop,
                'left': windowTabLeft
              });
            }, 400);
            setTimeout(function () {
              element.css({
                'height': windowTabHeight,
                'width': windowTabWidth,
                'border-radius': '3px'
              });
            }, 701);
            setTimeout(function () {
              windowTab.addClass('minimized');
              element.css('display', 'none');
            }, 1001)
          }
        };

        scope.toggleWindowSize = function () {
          if(!scope.data.max) {
            maximize();
            scope.data.max = true;
          } else {
            defaultSize();
            scope.data.max = false;
          }
        };

        scope.closeWindow = function () {
          scope.$emit('CLOSE_WINDOW', scope.data.createDate);
        }
      }
    }
  })
  .directive("windowTab", function() {
    return {
      restrict: 'A',
      scope: {
        data: "="
      },
      templateUrl: 'adminConsole/partials/adminWindowTabPartial.html',
      link: function (scope, element, attr) {
        scope.restoreWindow = function () {
          if(!scope.data.open) {
            var aWindow = angular.element(document.querySelectorAll("#window" + scope.data.createDate));
            scope.data.open = true;
            aWindow.css({
              display: 'flex'
            });
            element.children().removeClass('minimized');
            setTimeout(function () {
              aWindow.css({
                'top': scope.data.top + '%',
                'left': scope.data.left + '%',
                'border-radius': '25px',
                'width': '50px',
                'height': '50px'
              });
            }, 1);
            setTimeout(function () {
              aWindow.css({
                'height': scope.data.height,
                'width': scope.data.width,
                'border-radius': '3px'
              });
            }, 401);
            setTimeout(function () {
              aWindow.removeClass('minimized');
            }, 701)
          }
        }
        scope.$watch('data', function () {
          scope.$emit('SCOPE_CHANGE');
        });
      }
    }
  })
  .directive("windowDrag", function($document) {
    return function(scope, $element, $attr) {
      var startX = 0, startY = 0;
      var newElement = angular.element('<div class="draggable"></div>');

      $element.append(newElement);
      newElement.on("mousedown", function($event) {
        event.preventDefault();

        // To keep the last selected box in front
        angular.element(document.querySelectorAll(".admin-window")).css("z-index", "0");
        $element.css("z-index", "1");

        startX = $event.pageX - $element[0].offsetLeft;
        startY = $event.pageY - $element[0].offsetTop;
        $document.on("mousemove", mousemove);
        $document.on("mouseup", mouseup);
      });

      function mousemove($event) {
        y = $event.pageY - startY;
        x = $event.pageX - startX;
        $element.css({
          top: y + "px",
          left:  x + "px"
        });
      }

      function mouseup() {
        $document.off("mousemove", mousemove);
        $document.off("mouseup", mouseup);
        var windowW = angular.element(window).width(),
            windowH = angular.element(window).height();
        scope.$apply(function () {
          if(scope.data.max) {
            return;
          } else if (scope.data.halfScreen){
            scope.data.halfScreen = false;
            $element.css({
              width: scope.data.width,
              height: scope.data.height
            });
          } else {
            scope.data.top = Math.round($element[0].getBoundingClientRect().top / windowH * 100);
            scope.data.left = Math.round($element[0].getBoundingClientRect().left / windowW * 100);
            scope.data.height = $element.css('height');
            scope.data.width = $element.css('width');
            $element.removeClass('half-screen');
          }
        });
      }
    };
  })
  .directive("windowResize", function($document) {
  return function(scope, $element, $attr) {

    // Function to manage resize up event
    var resizeUp = function($event) {
      var top = $event.pageY;
      var height = $element[0].offsetTop + $element[0].offsetHeight - $event.pageY;

      if ($event.pageY < $element[0].offsetTop + $element[0].offsetHeight - 50) {
        $element.css({
          top: top + "px",
          height: height + "px"
        });
      } else {
        $element.css({
          top: $element[0].offsetTop + $element[0].offsetHeight - 50 + "px",
          height: "50px"
        });
      }
    };

    // Function to manage resize right event
    var resizeRight = function($event) {
      var width = $event.pageX - $element[0].offsetLeft;

      if ($event.pageX > $element[0].offsetLeft + 50) {
        $element.css({
          width: width + "px"
        });
      } else {
        $element.css({
          width: "50px"
        });
      }
    };

    // Function to manage resize down event
    var resizeDown = function($event) {
      var height = $event.pageY - $element[0].offsetTop;

      if ($event.pageY > $element[0].offsetTop + 50) {
        $element.css({
          height: height + "px"
        });
      } else {
        $element.css({
          height: "50px"
        });
      }
    };

    // Function to manage resize left event
    var resizeLeft = function($event) {
      var left = $event.pageX;
      var width = $element[0].offsetLeft + $element[0].offsetWidth - $event.pageX;

      if ($event.pageX < $element[0].offsetLeft + $element[0].offsetWidth - 50) {
        $element.css({
          left: left + "px",
          width: width + "px"
        });
      } else {
        $element.css({
          left: $element[0].offsetLeft + $element[0].offsetWidth - 50 + "px",
          width: "50px"
        });
      }
    };

    // Create a div to catch resize up event
    var newElement = angular.element('<div class="n-resize"></div>');
    $element.append(newElement);
    newElement.on("mousedown", function() {
      $document.on("mousemove", mousemove);
      $document.on("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        resizeUp($event);
      }

      function mouseup() {
        $document.off("mousemove", mousemove);
        $document.off("mouseup", mouseup);
      }
    });

    // Create a div to catch resize right event
    newElement = angular.element('<div class="e-resize"></div>');
    $element.append(newElement);
    newElement.on("mousedown", function() {
      $document.on("mousemove", mousemove);
      $document.on("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        resizeRight($event);
      }

      function mouseup() {
        $document.off("mousemove", mousemove);
        $document.off("mouseup", mouseup);
      }
    });

    // Create a div to catch resize down event
    newElement = angular.element('<div class="s-resize"></div>');
    $element.append(newElement);
    newElement.on("mousedown", function() {
      $document.on("mousemove", mousemove);
      $document.on("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        resizeDown($event);
      }

      function mouseup() {
        $document.off("mousemove", mousemove);
        $document.off("mouseup", mouseup);
      }
    });

    // Create a div to catch resize left event
    newElement = angular.element('<div class="w-resize"></div>');
    $element.append(newElement);
    newElement.on("mousedown", function() {
      $document.on("mousemove", mousemove);
      $document.on("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        resizeLeft($event);
      }

      function mouseup() {
        $document.off("mousemove", mousemove);
        $document.off("mouseup", mouseup);
      }
    });

    // Create a div to catch resize up left event
    newElement = angular.element('<div class="nw-resize"></div>');
    $element.append(newElement);
    newElement.on("mousedown", function() {
      $document.on("mousemove", mousemove);
      $document.on("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        resizeUp($event);
        resizeLeft($event);
      }

      function mouseup() {
        $document.off("mousemove", mousemove);
        $document.off("mouseup", mouseup);
      }
    });

    // Create a div to catch resize up right event
    newElement = angular.element('<div class="ne-resize"></div>');
    $element.append(newElement);
    newElement.on("mousedown", function() {
      $document.on("mousemove", mousemove);
      $document.on("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        resizeUp($event);
        resizeRight($event);
      }

      function mouseup() {
        $document.off("mousemove", mousemove);
        $document.off("mouseup", mouseup);
      }
    });

    // Create a div to catch resize down right event
    newElement = angular.element('<div class="se-resize"></div>');
    $element.append(newElement);
    newElement.on("mousedown", function() {
      $document.on("mousemove", mousemove);
      $document.on("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        resizeDown($event);
        resizeRight($event);
      }

      function mouseup() {
        $document.off("mousemove", mousemove);
        $document.off("mouseup", mouseup);
      }
    });

    // Create a div to catch resize down left event
    newElement = angular.element('<div class="sw-resize"></div>');
    $element.append(newElement);
    newElement.on("mousedown", function() {
      $document.on("mousemove", mousemove);
      $document.on("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        resizeDown($event);
        resizeLeft($event);
      }

      function mouseup() {
        $document.off("mousemove", mousemove);
        $document.off("mouseup", mouseup);
      }
    });
  };
});
