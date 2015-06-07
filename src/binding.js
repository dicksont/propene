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
  return (this.accessors[0] === undefined || this.accessors[0].length == 0)? null : this.accessors[0].get();
}

Binding.prototype.notifyChange = function() {
  if (!this.changeList) return;
  for (var i=0; i < this.changeList.length; i++) {
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
    elements = [ selector ];
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
      return ElementAccessor.hasAttr(el,opts.attr);
    } else if (opts.class) {
      return ElementAccessor.hasClass(el,opts.class);
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
      var filtered = elements.filter(function(el) { return isUnique(el).get() });
      return valueOf(filtered[0]);
    },
    set: function(val) {
      elements.map(function(el) {
        isUnique(el).set((valueOf(el) == val));
      });
    }
  });

  elements.map(function(el) {
    this.observer.observe(el,  ObserveCfg.unique(el, opts));
  });

  return this;
}
