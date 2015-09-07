// for now, tests only run in environments that support `require` (e.g. Node)

var moment = require('./frozen-moment');

var numTests = 0;
function assert(bool, str) {
  numTests++;
  if (!bool) {
    throw new Error(str);
  }
}


// basic functionality

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


// prototype chain and moment.frozen.fn

if (Object.getPrototypeOf) {
  // TODO Is there a good way to assert the correct prototype chain in IE 8?
  assert(Object.getPrototypeOf(frozen) === moment.frozen.fn, 'published prototype is used for frozen instances');
  assert(Object.getPrototypeOf(frozenUtc) === moment.frozen.fn, 'published prototype is used for frozen UTC instances');
  assert(Object.getPrototypeOf(mom1) === moment.fn, 'non-frozen moment uses published prototype from moment core');
  assert(moment.frozen.fn !== moment.fn, 'frozen and non-frozen moments use different prototypes');
  assert(Object.getPrototypeOf(moment.frozen.fn) === moment.fn, 'frozen prototype extends non-frozen prototype');
}
moment.frozen.fn.__TEST_PROPERTY = true;
assert(frozen.__TEST_PROPERTY, 'existing frozen instances reflect changes to published prototype');
assert(!moment().__TEST_PROPERTY, 'non-frozen moments do not have properties from frozen prototype');


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
