angular.module('portfolioApp')

  //Container directive for slider component
  .directive('jpSlider', function ($window, $document) {
    return {
      restrict: 'A',
      templateUrl: 'components/slider/partials/sliderPartial.html',
      scope: {
        displayTicks: '=?',
        minValue: '=',
        maxValue: '=',
        segments: '=',
        snapTo: '=?',
        popupContent: '@',
        colors: '=?',
        popupFade: '=?'
      },
      transclude: true,
      replace: true,
      controller: function ($scope) {
      },
      link: function (scope, element, attrs) {
        var numOfSegments = scope.segments.length - 1,
            segmentLength = 100 / numOfSegments;
        //Length of each segment as a percentage of total slider length
        scope.segmentLength = segmentLength;
      }
    }
  })

  //Directive for slider segment
  .directive('jpSliderSegment', function ($window, $document) {
    return {
      restrict: 'A',
      require: '^jpSlider',
      scope: {
        segmentLength: '@',
        displayTicks: '=?'
      },
      link: function (scope, element, attrs) {
        //set width of each slider segment using the calculated segmentLength from jpSlider
        element.css('width', scope.segmentLength + '%');

        if(!scope.displayTicks) {
          element
        }
      }
    }
  })

  //Directive for the slider button, slider fill, and slider popup
  .directive('jpSliderButton', function ($window, $document, $timeout) {
    return {
      restrict: 'A',
      require: '^jpSlider',
      scope: {
        segments: '=',
        snapTo: '=',
        minValue: '=',
        maxValue: '=',
        popupContent: '=',
        colors: '=?',
        popupFade: '=?'
      },
      link: function (scope, element, attrs) {
          //slider button position variables
        var startX = 0,
          x = 0,
          onSlider = 0,
          //slider parent dimensions
          parentLeft = element.parent()[0].offsetLeft,
          parentRight = element.parent().width() - parentLeft,
          parentTop = element.parent()[0].offsetTop,
          parentHeight = element.parent()[0].getBoundingClientRect().height,
          //segment variable
          segments = Math.round(parentRight / (scope.segments.length - 1)),
          //popup variables
          popup = element.parent().find('div')[0],
          popupHeight = popup.getBoundingClientRect().height + 15,
          popupWidth = popup.getBoundingClientRect().width,
          //button variables
          buttonWidth = element[0].getBoundingClientRect().width,
          buttonLeft = element[0].getBoundingClientRect().left,
          //slider fill variables
          segmentColors = [[scope.colors[0], 0]],
          currentSegment = 0,
          currentColor = 0,
          nextColor = 1,
          sliderFill = element.parent().find('span')[0],
          sliderFillSegments = parentRight / scope.colors.length,
          slider = {
            buildColorArray: function (colors, segmentColors, sliderFillSegments, currentSegment) {
              for(var i=0; i < colors.length; i++) {
                segmentColors.push([scope.colors[i], sliderFillSegments + currentSegment]);
                currentSegment = sliderFillSegments + currentSegment;
              }
            },
            setPopupPlacement: function (parentTop, popupHeight, popup, parentHeight) {
              if(parentTop < popupHeight) {
                angular.element(popup).css({
                  'margin-top': parentHeight
                });
              } else {
                angular.element(popup).css({
                  'margin-top': -popupHeight
                });
              }
            },
            setPopupStyleStart: function (popup, popupWidth, buttonWidth, buttonLeft) {
              angular.element(popup).css({
                'left': -(popupWidth / 2 + popupWidth * 2) + (buttonWidth / 2) + buttonLeft
              });
            },
            setPopupStyle: function (popup, popupWidth, buttonWidth, buttonLeft) {
              angular.element(popup).css({
                'left': -(popupWidth / 2) + (buttonWidth / 2) + buttonLeft
              });
            },
            setSliderWidth: function (sliderFill, x) {
              angular.element(sliderFill).css({
                'width': x
              });
            },
            populatePopup: function (popupContent, popup, x, parentRight, maxValue, minValue) {
              if(popupContent === 'percent') {
                angular.element(popup).html(Math.round(Math.ceil((x / parentRight) * 100)) + '%');
              } else if (popupContent === 'integer') {
                angular.element(popup).html(Math.round(Math.ceil((x / parentRight) * (maxValue - minValue) + minValue)));
              } else {
                angular.element(popup).html(scope.segments[Math.round(Math.floor(x / segments))]);
              }
            }
          };

        if(scope.popupFade && scope.popupFade !== undefined) {
          angular.element(popup).css({
            'opacity': 0
          })
        }

        //create function to find if a value is between two numbers
        Number.prototype.between = function(a, b, inclusive) {
          var min = Math.min(a, b),
            max = Math.max(a, b);

          return inclusive ? this >= min && this <= max : this > min && this < max;
        }

        //build the segmentColors array based on scope.colors array and segment length
        slider.buildColorArray(scope.colors, segmentColors, sliderFillSegments, currentSegment);

        slider.populatePopup(scope.popupContent, popup, x, parentRight, scope.maxValue, scope.minValue);

        popupHeight = popup.getBoundingClientRect().height + 15;

        //if top of popup collides with top of window, change placement of popup to bottom of slider
        slider.setPopupPlacement(parentTop, popupHeight, popup, parentHeight);

        //align middle of popup to middle of button
        slider.setPopupStyleStart(popup, popupWidth, buttonWidth, buttonLeft);

        //re-calculate on window resize
        angular.element($window).on('resize', function () {
          parentLeft = element.parent()[0].offsetLeft;
          parentRight = element.parent().width() - parentLeft;
          segments = Math.round(parentRight / (scope.segments.length - 1));
          popupWidth = popup.getBoundingClientRect().width;
          buttonWidth = element[0].getBoundingClientRect().width;
          buttonLeft = element[0].getBoundingClientRect().left;
          segmentColors = [[scope.colors[0], 0]];
          currentSegment = 0;
          sliderFillSegments = parentRight / scope.colors.length;

          //rebuild the segmentColors array based on scope.colors array and modified segment length
          slider.buildColorArray(scope.colors, segmentColors, sliderFillSegments, currentSegment);

          //set modified x value by multiplying slider width by the calculated position as of the last mouseup event
          x = parentRight * onSlider;

          //set button left position
          element.css({
            left:  x + 'px'
          });

          //set popup left position
          slider.setPopupStyle(popup, popupWidth, buttonWidth, buttonLeft);

          //set slider fill width
          slider.setSliderWidth(sliderFill, x);
        });

        // Prevent default dragging of selected content
        element.on('mousedown', function(event) {
          event.preventDefault();
          startX = event.pageX - x;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        //mousemove function
        function mousemove(event) {

          //handle moving button, and restricting left/right movement to the boundaries of the slider
          if(x < 0) {
            $document.off('mousemove', mousemove);
            x = 0;
          } else if (x > parentRight) {
            $document.off('mousemove', mousemove);
            x = parentRight - 1;
          } else {
            x = event.pageX - startX;
          }

          //handle setting the color of the slider fill based on the created segmentsColor array

          //if the button is between the current and next color breakpoint, set the background-color of the slider fill
          if(x.between(segmentColors[currentColor][1], segmentColors[nextColor][1], false)) {
            currentColor = currentColor;
            nextColor = nextColor;
            //else if the button is not between the current and next color breakpoint...
          } else if (!x.between(segmentColors[currentColor][1], segmentColors[nextColor][1], false)) {
            //if the button moved to the previous color breakpoint, set the current and next color to the previous color breakpoint
            if(x < segmentColors[currentColor][1] && x > 0) {
              currentColor = currentColor - 1;
              nextColor = nextColor - 1;
              //else if the button moved to the next color breakpoint, se the current and next color to the next color breakpoint
            } else if (x > segmentColors[currentColor][1] && x < segmentColors[segmentColors.length - 1][1]) {
              currentColor = currentColor + 1;
              nextColor = nextColor + 1;
            }
          }

          angular.element(sliderFill).css({
            'background-color': segmentColors[nextColor][0]
          });

          //set popupHeight, popupWidth, and buttonLeft to account for any dimension changes due to the content of the popup changing
          popupHeight = popup.getBoundingClientRect().height + 15;
          popupWidth = popup.getBoundingClientRect().width;
          buttonLeft = element[0].getBoundingClientRect().left;

          //set button left position
          element.css({
            left:  x + 'px'
          });

          slider.setPopupStyle(popup, popupWidth, buttonWidth, buttonLeft);

          angular.element(popup).css({
            'opacity': 1
          });

          //set slider fill width
          slider.setSliderWidth(sliderFill, x);

          slider.populatePopup(scope.popupContent, popup, x, parentRight, scope.maxValue, scope.minValue);

          //if top of popup collides with top of window, change placement of popup to bottom of slider.
          //This accounts for the height of the popup changing due to the contents of the popup changing
          slider.setPopupPlacement(parentTop, popupHeight, popup, parentHeight);
        }

        function mouseup() {

          //stop mousemove functions
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);

          //find the remainder of the segment length after the button's current position
          var remainder = x % segments;

          //if the snapTo option is selected...
          if(scope.snapTo) {
            //if the button is closer to the beginning of the current segment...
            if(remainder <= segments / 2) {
              //move the button back to the beginning of the current segment
              x = x - remainder;
            } else {
              //move the button to the end of the current segment
              x = x - remainder + segments;
            }

            //if the button is past the end of the slider, move it back to the end of the slider
            if(x >= parentRight) {
              x = parentRight;
            }
          }

          slider.populatePopup(scope.popupContent, popup, x, parentRight, scope.maxValue, scope.minValue);

          //if the button is between the current and next color breakpoint, set the background-color of the slider fill
          if(x.between(segmentColors[currentColor][1], segmentColors[nextColor][1], false)) {
            currentColor = currentColor;
            nextColor = nextColor;
            //else if the button is not between the current and next color breakpoint...
          } else if (!x.between(segmentColors[currentColor][1], segmentColors[nextColor][1], false)) {
            //if the button moved to the previous color breakpoint, set the current and next color to the previous color breakpoint
            if(x < segmentColors[currentColor][1] && x > 0) {
              currentColor = currentColor - 1;
              nextColor = nextColor - 1;
              //else if the button moved to the next color breakpoint, se the current and next color to the next color breakpoint
            } else if (x > segmentColors[currentColor][1] && x < segmentColors[segmentColors.length - 1][1]) {
              currentColor = currentColor + 1;
              nextColor = nextColor + 1;
            }
          }

          angular.element(sliderFill).css({
            'background-color': segmentColors[nextColor][0]
          });

          //find the current fraction of the length of the slider
          onSlider = x / parentRight;

          //set the left position of the button
          element.css({
            left:  x + 'px'
          });

          //set popupWidth, and buttonLeft to account for any dimension changes due to the content of the popup changing
          buttonLeft = element[0].getBoundingClientRect().left;
          popupWidth = popup.getBoundingClientRect().width;
          popupHeight = popup.getBoundingClientRect().height + 15;

          //set popup left position
          slider.setPopupStyle(popup, popupWidth, buttonWidth, buttonLeft);

          slider.setPopupPlacement(parentTop, popupHeight, popup, parentHeight);

          //set slider fill width
          slider.setSliderWidth(sliderFill, x);

          $timeout(function () {
            if(scope.popupFade && scope.popupFade !== undefined) {
              angular.element(popup).css({
                'opacity': 0
              });
            } else {
              return;
            }
          }, 1000);
        }
      }
    }
  });
