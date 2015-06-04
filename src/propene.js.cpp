/*
 * Copyright (c) 2015 Dickson Tam
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 */

(function(factory) {

  var defineUniqueId;

  if (typeof module !== 'undefined' && module && module.exports) { // Node.js & CommonJS

   module.exports = function(window) {
     require('define-uniqueid')(window.HTMLElement);
     return factory(window);
   }
  } else if (typeof define === 'function' && define.amd) { // Require.js & AMD

   define('propene', [ 'define-uniqueid'], function(defineUniqueId) {
     defineUniqueId(window.HTMLElement);
     window.propene = factory(window);
     return window.propene;
   });

  } else { // Browser

    if (!window.defineUniqueId) {
      throw new Error('defineUniqueId undefined prior to propene factory construction.');
    }

    window.defineUniqueId(window.HTMLElement);
    window.propene = factory(window);

 }
})(function(window) {

  var MutationObserver = window.MutationObserver;
  var document = window.document;
  var HTMLElement = window.HTMLElement;

  #include "accessor.js"

  #include "mufilter.js"

  #include "observer.js"

  #include "binding.js"

  return function(obj, prop) {
    return new Binding(obj, prop);
  }

});
