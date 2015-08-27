angular.module('portfolioApp')
  .directive('ngScopeElement', function () {
    var directiveDefinitionObject = {
      restrict: 'A',
      compile: function compile() {
        return {
          pre: function preLink(scope, iElement, iAttrs) {
            scope[iAttrs.ngScopeElement] = iElement;
          }
        };
      }
    };
    return directiveDefinitionObject;
  })
  .directive('boxGenerator', function () {
    return {
      restrict: 'A',
      link: function (scope) {
        var height = 450,
          depth = 300,
          width = 50,
          front = scope.front,
          back = scope.back,
          top = scope.top,
          bottom = scope.bottom,
          left = scope.left,
          right = scope.right;
        front.css({
          'transform': 'translateZ(' + (depth - 1) + 'px)',
          'height': height + 'px',
          'width': width + 'px'
        });
        back.css({
          'height': height + 'px',
          'width': width + 'px'
        });
        top.css({
          'transform': 'translateZ(' + depth + 'px) rotateX(-90deg)',
          'height': depth + 'px',
          'width': width + 'px'
        });
        bottom.css({
          'height': depth + 'px',
          'width': width + 'px',
          'margin-top': depth + 'px'
        });
        left.css({
          'height': height + 'px',
          'width': depth + 'px'
        });
        right.css({
          'transform': 'translateX(' + (width - depth) + 'px)' + 'rotateY(-270deg)',
          'transform-origin': 'top right',
          'height': height + 'px',
          'width': depth + 'px'
        });
      }
    };
  })
  .directive('clickAnywhereButHere', function ($document) {
    return {
      restrict: 'A',
      link: function(scope, elem, attr, ctrl) {
        elem.bind('click', function(e) {
          // this part keeps it from firing the click on the document.
          e.stopPropagation();
        });
        $document.bind('click', function() {
          // magic here.
          scope.$apply(attr.clickAnywhereButHere);
        })
      }
    }
  })
  .directive('compileTemplate', function($compile, $parse){
    return {
      link: function(scope, element, attr){
        var parsed = $parse(attr.ngBindHtml);
        function getStringValue() { return (parsed(scope) || '').toString(); }

        //Recompile if the template changes
        scope.$watch(getStringValue, function() {
          $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
        });
      }
    }
  })
  .directive('onLongPress', function($timeout) {
    return {
      restrict: 'A',
      link: function($scope, $elm, $attrs) {
        $elm.bind('mousedown touchstart', function(evt) {
          // Locally scoped variable that will keep track of the long press
          $scope.longPress = true;

          // We'll set a timeout for 600 ms for a long press
          $timeout(function() {
            if ($scope.longPress) {
              // If the touchend event hasn't fired,
              // apply the function given in on the element's on-long-press attribute
              $scope.$apply(function() {
                $scope.$eval($attrs.onLongPress)
              });
            }
          }, 50);
        });

        $elm.bind('mouseup touchend', function(evt) {
          // Prevent the onLongPress event from firing
          $scope.longPress = false;
          // If there is an on-touch-end function attached to this element, apply it
          if ($attrs.onTouchEnd) {
            $scope.$apply(function() {
              $scope.$eval($attrs.onTouchEnd)
            });
          }
        });
      }
    };
  });

