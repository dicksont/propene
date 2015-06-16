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
    var qunit = (typeof(QUnit) == "undefined")? require('qunitjs') : QUnit;

    require('./setup.js').setupWindow('simple.html', function(win) {
      win.propene = require('../dist/propene.js')(win);

      var arrload = require('array-etc');
      arrload(['equals']);

      module.exports = factory(qunit, win);
    });
  } else { // Browser
    factory(QUnit, window);
  }

})(function(QUnit, window) {

  var document = window.document;
  var propene = window.propene;


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

    assert.ok(!div.classList.contains('on'), ' false assignment removes class');

    ui.on = true;
    assert.ok(div.classList.contains('on'), ' true assignment adds class');

    div.classList.remove('on');
    assert.equal(ui.on, false, 'property returns false if class is not present');
  });


  QUnit.test('.noClass', function(assert) {
    var ui = {};
    var div = document.querySelector('div.fixture.class');

    propene(ui, 'on')
      .noClass(div, 'off');

    assert.equal(ui.on, true,'property returns true if class is not present');

    ui.on = false;
    assert.ok(div.classList.contains('off'), ' false assignment adds class');

    ui.on = true;
    assert.ok(!div.classList.contains('off'), ' true assignment removes class');

    div.classList.add('off');
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
