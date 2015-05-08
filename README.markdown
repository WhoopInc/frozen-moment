# Frozen Moment

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

Or maybe you're smarter than me, and yet you've
[still](https://github.com/moment/moment/pull/132)
[wished](https://github.com/moment/moment/issues/1107)
[that](https://github.com/moment/moment/issues/961)
Moment's
[API](https://github.com/moment/moment/issues/1737#issuecomment-47129996)
[was](https://github.com/moment/moment/issues/1661)
[immutable](https://github.com/moment/moment/pull/390).
It gets annoying to keep typing `moment.clone()` all the time.

Either way, this plugin is for you.

## API Reference:  What ~~does~~ _will_ it do?

Well... right now, this is just a README.  But I promise there will be code
here soon.  (If you want to help with writing the code, please let me know!)

Frozen Moment will be a plugin for Moment.js.  With Frozen Moment, all of your
normal moments will still work the same way they always have -- so you won't
need to adopt immutability throughout your entire codebase all at once.  Frozen
Moment simply adds a new method to every moment instance:

### `moment().freeze()`

Returns a "frozen" copy of the original moment.  "Frozen" moments will behave
exactly like normal moments, but all of the methods that would normally change
the value of a frozen moment will instead return a new frozen moment.

Basically, frozen moments will automatically call `moment.clone()` before you
try to call any of Moment's [setters](http://momentjs.com/docs/#/get-set/) or
[maniuplation](http://momentjs.com/docs/#/manipulate/) functions.  You'll also
get a new instance every time you change a frozen moment's locale.

For performance and compatibility reasons, frozen moments are **not** made
immutable with `Object.freeze`.  If you want to shoot yourself in the foot by
manually meddling with your frozen moment's internal data, go right ahead.
That said, frozen moments will be immutable as long as you only use Moment's
documented API methods.

Frozen moments will attempt to work with other Moment.js plugins, but I do not
guarantee that all plugins will behave correctly.

Frozen moments do not have the `freeze()` method -- only regular moments do.

### `frozenMoment.thaw()`

Returns a normal (un-frozen) copy of a frozen moment.

Regular old moments do not have a `thaw()` method -- only frozen moments do.

### `moment().isFrozen()` / `frozenMoment.isFrozen()`

Returns `true` if called on a frozen moment, and `false` if called on a
standard moment.

Note that `moment.isMoment()` will return `true` for frozen moments and normal
moments alike.

## Historical Note

The [original version](https://github.com/WhoopInc/frozen-moment-OLD) of Frozen
Moment was a full-fledged fork of Moment.js.  It is no longer maintained.

[Moment.js]: http://momentjs.com/
