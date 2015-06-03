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
  };
});

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

ObserveCfg.prototype.addAttr(attrName) {
  this.attributes = true;

  if (this.attributeFilter == null) this.attributeFilter = [];

  if (!~this.attributeFilter.indexOf(attrName))
    this.attributeFilter.push(attrName);
}

ObserveCfg.prototype.addCData() {
  this.childList = true;
  this.characterData = true;
}

ObserveCfg.prototype.merge(cfg) {

  if (cfg.attributes) this.attributes = true;
  if (cfg.characterData) this.characterData = true;
  if (cfg.childList) this.childList = true;

  if (cfg.attributeFilter) {
    for(var i=0; i < cfg.attributeFilter.length; i++) {
      this.addAttr(cfg.attributeFilter[i]);
    }
  }

}
