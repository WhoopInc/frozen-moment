// for now, tests only run in environments that support `require` (e.g. Node)

var moment = require('./frozen-moment');

function assert(bool, str) {
  if (!bool) {
    throw new Error(str);
  }
}

assert(moment.fn.thaw === undefined, 'moment.fn does not provide thaw');

var mom1 = moment();
var mom2 = mom1.add(1, 'days');
assert(mom1 === mom2, 'non-frozen moment doesnt clone on modifications');

var momFrozen = mom1.freeze();
assert(momFrozen !== mom1, 'freezing a moment clones it, so theyre not the same ref');
assert(momFrozen.isFrozen(), 'frozen moment identifies as such');

mom2 = momFrozen.add(1, 'days');
assert(momFrozen !== mom2, 'frozen moment did clone, now two different moments');
assert(mom2.isAfter(momFrozen), 'and second moment is really later now');
assert(mom2.isFrozen(), 'secondary moment is still frozen');

var momThawed = momFrozen.thaw();
assert(momThawed !== momFrozen, 'thawing a moment clones it, so theyre not the same ref');
assert(!momThawed.isFrozen(), 'first moment is no longer frozen after thawing');

mom2 = momThawed.add(1, 'days');
assert(momThawed === mom2, 'thawed moment doesnt clone on modifications');

console.log('all tests passed');
