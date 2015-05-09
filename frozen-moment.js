// Implementation:
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

// Test:
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
