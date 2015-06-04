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

var MuFilter = {};

MuFilter.text = function(el) {
  return new ObserveCfg({
    characterData: true,
    childList: true
  });
}
MuFilter.html = function(el) {
  return new ObserveCfg({
    characterData: true,
    childList: true,
    subtree: true
  });
}

MuFilter.class = function(el, className) {
  return new ObserveCfg({
    attributes: true,
    attributeFilter: [ 'class' ]
  });
}

MuFilter.attr = function(el, attrName) {
  return new ObserveCfg({
    attributes: true,
    attributeFilter: [ attrName ]
  });
};

MuFilter.value = function(el) {
  return new ObserveCfg({
    attributes: true,
    attributeFilter: [ 'value' ]
  });
};

MuFilter.checked = function(el) {
  return new ObserveCfg({
    attributes: true,
    attributeFilter: [ 'checked' ]
  });
};


MuFilter.unique = function(el, opts) {
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

function ObserveCfg(cfg) {
  if (cfg) this.merge(cfg);
}

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
    for(var i=0; i < cfg.attributeFilter.length; i++) {
      this.addAttr(cfg.attributeFilter[i]);
    }
  }

}
