`requestAnimation` kicks off your animation and manages the basic variables (like start time and such) for you.

This mimics `requestAnimationFrame` (and uses it) style of creating animations with a simple layer on top of it 
to keep heavily animated pieces from getting overrun with variables related just to animation.

To cancel an animation, call the browser-native `cancelAnimationFrame` and pass it the `id` property provided to the `callback` function.

This method will also the tick value on your `requestAnimationFrame` callbacks across multiple browsers to use `performance.now()`.

Parameters:

|Parameter | Required   | Type      | Description |
|:---------|:-----------|:----------|:------------|
|callback  | _required_ | Function. | Called on every frame. Use `bind` to lock the scope of this guy to whatever you need. First argument for this function will be `performance.now()` - just like a `requestAnimationFrame` callback. Second argument is info about this animation: `{id, startTime, endTime, duration, progress}`
|duration  | _required_ | int.      | If using time as the measurement, duration should be in milliseconds. Animation ends when the time elapsed is equal to the duration.
|endCallback | _optional_ | Function. | Called when the animation is complete. Use this for daisy-chaining/queuing.
|useTime   | _optional_ | Boolean.  | Defaults to `true`. If set to `true` then the `startValue` defaults to the value of `performance.now()` or `new Date().valueOf()` (depending on browser).If set to `false` then the `startValue` must be set or animations will be requested indefinitely.If set to `false`, then the animation stops when the `startValue` + {ticks/milliseconds passed} == `duration`
|startValue| _optional_ | Number.   | If `useTime` is set to `true`, this will be set to the time at function call. Otherwise the developer can set this to an arbitrary number. The main purpose of this is for "time-based" or "frame-based" animation. With "frame-based" animation, you can insure that every frame is rendered. 
|increment | _optional_ | Number.   | Defaults to 1. This is essentially ignored if `useTime` is set to true. Used for "frame-based" animation.