(function (global, factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('moment'));
  } else if (typeof define === 'function' && define.amd) {
    define(['moment'], factory);
  } else {
    global.moment = factory(global.moment);
  }
}(this, function(moment) {

  var immutableMethods = [
    // Display
    'format',
    'fromNow',
    'from',
    'calendar',
    'diff',
    'valueOf',
    'unix',
    'daysInMonth',
    'toArray',
    'toJSON',
    'toISOString',
    // Query
    'isBefore',
    'isSame',
    'isAfter',
    'isBetween',
    'isLeapYear',
    'isDST',
    'isDSTShifted'
  ];

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

  for (var key in moment.fn) {
    var func = moment.fn[key];
    if (moment.fn.hasOwnProperty(key) && typeof func === 'function') {
      if (immutableMethods.indexOf(key) === -1) {
        frozenProto[key] = frozenMethodGenerator(func);
      }
    }
  }
  moment.fn.isFrozen = function () {
    return this.__frozen;
  };
  moment.fn.freeze = function () {
    var props = moment.fn.clone.apply(this);
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
