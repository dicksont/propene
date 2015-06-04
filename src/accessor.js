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
  } else if (!className.match(rclass)){
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
  } else if (attr.match(rattrib)){
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
    el.className = el.className + ((el.className.trim().length > 0)? " " :"") + className;
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
  if (arr && el.classList) { /*  New Setter */
    var last = el.classList.length - 1;
    for (var i=last; i >= 0; i--) {
      el.classList.remove(el.classList[i]);
    }

    for (var i=0; i < arr.length; i++) {
      el.classList.add(arr[i]);
    }

  } else if (arr && el.className) { /*  Old Setter */
      el.className = arr.join(' ');
  } else if (el.classList) { /* New Getter */
      return Array.prototype.slice.call(el.classList);
  } else if (el.className) { /* Old Getter */
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
      var value = !boolean? 'true' : 'false';
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
