angular.module('portfolioApp')
  .service('themeService', function ($document, $firebaseArray, Ref) {

    var themes = $firebaseArray(Ref.child('admin').child('default').child('themes')),
      sheet = (function() {
      var style = document.createElement("style");
      style.title = "dynamicStyle";
      style.appendChild(document.createTextNode(""));
      document.head.appendChild(style);
      return style.sheet;
    })();

    function replaceAll(find, replace, str) {
      return str.replace(new RegExp(find, 'g'), replace);
    }

    if("insertRule" in sheet) {
      sheet.insertRule(".dummy-rule { font-size: 12px }", 0);
    }
    else if("addRule" in sheet) {
      sheet.addRule(".dummy-rule", "font-size: 12px", 0);
    }

    this.addNameSpace = function (el, styleProp, styleValue, nameSpace) {
      var element = el[0],
          currentStyle,
          ruleList = element.classList,
          styleProp = styleProp.toLowerCase(),
          styleSheet,
          matchedRules = [];
      if (element.currentStyle) {
        currentStyle = element.currentStyle[styleProp];
      } else if (window.getComputedStyle) {
        currentStyle = document.defaultView.getComputedStyle(element, null).getPropertyValue(styleProp);
      }
      for(var r=0; r < ruleList.length; r++) {
        var ruleName = ruleList[r].toLowerCase();
        if (document.styleSheets) {
          for (var i = 0; i < document.styleSheets.length; i++) {
            styleSheet = document.styleSheets[i];
            var ii=0;
            var cssRule=false;
            do {
              if (styleSheet.cssRules) {
                cssRule = styleSheet.cssRules[ii];
              } else {
                cssRule = styleSheet.rules[ii];
              }
              if (cssRule && cssRule.selectorText)  {
                var selector = cssRule.selectorText.toLocaleLowerCase(),
                  endOfSelector = selector.length,
                  themes;
                if (cssRule.selectorText.toLowerCase().indexOf(ruleName + ' ') > 0
                    || cssRule.selectorText.toLowerCase().indexOf(ruleName + ',') > 0
                    && cssRule.cssText.indexOf(styleProp + ': ' + currentStyle) > 0) {
                  var nameSpaceClass = '.' + nameSpace;
                  selector = replaceAll(nameSpaceClass, '', selector);
                  selector = selector + selector.slice(endOfSelector) + '.' + nameSpace;
                  selector = replaceAll(',', nameSpaceClass + ',', selector);
                  themes = [
                    {
                      themeClass: selector,
                      rules: [
                        {
                          property: styleProp,
                          value: styleValue
                        }
                      ]
                    }
                  ];
                  this.addRules(themes);
                } else if (cssRule.selectorText.toLowerCase().indexOf(ruleName + ' ') > 0
                          || cssRule.selectorText.toLowerCase().indexOf(ruleName + ',') > 0) {
                  var nameSpaceClass = '.' + nameSpace;
                  selector = replaceAll(nameSpaceClass, '', selector);
                  selector = selector + selector.slice(endOfSelector) + '.' + nameSpace;
                  selector = replaceAll(',', nameSpaceClass + ',', selector);
                  themes = [
                    {
                      themeClass: selector,
                      rules: [
                        {
                          property: styleProp,
                          value: styleValue
                        }
                      ]
                    }
                  ];
                  this.addRules(themes);
                }
              }
              ii++;
            } while (cssRule)
          }
        }
      }
      return matchedRules;
    }

    this.getExistingRule = function (ruleList, style) {
      for(var r=0; r < ruleList.length; r++) {
        var ruleName = ruleList[r].toLowerCase(),
            style = style.toLowerCase(),
            styleSheet;
        if (document.styleSheets) {
          for (var i = 0; i < document.styleSheets.length; i++) {
            styleSheet = document.styleSheets[i];
            var ii=0;
            var cssRule=false;
            do {
              if (styleSheet.cssRules) {
                cssRule = styleSheet.cssRules[ii];
              } else {
                cssRule = styleSheet.rules[ii];
              }
              if (cssRule && cssRule.selectorText)  {
                if (cssRule.selectorText.toLowerCase().indexOf(ruleName) > 0 && cssRule.cssText.indexOf(style) > 0) {
                  console.log(cssRule);
                }
              }
              ii++;
            } while (cssRule)
          }
        }
      }
    }

    function getCSSRule(ruleName, deleteFlag) {
      ruleName = ruleName.toLowerCase();
      var styleSheet;
      if (document.styleSheets) {
        for (var i=0; i<document.styleSheets.length; i++) {
          if(document.styleSheets[i].title === 'dynamicStyle') {
            styleSheet = document.styleSheets[i];
            var ii=0;
            var cssRule=false;
            do {
              if (styleSheet.cssRules) {
                cssRule = styleSheet.cssRules[ii];
              } else {
                cssRule = styleSheet.rules[ii];
              }
              if (cssRule)  {
                if (cssRule.selectorText.toLowerCase() === ruleName) {
                  if (deleteFlag === 'delete') {
                    if (styleSheet.cssRules) {
                      styleSheet.deleteRule(ii);
                    } else {
                      styleSheet.removeRule(ii);
                    }
                    return true;
                  } else {
                    return cssRule;
                  }
                }
              }
              ii++;
            } while (cssRule)
          }
        }
      }
      return {
        isRule: false,
        styleSheet: styleSheet
      };
    }

    function addCSSRule(ruleName) {
      if (document.styleSheets) {
        if (getCSSRule(ruleName).isRule === false) {
          if (getCSSRule(ruleName).styleSheet.addRule) {
            getCSSRule(ruleName).styleSheet.addRule(ruleName, null, 0);
          } else {
            getCSSRule(ruleName).styleSheet.insertRule(ruleName+' { }', 0);
          }
        }
      }
      return getCSSRule(ruleName);
    }

    this.addRules = function(themes) {
      for(var i=0; i < themes.length; i++) {                                                                //start loop through array of css styles
        var themeRule = themes[i],
          theme = addCSSRule(themeRule.themeClass),                                                         //invoke addCSSRule function to either retrieve matched css style object, or create and return new one
          oRules = theme.cssText;                                                                           //copy original css text of returned style object
        oRules = oRules.substring(oRules.indexOf('{') + 1, oRules.indexOf('}'));                            //strip out everything but the sting of rules
        for(var r=0; r < themeRule.rules.length; r++) {                                                     //begin loop of rules
          var rule = themeRule.rules[r].property + ': ' + themeRule.rules[r].value + ' !important' + '; ',  //build string of new rule
              ruleIndex = oRules.indexOf(themeRule.rules[r].property),                                      //index of original rule; -1 if new rule does not already exist in string
              endOfRule = oRules.indexOf(';', ruleIndex),                                                   //index of end of original rule, if it already exists
              oRule = oRules.substring(ruleIndex, endOfRule);                                               //text string of original rule
          if(ruleIndex < 0) {                                                                               //if new rule doesn't already exist...
            var lastRule = oRules.lastIndexOf(' ');
            oRules = oRules.slice(0, lastRule) + rule + oRules.slice(lastRule);                             //add it to the end of the text string of rules
          } else {                                                                                          //else...
            oRules = oRules.replace(oRule, rule);                                                           //replace old rule with new one
          }
        }
        theme.style.cssText = oRules;                                                                       //replace cssText property of matched style object with edited string of rules
      }
    }
  });
