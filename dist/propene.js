/* The MIT License (MIT)
 * 
 * Copyright (c) 2015 Dickson Tam
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


(function(factory) {

   var defineUniqueId;

   if (typeof module !== 'undefined' && module && module.exports) { // Node.js & CommonJS

      module.exports = function(window) {
         require('define-uniqueid')(window.HTMLElement);
         return factory(window);
      }
   } else if (typeof define === 'function' && define.amd) { // Require.js & AMD

      define('propene', ['define-uniqueid'], function(defineUniqueId) {
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

   var rclass = /^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/;
   var rattrib = /^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/;

   function truthy(str) {
      if (str == null) return false;

      var str = str.trim().toLowerCase();
      return str != 'no' && str != 'false' && str != '0';
   }

   function checkClassName(className) {

      if (className == null) {
         var fname = arguments.callee.caller.name;
         throw new Error('className parameter required in ' + fname + ' call.');
      } else if (typeof className != "string") {
         throw new Error('className parameter is not a string.');
      } else if (className.length == 0) {
         throw new Error('className parameter is an empty string.');
      } else if (!className.match(rclass)) {
         throw new Error('className parameter is not valid class name.');
      }
   }

   function checkAttributeName(attr) {
      var fname = arguments.callee.caller.name;

      if (attr == null) {
         throw new Error('Attribute name required in ' + fname + ' call.');
      } else if (typeof attr != "string") {
         throw new Error('Attribute parameter is not a string.');
      } else if (attr.length == 0) {
         throw new Error('Attribute parameter is an empty string.');
      } else if (attr.match(rattrib)) {
         throw new Error('Attribute parameter is not valid attribute name.');
      }
   }

   function regExp(className) {
      return new RegExp('(^|\\s+)' + className + '(?=($|\\s+))');
   }

   function hasClass(el, className) {
      if (el.classList) {
         return el.classList.contains(className);
      } else if (el.className) {
         return !!~el.className.search(regExp(className));
      } else {
         throw new Error('Element ' + el + ' does not have classList or className properties.');
      }
   }

   function addClass(el, className) {
      if (hasClass(el, className)) return;

      if (el.classList) {
         el.classList.add(className);
      } else if (el.className) {
         el.className = el.className + ((el.className.trim().length > 0) ? " " : "") + className;
      } else {
         throw new Error('Element ' + el + ' does not have classList or className properties.');
      }
   }

   function removeClass(el, className) {
      if (!hasClass(el, className)) return;

      if (el.classList) {
         el.classList.remove(className);
      } else if (el.className) {
         el.className = el.className.trim().replace(regExp(className), '');
      } else {
         throw new Error('Element ' + el + ' does not have classList or className properties.');
      }
   }

   function classList(el, arr) {
      if (arr && el.classList) {
         var last = el.classList.length - 1;
         for (var i = last; i >= 0; i--) {
            el.classList.remove(el.classList[i]);
         }

         for (var i = 0; i < arr.length; i++) {
            el.classList.add(arr[i]);
         }

      } else if (arr && el.className) {
         el.className = arr.join(' ');
      } else if (el.classList) {
         return Array.prototype.slice.call(el.classList);
      } else if (el.className) {
         return el.className.split(/\s/);
      } else {
         throw new Error('Element ' + el + ' does not have classList or className properties.');
      }
   }

   var ElementAccessor = {};

   ElementAccessor.text = function(el) {
      return {
         get: function() {
            return el.textContent || el.innerText;
         },
         set: function(text) {
            el.innerText = text;
         }
      }
   }

   ElementAccessor.html = function(el) {
      return {
         get: function() {
            return el.innerHTML;
         },
         set: function(html) {
            el.innerHTML = html;
         }
      }
   }

   ElementAccessor.classList = function(el) {
      return {
         get: function() {
            return classList(el);
         },
         set: function(arr) {
            classList(el, arr);
         }
      }
   }

   ElementAccessor.hasClass = function(el, className) {

      return {
         get: function() {
            return hasClass(el, className);
         },
         set: function(boolean) {
            if (boolean) {
               addClass(el, className);
            } else {
               removeClass(el, className);
            }
         }
      };
   }

   ElementAccessor.noClass = function(el, className) {
      return {
         get: function() {
            return !hasClass(el, className);
         },
         set: function(boolean) {
            if (!boolean) {
               addClass(el, className);
            } else {
               removeClass(el, className);
            }
         }
      }
   }

   ElementAccessor.attr = function(el, attrName) {
      return {
         get: function() {
            return el.getAttribute(attrName);
         },
         set: function(value) {
            el.setAttribute(attrName, Object(value).toString());
         },
         type: 'attribute',
         attribute: attrName
      }
   }

   ElementAccessor.hasAttr = function(el, attrName) {
      return {
         get: function() {
            return el.getAttribute(attrName) != null;
         },
         set: function(val) {
            if (val == null) {
               el.removeAttribute(attrName);
            } else {
               el.setAttribute(attrName, Object(val).toString());
            }
         },
         type: 'attribute',
         attribute: attrName
      }
   }

   ElementAccessor.hasTruthyAttr = function(el, attrName) {
      return {
         get: function() {
            return truthy(el.getAttribute(attrName));
         },
         set: function(val) {
            if (val == null) {
               el.removeAttribute(attrName);
            } else {
               el.setAttribute(attrName, Object(val).toString());
            }
         },
         type: 'attribute',
         attribute: attrName
      }
   }

   ElementAccessor.noTruthyAttr = function(el, attrName) {
      return {
         get: function() {
            return !truthy(el.getAttribute(attrName));
         },
         set: function(boolean) {
            var value = !boolean ? 'true' : 'false';
            el.setAttribute(attrName, value);
         },
         type: 'attribute',
         attribute: attrName
      }
   }

   ElementAccessor.value = function(el) {
      return {
         get: function() {
            return el.value;
         },
         set: function(value) {
            el.value = value;
         },
         type: 'characterData'
      }
   }

   ElementAccessor.checked = function(el) {
      return {
         get: function() {
            return el.checked;
         },
         set: function(boolean) {
            el.checked = boolean;
         },
         type: 'attribute',
         attribute: 'checked'
      }
   }

   function ObserveCfg(cfg) {
      if (cfg) this.merge(cfg);
   }

   ObserveCfg.text = function(el) {
      return new ObserveCfg({
         characterData: true,
         childList: true
      });
   }
   ObserveCfg.html = function(el) {
      return new ObserveCfg({
         characterData: true,
         childList: true,
         subtree: true
      });
   }

   ObserveCfg.class = function(el, className) {
      return new ObserveCfg({
         attributes: true,
         attributeFilter: ['class']
      });
   }

   ObserveCfg.attr = function(el, attrName) {
      return new ObserveCfg({
         attributes: true,
         attributeFilter: [attrName]
      });
   };

   ObserveCfg.value = function(el) {
      return new ObserveCfg({
         attributes: true,
         attributeFilter: ['value']
      });
   };

   ObserveCfg.checked = function(el) {
      return new ObserveCfg({
         attributes: true,
         attributeFilter: ['checked']
      });
   };

   ObserveCfg.unique = function(el, opts) {
      var cfg = new ObserveCfg();

      if (opts.attr) {
         cfg.addAttr(opts.attr);
      } else if (opts.class) {
         cfg.addAttr(opts.class);
      }

      if (opts.output == 'text') {
         cfg.addCData();
      } else if (opts.output == 'html') {
         cfg.addCData();
      } else if (opts.output == 'value' && el instanceof(HTMLTextArea)) { // Match TextArea
         cfg.addCData();
      } else if (opts.output == 'value') { // Must be input then
         cfg.addAttr('value');
      } else {
         cfg.addAttr(opts.output);
      }

      return cfg;
   };

   ObserveCfg.prototype.addAttr = function(attrName) {
      this.attributes = true;

      if (this.attributeFilter == null) this.attributeFilter = [];

      if (!~this.attributeFilter.indexOf(attrName))
         this.attributeFilter.push(attrName);
   }

   ObserveCfg.prototype.addCData = function() {
      this.childList = true;
      this.characterData = true;
   }

   ObserveCfg.prototype.merge = function(cfg) {

      if (cfg.attributes) this.attributes = true;
      if (cfg.characterData) this.characterData = true;
      if (cfg.childList) this.childList = true;

      if (cfg.attributeFilter) {
         for (var i = 0; i < cfg.attributeFilter.length; i++) {
            this.addAttr(cfg.attributeFilter[i]);
         }
      }

   }

   function Observer(binding) {
      this.binding = binding;
      this.mutob = new MutationObserver(this.handleMutations);
      this.cfglist = {};
      this.disconnected = true;
   }

   Observer.prototype.handleMutations = function(mutations) {
      this.binding.notifyChange();
   }

   Observer.prototype.observe = function(el, cfg) {
      if (this.cfglist.hasOwnProperty(el.uniqueId)) {
         this.cfglist[el.uniqueId].merge(cfg);
      } else {
         this.cfglist[el.uniqueId] = cfg;
      };

      if (!this.disconnected)
         this.mutob.observe(el, cfg);
   }

   function Binding(obj, prop) {
      if (obj == null) {
         throw new Error('obj argument is undefined or null.');
      }

      if (typeof(obj) != 'object') {
         throw new Error('obj argument is not an Object')
      }

      Object.defineProperty(obj, prop, {
         get: this.get.bind(this),
         set: this.set.bind(this),
         enumerable: true,
         configurable: true
      });
      this.accessors = [];
      this.observer = new Observer(this);
   }

   Binding.prototype.get = function() {
      return (this.accessors[0] === undefined || this.accessors[0].length == 0) ? null : this.accessors[0].get();
   }

   Binding.prototype.notifyChange = function() {
      if (!this.changeList) return;
      for (var i = 0; i < this.changeList.length; i++) {
         this.changeList[i]();
      }
   }

   Binding.prototype.set = function(val) {
      for (var i = 0; i < this.accessors.length; i++) {
         this.accessors[i].set(val);
      }

      this.notifyChange();
   }

   Binding.prototype.setFromElement = function(element) {
      for (var i = 0; i < this.accessors.length; i++) {
         if (element == this.accessors[i].element) {
            this.set(this.accessors[i].get());
            return this;
         }
      }
   }

   function getElements(selector) {

      if (selector == null) {
         throw new Error('Cannot get elements for a null/undefined selector')
      } else if (typeof(selector) == 'string') {
         elements = document.querySelectorAll(selector);
         elements = Array.prototype.slice.call(elements);
      } else if (selector instanceof HTMLElement) {
         elements = [selector];
      } else if (selector instanceof Array) {
         elements = selector;
      } else {
         throw new Error(selector + ' is of unknown type.')
      }

      if (elements == null) {
         throw new Error(selector + ' not found.');
      }

      return Array.prototype.slice.call(elements);
   }

   Binding.prototype.change = function(cbChange) {
      this.changeList = this.changeList || [];
      this.changeList.push(cbChange);
   }

   function multiplex(accessorFx, cfg) {
      return function(selector, opt) {
         var binding = this;
         var elements = getElements(selector);

         elements.map(function(el) {
            var accessor = accessorFx(el, opt);
            binding.accessors.push(accessor);

            binding.observer.observe(el, cfg(el, opt));
         });

         return this;
      }
   }

   Binding.prototype.text = multiplex(ElementAccessor.text, ObserveCfg.text);
   Binding.prototype.html = multiplex(ElementAccessor.html, ObserveCfg.html);
   Binding.prototype.classList = multiplex(ElementAccessor.classList, ObserveCfg.class);
   Binding.prototype.hasClass = multiplex(ElementAccessor.hasClass, ObserveCfg.class);
   Binding.prototype.noClass = multiplex(ElementAccessor.noClass, ObserveCfg.class);
   Binding.prototype.attr = multiplex(ElementAccessor.attr, ObserveCfg.attr);
   Binding.prototype.hasTruthyAttr = multiplex(ElementAccessor.hasTruthyAttr, ObserveCfg.attr);
   Binding.prototype.noTruthyAttr = multiplex(ElementAccessor.noTruthyAttr, ObserveCfg.attr);
   Binding.prototype.value = multiplex(ElementAccessor.value, ObserveCfg.value);
   Binding.prototype.checked = multiplex(ElementAccessor.checked, ObserveCfg.checked);

   Binding.prototype.unique = function(selector, opts) {
      function isUnique(el) {
         if (opts.attr) {
            return ElementAccessor.hasAttr(el, opts.attr);
         } else if (opts.class) {
            return ElementAccessor.hasClass(el, opts.class);
         }
      };

      function valueOf(el) {
         if (el == null) return null;

         if (opts.output == 'text') {
            return ElementAccessor.text(el).get();
         } else if (opts.output == 'html') {
            return ElementAccessor.html(el).get();
         } else if (opts.output == 'value') {
            return ElementAccessor.value(el).get();
         } else {
            return ElementAccessor.attr(opts.output).get();
         }
      };

      var elements = getElements(selector);

      this.accessors.push({
         get: function() {
            var filtered = elements.filter(function(el) {
               return isUnique(el).get()
            });
            return valueOf(filtered[0]);
         },
         set: function(val) {
            elements.map(function(el) {
               isUnique(el).set((valueOf(el) == val));
            });
         }
      });

      elements.map(function(el) {
         this.observer.observe(el, ObserveCfg.unique(el, opts));
      });

      return this;
   }

   return function(obj, prop) {
      return new Binding(obj, prop);
   }

});