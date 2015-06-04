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

module.exports = {

  setupWindow: function(htmlFile) {
    var isIojs = parseInt(process.version.match(/^v(\d+)\./)[1]) >= 1;

    if (!isIojs) throw new Error('testing on jsDom requires io.js.');


    var dirname = (typeof(__dirname) == "undefined")? "./" : __dirname;
    var fs = require('fs');
    var path = require('path');
    var txt = fs.readFileSync(path.resolve(dirname,htmlFile), 'utf8');

    var jsdom = require('jsdom');
    var doc = jsdom.jsdom(txt);
    var window = doc.defaultView;

    /* Stub for MutationObserver until it becomes available in jsdom */
    window.MutationObserver = function() {};

    window.propene = require('../dist/propene.js')(window);

    return window;
  }
}
