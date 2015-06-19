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
  });

