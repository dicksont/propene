var defineUniqueId = require('define-uniqueid');

defineUniqueId(HTMLElement);

function Observer(binding) {
  this.binding = binding;
  this.mutob = new MutationObserver(this.handleMutations);
  this.cfglist = {};
  this.disconnected = true;
}

Observer.prototype.handleMutations = function(mutations) {
  console.log(mutations.target);
}

Observer.prototype.observe = function(el, cfg) {
  if (this.cfglist.hasOwnProperty(el.uniqueId)) {
    this.cfglist[el.uniqueId].merge(cfg);
  } else {
    this.cfglist[el.uniqueId] = cfg;
  };

  if (!this.disconnected)
    this.mutob.observe(el, cfg);
}
