# Frozen Moment

[![MIT License][license-image]][license-url] [![NPM version][npm-version-image]][npm-url] ![Bower version][bower-version-image]

[npm-version-image]: http://img.shields.io/npm/v/frozen-moment.svg?style=flat-square
[npm-url]: https://npmjs.org/package/frozen-moment

[bower-version-image]: https://img.shields.io/bower/v/frozen-moment.svg?style=flat-square

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: LICENSE

## Immutability for Moment.js

If you build large applications that use [Moment.js][], you've
[probably](https://github.com/moment/moment/issues/1754)
[been](https://github.com/moment/moment/issues/335)
[surprised](https://github.com/moment/moment/issues/832)
at some point by the mutability of moments.  Things like `moment.startOf("day")`
change the date of your original moment (instead of returning a new moment).
Unfortunately, this leads to subtle bugs if you pass moments around and then
start to do math on them while expecting other places to still have the old
value.

Or maybe you're smarter than me, and yet you still
[wish](https://github.com/moment/moment/issues/1107)
[that](https://github.com/moment/moment/issues/961)
[Moment](https://github.com/moment/moment/pull/132)
[had an](https://github.com/moment/moment/issues/1661)
[immutable](https://github.com/moment/moment/pull/390)
[API](https://github.com/moment/moment/issues/1737#issuecomment-47129996).
It gets annoying to keep typing `moment.clone()` all the time.

Either way, this plugin is for you.

## API Reference:  What does it do?

Frozen Moment is a plugin for Moment.js.  With Frozen Moment, all of your
normal moments will still work the same way they always have -- so you won't
need to adopt immutability throughout your entire codebase all at once.  Frozen
Moment simply adds a new method to every moment instance:

### Methods on Moment and Frozen Moment instances

#### `moment().freeze()`

Returns a "frozen" copy of the original moment.  "Frozen" moments will behave
exactly like normal moments, but all of the methods that would normally change
the value of a frozen moment will instead return a new frozen moment.

Basically, frozen moments will automatically call `moment.clone()` before you
try to call any of Moment's [setters](http://momentjs.com/docs/#/get-set/) or
[manipulation](http://momentjs.com/docs/#/manipulate/) functions.  You'll also
get a new instance every time you change a frozen moment's locale.

For performance and compatibility reasons, frozen moments are **not** made
immutable with `Object.freeze`.  If you want to shoot yourself in the foot by
manually meddling with your frozen moment's internal data, go right ahead.
That said, frozen moments will be immutable as long as you only use Moment's
documented API methods.

Frozen moments attempt to play nice with other Moment.js plugins, assuming that
the Frozen Moment plugin is loaded last and/or `moment.frozen.autowrap()` is
called after the last Moment plugin has been initialized.  That said, we cannot
guarantee that every plugin will behave correctly.  If you have problems using
Frozen Moment with any other Moment plugin, please [open an issue][] and we'll
work with the other plugin maintainer to resolve the incompatibility.

Frozen moments do not have the `freeze()` method -- only regular moments do.

#### `frozenMoment.thaw()`

Returns a normal (un-frozen) copy of a frozen moment.

Regular old moments do not have a `thaw()` method -- only frozen moments do.

#### `moment().isFrozen()` / `frozenMoment.isFrozen()`

Returns `true` if called on a frozen moment, and `false` if called on a
standard moment.

Note that `moment.isMoment()` will return `true` for frozen moments and normal
moments alike.

### Global configuration

#### `moment.frozen.fn`

This is the prototype for all frozen moment instances.  It inherits from
`moment.fn`, which is the prototype used for all Moment instances created by
the core library.

#### `moment.frozen.unwrap(methodNames...)`

Removes all existing wrappers for the named moment prototype function(s), and
whitelists those method names so that wrappers will not be re-created by
subsequent calls to `moment.frozen.autowrap()`.  This is a mechanism for
performance-optimizing plugin authors to whitelist methods that do not mutate
the moment instance, so that Frozen Moment will not automatically clone a new
instance every time those methods are invoked.

#### `moment.frozen.autowrap()`

Re-generates wrappers for all functions on the Moment prototype that have not
been explicitly whitelisted.  Some plugin authors may want to call this after
adding mutation methods to the Moment prototype, so that their users will not
need to load their plugin before Frozen Moment.  Alternatively, application
authors may wish to call this after loading their Moment plugins, to ensure
that all plugin methods are properly wrapped for immutable behavior.

## TODO

Frozen Moment should generally work, and it has been used by a few folks in
production applications.  The current v0.2 release is a feature complete
release candidate for v1.0.  Note, however, that we will not release v1.0
without a comprehensive suite of automated CI testing in Node and in Moment's
supported browsers.

Until we set up our automated CI builds, our maintainer is manually running our
unit tests in Node and a variety of browsers (IE 8 and the current releases of
Chrome, Firefox, and Safari) to ensure broad runtime compatibility.

Since Frozen Moment aims to be the Moment community's de-facto standard
solution for immutable Moment instances, we'd also love to see a bit wider
usage and feedback from the community before releasing v1.0.  If Frozen Moment
doesn't do what you need, or if you have technical reasons to prefer a
different API, we want your feedback!

Pull requests are enthusiastically welcomed for improvements on our
current [to-do list][].
If you have other ideas for new features, it's often a good idea to get our
feedback on your plans before you bother writing the code.  In any event, please remember to submit unit tests to verify your changes.

## Historical Note

The [original version](https://github.com/WhoopInc/frozen-moment-OLD) of Frozen
Moment was a full-fledged fork of Moment.js.  It is no longer maintained.

[Moment.js]: http://momentjs.com/
[open an issue]: https://github.com/WhoopInc/frozen-moment/issues/new
[to-do list]: https://github.com/WhoopInc/frozen-moment/labels/TODO