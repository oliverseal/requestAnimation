(function() {
  /**
   * `requestAnimation` kicks off your animation and manages the basic variables (like start time and such) for you.
   * This mimics `requestAnimationFrame` (and uses it) style of creating animations with a simple layer on top of it 
   * to keep heavily animated pieces from getting overrun with variables related just to animation.
   *
   * To cancel an animation, call the browser-native `cancelAnimationFrame` and pass it the `id` property provided to the `callback` function.
   * This method will also the tick value on your `requestAnimationFrame` callbacks across multiple browsers to use `performance.now()`.
   *
   *
   * Parameters:
   *   callback   - _required_ Function. Called on every frame. Use `bind` to lock the scope of this guy to whatever you need.
   *                                     First argument for this function will be `performance.now()` - just like a `requestAnimationFrame` callback.
   *                                     Second argument is info about this animation: `{id, start, projectedEnd, duration, progress}`
   *   duration   - _required_ int.      If using time as the measurement, duration should be in milliseconds. Animation ends when the time elapsed is equal to the duration.
   *   endCallback- _optional_ Function. Called when animation has finished. Use this if you want to daisy-chain.
   *   useTime    - _optional_ Boolean.  Defaults to `true`. 
   *                                     If set to `true` then the `startValue` defaults to the value of `performance.now()` or `new Date().valueOf()` (depending on browser).
   *                                     If set to `false` then the `startValue` must be set or animations will be requested indefinitely.
   *                                     If set to `false`, then the animation stops when the `startValue` + {ticks/milliseconds passed} == `duration`
   *   startValue - _optional_ Number.   If `useTime` is set to `true`, this will be set to the time at function call. Otherwise the developer can set this to an arbitrary number.
   *                                     The main purpose of this is for "time-based" or "frame-based" animation. With "frame-based" animation, you can insure that every frame is 
   *                                     rendered. 
   *   increment  - _optional_ Number.   Defaults to 1. This is essentially ignored if `useTime` is set to true. Used for "frame-based" animation or linear tweens.
   */
  window.requestAnimation = function(callback, duration, endCallback, useTime, startValue, increment) {
    var onTimeTick, 
        onArbitraryTick, 
        startTime,
        endTime,
        endValue,
        currentValue,
        progress,
        id;

    useTime = (useTime == undefined) ? true : false;
    // undocument default to 1 second.
    duration = duration || 1000;

    // using two separate functions determined at the moment of request executes more efficiently, though it looks ugly here.

    // time based animations -- what will probably be the most common use-case
    if (useTime) {
      startTime = performance.now();
      endTime = startTime + duration;

      onTimeTick = function() {
        var tick,progress;

        tick = performance.now();
        progress = tick - startTime;
        
        // if we're within our duration, request a new frame.
        if (progress < duration) {
          id = requestAnimationFrame(onTimeTick);
          // this is duplicated in the else statement because we might have an endCallback. It's still efficient, though it looks messy.
          callback(tick, {id: id, progress: progress, start: startTime, projectedEnd: endTime, duration: duration });
        } else {
          // jump to the last part 
          // Yes, this means that `id` is null if we're on the last frame and not requesting another.
          callback(tick, {id: null, progress: duration, start: startTime, projectedEnd: endTime, duration: duration });

          if (endCallback) endCallback();
        }

        return id;
      }

      return onTimeTick();
    } 

    // arbitrary mechanism or "frame-based" animations
    else {
      startValue = startValue || 0;
      increment = increment || 1;
      endValue = startValue + duration;
      progress = startValue;

      onArbitraryTick = function() {
        var tick;

        tick = performance.now();
        
        // if we're within our duration, request a new frame.
        if (progress < endValue) {
          id = requestAnimationFrame(onArbitraryTick);
          // this is duplicated in the else statement because we might have an endCallback. It's still efficient, though it looks messy.
          callback(tick, {id: id, progress: progress, start: startTime, projectedEnd: null, duration: duration });
        } else {
          // jump to the last part and set the time.
          progress = endValue;
          // jump to the last part 
          // Yes, this means that `id` is null if we're on the last frame and not requesting another.
          callback(tick, {id: null, progress: endValue, start: startTime, projectedEnd: null, duration: duration });

          if (endCallback) endCallback();
        }


        // increment down here so we can get a callback at the `startValue` and at the `endValue`
        progress += increment;

        return id;
      }

      return onArbitraryTick();
    }
  }

}());






// http://paulirish.com/2011/requestanimationframe-for-smart-animating
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license

(function() {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

// relies on Date.now() which has been supported everywhere modern for years.
// as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values
 
(function(){
 
  // prepare base perf object
  if (typeof window.performance === 'undefined') {
      window.performance = {};
  }
 
  if (!window.performance.now){
    
    var nowOffset = new Date().valueOf();
 
    if (performance.timing && performance.timing){
      nowOffset = performance.timing.navigationStart
    }
 
 
    window.performance.now = function now(){
      return Date.now() - nowOffset;
    }
 
  }
 
})();