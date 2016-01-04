// for now, tests only run in environments that support `require` (e.g. Node)

var moment = require('./frozen-moment');

var numTests = 0;
function assert(bool, str) {
  numTests++;
  if (!bool) {
    throw new Error(str);
  }
}


// basic moment functionality

assert(moment.fn.thaw === undefined, 'moment.fn does not provide thaw');

var mom1 = moment();
var mom2 = mom1.add(1, 'days');
assert(mom1 === mom2, 'non-frozen moment doesnt clone on modifications');

var momFrozen = mom1.freeze();
assert(momFrozen !== mom1, 'freezing a moment clones it, so theyre not the same ref');
assert(momFrozen.isFrozen() === true, 'frozen moment identifies as such');
assert(moment.isMoment(momFrozen) === true, 'frozen moment is still a moment');

mom2 = momFrozen.add(1, 'days');
assert(momFrozen !== mom2, 'frozen moment did clone, now two different moments');
assert(mom2.isAfter(momFrozen), 'and second moment is really later now');
assert(mom2.isFrozen() === true, 'secondary moment is still frozen');

var momThawed = momFrozen.thaw();
assert(momThawed !== momFrozen, 'thawing a moment clones it, so theyre not the same ref');
assert(momThawed.isFrozen() === false, 'first moment is no longer frozen after thawing');

mom2 = momThawed.add(1, 'days');
assert(momThawed === mom2, 'thawed moment doesnt clone on modifications');

var frozen = moment.frozen();
var frozen2 = frozen.add(1, 'days');
assert(frozen !== frozen2, 'frozen did clone, now two different moments');
assert(frozen2.isAfter(frozen), 'and second moment is really later now');
assert(frozen.isFrozen() === true, 'first frozen identifies itself properly');
assert(frozen2.isFrozen() === true, 'and the second frozen also identifies properly');

var frozenUtc = moment.frozenUtc();
var frozenUtc2 = frozenUtc.add(1, 'days');
assert(frozenUtc !== frozenUtc2, 'frozenUtc did clone, now two different moments');
assert(frozenUtc2.isAfter(frozenUtc), 'and second moment is really later now');
assert(frozenUtc.utcOffset() === 0, 'frozenUtc is actually in UTC');
assert(frozenUtc.isFrozen() === true, 'first frozenUtc identifies itself properly');
assert(frozenUtc2.isFrozen() === true, 'and the second frozenUtc also identifies properly');

var frozenClone = frozen.clone();
assert(frozenClone !== frozen, 'cloning frozen moment returns a new instance');
assert(frozenClone.thaw, 'cloning frozen moment creates another frozen moment');
frozenClone.add(1, 'days');
assert(frozenClone.isSame(frozen), 'mutators do not change value of cloned frozen moment');

var frozenStartOfYear = moment.frozen('2015-11-09T09:44:04').startOf('year');
assert(frozenStartOfYear.valueOf() === moment('2015-01-01T00:00:00').valueOf(), 'start of year is calculated accurately');

assert(frozenStartOfYear.format().substr(0, 19) === '2015-01-01T00:00:00', 'format works with frozen moment')


// basic duration functionality

assert(moment.duration.fn.thaw === undefined, 'moment.duration.fn does not provide thaw');

var duration = moment.duration(30000);
assert(duration.asSeconds() === 30, 'duration is created correctly');
duration.add(15, 'seconds');
assert(duration.asSeconds() === 45, 'non-frozen duration does not clone on modifications');
assert(duration.isFrozen() === false, 'non-frozen duration is not frozen');

var frozenDuration = duration.freeze();
assert(duration !== frozenDuration, 'freezing a duration returns a new object reference');
assert(frozenDuration.asSeconds() === 45, 'duration value is unchanged after freezing');
assert(frozenDuration.isFrozen() === true, 'frozen duration identifies as such');
assert(moment.isDuration(frozenDuration) === true, 'frozen duration is still a duration');

