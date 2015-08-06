angular.module('portfolioApp')
  .directive('highlightElements', function ($window, $document, themeService, $timeout, utils, $rootScope) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$on('selectElement', function () {
          var prev,
            highlighterTopLeft = angular.element('<div class="highlighterTopLeft"></div>'),
            highlighterTop = angular.element('<div class="highlighterTop"></div>'),
            highlighterTopRight = angular.element('<div class="highlighterTopRight"></div>'),
            highlighterRight = angular.element('<div class="highlighterRight"></div>'),
            highlighterBottomRight = angular.element('<div class="highlighterBottomRight"></div>'),
            highlighterBottom = angular.element('<div class="highlighterBottom"></div>'),
            highlighterBottomLeft = angular.element('<div class="highlighterBottomLeft"></div>'),
            highlighterLeft = angular.element('<div class="highlighterLeft"></div>'),
            body = angular.element(document.querySelectorAll('body'));
          body.append(highlighterTopLeft);
          body.append(highlighterTop);
          body.append(highlighterTopRight);
          body.append(highlighterRight);
          body.append(highlighterBottomRight);
          body.append(highlighterBottom);
          body.append(highlighterBottomLeft);
          body.append(highlighterLeft);
          element.on('mouseover', targetElement);

          function targetElement(event) {

            if (event.target === element ||
              (prev && prev === event.target)) {
              return;
            }
            if (prev) {
              prev = undefined;
            }
            if (event.target) {
              prev = event.target;
              prev = angular.element(prev);
              var targetHeight = prev[0].offsetHeight,
                targetWidth = prev[0].offsetWidth,
                targetTop = utils.getElementOffset(prev[0]).top,
                targetLeft = utils.getElementOffset(prev[0]).left,
                editor = angular.element(document.querySelectorAll('#editTheme')),
                body = angular.element(document.querySelectorAll('body')),
                editorHeight = editor[0].offsetHeight,
                editorWidth = editor[0].getBoundingClientRect().left,
                editorLeft = utils.getElementOffset(editor[0]).left,
                editorTop = utils.getElementOffset(editor[0]).top,
                windowW = $window.innerWidth,
                editorLeftEdge = editorWidth - 7.5,
                targetTopEdge = targetTop - (editorTop + 5),
                targetLeftEdge = targetLeft - editorLeft,
                targetRightEdge = (editorLeftEdge) + (targetLeftEdge) + targetWidth + 20,
                targetBottomEdge = ((targetTopEdge) + editorTop) + targetHeight + 10,
                targetBottomSpace = editorHeight - ((targetTopEdge) + targetHeight),
                targetRightSpace = windowW - (targetRightEdge);

              highlighterTopLeft.css({
                'top': editorTop,
                'left': editorLeftEdge,
                'height': targetTopEdge,
                'width': targetLeftEdge
              });
              highlighterTop.css({
                'top': editorTop,
                'left': (editorLeftEdge) + (targetLeftEdge),
                'height': targetTopEdge,
                'width': targetWidth + 20
              });
              highlighterTopRight.css({
                'top': editorTop,
                'left': targetRightEdge,
                'height': targetTopEdge,
                'width': targetRightSpace
              });
              highlighterRight.css({
                'top': (targetTopEdge) + editorTop,
                'left': targetRightEdge,
                'height': targetHeight + 10,
                'width': targetRightSpace
              });
              highlighterBottomRight.css({
                'top': targetBottomEdge,
                'left': targetRightEdge,
                'height': targetBottomSpace,
                'width': targetRightSpace
              });
              highlighterBottom.css({
                'top': targetBottomEdge,
                'left': (editorLeftEdge) + (targetLeftEdge),
                'height': targetBottomSpace,
                'width': targetWidth + 20
              });
              highlighterBottomLeft.css({
                'top': targetBottomEdge,
                'left': editorLeftEdge,
                'height': targetBottomSpace,
                'width': targetLeftEdge
              });
              highlighterLeft.css({
                'top': (targetTopEdge) + editorTop,
                'left': editorLeftEdge,
                'height': targetHeight + 10,
                'width': targetLeftEdge
              });

              prev.on('click', function () {
                scope.$broadcast('elementSelected', prev);
                highlighterTopLeft.remove();
                  highlighterTop.remove();
                  highlighterTopRight.remove();
                  highlighterRight.remove();
                  highlighterBottomRight.remove();
                  highlighterBottom.remove();
                  highlighterBottomLeft.remove();
                  highlighterLeft.remove();
              });
            }
          }
        });
      }
    }
  });
