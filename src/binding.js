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

function getElement(selector) {
  if (selector instanceof HTMLElement) return selector;
  if (typeof(selector) == 'string')
    return document.querySelector(selector);

  throw new Error('Unable to get element for' + selector);
}

function Binding(obj, prop) {
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
  return (this.accessors[0] === undefined || this.accessors[0].length == 0)? null : this.accessors[0].get();
}

Binding.prototype.set = function(val) {
  for (var i = 0; i < this.accessors.length; i++) {
    this.accessors[i].set(val);
  }
}


Binding.prototype.setFromElement = function(element) {
  for (var i = 0; i < this.accessors.length; i++) {
    if (element == this.accessors[i].element) {
      this.set(this.accessors[i].get());
      return this;
    }
  }
}

Binding.prototype.addObserver = function(element, options, fx) {

}

function multiplex(accessorFx, cfg) {
  return function(selector, opt) {
    var elements;
    var binding = this;


    if (typeof(selector) == 'string') {
      elements = document.querySelectorAll(selector);
      elements = Array.prototype.slice.call(elements);
    } else if (selector instanceof HTMLElement) {
      elements = [ selector ];
    } else if (selector instanceof Array) {
      elements = selector;
    } else {
      throw new Error(selector + ' is of unknown type.')
    }

    elements.map(function(el) {
      var accessor = accessorFx(el, opt);
      binding.accessors.push(accessor);

      binding.observer.observe(el, cfg(el, opt));
    });
  }
}

Binding.prototype.text = multiplex(ElementAccessor.text, MuFilter.text);
Binding.prototype.html = multiplex(ElementAccessor.html, MuFilter.html);
Binding.prototype.classList = multiplex(ElementAccessor.classList, MuFilter.class);
Binding.prototype.hasClass = multiplex(ElementAccessor.hasClass, MuFilter.class);
Binding.prototype.noClass = multiplex(ElementAccessor.noClass, MuFilter.class);
Binding.prototype.attr = multiplex(ElementAccessor.attr, MuFilter.attr);
Binding.prototype.hasTruthyAttr = multiplex(ElementAccessor.hasTruthyAttr, MuFilter.attr);
Binding.prototype.noTruthyAttr = multiplex(ElementAccessor.noTruthyAttr, MuFilter.attr);
Binding.prototype.value = multiplex(ElementAccessor.value, MuFilter.value);
Binding.prototype.checked = multiplex(ElementAccessor.checked, MuFilter.checked);

Binding.prototype.unique = function(selector, opts) {
  var isUnique = function(el) {
    if (opts.attr) {
      return ElementAccessor.hasAttr(el,opts.attr);
    } else if (opts.class) {
      return ElementAccessor.hasClass(el,opts.class);
    }
  };

  var valueOf = function(el) {
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

  var elements = document.querySelectorAll(selector);

  var accessor = {
    get: function() {
      var filtered = elements.filter(function(el) { return isUnique(el).get() });
      return valueOf(filtered[0]);
    },
    set: function(val) {
      elements.map(function(el) {
        isUnique(el).set((valueOf(el) == val));
      });
    }
  };

  this.accessors.push(accessor);

  elements.map(function(el) {
    this.observer.observe(el,  MuFilter.unique(el, opts));
  });

  return accessor;
}