var frozenDuration2 = frozenDuration.add(15, 'seconds');
assert(frozenDuration !== frozenDuration2, 'adding to frozen moment returns new instance');
assert(frozenDuration2.isFrozen() === true, 'result of addition is still frozen');
assert(frozenDuration2.asSeconds() === 60, 'can add to frozen duration');
assert(frozenDuration.asSeconds() === 45, 'frozen duration value is unchanged by addition');

var thawedDuration = frozenDuration.thaw();
assert(thawedDuration !== frozenDuration, 'thawing duration returns new instance');
assert(thawedDuration.asSeconds() === 45, 'value does not change when thawing');
assert(thawedDuration.isFrozen() === false, 'thawed duration is not frozen');
thawedDuration.subtract(15, 'seconds');
assert(thawedDuration.asSeconds() === 30, 'subtracting from thawed duration mutates existing instance');
assert(frozenDuration.asSeconds() === 45, 'frozen duration is unchanged when mutating thawed');


// prototype chain and moment.frozen.fn

if (Object.getPrototypeOf) {
  // TODO Is there a good way to assert the correct prototype chain in IE 8?
  assert(Object.getPrototypeOf(frozen) === moment.frozen.fn, 'published prototype is used for frozen instances');
  assert(Object.getPrototypeOf(frozenUtc) === moment.frozen.fn, 'published prototype is used for frozen UTC instances');
  assert(Object.getPrototypeOf(mom1) === moment.fn, 'non-frozen moment uses published prototype from moment core');
  assert(moment.frozen.fn !== moment.fn, 'frozen and non-frozen moments use different prototypes');
  assert(Object.getPrototypeOf(moment.frozen.fn) === moment.fn, 'frozen prototype extends non-frozen prototype');

  assert(Object.getPrototypeOf(frozenDuration) === moment.frozenDuration.fn, 'published prototype is used for frozen durations');
  assert(Object.getPrototypeOf(duration) === moment.duration.fn, 'non-frozen duration prototype from upstream moment');
  assert(moment.duration.fn !== moment.frozenDuration.fn, 'frozen and un-frozen durations use different prototypes');
  assert(Object.getPrototypeOf(moment.frozenDuration.fn) === moment.duration.fn, 'frozen duration prototype extends non-frozen prototype');
}

moment.frozen.fn.__TEST_PROPERTY = true;
assert(frozen.__TEST_PROPERTY, 'existing frozen instances reflect changes to published prototype');
assert(!moment().__TEST_PROPERTY, 'non-frozen moments do not have properties from frozen prototype');

moment.frozenDuration.fn.__TEST_PROPERTY = true;
assert(frozenDuration.__TEST_PROPERTY, 'existing frozen durations reflect changes to published prototype');
assert(!moment.duration().__TEST_PROPERTY, 'non-frozen durations do not have properties from frozen prototype');


// autowrap and unwrap - integrating third-party plugins that mutate moments

moment.fn.addFive = function () {
  return moment.fn.add.call(this, 5, 'milliseconds');
};
var mutatedFrozen = frozen.clone();
assert(mutatedFrozen.addFive() === mutatedFrozen, 'ill-behaved plugin returns same instance');
assert(mutatedFrozen - 5 === +frozen, 'ill-behaved plugin mutates frozen moment');

moment.frozen.autowrap();
mutatedFrozen = frozen.clone();
assert(mutatedFrozen.addFive() !== mutatedFrozen, 'wrapped plugin method returns a new instance');
assert(mutatedFrozen.addFive() - 5 === +frozen, 'wrapped plugin method returns instance with new value');

moment.frozen.unwrap("addFive");
mutatedFrozen = frozen.clone();
assert(mutatedFrozen.addFive() === mutatedFrozen, 'unwrapped plugin returns same instance');
assert(mutatedFrozen - 5 === +frozen, 'unwrapped plugin mutates frozen moment');


// final status report

console.log('all ' + numTests + ' tests passed');
