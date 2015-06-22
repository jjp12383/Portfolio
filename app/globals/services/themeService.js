angular.module('portfolioApp')
  .service('themeService', function ($document) {


    var sheet = (function() {
      // Create the <style> tag
      var style = document.createElement("style");
      style.title = "dynamicStyle";

      // Add a media (and/or media query) here if you'd like!
      // style.setAttribute("media", "screen")
      // style.setAttribute("media", "only screen and (max-width : 1024px)")

      // WebKit hack :(
      style.appendChild(document.createTextNode(""));

      // Add the <style> element to the page
      document.head.appendChild(style);

      return style.sheet;
    })();

    if("insertRule" in sheet) {
      sheet.insertRule(".dummy-rule { font-size: 12px }", 0);
    }
    else if("addRule" in sheet) {
      sheet.addRule(".dummy-rule", "font-size: 12px", 0);
    }

    function getCSSRule(ruleName, deleteFlag) {
      ruleName=ruleName.toLowerCase();
      var styleSheet;// Convert test string to lower case.
      if (document.styleSheets) {                            // If browser can play with stylesheets
        for (var i=0; i<document.styleSheets.length; i++) {
         if(document.styleSheets[i].title === 'dynamicStyle') {

           styleSheet = document.styleSheets[i];
           var ii=0;                                        // Initialize subCounter.
           var cssRule=false;
           do {                                             // For each rule in stylesheet
             if (styleSheet.cssRules) {                    // Browser uses cssRules?
               cssRule = styleSheet.cssRules[ii];         // Yes --Mozilla Style
             } else {                                      // Browser usses rules?
               cssRule = styleSheet.rules[ii];            // Yes IE style.
             }                                             // End IE check.
             if (cssRule)  {        // If we found a rule...
               if (cssRule.selectorText.toLowerCase()==ruleName) { //  match ruleName?
                 if (deleteFlag=='delete') {             // Yes.  Are we deleteing?
                   if (styleSheet.cssRules) {           // Yes, deleting...
                     styleSheet.deleteRule(ii);        // Delete rule, Moz Style
                   } else {                             // Still deleting.
                     styleSheet.removeRule(ii);        // Delete rule IE style.
                   }                                    // End IE check.
                   return true;                         // return true, class deleted.
                 } else {                                // found and not deleting.
                   return cssRule;                      // return the style object.
                 }                                       // End delete Check
               }                                          // End found rule name
             }                                             // end found cssRule
             ii++;                                         // Increment sub-counter
           } while (cssRule)
          }
        }
      }
      return {
        isRule: false,
        styleSheet: styleSheet
      };
    }

    this.addCSSRule = function(ruleName) {                           // Create a new css rule
      if (document.styleSheets) {                            // Can browser do styleSheets?
        if (getCSSRule(ruleName).isRule === false) {
          if (getCSSRule(ruleName).styleSheet.addRule) {           // Browser is IE?
            getCSSRule(ruleName).styleSheet.addRule(ruleName, null, 0);      // Yes, add IE style
          } else {                                         // Browser is IE?
            getCSSRule(ruleName).styleSheet.insertRule(ruleName+' { }', 0); // Yes, add Moz style.
          }                                                // End browser check
        }                                                   // End already exist check.
      }                                                      // End browser ability check.
      return getCSSRule(ruleName);                           // return rule we just created.
    }

  });
