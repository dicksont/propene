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

  if (typeof module !== 'undefined' && module && module.exports) { // Node.js & CommonJS
    var isIojs = parseInt(process.version.match(/^v(\d+)\./)[1]) >= 1;

    if (!isIojs) throw new Error('QUnit tests for node require io.js.');
    var qunit = (typeof(QUnit) == "undefined")? require('qunitjs') : QUnit;

    var dirname = (typeof(__dirname) == "undefined")? "./" : __dirname;
    var fs = require('fs');
    var path = require('path');
    var txt = fs.readFileSync(path.resolve(dirname,'fixtures.html'), 'utf8');

    var jsdom = require('jsdom');
    var doc = jsdom.jsdom(txt);
    var win = doc.defaultView;

    win.propene = require('../dist/propene.js')(win);
    module.exports = factory(qunit, win);
  } else { // Browser
    factory(QUnit, window);
  }

})(function(QUnit, window) {

  var document = window.document;
  var propene = window.propene;



    function regExp(className) {
      return new RegExp('(^|\\s+)' + className + '(?=($|\\s+))');
    }


    function hasClass(el, className) {
      if (typeof(el) == 'string')
        el = document.querySelector(el);

      if (el.classList) {
        return el.classList.contains(className);
      } else if (el.className) {
        return !!~el.className.search(regExp(className));
      } else {
        throw new Error('Element ' + el + ' does not have classList or className properties.');
      }
    }

    function addClass(el, className) {
      if (typeof(el) == 'string')
        el = document.querySelector(el);

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
      if (typeof(el) == 'string')
        el = document.querySelector(el);

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
      if (typeof(el) == 'string')
        el = document.querySelector(el);

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

  Array.prototype.equals = Array.prototype.equals || function (array) {
    // if the other array is a falsy value, return
    if (!array)
      return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
      return false;

    for (var i = 0, l=this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this[i].equals(array[i]))
          return false;
        }
        else if (this[i] != array[i]) {
          // Warning - two different object instances will never be equal: {x:20} != {x:20}
          return false;
        }
    }
    return true;
  }

  QUnit.test('propene', function(assert) {
    var ui = {};
    assert.ok(propene != null, 'propene constructor exists');
    assert.ok(propene(ui,'property') != null, 'propene constructor accepts object property string');
  });


  QUnit.test('.text', function(assert) {
    var ui = {};

    propene(ui, 'div')
      .text('div.fixture.text');

    assert.equal(ui.div, "I'm a div.", "property returns text");

    ui.div = 'Hello world!';
    assert.equal(document.querySelector('div.fixture.text').innerText, "Hello world!", "assignment sets text");
  });


  QUnit.test('.html', function(assert) {
    var ui = {};

    propene(ui, 'html')
      .html('div.fixture.html');

    assert.equal(ui.html, "<b>I'm a div with HTML.</b>", "property returns html");

    ui.html = 'Hello world!';
    assert.equal(document.querySelector('div.fixture.html').innerHTML,"Hello world!", "assignment sets html");

  });

  QUnit.test('.classList', function(assert) {
    var ui = {};

    propene(ui, 'classList')
      .classList('div.fixture.clist');

    assert.ok(ui.classList.equals([ 'fixture', 'clist']), 'property returns classList');

    ui.classList = ['fixture', 'hello', 'world'];
    assert.ok(ui.classList.equals([ 'fixture', 'hello', 'world']), 'assignment sets classList');
  });

  QUnit.test('.hasClass', function(assert) {
    var ui = {};

    var div = document.querySelector('div.fixture.class');

    propene(ui, 'on')
      .hasClass(div, 'on');


    assert.equal(ui.on, true, 'property returns true if class is present');

    ui.on = false;

    assert.ok(!hasClass(div,'on'), ' false assignment removes class');

    ui.on = true;
    assert.ok(hasClass(div,'on'), ' true assignment adds class');

    removeClass(div, 'on');
    assert.equal(ui.on, false, 'property returns false if class is not present');
  });


  QUnit.test('.noClass', function(assert) {
    var ui = {};
    var div = document.querySelector('div.fixture.class');

    propene(ui, 'on')
      .noClass(div, 'off');

    assert.equal(ui.on, true,'property returns true if class is not present');

    ui.on = false;
    assert.ok(hasClass(div,'off'), ' false assignment adds class');

    ui.on = true;
    assert.ok(!hasClass(div,'off'), ' true assignment removes class');

    addClass(div, 'off');
    assert.equal(ui.on, false, 'property returns false if class is present');
  });


  QUnit.test('.attr', function(assert) {
    var ui = {};
    var div = document.querySelector('div.fixture.attr');

    propene(ui, 'color')
      .attr(div, 'data-color');

    assert.equal(ui.color, null, 'property returns null or undefined if attribute is not present');

    ui.color = 'red';
    assert.equal(div.getAttribute('data-color'), 'red', 'assignment changes value of attribute');
    assert.equal(ui.color, 'red', 'property returns value of attribute');
  });

  QUnit.test('.hasTruthyAttr', function(assert) {
    var ui = {};
    var div = document.querySelector('div.fixture.hattr');

    propene(ui, 'display')
      .hasTruthyAttr(div, 'data-display');

    assert.equal(ui.display, false, 'property returns false if attribute is not present');

    div.setAttribute('data-display', 'on');
    assert.equal(ui.display, true, 'property returns true if attribute is "yes"');

    div.setAttribute('data-display', '1');
    assert.equal(ui.display, true, 'property returns true if attribute is "1"');

    div.setAttribute('data-display', 'true');
    assert.equal(ui.display, true, 'property returns true if attribute is "true"');

    div.setAttribute('data-display', '');
    assert.equal(ui.display, true, 'property returns true if attribute is ""');

    div.setAttribute('data-display', 'no');
    assert.equal(ui.display, false, 'property returns false if attribute is "no"');

    div.setAttribute('data-display', '0');
    assert.equal(ui.display, false, 'property returns false if attribute is "0"');

    div.setAttribute('data-display', 'false');
    assert.equal(ui.display, false, 'property returns false if attribute is "false"');

    ui.display = true;
    assert.equal(ui.display, true, 'property can be set to true');
    assert.equal(div.getAttribute('data-display'), 'true', 'value of attribute is "true" when property is set to true');

    ui.display = false;
    assert.equal(ui.display, false, 'property can be set to false');
    assert.equal(div.getAttribute('data-display'), 'false', 'value of attribute is "false" when property is set to true');

  });

  QUnit.test('.noTruthyAttr', function(assert) {
    var ui = {};
    var div = document.querySelector('div.fixture.nattr');

    propene(ui, 'display')
      .noTruthyAttr(div, 'data-display');


    assert.equal(ui.display, true, 'property returns true if attribute is not present');

    div.setAttribute('data-display', 'on');
    assert.equal(ui.display, false, 'property returns false if attribute is "yes"');

    div.setAttribute('data-display', '1');
    assert.equal(ui.display, false, 'property returns false if attribute is "1"');

    div.setAttribute('data-display', 'true');
    assert.equal(ui.display, false, 'property returns false if attribute is "true"');

    div.setAttribute('data-display', '');
    assert.equal(ui.display, false, 'property returns true if attribute is ""');

    div.setAttribute('data-display', 'no');
    assert.equal(ui.display, true, 'property returns true if attribute is "no"');

    div.setAttribute('data-display', '0');
    assert.equal(ui.display, true, 'property returns true if attribute is "0"');

    div.setAttribute('data-display', 'false');
    assert.equal(ui.display, true, 'property returns true if attribute is "false"');

    ui.display = true;
    assert.equal(ui.display, true, 'property can be set to true');
    assert.equal(div.getAttribute('data-display'), 'false', 'value of attribute is "false" when property is set to true');

    ui.display = false;
    assert.equal(ui.display, false, 'property can be set to false');
    assert.equal(div.getAttribute('data-display'), 'true', 'value of attribute is "false" when property is set to false');
  });

  QUnit.test('.value', function(assert) {
    var ui = {};
    var fixtures = [ 'input.fixture[type="text"]', 'input.fixture[type="password"]', 'textarea.fixture'];

    for (var i=0; i < fixtures.length; i++) {
      var input = document.querySelector(fixtures[i]);

      propene(ui, 'text')
        .value(input);

      assert.equal(ui.text, 'hello', 'property can be read');

      ui.text = 'bye';
      assert.equal(input.value, 'bye', 'property can be assigned');
    }

    var select = document.querySelector('select.fixture')

    propene(ui, 'selection')
      .value(select);

    assert.equal(ui.selection, 'A', "property is the first value when no selection made");

    ui.selection = "A";
    assert.equal(select.value, "A", "changing property changes selection");

  });

  QUnit.load();
});
