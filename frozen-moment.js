(function (global, factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('moment'));
  } else if (typeof define === 'function' && define.amd) {
    define(['moment'], factory);
  } else {
    global.moment = factory(global.moment);
  }
}(this, function(moment) {

  var patchMethods = ['add', /* other methods here */];
  var frozenProto = Object.create(moment.fn);
  function frozenMethodGenerator(orig) {
    return function () {
      return orig.apply(this.freeze(), arguments);
    };
  }
  function mixin(dest, props) {
    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        dest[prop] = props[prop];
      }
    }
  }
  for (var i = 0, len = patchMethods.length; i < len; i++) {
    var methodToPatch = patchMethods[i];
    var originalMethod = moment.fn[methodToPatch];
    frozenProto[methodToPatch] = frozenMethodGenerator(originalMethod);
  }
  moment.fn.isFrozen = function () {
    return this.__frozen;
  };
  moment.fn.freeze = function () {
    var props = this.clone();
    var frozen = Object.create(frozenProto);
    mixin(frozen, props);
    return frozen;
  };
  frozenProto.thaw = function () {
    return this.clone();
  };
  frozenProto.__frozen = true;

  return moment;

}));
