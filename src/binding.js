function getElement(selector) {
  if (selector instanceof HTMLElement) return selector;
  if (typeof(selector) == 'string')
    return document.querySelector(selector);

  throw new Error('Unable to get element for' + selector);
}

function Binding(obj, prop) {
    Object.defineProperty(obj, prop, {
      get: this.get.bind(this),
      set: this.set.bind(this)
    }
    this.accessors = [];
    this.observer = new Observer(this);
}

Binding.prototype.get = function() {
  return (this.accessors[0] == undefined || this.accessors[0].length == 0)? null : this.accessors[0].get();
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

var multiplex = function(accessorFx, cfg) {
  return function(selector, opt) {
    var elements = document.querySelectorAll(selector);
    elements.map(function(el) {
      var accessor = accessorFx(el, opt);
      this.accessors.push(accessor);

      this.observer.observe(el, cfg(el, opt));
    });
  }
}

Binding.prototype.text = multiplex(ElementAccessor.text, MuFilter.text);
Binding.prototype.html = multiplex(ElementAccessor.html, MuFilter.html);
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
