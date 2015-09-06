(function (global, factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('moment'));
  } else if (typeof define === 'function' && define.amd) {
    define(['moment'], factory);
  } else {
    global.moment = factory(global.moment);
  }
}(this, function (moment) {
  
  var create = Object.create || function(proto) {
    var obj = {};
    obj.__proto__ = proto;
  
    return obj;
  };
  
  var includes = Array.prototype.includes.call.bind(Array.prototype.includes) || function(arr, value){
    var l = arr.length, i = 0; 
    while(i < l){
      if(arr[i] === value){
        return true;
      }
    }
    return false;
  };

  var immutableMethods = [
    // Get
    'weeksInYear',
    'isoWeeksInYear',
    'get',
    'max',
    'min',
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

  // moment has a lot of overloaded getters and setters, where calling the
  // method with no arguments will run an immutable getter, and calling the
  // method with one or more arguments will run a mutating setter.
  var mutatorsIfArguments = [
    // Get + Set
    'millisecond', 'milliseconds',
    'second', 'seconds',
    'minute', 'minutes',
    'hour', 'hours',
    'date', 'dates',
    'day', 'days',
    'weekday',
    'isoWeekday',
    'dayOfYear',
    'week', 'weeks',
    'isoWeek', 'isoWeeks',
    'month', 'months',
    'quarter',
    'year', 'years',
    'weekYear',
    'isoWeekYear',
    'set'
  ];

  function frozenMethodGenerator(orig) {
    return function () {
      return orig.apply(this.freeze(), arguments);
    };
  }
  function frozenIfArgumentsMethodGenerator(orig) {
    return function () {
      if (arguments.length) {
        return orig.apply(this.freeze(), arguments);
      }
      return orig.apply(this);
    };
  }
  function mixin(dest, props) {
    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        dest[prop] = props[prop];
      }
    }
  }

  var frozenProto = create(moment.fn);
  for (var key in moment.fn) {
    var func = moment.fn[key];

    if (moment.fn.hasOwnProperty(key)
        && typeof func === 'function'
        && !contains(immutableMethods, key)) {

      if (!contains(mutatorsIfArguments, key)) {
        frozenProto[key] = frozenMethodGenerator(func);
      } else {
        frozenProto[key] = frozenIfArgumentsMethodGenerator(func);
      }

    }
  }
  frozenProto.thaw = function () {
    return this.clone();
  };
  frozenProto.isFrozen = function () {
    return true;
  };

  moment.fn.isFrozen = function () {
    return false;
  };
  moment.fn.freeze = function () {
    var props = moment.fn.clone.apply(this);
    var frozen = create(frozenProto);
    mixin(frozen, props);
    return frozen;
  };

  moment.frozen = function () {
    return moment.apply(this, arguments).freeze();
  };
  moment.frozenUtc = function () {
    return moment.utc.apply(this, arguments).freeze();
  };

  return moment;

}));
