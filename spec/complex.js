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
     var win = require('./setup.js').setupWindow('simple.html', function(win) {
       win.propene = require('../dist/propene.js')(win);
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

   QUnit.test('chaining', function(assert) {
     var ui = {};

     propene(ui, 'div')
       .hasClass('div.fixture.a', 'on')
       .hasClass('div.fixture.b', 'on');

     assert.equal(ui.div, false);
     assert.ok(!document.querySelector('div.fixture.a').classList.contains('on'));
     assert.ok(!document.querySelector('div.fixture.b').classList.contains('on'));

     ui.div = true;
     assert.ok(document.querySelector('div.fixture.a').classList.contains('on'));
     assert.ok(document.querySelector('div.fixture.b').classList.contains('on'));

   });

   QUnit.test('change', function(assert) {
     var ui = {};

     var count = 0;
     propene(ui, 'div')
       .hasClass('div.fixture.a', 'on')
       .change(function() {
         count++;
       });

     assert.equal(ui.div, false);
     ui.div = true;
     assert.equal(count, 1, "change callback called");

   });


 });
