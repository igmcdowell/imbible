(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/iangm/Code/imbible/node_modules/babel-polyfill/lib/index.js":[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("babel-regenerator-runtime");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"babel-regenerator-runtime":"/Users/iangm/Code/imbible/node_modules/babel-regenerator-runtime/runtime.js","core-js/shim":"/Users/iangm/Code/imbible/node_modules/core-js/shim.js"}],"/Users/iangm/Code/imbible/node_modules/babel-regenerator-runtime/runtime.js":[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument
        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
        : Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            return result;
          });
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return invoke(method, arg);
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : new Promise(function (resolve) {
          resolve(callInvokeWithMethodAndArg());
        });
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          context._sent = arg;

          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }
        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":"/Users/iangm/Code/imbible/node_modules/process/browser.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.a-function.js":[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.add-to-unscopables.js":[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./$.wks')('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)require('./$.hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"./$.hide":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.hide.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js":[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-copy-within.js":[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./$.to-object')
  , toIndex  = require('./$.to-index')
  , toLength = require('./$.to-length');

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , $$    = arguments
    , end   = $$.length > 2 ? $$[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};
},{"./$.to-index":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-index.js","./$.to-length":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-length.js","./$.to-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-fill.js":[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./$.to-object')
  , toIndex  = require('./$.to-index')
  , toLength = require('./$.to-length');
module.exports = [].fill || function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , $$     = arguments
    , $$len  = $$.length
    , index  = toIndex($$len > 1 ? $$[1] : undefined, length)
    , end    = $$len > 2 ? $$[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};
},{"./$.to-index":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-index.js","./$.to-length":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-length.js","./$.to-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-includes.js":[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./$.to-iobject')
  , toLength  = require('./$.to-length')
  , toIndex   = require('./$.to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"./$.to-index":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-index.js","./$.to-iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-iobject.js","./$.to-length":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-length.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-methods.js":[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./$.ctx')
  , IObject  = require('./$.iobject')
  , toObject = require('./$.to-object')
  , toLength = require('./$.to-length')
  , asc      = require('./$.array-species-create');
module.exports = function(TYPE){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? asc($this, length) : IS_FILTER ? asc($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./$.array-species-create":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-species-create.js","./$.ctx":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.ctx.js","./$.iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iobject.js","./$.to-length":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-length.js","./$.to-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-species-create.js":[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var isObject = require('./$.is-object')
  , isArray  = require('./$.is-array')
  , SPECIES  = require('./$.wks')('species');
module.exports = function(original, length){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return new (C === undefined ? Array : C)(length);
};
},{"./$.is-array":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-array.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.classof.js":[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.cof.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.cof.js":[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection-strong.js":[function(require,module,exports){
'use strict';
var $            = require('./$')
  , hide         = require('./$.hide')
  , redefineAll  = require('./$.redefine-all')
  , ctx          = require('./$.ctx')
  , strictNew    = require('./$.strict-new')
  , defined      = require('./$.defined')
  , forOf        = require('./$.for-of')
  , $iterDefine  = require('./$.iter-define')
  , step         = require('./$.iter-step')
  , ID           = require('./$.uid')('id')
  , $has         = require('./$.has')
  , isObject     = require('./$.is-object')
  , setSpecies   = require('./$.set-species')
  , DESCRIPTORS  = require('./$.descriptors')
  , isExtensible = Object.isExtensible || isObject
  , SIZE         = DESCRIPTORS ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.ctx":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.ctx.js","./$.defined":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.defined.js","./$.descriptors":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.descriptors.js","./$.for-of":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.for-of.js","./$.has":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.has.js","./$.hide":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.hide.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.iter-define":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-define.js","./$.iter-step":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-step.js","./$.redefine-all":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine-all.js","./$.set-species":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-species.js","./$.strict-new":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.strict-new.js","./$.uid":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.uid.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection-to-json.js":[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = require('./$.for-of')
  , classof = require('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.classof.js","./$.for-of":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.for-of.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection-weak.js":[function(require,module,exports){
'use strict';
var hide              = require('./$.hide')
  , redefineAll       = require('./$.redefine-all')
  , anObject          = require('./$.an-object')
  , isObject          = require('./$.is-object')
  , strictNew         = require('./$.strict-new')
  , forOf             = require('./$.for-of')
  , createArrayMethod = require('./$.array-methods')
  , $has              = require('./$.has')
  , WEAK              = require('./$.uid')('weak')
  , isExtensible      = Object.isExtensible || isObject
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for frozen keys
var frozenStore = function(that){
  return that._l || (that._l = new FrozenStore);
};
var FrozenStore = function(){
  this.a = [];
};
var findFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
FrozenStore.prototype = {
  get: function(key){
    var entry = findFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findFrozen(this, key);
  },
  set: function(key, value){
    var entry = findFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = id++;      // collection id
      that._l = undefined; // leak store for frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this)['delete'](key);
        return $has(key, WEAK) && $has(key[WEAK], this._i) && delete key[WEAK][this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this).has(key);
        return $has(key, WEAK) && $has(key[WEAK], this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    if(!isExtensible(anObject(key))){
      frozenStore(that).set(key, value);
    } else {
      $has(key, WEAK) || hide(key, WEAK, {});
      key[WEAK][that._i] = value;
    } return that;
  },
  frozenStore: frozenStore,
  WEAK: WEAK
};
},{"./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.array-methods":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-methods.js","./$.for-of":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.for-of.js","./$.has":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.has.js","./$.hide":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.hide.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.redefine-all":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine-all.js","./$.strict-new":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.strict-new.js","./$.uid":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.uid.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection.js":[function(require,module,exports){
'use strict';
var global         = require('./$.global')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , redefineAll    = require('./$.redefine-all')
  , forOf          = require('./$.for-of')
  , strictNew      = require('./$.strict-new')
  , isObject       = require('./$.is-object')
  , fails          = require('./$.fails')
  , $iterDetect    = require('./$.iter-detect')
  , setToStringTag = require('./$.set-to-string-tag');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO;
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        strictNew(target, C, NAME);
        var that = new Base;
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    IS_WEAK || instance.forEach(function(val, key){
      BUGGY_ZERO = 1 / key === -Infinity;
    });
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js","./$.for-of":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.for-of.js","./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.iter-detect":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-detect.js","./$.redefine":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine.js","./$.redefine-all":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine-all.js","./$.set-to-string-tag":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-to-string-tag.js","./$.strict-new":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.strict-new.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.core.js":[function(require,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.ctx.js":[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.a-function.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.defined.js":[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.descriptors.js":[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.dom-create.js":[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.enum-keys.js":[function(require,module,exports){
// all enumerable object keys, includes symbols
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js":[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , hide      = require('./$.hide')
  , redefine  = require('./$.redefine')
  , ctx       = require('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own)redefine(target, key, out);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.core.js","./$.ctx":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.ctx.js","./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.hide":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.hide.js","./$.redefine":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails-is-regexp.js":[function(require,module,exports){
var MATCH = require('./$.wks')('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};
},{"./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js":[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fix-re-wks.js":[function(require,module,exports){
'use strict';
var hide     = require('./$.hide')
  , redefine = require('./$.redefine')
  , fails    = require('./$.fails')
  , defined  = require('./$.defined')
  , wks      = require('./$.wks');

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , original = ''[KEY];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, exec(defined, SYMBOL, original));
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return original.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return original.call(string, this); }
    );
  }
};
},{"./$.defined":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.defined.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js","./$.hide":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.hide.js","./$.redefine":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.flags.js":[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./$.an-object');
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};
},{"./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.for-of.js":[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.ctx":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.ctx.js","./$.is-array-iter":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-array-iter.js","./$.iter-call":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-call.js","./$.to-length":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-length.js","./core.get-iterator-method":"/Users/iangm/Code/imbible/node_modules/core-js/modules/core.get-iterator-method.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.get-names.js":[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./$.to-iobject')
  , getNames  = require('./$').getNames
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.to-iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-iobject.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js":[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.has.js":[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.hide.js":[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.descriptors":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.descriptors.js","./$.property-desc":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.property-desc.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.html.js":[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.invoke.js":[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iobject.js":[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.cof.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-array-iter.js":[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./$.iterators')
  , ITERATOR   = require('./$.wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./$.iterators":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iterators.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-array.js":[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.cof.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-integer.js":[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./$.is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js":[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-regexp.js":[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./$.is-object')
  , cof      = require('./$.cof')
  , MATCH    = require('./$.wks')('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
},{"./$.cof":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.cof.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-call.js":[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-create.js":[function(require,module,exports){
'use strict';
var $              = require('./$')
  , descriptor     = require('./$.property-desc')
  , setToStringTag = require('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.hide":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.hide.js","./$.property-desc":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.property-desc.js","./$.set-to-string-tag":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-to-string-tag.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-define.js":[function(require,module,exports){
'use strict';
var LIBRARY        = require('./$.library')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , hide           = require('./$.hide')
  , has            = require('./$.has')
  , Iterators      = require('./$.iterators')
  , $iterCreate    = require('./$.iter-create')
  , setToStringTag = require('./$.set-to-string-tag')
  , getProto       = require('./$').getProto
  , ITERATOR       = require('./$.wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if($native){
    var IteratorPrototype = getProto($default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    // fix Array#{values, @@iterator}.name in V8 / FF
    if(DEF_VALUES && $native.name !== VALUES){
      VALUES_BUG = true;
      $default = function values(){ return $native.call(this); };
    }
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES  ? $default : getMethod(VALUES),
      keys:    IS_SET      ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod('entries')
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.has":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.has.js","./$.hide":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.hide.js","./$.iter-create":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-create.js","./$.iterators":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iterators.js","./$.library":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.library.js","./$.redefine":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine.js","./$.set-to-string-tag":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-to-string-tag.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-detect.js":[function(require,module,exports){
var ITERATOR     = require('./$.wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-step.js":[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iterators.js":[function(require,module,exports){
module.exports = {};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js":[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.keyof.js":[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.to-iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-iobject.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.library.js":[function(require,module,exports){
module.exports = false;
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.math-expm1.js":[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
module.exports = Math.expm1 || function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.math-log1p.js":[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.math-sign.js":[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.microtask.js":[function(require,module,exports){
var global    = require('./$.global')
  , macrotask = require('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain, fn;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    fn     = head.fn;
    if(domain)domain.enter();
    fn(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// environments with maybe non-completely correct, but existent Promise
} else if(Promise && Promise.resolve){
  notify = function(){
    Promise.resolve().then(flush);
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.cof.js","./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.task":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.task.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-assign.js":[function(require,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var $        = require('./$')
  , toObject = require('./$.to-object')
  , IObject  = require('./$.iobject');

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = require('./$.fails')(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js","./$.iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iobject.js","./$.to-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-sap.js":[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./$.export')
  , core    = require('./$.core')
  , fails   = require('./$.fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.core.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-to-array.js":[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject')
  , isEnum    = $.isEnum;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = $.getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.to-iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-iobject.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.own-keys.js":[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var $        = require('./$')
  , anObject = require('./$.an-object')
  , Reflect  = require('./$.global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = $.getNames(anObject(it))
    , getSymbols = $.getSymbols;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.partial.js":[function(require,module,exports){
'use strict';
var path      = require('./$.path')
  , invoke    = require('./$.invoke')
  , aFunction = require('./$.a-function');
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that  = this
      , $$    = arguments
      , $$len = $$.length
      , j = 0, k = 0, args;
    if(!holder && !$$len)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = $$[k++];
    while($$len > k)args.push($$[k++]);
    return invoke(fn, args, that);
  };
};
},{"./$.a-function":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.a-function.js","./$.invoke":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.invoke.js","./$.path":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.path.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.path.js":[function(require,module,exports){
module.exports = require('./$.global');
},{"./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.property-desc.js":[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine-all.js":[function(require,module,exports){
var redefine = require('./$.redefine');
module.exports = function(target, src){
  for(var key in src)redefine(target, key, src[key]);
  return target;
};
},{"./$.redefine":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine.js":[function(require,module,exports){
// add fake Function#toString
// for correct work wrapped methods / constructors with methods like LoDash isNative
var global    = require('./$.global')
  , hide      = require('./$.hide')
  , SRC       = require('./$.uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

require('./$.core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  if(typeof val == 'function'){
    val.hasOwnProperty(SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    val.hasOwnProperty('name') || hide(val, 'name', key);
  }
  if(O === global){
    O[key] = val;
  } else {
    if(!safe)delete O[key];
    hide(O, key, val);
  }
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./$.core":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.core.js","./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.hide":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.hide.js","./$.uid":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.uid.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.replacer.js":[function(require,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.same-value.js":[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-proto.js":[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.ctx":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.ctx.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-species.js":[function(require,module,exports){
'use strict';
var global      = require('./$.global')
  , $           = require('./$')
  , DESCRIPTORS = require('./$.descriptors')
  , SPECIES     = require('./$.wks')('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.descriptors":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.descriptors.js","./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-to-string-tag.js":[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.has":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.has.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.shared.js":[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.species-constructor.js":[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./$.an-object')
  , aFunction = require('./$.a-function')
  , SPECIES   = require('./$.wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./$.a-function":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.a-function.js","./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.strict-new.js":[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-at.js":[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.defined.js","./$.to-integer":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-integer.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-context.js":[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./$.is-regexp')
  , defined  = require('./$.defined');

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
},{"./$.defined":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.defined.js","./$.is-regexp":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-regexp.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-pad.js":[function(require,module,exports){
// https://github.com/ljharb/proposal-string-pad-left-right
var toLength = require('./$.to-length')
  , repeat   = require('./$.string-repeat')
  , defined  = require('./$.defined');

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength)return S;
  if(fillStr == '')fillStr = ' ';
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};
},{"./$.defined":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.defined.js","./$.string-repeat":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-repeat.js","./$.to-length":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-length.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-repeat.js":[function(require,module,exports){
'use strict';
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./$.defined":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.defined.js","./$.to-integer":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-integer.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-trim.js":[function(require,module,exports){
var $export = require('./$.export')
  , defined = require('./$.defined')
  , fails   = require('./$.fails')
  , spaces  = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
      '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF'
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec){
  var exp  = {};
  exp[KEY] = exec(trim);
  $export($export.P + $export.F * fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  }), 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;
},{"./$.defined":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.defined.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.task.js":[function(require,module,exports){
var ctx                = require('./$.ctx')
  , invoke             = require('./$.invoke')
  , html               = require('./$.html')
  , cel                = require('./$.dom-create')
  , global             = require('./$.global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$.cof":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.cof.js","./$.ctx":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.ctx.js","./$.dom-create":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.dom-create.js","./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.html":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.html.js","./$.invoke":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.invoke.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-index.js":[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./$.to-integer":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-integer.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-integer.js":[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-iobject.js":[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.defined.js","./$.iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iobject.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-length.js":[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-integer.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-object.js":[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.defined.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-primitive.js":[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./$.is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.uid.js":[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js":[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , uid    = require('./$.uid')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.shared":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.shared.js","./$.uid":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.uid.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/core.get-iterator-method.js":[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.classof.js","./$.core":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.core.js","./$.iterators":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iterators.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es5.js":[function(require,module,exports){
'use strict';
var $                 = require('./$')
  , $export           = require('./$.export')
  , DESCRIPTORS       = require('./$.descriptors')
  , createDesc        = require('./$.property-desc')
  , html              = require('./$.html')
  , cel               = require('./$.dom-create')
  , has               = require('./$.has')
  , cof               = require('./$.cof')
  , invoke            = require('./$.invoke')
  , fails             = require('./$.fails')
  , anObject          = require('./$.an-object')
  , aFunction         = require('./$.a-function')
  , isObject          = require('./$.is-object')
  , toObject          = require('./$.to-object')
  , toIObject         = require('./$.to-iobject')
  , toInteger         = require('./$.to-integer')
  , toIndex           = require('./$.to-index')
  , toLength          = require('./$.to-length')
  , IObject           = require('./$.iobject')
  , IE_PROTO          = require('./$.uid')('__proto__')
  , createArrayMethod = require('./$.array-methods')
  , arrayIndexOf      = require('./$.array-includes')(false)
  , ObjectProto       = Object.prototype
  , ArrayProto        = Array.prototype
  , arraySlice        = ArrayProto.slice
  , arrayJoin         = ArrayProto.join
  , defineProperty    = $.setDesc
  , getOwnDescriptor  = $.getDesc
  , defineProperties  = $.setDescs
  , factories         = {}
  , IE8_DOM_DEFINE;

if(!DESCRIPTORS){
  IE8_DOM_DEFINE = !fails(function(){
    return defineProperty(cel('div'), 'a', {get: function(){ return 7; }}).a != 7;
  });
  $.setDesc = function(O, P, Attributes){
    if(IE8_DOM_DEFINE)try {
      return defineProperty(O, P, Attributes);
    } catch(e){ /* empty */ }
    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
    if('value' in Attributes)anObject(O)[P] = Attributes.value;
    return O;
  };
  $.getDesc = function(O, P){
    if(IE8_DOM_DEFINE)try {
      return getOwnDescriptor(O, P);
    } catch(e){ /* empty */ }
    if(has(O, P))return createDesc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
  };
  $.setDescs = defineProperties = function(O, Properties){
    anObject(O);
    var keys   = $.getKeys(Properties)
      , length = keys.length
      , i = 0
      , P;
    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
    return O;
  };
}
$export($export.S + $export.F * !DESCRIPTORS, 'Object', {
  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $.getDesc,
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  defineProperty: $.setDesc,
  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
  defineProperties: defineProperties
});

  // IE 8- don't enum bug keys
var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
            'toLocaleString,toString,valueOf').split(',')
  // Additional keys for getOwnPropertyNames
  , keys2 = keys1.concat('length', 'prototype')
  , keysLen1 = keys1.length;

// Create object with `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = cel('iframe')
    , i      = keysLen1
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict.prototype[keys1[i]];
  return createDict();
};
var createGetKeys = function(names, length){
  return function(object){
    var O      = toIObject(object)
      , i      = 0
      , result = []
      , key;
    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while(length > i)if(has(O, key = names[i++])){
      ~arrayIndexOf(result, key) || result.push(key);
    }
    return result;
  };
};
var Empty = function(){};
$export($export.S, 'Object', {
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  getPrototypeOf: $.getProto = $.getProto || function(O){
    O = toObject(O);
    if(has(O, IE_PROTO))return O[IE_PROTO];
    if(typeof O.constructor == 'function' && O instanceof O.constructor){
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  },
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  create: $.create = $.create || function(O, /*?*/Properties){
    var result;
    if(O !== null){
      Empty.prototype = anObject(O);
      result = new Empty();
      Empty.prototype = null;
      // add "__proto__" for Object.getPrototypeOf shim
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : defineProperties(result, Properties);
  },
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false)
});

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  }
  return factories[len](F, args);
};

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
$export($export.P, 'Function', {
  bind: function bind(that /*, args... */){
    var fn       = aFunction(this)
      , partArgs = arraySlice.call(arguments, 1);
    var bound = function(/* args... */){
      var args = partArgs.concat(arraySlice.call(arguments));
      return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
    };
    if(isObject(fn.prototype))bound.prototype = fn.prototype;
    return bound;
  }
});

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * fails(function(){
  if(html)arraySlice.call(html);
}), 'Array', {
  slice: function(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return arraySlice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});
$export($export.P + $export.F * (IObject != Object), 'Array', {
  join: function join(separator){
    return arrayJoin.call(IObject(this), separator === undefined ? ',' : separator);
  }
});

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
$export($export.S, 'Array', {isArray: require('./$.is-array')});

var createArrayReduce = function(isRight){
  return function(callbackfn, memo){
    aFunction(callbackfn);
    var O      = IObject(this)
      , length = toLength(O.length)
      , index  = isRight ? length - 1 : 0
      , i      = isRight ? -1 : 1;
    if(arguments.length < 2)for(;;){
      if(index in O){
        memo = O[index];
        index += i;
        break;
      }
      index += i;
      if(isRight ? index < 0 : length <= index){
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
      memo = callbackfn(memo, O[index], index, this);
    }
    return memo;
  };
};

var methodize = function($fn){
  return function(arg1/*, arg2 = undefined */){
    return $fn(this, arg1, arguments[1]);
  };
};

$export($export.P, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: $.each = $.each || methodize(createArrayMethod(0)),
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: methodize(createArrayMethod(1)),
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: methodize(createArrayMethod(2)),
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: methodize(createArrayMethod(3)),
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: methodize(createArrayMethod(4)),
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: createArrayReduce(false),
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: createArrayReduce(true),
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: methodize(arrayIndexOf),
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(fromIndex));
    if(index < 0)index = toLength(length + index);
    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
    return -1;
  }
});

// 20.3.3.1 / 15.9.4.4 Date.now()
$export($export.S, 'Date', {now: function(){ return +new Date; }});

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function(){
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function(){
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(this))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.a-function":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.a-function.js","./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.array-includes":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-includes.js","./$.array-methods":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-methods.js","./$.cof":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.cof.js","./$.descriptors":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.descriptors.js","./$.dom-create":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.dom-create.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js","./$.has":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.has.js","./$.html":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.html.js","./$.invoke":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.invoke.js","./$.iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iobject.js","./$.is-array":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-array.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.property-desc":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.property-desc.js","./$.to-index":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-index.js","./$.to-integer":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-integer.js","./$.to-iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-iobject.js","./$.to-length":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-length.js","./$.to-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-object.js","./$.uid":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.uid.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.copy-within.js":[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./$.export');

$export($export.P, 'Array', {copyWithin: require('./$.array-copy-within')});

require('./$.add-to-unscopables')('copyWithin');
},{"./$.add-to-unscopables":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.add-to-unscopables.js","./$.array-copy-within":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-copy-within.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.fill.js":[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./$.export');

$export($export.P, 'Array', {fill: require('./$.array-fill')});

require('./$.add-to-unscopables')('fill');
},{"./$.add-to-unscopables":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.add-to-unscopables.js","./$.array-fill":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-fill.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.find-index.js":[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./$.export')
  , $find   = require('./$.array-methods')(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./$.add-to-unscopables')(KEY);
},{"./$.add-to-unscopables":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.add-to-unscopables.js","./$.array-methods":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-methods.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.find.js":[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./$.export')
  , $find   = require('./$.array-methods')(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./$.add-to-unscopables')(KEY);
},{"./$.add-to-unscopables":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.add-to-unscopables.js","./$.array-methods":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-methods.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.from.js":[function(require,module,exports){
'use strict';
var ctx         = require('./$.ctx')
  , $export     = require('./$.export')
  , toObject    = require('./$.to-object')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
$export($export.S + $export.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , $$      = arguments
      , $$len   = $$.length
      , mapfn   = $$len > 1 ? $$[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

},{"./$.ctx":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.ctx.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.is-array-iter":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-array-iter.js","./$.iter-call":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-call.js","./$.iter-detect":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-detect.js","./$.to-length":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-length.js","./$.to-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-object.js","./core.get-iterator-method":"/Users/iangm/Code/imbible/node_modules/core-js/modules/core.get-iterator-method.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.iterator.js":[function(require,module,exports){
'use strict';
var addToUnscopables = require('./$.add-to-unscopables')
  , step             = require('./$.iter-step')
  , Iterators        = require('./$.iterators')
  , toIObject        = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./$.add-to-unscopables":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.add-to-unscopables.js","./$.iter-define":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-define.js","./$.iter-step":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-step.js","./$.iterators":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iterators.js","./$.to-iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-iobject.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.of.js":[function(require,module,exports){
'use strict';
var $export = require('./$.export');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./$.fails')(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , $$     = arguments
      , $$len  = $$.length
      , result = new (typeof this == 'function' ? this : Array)($$len);
    while($$len > index)result[index] = $$[index++];
    result.length = $$len;
    return result;
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.species.js":[function(require,module,exports){
require('./$.set-species')('Array');
},{"./$.set-species":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-species.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.function.has-instance.js":[function(require,module,exports){
'use strict';
var $             = require('./$')
  , isObject      = require('./$.is-object')
  , HAS_INSTANCE  = require('./$.wks')('hasInstance')
  , FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = $.getProto(O))if(this.prototype === O)return true;
  return false;
}});
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.function.name.js":[function(require,module,exports){
var setDesc    = require('./$').setDesc
  , createDesc = require('./$.property-desc')
  , has        = require('./$.has')
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';
// 19.2.4.2 name
NAME in FProto || require('./$.descriptors') && setDesc(FProto, NAME, {
  configurable: true,
  get: function(){
    var match = ('' + this).match(nameRE)
      , name  = match ? match[1] : '';
    has(this, NAME) || setDesc(this, NAME, createDesc(5, name));
    return name;
  }
});
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.descriptors":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.descriptors.js","./$.has":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.has.js","./$.property-desc":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.property-desc.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.map.js":[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection.js","./$.collection-strong":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection-strong.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.acosh.js":[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./$.export')
  , log1p   = require('./$.math-log1p')
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

// V8 bug https://code.google.com/p/v8/issues/detail?id=3509
$export($export.S + $export.F * !($acosh && Math.floor($acosh(Number.MAX_VALUE)) == 710), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.math-log1p":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.math-log1p.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.asinh.js":[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./$.export');

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

$export($export.S, 'Math', {asinh: asinh});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.atanh.js":[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.cbrt.js":[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./$.export')
  , sign    = require('./$.math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.math-sign":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.math-sign.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.clz32.js":[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.cosh.js":[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./$.export')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.expm1.js":[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./$.export');

$export($export.S, 'Math', {expm1: require('./$.math-expm1')});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.math-expm1":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.math-expm1.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.fround.js":[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export   = require('./$.export')
  , sign      = require('./$.math-sign')
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.math-sign":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.math-sign.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.hypot.js":[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./$.export')
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum   = 0
      , i     = 0
      , $$    = arguments
      , $$len = $$.length
      , larg  = 0
      , arg, div;
    while(i < $$len){
      arg = abs($$[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.imul.js":[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./$.export')
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./$.fails')(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.log10.js":[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.log1p.js":[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./$.export');

$export($export.S, 'Math', {log1p: require('./$.math-log1p')});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.math-log1p":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.math-log1p.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.log2.js":[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.sign.js":[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./$.export');

$export($export.S, 'Math', {sign: require('./$.math-sign')});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.math-sign":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.math-sign.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.sinh.js":[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./$.export')
  , expm1   = require('./$.math-expm1')
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./$.fails')(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js","./$.math-expm1":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.math-expm1.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.tanh.js":[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./$.export')
  , expm1   = require('./$.math-expm1')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.math-expm1":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.math-expm1.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.trunc.js":[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.constructor.js":[function(require,module,exports){
'use strict';
var $           = require('./$')
  , global      = require('./$.global')
  , has         = require('./$.has')
  , cof         = require('./$.cof')
  , toPrimitive = require('./$.to-primitive')
  , fails       = require('./$.fails')
  , $trim       = require('./$.string-trim').trim
  , NUMBER      = 'Number'
  , $Number     = global[NUMBER]
  , Base        = $Number
  , proto       = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF  = cof($.create(proto)) == NUMBER
  , TRIM        = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? new Base(toNumber(it)) : toNumber(it);
  };
  $.each.call(require('./$.descriptors') ? $.getNames(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), function(key){
    if(has(Base, key) && !has($Number, key)){
      $.setDesc($Number, key, $.getDesc(Base, key));
    }
  });
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./$.redefine')(global, NUMBER, $Number);
}
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.cof":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.cof.js","./$.descriptors":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.descriptors.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js","./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.has":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.has.js","./$.redefine":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine.js","./$.string-trim":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-trim.js","./$.to-primitive":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-primitive.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.epsilon.js":[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./$.export');

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.is-finite.js":[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export   = require('./$.export')
  , _isFinite = require('./$.global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.is-integer.js":[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./$.export');

$export($export.S, 'Number', {isInteger: require('./$.is-integer')});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.is-integer":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-integer.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.is-nan.js":[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./$.export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.is-safe-integer.js":[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export   = require('./$.export')
  , isInteger = require('./$.is-integer')
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.is-integer":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-integer.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.max-safe-integer.js":[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./$.export');

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.min-safe-integer.js":[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./$.export');

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.parse-float.js":[function(require,module,exports){
// 20.1.2.12 Number.parseFloat(string)
var $export = require('./$.export');

$export($export.S, 'Number', {parseFloat: parseFloat});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.parse-int.js":[function(require,module,exports){
// 20.1.2.13 Number.parseInt(string, radix)
var $export = require('./$.export');

$export($export.S, 'Number', {parseInt: parseInt});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.assign.js":[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./$.export');

$export($export.S + $export.F, 'Object', {assign: require('./$.object-assign')});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.object-assign":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-assign.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.freeze.js":[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(it) : it;
  };
});
},{"./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.object-sap":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-sap.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.get-own-property-descriptor.js":[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-sap.js","./$.to-iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-iobject.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.get-own-property-names.js":[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./$.object-sap')('getOwnPropertyNames', function(){
  return require('./$.get-names').get;
});
},{"./$.get-names":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.get-names.js","./$.object-sap":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-sap.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.get-prototype-of.js":[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('getPrototypeOf', function($getPrototypeOf){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./$.object-sap":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-sap.js","./$.to-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.is-extensible.js":[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});
},{"./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.object-sap":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-sap.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.is-frozen.js":[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
},{"./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.object-sap":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-sap.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.is-sealed.js":[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});
},{"./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.object-sap":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-sap.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.is.js":[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./$.export');
$export($export.S, 'Object', {is: require('./$.same-value')});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.same-value":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.same-value.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.keys.js":[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-sap.js","./$.to-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.prevent-extensions.js":[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(it) : it;
  };
});
},{"./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.object-sap":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-sap.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.seal.js":[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(it) : it;
  };
});
},{"./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.object-sap":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-sap.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.set-prototype-of.js":[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./$.export');
$export($export.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.set-proto":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-proto.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.to-string.js":[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./$.classof')
  , test    = {};
test[require('./$.wks')('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  require('./$.redefine')(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"./$.classof":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.classof.js","./$.redefine":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.promise.js":[function(require,module,exports){
'use strict';
var $          = require('./$')
  , LIBRARY    = require('./$.library')
  , global     = require('./$.global')
  , ctx        = require('./$.ctx')
  , classof    = require('./$.classof')
  , $export    = require('./$.export')
  , isObject   = require('./$.is-object')
  , anObject   = require('./$.an-object')
  , aFunction  = require('./$.a-function')
  , strictNew  = require('./$.strict-new')
  , forOf      = require('./$.for-of')
  , setProto   = require('./$.set-proto').set
  , same       = require('./$.same-value')
  , SPECIES    = require('./$.wks')('species')
  , speciesConstructor = require('./$.species-constructor')
  , asap       = require('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var USE_NATIVE = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && require('./$.descriptors')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var PromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve),
  this.reject  = aFunction(reject)
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , result, then;
      try {
        if(handler){
          if(!ok)record.h = true;
          result = handler === true ? value : handler(value);
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise._d
    , chain  = record.a || record.c
    , i      = 0
    , reaction;
  if(record.h)return false;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(record.p === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = this._d = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.redefine-all')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction = new PromiseCapability(speciesConstructor(this, P))
        , promise  = reaction.promise
        , record   = this._d;
      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      record.c.push(reaction);
      if(record.a)record.a.push(reaction);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
require('./$.set-to-string-tag')(P, PROMISE);
require('./$.set-species')(PROMISE);
Wrapper = require('./$.core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = new PromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof P && sameConstructor(x.constructor, this))return x;
    var capability = new PromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject
      , values     = [];
    var abrupt = perform(function(){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        var alreadyCalled = false;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled = true;
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.a-function":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.a-function.js","./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.classof":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.classof.js","./$.core":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.core.js","./$.ctx":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.ctx.js","./$.descriptors":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.descriptors.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.for-of":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.for-of.js","./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.iter-detect":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-detect.js","./$.library":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.library.js","./$.microtask":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.microtask.js","./$.redefine-all":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine-all.js","./$.same-value":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.same-value.js","./$.set-proto":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-proto.js","./$.set-species":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-species.js","./$.set-to-string-tag":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-to-string-tag.js","./$.species-constructor":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.species-constructor.js","./$.strict-new":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.strict-new.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.apply.js":[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./$.export')
  , _apply  = Function.apply;

$export($export.S, 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    return _apply.call(target, thisArgument, argumentsList);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.construct.js":[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $         = require('./$')
  , $export   = require('./$.export')
  , aFunction = require('./$.a-function')
  , anObject  = require('./$.an-object')
  , isObject  = require('./$.is-object')
  , bind      = Function.bind || require('./$.core').Function.prototype.bind;

// MS Edge supports only 2 arguments
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
$export($export.S + $export.F * require('./$.fails')(function(){
  function F(){}
  return !(Reflect.construct(function(){}, [], F) instanceof F);
}), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      if(args != undefined)switch(anObject(args).length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = $.create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.a-function":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.a-function.js","./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.core":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.core.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.define-property.js":[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var $        = require('./$')
  , $export  = require('./$.export')
  , anObject = require('./$.an-object');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./$.fails')(function(){
  Reflect.defineProperty($.setDesc({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    try {
      $.setDesc(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.delete-property.js":[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = require('./$.export')
  , getDesc  = require('./$').getDesc
  , anObject = require('./$.an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = getDesc(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.enumerate.js":[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export  = require('./$.export')
  , anObject = require('./$.an-object');
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
require('./$.iter-create')(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});
},{"./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.iter-create":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-create.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.get-own-property-descriptor.js":[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var $        = require('./$')
  , $export  = require('./$.export')
  , anObject = require('./$.an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return $.getDesc(anObject(target), propertyKey);
  }
});
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.get-prototype-of.js":[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = require('./$.export')
  , getProto = require('./$').getProto
  , anObject = require('./$.an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.get.js":[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var $        = require('./$')
  , has      = require('./$.has')
  , $export  = require('./$.export')
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = $.getDesc(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = $.getProto(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.has":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.has.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.has.js":[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./$.export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.is-extensible.js":[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export       = require('./$.export')
  , anObject      = require('./$.an-object')
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
},{"./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.own-keys.js":[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./$.export');

$export($export.S, 'Reflect', {ownKeys: require('./$.own-keys')});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.own-keys":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.own-keys.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.prevent-extensions.js":[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export            = require('./$.export')
  , anObject           = require('./$.an-object')
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.set-prototype-of.js":[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = require('./$.export')
  , setProto = require('./$.set-proto');

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.set-proto":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-proto.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.set.js":[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var $          = require('./$')
  , has        = require('./$.has')
  , $export    = require('./$.export')
  , createDesc = require('./$.property-desc')
  , anObject   = require('./$.an-object')
  , isObject   = require('./$.is-object');

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = $.getDesc(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = $.getProto(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = $.getDesc(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    $.setDesc(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.has":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.has.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.property-desc":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.property-desc.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.regexp.constructor.js":[function(require,module,exports){
var $        = require('./$')
  , global   = require('./$.global')
  , isRegExp = require('./$.is-regexp')
  , $flags   = require('./$.flags')
  , $RegExp  = global.RegExp
  , Base     = $RegExp
  , proto    = $RegExp.prototype
  , re1      = /a/g
  , re2      = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW = new $RegExp(re1) !== re1;

if(require('./$.descriptors') && (!CORRECT_NEW || require('./$.fails')(function(){
  re2[require('./$.wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !(this instanceof $RegExp) && piRE && p.constructor === $RegExp && fiU ? p
      : CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f);
  };
  $.each.call($.getNames(Base), function(key){
    key in $RegExp || $.setDesc($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  });
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./$.redefine')(global, 'RegExp', $RegExp);
}

require('./$.set-species')('RegExp');
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.descriptors":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.descriptors.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js","./$.flags":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.flags.js","./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.is-regexp":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-regexp.js","./$.redefine":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine.js","./$.set-species":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-species.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.regexp.flags.js":[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
var $ = require('./$');
if(require('./$.descriptors') && /./g.flags != 'g')$.setDesc(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./$.flags')
});
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.descriptors":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.descriptors.js","./$.flags":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.flags.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.regexp.match.js":[function(require,module,exports){
// @@match logic
require('./$.fix-re-wks')('match', 1, function(defined, MATCH){
  // 21.1.3.11 String.prototype.match(regexp)
  return function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  };
});
},{"./$.fix-re-wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fix-re-wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.regexp.replace.js":[function(require,module,exports){
// @@replace logic
require('./$.fix-re-wks')('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  };
});
},{"./$.fix-re-wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fix-re-wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.regexp.search.js":[function(require,module,exports){
// @@search logic
require('./$.fix-re-wks')('search', 1, function(defined, SEARCH){
  // 21.1.3.15 String.prototype.search(regexp)
  return function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  };
});
},{"./$.fix-re-wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fix-re-wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.regexp.split.js":[function(require,module,exports){
// @@split logic
require('./$.fix-re-wks')('split', 2, function(defined, SPLIT, $split){
  // 21.1.3.17 String.prototype.split(separator, limit)
  return function split(separator, limit){
    'use strict';
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined
      ? fn.call(separator, O, limit)
      : $split.call(String(O), separator, limit);
  };
});
},{"./$.fix-re-wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fix-re-wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.set.js":[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection.js","./$.collection-strong":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection-strong.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.code-point-at.js":[function(require,module,exports){
'use strict';
var $export = require('./$.export')
  , $at     = require('./$.string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.string-at":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-at.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.ends-with.js":[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export   = require('./$.export')
  , toLength  = require('./$.to-length')
  , context   = require('./$.string-context')
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./$.fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , $$   = arguments
      , endPosition = $$.length > 1 ? $$[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.fails-is-regexp":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails-is-regexp.js","./$.string-context":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-context.js","./$.to-length":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-length.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.from-code-point.js":[function(require,module,exports){
var $export        = require('./$.export')
  , toIndex        = require('./$.to-index')
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res   = []
      , $$    = arguments
      , $$len = $$.length
      , i     = 0
      , code;
    while($$len > i){
      code = +$$[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.to-index":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-index.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.includes.js":[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export  = require('./$.export')
  , context  = require('./$.string-context')
  , INCLUDES = 'includes';

$export($export.P + $export.F * require('./$.fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.fails-is-regexp":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails-is-regexp.js","./$.string-context":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-context.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.iterator.js":[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iter-define.js","./$.string-at":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-at.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.raw.js":[function(require,module,exports){
var $export   = require('./$.export')
  , toIObject = require('./$.to-iobject')
  , toLength  = require('./$.to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl   = toIObject(callSite.raw)
      , len   = toLength(tpl.length)
      , $$    = arguments
      , $$len = $$.length
      , res   = []
      , i     = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < $$len)res.push(String($$[i]));
    } return res.join('');
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.to-iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-iobject.js","./$.to-length":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-length.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.repeat.js":[function(require,module,exports){
var $export = require('./$.export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./$.string-repeat')
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.string-repeat":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-repeat.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.starts-with.js":[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export     = require('./$.export')
  , toLength    = require('./$.to-length')
  , context     = require('./$.string-context')
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./$.fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , $$     = arguments
      , index  = toLength(Math.min($$.length > 1 ? $$[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.fails-is-regexp":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails-is-regexp.js","./$.string-context":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-context.js","./$.to-length":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-length.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.trim.js":[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./$.string-trim')('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});
},{"./$.string-trim":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-trim.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.symbol.js":[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = require('./$')
  , global         = require('./$.global')
  , has            = require('./$.has')
  , DESCRIPTORS    = require('./$.descriptors')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , $fails         = require('./$.fails')
  , shared         = require('./$.shared')
  , setToStringTag = require('./$.set-to-string-tag')
  , uid            = require('./$.uid')
  , wks            = require('./$.wks')
  , keyOf          = require('./$.keyof')
  , $names         = require('./$.get-names')
  , enumKeys       = require('./$.enum-keys')
  , isArray        = require('./$.is-array')
  , anObject       = require('./$.an-object')
  , toIObject      = require('./$.to-iobject')
  , createDesc     = require('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  redefine($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./$.library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$export($export.G + $export.W, {Symbol: $Symbol});

$export($export.S, 'Symbol', symbolStatics);

$export($export.S + $export.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.an-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.an-object.js","./$.descriptors":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.descriptors.js","./$.enum-keys":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.enum-keys.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.fails":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.fails.js","./$.get-names":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.get-names.js","./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.has":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.has.js","./$.is-array":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-array.js","./$.keyof":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.keyof.js","./$.library":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.library.js","./$.property-desc":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.property-desc.js","./$.redefine":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine.js","./$.set-to-string-tag":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.set-to-string-tag.js","./$.shared":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.shared.js","./$.to-iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-iobject.js","./$.uid":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.uid.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.weak-map.js":[function(require,module,exports){
'use strict';
var $            = require('./$')
  , redefine     = require('./$.redefine')
  , weak         = require('./$.collection-weak')
  , isObject     = require('./$.is-object')
  , has          = require('./$.has')
  , frozenStore  = weak.frozenStore
  , WEAK         = weak.WEAK
  , isExtensible = Object.isExtensible || isObject
  , tmp          = {};

// 23.3 WeakMap Objects
var $WeakMap = require('./$.collection')('WeakMap', function(get){
  return function WeakMap(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      if(!isExtensible(key))return frozenStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this._i];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
}, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  $.each.call(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && !isExtensible(a)){
        var result = frozenStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.collection":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection.js","./$.collection-weak":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection-weak.js","./$.has":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.has.js","./$.is-object":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.is-object.js","./$.redefine":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.redefine.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.weak-set.js":[function(require,module,exports){
'use strict';
var weak = require('./$.collection-weak');

// 23.4 WeakSet Objects
require('./$.collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./$.collection":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection.js","./$.collection-weak":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection-weak.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.array.includes.js":[function(require,module,exports){
'use strict';
var $export   = require('./$.export')
  , $includes = require('./$.array-includes')(true);

$export($export.P, 'Array', {
  // https://github.com/domenic/Array.prototype.includes
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./$.add-to-unscopables')('includes');
},{"./$.add-to-unscopables":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.add-to-unscopables.js","./$.array-includes":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.array-includes.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.map.to-json.js":[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./$.export');

$export($export.P, 'Map', {toJSON: require('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection-to-json.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.object.entries.js":[function(require,module,exports){
// http://goo.gl/XkBrjD
var $export  = require('./$.export')
  , $entries = require('./$.object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.object-to-array":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-to-array.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.object.get-own-property-descriptors.js":[function(require,module,exports){
// https://gist.github.com/WebReflection/9353781
var $          = require('./$')
  , $export    = require('./$.export')
  , ownKeys    = require('./$.own-keys')
  , toIObject  = require('./$.to-iobject')
  , createDesc = require('./$.property-desc');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , setDesc = $.setDesc
      , getDesc = $.getDesc
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key, D;
    while(keys.length > i){
      D = getDesc(O, key = keys[i++]);
      if(key in result)setDesc(result, key, createDesc(0, D));
      else result[key] = D;
    } return result;
  }
});
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.own-keys":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.own-keys.js","./$.property-desc":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.property-desc.js","./$.to-iobject":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.to-iobject.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.object.values.js":[function(require,module,exports){
// http://goo.gl/XkBrjD
var $export = require('./$.export')
  , $values = require('./$.object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.object-to-array":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.object-to-array.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.regexp.escape.js":[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = require('./$.export')
  , $re     = require('./$.replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});

},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.replacer":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.replacer.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.set.to-json.js":[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./$.export');

$export($export.P, 'Set', {toJSON: require('./$.collection-to-json')('Set')});
},{"./$.collection-to-json":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.collection-to-json.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.string.at.js":[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./$.export')
  , $at     = require('./$.string-at')(true);

$export($export.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.string-at":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-at.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.string.pad-left.js":[function(require,module,exports){
'use strict';
var $export = require('./$.export')
  , $pad    = require('./$.string-pad');

$export($export.P, 'String', {
  padLeft: function padLeft(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.string-pad":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-pad.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.string.pad-right.js":[function(require,module,exports){
'use strict';
var $export = require('./$.export')
  , $pad    = require('./$.string-pad');

$export($export.P, 'String', {
  padRight: function padRight(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.string-pad":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-pad.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.string.trim-left.js":[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./$.string-trim')('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
});
},{"./$.string-trim":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-trim.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.string.trim-right.js":[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./$.string-trim')('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
});
},{"./$.string-trim":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.string-trim.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/js.array.statics.js":[function(require,module,exports){
// JavaScript 1.6 / Strawman array statics shim
var $       = require('./$')
  , $export = require('./$.export')
  , $ctx    = require('./$.ctx')
  , $Array  = require('./$.core').Array || Array
  , statics = {};
var setStatics = function(keys, length){
  $.each.call(keys.split(','), function(key){
    if(length == undefined && key in $Array)statics[key] = $Array[key];
    else if(key in [])statics[key] = $ctx(Function.call, [][key], length);
  });
};
setStatics('pop,reverse,shift,keys,values,entries', 1);
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
           'reduce,reduceRight,copyWithin,fill');
$export($export.S, 'Array', statics);
},{"./$":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.js","./$.core":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.core.js","./$.ctx":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.ctx.js","./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/web.dom.iterable.js":[function(require,module,exports){
require('./es6.array.iterator');
var global      = require('./$.global')
  , hide        = require('./$.hide')
  , Iterators   = require('./$.iterators')
  , ITERATOR    = require('./$.wks')('iterator')
  , NL          = global.NodeList
  , HTC         = global.HTMLCollection
  , NLProto     = NL && NL.prototype
  , HTCProto    = HTC && HTC.prototype
  , ArrayValues = Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
if(NLProto && !NLProto[ITERATOR])hide(NLProto, ITERATOR, ArrayValues);
if(HTCProto && !HTCProto[ITERATOR])hide(HTCProto, ITERATOR, ArrayValues);
},{"./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.hide":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.hide.js","./$.iterators":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.iterators.js","./$.wks":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.wks.js","./es6.array.iterator":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.iterator.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/web.immediate.js":[function(require,module,exports){
var $export = require('./$.export')
  , $task   = require('./$.task');
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.task":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.task.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/modules/web.timers.js":[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global     = require('./$.global')
  , $export    = require('./$.export')
  , invoke     = require('./$.invoke')
  , partial    = require('./$.partial')
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
},{"./$.export":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.export.js","./$.global":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.global.js","./$.invoke":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.invoke.js","./$.partial":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.partial.js"}],"/Users/iangm/Code/imbible/node_modules/core-js/shim.js":[function(require,module,exports){
require('./modules/es5');
require('./modules/es6.symbol');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.number.constructor');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.iterator');
require('./modules/es6.array.species');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-left');
require('./modules/es7.string.pad-right');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.regexp.escape');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/js.array.statics');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/$.core');
},{"./modules/$.core":"/Users/iangm/Code/imbible/node_modules/core-js/modules/$.core.js","./modules/es5":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es5.js","./modules/es6.array.copy-within":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.copy-within.js","./modules/es6.array.fill":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.fill.js","./modules/es6.array.find":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.find.js","./modules/es6.array.find-index":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.find-index.js","./modules/es6.array.from":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.from.js","./modules/es6.array.iterator":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.iterator.js","./modules/es6.array.of":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.of.js","./modules/es6.array.species":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.array.species.js","./modules/es6.function.has-instance":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.function.has-instance.js","./modules/es6.function.name":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.function.name.js","./modules/es6.map":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.map.js","./modules/es6.math.acosh":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.acosh.js","./modules/es6.math.asinh":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.asinh.js","./modules/es6.math.atanh":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.atanh.js","./modules/es6.math.cbrt":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.cbrt.js","./modules/es6.math.clz32":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.clz32.js","./modules/es6.math.cosh":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.cosh.js","./modules/es6.math.expm1":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.expm1.js","./modules/es6.math.fround":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.fround.js","./modules/es6.math.hypot":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.hypot.js","./modules/es6.math.imul":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.imul.js","./modules/es6.math.log10":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.log10.js","./modules/es6.math.log1p":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.log1p.js","./modules/es6.math.log2":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.log2.js","./modules/es6.math.sign":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.sign.js","./modules/es6.math.sinh":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.sinh.js","./modules/es6.math.tanh":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.tanh.js","./modules/es6.math.trunc":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.math.trunc.js","./modules/es6.number.constructor":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.constructor.js","./modules/es6.number.epsilon":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.epsilon.js","./modules/es6.number.is-finite":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.is-finite.js","./modules/es6.number.is-integer":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.is-integer.js","./modules/es6.number.is-nan":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.is-nan.js","./modules/es6.number.is-safe-integer":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.is-safe-integer.js","./modules/es6.number.max-safe-integer":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.max-safe-integer.js","./modules/es6.number.min-safe-integer":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.min-safe-integer.js","./modules/es6.number.parse-float":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.parse-float.js","./modules/es6.number.parse-int":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.number.parse-int.js","./modules/es6.object.assign":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.assign.js","./modules/es6.object.freeze":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.freeze.js","./modules/es6.object.get-own-property-descriptor":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.get-own-property-descriptor.js","./modules/es6.object.get-own-property-names":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.get-own-property-names.js","./modules/es6.object.get-prototype-of":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.get-prototype-of.js","./modules/es6.object.is":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.is.js","./modules/es6.object.is-extensible":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.is-extensible.js","./modules/es6.object.is-frozen":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.is-frozen.js","./modules/es6.object.is-sealed":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.is-sealed.js","./modules/es6.object.keys":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.keys.js","./modules/es6.object.prevent-extensions":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.prevent-extensions.js","./modules/es6.object.seal":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.seal.js","./modules/es6.object.set-prototype-of":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.set-prototype-of.js","./modules/es6.object.to-string":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.object.to-string.js","./modules/es6.promise":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.promise.js","./modules/es6.reflect.apply":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.apply.js","./modules/es6.reflect.construct":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.construct.js","./modules/es6.reflect.define-property":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.define-property.js","./modules/es6.reflect.delete-property":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.delete-property.js","./modules/es6.reflect.enumerate":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.enumerate.js","./modules/es6.reflect.get":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.get.js","./modules/es6.reflect.get-own-property-descriptor":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.get-own-property-descriptor.js","./modules/es6.reflect.get-prototype-of":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.get-prototype-of.js","./modules/es6.reflect.has":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.has.js","./modules/es6.reflect.is-extensible":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.is-extensible.js","./modules/es6.reflect.own-keys":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.own-keys.js","./modules/es6.reflect.prevent-extensions":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.prevent-extensions.js","./modules/es6.reflect.set":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.set.js","./modules/es6.reflect.set-prototype-of":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.reflect.set-prototype-of.js","./modules/es6.regexp.constructor":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.regexp.constructor.js","./modules/es6.regexp.flags":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.regexp.flags.js","./modules/es6.regexp.match":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.regexp.match.js","./modules/es6.regexp.replace":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.regexp.replace.js","./modules/es6.regexp.search":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.regexp.search.js","./modules/es6.regexp.split":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.regexp.split.js","./modules/es6.set":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.set.js","./modules/es6.string.code-point-at":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.code-point-at.js","./modules/es6.string.ends-with":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.ends-with.js","./modules/es6.string.from-code-point":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.from-code-point.js","./modules/es6.string.includes":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.includes.js","./modules/es6.string.iterator":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.iterator.js","./modules/es6.string.raw":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.raw.js","./modules/es6.string.repeat":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.repeat.js","./modules/es6.string.starts-with":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.starts-with.js","./modules/es6.string.trim":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.string.trim.js","./modules/es6.symbol":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.symbol.js","./modules/es6.weak-map":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.weak-map.js","./modules/es6.weak-set":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es6.weak-set.js","./modules/es7.array.includes":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.array.includes.js","./modules/es7.map.to-json":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.map.to-json.js","./modules/es7.object.entries":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.object.entries.js","./modules/es7.object.get-own-property-descriptors":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.object.get-own-property-descriptors.js","./modules/es7.object.values":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.object.values.js","./modules/es7.regexp.escape":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.regexp.escape.js","./modules/es7.set.to-json":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.set.to-json.js","./modules/es7.string.at":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.string.at.js","./modules/es7.string.pad-left":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.string.pad-left.js","./modules/es7.string.pad-right":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.string.pad-right.js","./modules/es7.string.trim-left":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.string.trim-left.js","./modules/es7.string.trim-right":"/Users/iangm/Code/imbible/node_modules/core-js/modules/es7.string.trim-right.js","./modules/js.array.statics":"/Users/iangm/Code/imbible/node_modules/core-js/modules/js.array.statics.js","./modules/web.dom.iterable":"/Users/iangm/Code/imbible/node_modules/core-js/modules/web.dom.iterable.js","./modules/web.immediate":"/Users/iangm/Code/imbible/node_modules/core-js/modules/web.immediate.js","./modules/web.timers":"/Users/iangm/Code/imbible/node_modules/core-js/modules/web.timers.js"}],"/Users/iangm/Code/imbible/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"/Users/iangm/Code/imbible/src/client/actions.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDrink = addDrink;
exports.addDrinkIngredient = addDrinkIngredient;
exports.addIngredient = addIngredient;
exports.addIngredientType = addIngredientType;
exports.changeSuggestInput = changeSuggestInput;
exports.addSuggestion = addSuggestion;
exports.removeSuggestion = removeSuggestion;
var ADD_DRINK = exports.ADD_DRINK = 'ADD_DRINK';
var ADD_DRINK_INGREDIENT = exports.ADD_DRINK_INGREDIENT = 'ADD_DRINK_INGREDIENT';
var ADD_INGREDIENT_TYPE = exports.ADD_INGREDIENT_TYPE = 'ADD_INGREDIENT_TYPE';
var ADD_INGREDIENT = exports.ADD_INGREDIENT = 'ADD_INGREDIENT';
var INPUT_CHANGE = exports.INPUT_CHANGE = 'INPUT_CHANGE';
var SUGGESTION_ADDED = exports.SUGGESTION_ADDED = 'SUGGESTION_ADDED';
var SUGGESTION_REMOVED = exports.SUGGESTION_REMOVED = 'SUGGESTION_REMOVED';

function addDrink(drink) {
  return { type: ADD_DRINK, drink: drink };
}

function addDrinkIngredient(drinkIngredient) {
  return { type: ADD_DRINK_INGREDIENT, drinkIngredient: drinkIngredient };
}

function addIngredient(ingredient) {
  return { type: ADD_INGREDIENT, ingredient: ingredient };
}

function addIngredientType(ingredientType) {
  return { type: ADD_INGREDIENT_TYPE, ingredientType: ingredientType };
}

function changeSuggestInput(value) {
  return { type: INPUT_CHANGE, value: value };
}

function addSuggestion(suggestion) {
  return { type: SUGGESTION_ADDED, suggestion: suggestion };
}

function removeSuggestion(id) {
  return { type: SUGGESTION_REMOVED, id: id };
}

},{}],"/Users/iangm/Code/imbible/src/client/components/DrinkDetailView.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DrinkIngredientListReact = require('./DrinkIngredientList.react.es6');

var _DrinkIngredientListReact2 = _interopRequireDefault(_DrinkIngredientListReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrinkDetailView = function DrinkDetailView(_ref) {
  var name = _ref.name;
  var drinkIngredients = _ref.drinkIngredients;
  return _react2.default.createElement(
    'div',
    { className: 'card' },
    _react2.default.createElement(
      'h2',
      null,
      name
    ),
    _react2.default.createElement(_DrinkIngredientListReact2.default, {
      drinkIngredients: drinkIngredients
    })
  );
};

DrinkDetailView.propTypes = {
  name: _react.PropTypes.string.isRequired,
  id: _react.PropTypes.number.isRequired,
  drinkIngredients: _react.PropTypes.array.isRequired
};

exports.default = DrinkDetailView;

},{"./DrinkIngredientList.react.es6":"/Users/iangm/Code/imbible/src/client/components/DrinkIngredientList.react.es6","react":"react"}],"/Users/iangm/Code/imbible/src/client/components/DrinkIngredientList.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DrinkIngredientListItemContainerReact = require('../containers/DrinkIngredientListItemContainer.react.es6');

var _DrinkIngredientListItemContainerReact2 = _interopRequireDefault(_DrinkIngredientListItemContainerReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrinkIngredientList = function DrinkIngredientList(_ref) {
  var drinkIngredients = _ref.drinkIngredients;
  return _react2.default.createElement(
    'ul',
    null,
    drinkIngredients.map(function (drinkIngredient) {
      return _react2.default.createElement(_DrinkIngredientListItemContainerReact2.default, _extends({
        key: drinkIngredient.id
      }, drinkIngredient));
    })
  );
};

DrinkIngredientList.propTypes = {
  drinkIngredients: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    id: _react.PropTypes.number.isRequired,
    drinkId: _react.PropTypes.number.isRequired,
    ingredientId: _react.PropTypes.number.isRequired,
    amount: _react.PropTypes.number.isRequired,
    unit: _react.PropTypes.string.isRequired
  }).isRequired).isRequired
};

exports.default = DrinkIngredientList;

},{"../containers/DrinkIngredientListItemContainer.react.es6":"/Users/iangm/Code/imbible/src/client/containers/DrinkIngredientListItemContainer.react.es6","react":"react"}],"/Users/iangm/Code/imbible/src/client/components/DrinkIngredientListItem.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrinkIngredientListItem = function DrinkIngredientListItem(_ref) {
  var name = _ref.name;
  var amount = _ref.amount;
  var unit = _ref.unit;
  return _react2.default.createElement(
    'li',
    null,
    amount,
    unit,
    ' ',
    name
  );
};

DrinkIngredientListItem.propTypes = {
  name: _react.PropTypes.string.isRequired,
  amount: _react.PropTypes.number.isRequired,
  unit: _react.PropTypes.string.isRequired,
  id: _react.PropTypes.number.isRequired
};

exports.default = DrinkIngredientListItem;

},{"react":"react"}],"/Users/iangm/Code/imbible/src/client/components/DrinkList.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DrinkListItemContainerReact = require('../containers/DrinkListItemContainer.react.es6');

var _DrinkListItemContainerReact2 = _interopRequireDefault(_DrinkListItemContainerReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrinkList = function DrinkList(_ref) {
  var drinks = _ref.drinks;
  return _react2.default.createElement(
    'ul',
    { className: 'card drink-list' },
    drinks.map(function (drink) {
      return _react2.default.createElement(_DrinkListItemContainerReact2.default, _extends({
        key: drink.id
      }, drink));
    })
  );
};

DrinkList.propTypes = {
  drinks: _react.PropTypes.object.isRequired
};

exports.default = DrinkList;

},{"../containers/DrinkListItemContainer.react.es6":"/Users/iangm/Code/imbible/src/client/containers/DrinkListItemContainer.react.es6","react":"react"}],"/Users/iangm/Code/imbible/src/client/components/DrinkListItem.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrinkListItem = function DrinkListItem(_ref) {
  var name = _ref.name;
  var id = _ref.id;
  var source = _ref.source;
  var ingredients = _ref.ingredients;
  return _react2.default.createElement(
    'li',
    null,
    _react2.default.createElement(
      _reactRouter.Link,
      { to: '/drinks/' + id },
      name
    ),
    _react2.default.createElement(
      'span',
      { className: 'source' },
      source
    ),
    _react2.default.createElement('br', null),
    _react2.default.createElement(
      'span',
      { className: 'ingredients' },
      ingredients.join(', ')
    )
  );
};

DrinkListItem.propTypes = {
  name: _react.PropTypes.string.isRequired,
  id: _react.PropTypes.number.isRequired,
  ingredients: _react.PropTypes.array.isRequired,
  source: _react.PropTypes.string.isRequired
};

exports.default = DrinkListItem;

},{"react":"react","react-router":"react-router"}],"/Users/iangm/Code/imbible/src/client/components/HomePage.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _LoadedDrinkListReact = require('../containers/LoadedDrinkList.react.es6');

var _LoadedDrinkListReact2 = _interopRequireDefault(_LoadedDrinkListReact);

var _IngredientAutoSuggestContainerReact = require('../containers/IngredientAutoSuggestContainer.react.es6');

var _IngredientAutoSuggestContainerReact2 = _interopRequireDefault(_IngredientAutoSuggestContainerReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HomePage = function HomePage() {
  return _react2.default.createElement(
    'div',
    { className: 'home' },
    _react2.default.createElement(_IngredientAutoSuggestContainerReact2.default, null),
    _react2.default.createElement(_LoadedDrinkListReact2.default, null)
  );
};

exports.default = HomePage;

},{"../containers/IngredientAutoSuggestContainer.react.es6":"/Users/iangm/Code/imbible/src/client/containers/IngredientAutoSuggestContainer.react.es6","../containers/LoadedDrinkList.react.es6":"/Users/iangm/Code/imbible/src/client/containers/LoadedDrinkList.react.es6","react":"react"}],"/Users/iangm/Code/imbible/src/client/components/ImbibleApp.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ImbibleApp = function ImbibleApp(_ref) {
  var children = _ref.children;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'div',
        { className: 'topbar' },
        _react2.default.createElement(
          'h1',
          null,
          _react2.default.createElement(
            _reactRouter.IndexLink,
            { to: '/' },
            'Imbible'
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'main-content' },
        children
      )
    )
  );
};

exports.default = ImbibleApp;

},{"react":"react","react-addons-pure-render-mixin":"react-addons-pure-render-mixin","react-router":"react-router"}],"/Users/iangm/Code/imbible/src/client/components/ImbibleRouter.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _ImbibleAppReact = require('./ImbibleApp.react.es6');

var _ImbibleAppReact2 = _interopRequireDefault(_ImbibleAppReact);

var _HomePageReact = require('./HomePage.react.es6');

var _HomePageReact2 = _interopRequireDefault(_HomePageReact);

var _DrinkDetailContainerReact = require('../containers/DrinkDetailContainer.react.es6');

var _DrinkDetailContainerReact2 = _interopRequireDefault(_DrinkDetailContainerReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _react2.default.createElement(
  _reactRouter.Router,
  { history: _reactRouter.hashHistory },
  _react2.default.createElement(
    _reactRouter.Route,
    { path: '/', component: _ImbibleAppReact2.default },
    _react2.default.createElement(_reactRouter.IndexRoute, { component: _HomePageReact2.default }),
    _react2.default.createElement(_reactRouter.Route, { path: '/drinks/:id', component: _DrinkDetailContainerReact2.default })
  )
);

exports.default = router;

},{"../containers/DrinkDetailContainer.react.es6":"/Users/iangm/Code/imbible/src/client/containers/DrinkDetailContainer.react.es6","./HomePage.react.es6":"/Users/iangm/Code/imbible/src/client/components/HomePage.react.es6","./ImbibleApp.react.es6":"/Users/iangm/Code/imbible/src/client/components/ImbibleApp.react.es6","react":"react","react-router":"react-router"}],"/Users/iangm/Code/imbible/src/client/components/IngredientAutoSuggest.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAutosuggest = require('react-autosuggest');

var _reactAutosuggest2 = _interopRequireDefault(_reactAutosuggest);

var _SelectedIngredientListContainerReact = require('../containers/SelectedIngredientListContainer.react.es6');

var _SelectedIngredientListContainerReact2 = _interopRequireDefault(_SelectedIngredientListContainerReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IngredientAutoSuggest = function IngredientAutoSuggest(_ref) {
  var suggestions = _ref.suggestions;
  var getSuggestionValue = _ref.getSuggestionValue;
  var renderSuggestion = _ref.renderSuggestion;
  var onSuggestionSelected = _ref.onSuggestionSelected;
  var inputProps = _ref.inputProps;
  var onChange = _ref.onChange;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_reactAutosuggest2.default, { suggestions: suggestions,
      getSuggestionValue: getSuggestionValue,
      renderSuggestion: renderSuggestion,
      onSuggestionSelected: onSuggestionSelected,
      inputProps: Object.assign(inputProps, { onChange: onChange }) }),
    _react2.default.createElement(_SelectedIngredientListContainerReact2.default, null)
  );
};

IngredientAutoSuggest.propTypes = {
  suggestions: _react2.default.PropTypes.array.isRequired,
  getSuggestionValue: _react2.default.PropTypes.func.isRequired,
  renderSuggestion: _react2.default.PropTypes.func.isRequired,
  onSuggestionSelected: _react2.default.PropTypes.func.isRequired,
  inputProps: _react2.default.PropTypes.object.isRequired,
  onChange: _react2.default.PropTypes.func.isRequired
};

exports.default = IngredientAutoSuggest;

},{"../containers/SelectedIngredientListContainer.react.es6":"/Users/iangm/Code/imbible/src/client/containers/SelectedIngredientListContainer.react.es6","react":"react","react-autosuggest":"react-autosuggest"}],"/Users/iangm/Code/imbible/src/client/components/SelectedIngredientList.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SelectedIngredientListItemReact = require('./SelectedIngredientListItem.react.es6');

var _SelectedIngredientListItemReact2 = _interopRequireDefault(_SelectedIngredientListItemReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectedIngredientList = function SelectedIngredientList(_ref) {
  var ingredients = _ref.ingredients;
  var removeIngredient = _ref.removeIngredient;
  return _react2.default.createElement(
    'ul',
    { className: 'selected-ingredients' },
    ingredients.map(function (ingredient) {
      return _react2.default.createElement(_SelectedIngredientListItemReact2.default, _extends({
        key: ingredient.id,
        removeIngredient: removeIngredient
      }, ingredient));
    })
  );
};

SelectedIngredientList.propTypes = {
  ingredients: _react.PropTypes.array.isRequired,
  removeIngredient: _react.PropTypes.func.isRequired
};

exports.default = SelectedIngredientList;

},{"./SelectedIngredientListItem.react.es6":"/Users/iangm/Code/imbible/src/client/components/SelectedIngredientListItem.react.es6","react":"react"}],"/Users/iangm/Code/imbible/src/client/components/SelectedIngredientListItem.react.es6":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IngredientListItem = function IngredientListItem(_ref) {
  var name = _ref.name;
  var id = _ref.id;
  var removeIngredient = _ref.removeIngredient;
  return _react2.default.createElement(
    "li",
    { className: "selected-ingredient" },
    _react2.default.createElement(
      "span",
      { className: "closer",
        onClick: removeIngredient.bind(undefined, id)
      },
      "X"
    ),
    name
  );
};

IngredientListItem.propTypes = {
  name: _react.PropTypes.string.isRequired,
  id: _react.PropTypes.number.isRequired,
  removeIngredient: _react.PropTypes.func.isRequired
};

exports.default = IngredientListItem;

},{"react":"react"}],"/Users/iangm/Code/imbible/src/client/containers/DrinkDetailContainer.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _DrinkDetailViewReact = require('../components/DrinkDetailView.react.es6');

var _DrinkDetailViewReact2 = _interopRequireDefault(_DrinkDetailViewReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state, ownProps) {
  var drink = state.drinks.get(parseInt(ownProps.params.id));
  var drinkIngredients = drink.drinkIngredients.map(function (id) {
    return state.drinkIngredients.get(id);
  });
  return {
    name: drink.name,
    id: drink.id,
    drinkIngredients: drinkIngredients
  };
};

var DrinkDetailContainer = (0, _reactRedux.connect)(mapStateToProps)(_DrinkDetailViewReact2.default);

exports.default = DrinkDetailContainer;

},{"../components/DrinkDetailView.react.es6":"/Users/iangm/Code/imbible/src/client/components/DrinkDetailView.react.es6","react-redux":"react-redux"}],"/Users/iangm/Code/imbible/src/client/containers/DrinkIngredientListItemContainer.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _DrinkIngredientListItemReact = require('../components/DrinkIngredientListItem.react.es6');

var _DrinkIngredientListItemReact2 = _interopRequireDefault(_DrinkIngredientListItemReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state, ownProps) {
  var ingredientName = state.ingredients.get(ownProps.ingredientId).name;
  return {
    name: ingredientName,
    amount: ownProps.amount,
    unit: ownProps.unit,
    id: ownProps.id
  };
};

var DrinkIngredientListItemContainer = (0, _reactRedux.connect)(mapStateToProps)(_DrinkIngredientListItemReact2.default);

exports.default = DrinkIngredientListItemContainer;

},{"../components/DrinkIngredientListItem.react.es6":"/Users/iangm/Code/imbible/src/client/components/DrinkIngredientListItem.react.es6","react-redux":"react-redux"}],"/Users/iangm/Code/imbible/src/client/containers/DrinkListItemContainer.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _DrinkListItemReact = require('../components/DrinkListItem.react.es6');

var _DrinkListItemReact2 = _interopRequireDefault(_DrinkListItemReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state, ownProps) {
  var drink = Object.apply({}, ownProps);
  drink.ingredients = ownProps.ingredientTypes.map(function (type) {
    return state.ingredientTypes.get(type).name;
  });
  return drink;
};

var DrinkListItemContainer = (0, _reactRedux.connect)(mapStateToProps)(_DrinkListItemReact2.default);

exports.default = DrinkListItemContainer;

},{"../components/DrinkListItem.react.es6":"/Users/iangm/Code/imbible/src/client/components/DrinkListItem.react.es6","react-redux":"react-redux"}],"/Users/iangm/Code/imbible/src/client/containers/IngredientAutoSuggestContainer.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _IngredientAutoSuggestReact = require('../components/IngredientAutoSuggest.react.es6');

var _IngredientAutoSuggestReact2 = _interopRequireDefault(_IngredientAutoSuggestReact);

var _actions = require('../actions.es6');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSuggestions(allSuggestions, value) {
  var inputValue = value.trim().toLowerCase();
  var inputLength = inputValue.length;
  var arr = inputLength === 0 ? [] : allSuggestions.filter(function (ingredient) {
    var idx = ingredient.name.toLowerCase().indexOf(value.toLowerCase());
    return idx !== -1 && (idx === 0 || ingredient.name[idx - 1] === ' ');
  });
  return arr.slice(0, 20);
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return _react2.default.createElement(
    'span',
    null,
    suggestion.name
  );
}

function makeOnSuggestionsUpdateRequested(suggestionGetter) {
  return function (_ref) {
    var value = _ref.value;

    updateSuggestionRequested(suggestionGetter(value));
  };
}

var mapStateToProps = function mapStateToProps(state, ownProps) {
  var value = state.autoSuggest.get('value');
  var availableIngredients = state.ingredientTypes.toOrderedSet().subtract(state.autoSuggest.get('pickedSuggestions')).toArray();
  var suggestions = getSuggestions(availableIngredients, value);
  var inputProps = {
    value: value,
    placeholder: 'Type an ingredient'
  };
  return {
    getSuggestionValue: getSuggestionValue,
    renderSuggestion: renderSuggestion,
    inputProps: inputProps,
    suggestions: suggestions
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    onChange: function onChange(event, _ref2) {
      var newValue = _ref2.newValue;
      var method = _ref2.method;

      if (['type', 'escape', 'click'].includes(method)) dispatch((0, _actions.changeSuggestInput)(newValue));
    },
    onSuggestionSelected: function onSuggestionSelected(event, _ref3) {
      var suggestion = _ref3.suggestion;
      var suggestionValue = _ref3.suggestionValue;
      var method = _ref3.method;

      dispatch((0, _actions.addSuggestion)(suggestion));
    }
  };
};

var IngredientAutoSuggestContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_IngredientAutoSuggestReact2.default);

exports.default = IngredientAutoSuggestContainer;

},{"../actions.es6":"/Users/iangm/Code/imbible/src/client/actions.es6","../components/IngredientAutoSuggest.react.es6":"/Users/iangm/Code/imbible/src/client/components/IngredientAutoSuggest.react.es6","react":"react","react-redux":"react-redux"}],"/Users/iangm/Code/imbible/src/client/containers/LoadedDrinkList.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _DrinkListReact = require('../components/DrinkList.react.es6');

var _DrinkListReact2 = _interopRequireDefault(_DrinkListReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isSubset = function isSubset(candidate, arr) {
  var len = candidate.length;
  for (var i = 0; i < len; i++) {
    if (arr.indexOf(candidate[i]) === -1) return false;
  }
  return true;
};

var mapStateToProps = function mapStateToProps(state) {
  var selectedIngredientTypes = state.autoSuggest.get('pickedSuggestions').map(function (s) {
    return s.id;
  });
  var availableDrinks = state.drinks.filter(function (d) {
    return isSubset(selectedIngredientTypes, d.ingredientTypes.concat(d.ingredientSuperTypes));
  });
  return {
    drinks: availableDrinks.slice(0, 20)
  };
};

var LoadedDrinkList = (0, _reactRedux.connect)(mapStateToProps)(_DrinkListReact2.default);

exports.default = LoadedDrinkList;

},{"../components/DrinkList.react.es6":"/Users/iangm/Code/imbible/src/client/components/DrinkList.react.es6","react-redux":"react-redux"}],"/Users/iangm/Code/imbible/src/client/containers/SelectedIngredientListContainer.react.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _SelectedIngredientListReact = require('../components/SelectedIngredientList.react.es6');

var _SelectedIngredientListReact2 = _interopRequireDefault(_SelectedIngredientListReact);

var _actions = require('../actions.es6');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
  return {
    ingredients: state.autoSuggest.get('pickedSuggestions')
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    removeIngredient: function removeIngredient(ingredient) {
      dispatch((0, _actions.removeSuggestion)(ingredient));
    }
  };
};

var LoadedIngredientList = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_SelectedIngredientListReact2.default);

exports.default = LoadedIngredientList;

},{"../actions.es6":"/Users/iangm/Code/imbible/src/client/actions.es6","../components/SelectedIngredientList.react.es6":"/Users/iangm/Code/imbible/src/client/components/SelectedIngredientList.react.es6","react-redux":"react-redux"}],"/Users/iangm/Code/imbible/src/client/loadSampleData.es6":[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _actions=require("./actions.es6");function loadSampleData(store){sampleData.drinkIngredients.forEach(function(drinkIngredient){return store.dispatch((0,_actions.addDrinkIngredient)(drinkIngredient));});sampleData.ingredients.forEach(function(i){store.dispatch((0,_actions.addIngredient)(i));});sampleData.ingredientTypes.forEach(function(t){store.dispatch((0,_actions.addIngredientType)(t));});sampleData.drinks.forEach(function(d){store.dispatch((0,_actions.addDrink)(d));});}var sampleData={"ingredients":[{"id":1,"name":"El Dorado 151 Rum","ingredientType":1,"ingredientSuperType":2},{"id":2,"name":"Lemon Hart 151 Rum","ingredientType":1,"ingredientSuperType":2},{"id":3,"name":"St. George Absinthe","ingredientType":3},{"id":4,"name":"Vieux Pontarlier Absinthe","ingredientType":3},{"id":5,"name":"Pernod 68 Absinthe","ingredientType":3},{"id":6,"name":"Absinthe Bitters","ingredientType":4},{"id":7,"name":"Acid Phosphate","ingredientType":5},{"id":8,"name":"Agave Nectar","ingredientType":6},{"id":9,"name":"Agave Syrup","ingredientType":7},{"id":10,"name":"Avuá Amburana Cachaça","ingredientType":8,"ingredientSuperType":2},{"id":11,"name":"La Favorite Rhum Agricole Ambre","ingredientType":8,"ingredientSuperType":2},{"id":12,"name":"La Favorite Rhum Agricole Blanc","ingredientType":8,"ingredientSuperType":2},{"id":13,"name":"Neisson Rhum Agricole Blanc","ingredientType":8,"ingredientSuperType":2},{"id":14,"name":"Rhum JM 100-proof Agricole Blanc","ingredientType":8,"ingredientSuperType":2},{"id":15,"name":"Beleza Pura Cachaça","ingredientType":8,"ingredientSuperType":2},{"id":16,"name":"Rhum Clément V.S.O.P.","ingredientType":8,"ingredientSuperType":2},{"id":17,"name":"St. James Royal Ambre Rhum Agricole","ingredientType":8,"ingredientSuperType":2},{"id":18,"name":"Barbancourt 3-star Rhum","ingredientType":8,"ingredientSuperType":2},{"id":19,"name":"Barbancourt 8-Year Rhum","ingredientType":8,"ingredientSuperType":2},{"id":20,"name":"Barbancourt White Rhum","ingredientType":8,"ingredientSuperType":2},{"id":21,"name":"Neisson Rhum Réserve Spéciale","ingredientType":8,"ingredientSuperType":2},{"id":22,"name":"Sagatiba Cachaça","ingredientType":8,"ingredientSuperType":2},{"id":23,"name":"Mãe de Ouro Cachaça","ingredientType":8,"ingredientSuperType":2},{"id":24,"name":"Dale Degroff’s Pimento Bitters","ingredientType":9},{"id":25,"name":"St. Elizabeth Allspice Dram Liqueur","ingredientType":10},{"id":26,"name":"Amaretto Liqueur","ingredientType":11},{"id":27,"name":"Lazzaroni Amaretto Liqueur","ingredientType":11},{"id":28,"name":"Luxardo Amaretto Liqueur","ingredientType":11},{"id":29,"name":"Peruvian Amargo Bitters","ingredientType":12},{"id":30,"name":"Amaro Averna Liqueur","ingredientType":13},{"id":31,"name":"Amaro Ciociaro Liqueur","ingredientType":13},{"id":32,"name":"Amaro Lucano Liqueur","ingredientType":13},{"id":33,"name":"Amaro Meletti Liqueur","ingredientType":13},{"id":34,"name":"Amaro Nardini Liqueur","ingredientType":13},{"id":35,"name":"Amaro Nonino Liqueur","ingredientType":13},{"id":36,"name":"Amer Picon Liqueur","ingredientType":13},{"id":37,"name":"Cardamaro Amaro Liqueur","ingredientType":13},{"id":38,"name":"Cynar Liqueur","ingredientType":13},{"id":39,"name":"Fernet-Branca Liqueur","ingredientType":13},{"id":40,"name":"Luxardo Amaro Abano Liqueur","ingredientType":13},{"id":41,"name":"Ramazzotti Liqueur","ingredientType":13},{"id":42,"name":"Luxardo Bitter Liqueur","ingredientType":13},{"id":43,"name":"Zwack Liqueur","ingredientType":13},{"id":44,"name":"American Whiskey","ingredientType":14,"ingredientSuperType":15},{"id":45,"name":"Barbadillo Principe Amontillado Sherry","ingredientType":16,"ingredientSuperType":17},{"id":46,"name":"Lustau Amontillado Sherry","ingredientType":16,"ingredientSuperType":17},{"id":47,"name":"Lustau Los Arcos Amontillado Sherry","ingredientType":16,"ingredientSuperType":17},{"id":48,"name":"Ocho Añejo Tequila","ingredientType":18,"ingredientSuperType":19},{"id":49,"name":"Pueblo Viejo Añejo Tequila","ingredientType":18,"ingredientSuperType":19},{"id":50,"name":"Siembra Azul Añejo Tequila","ingredientType":18,"ingredientSuperType":19},{"id":51,"name":"Don Julio Añejo Tequila","ingredientType":18,"ingredientSuperType":19},{"id":52,"name":"El Tesoro Añejo Tequila","ingredientType":18,"ingredientSuperType":19},{"id":53,"name":"Star Anise","ingredientType":20},{"id":54,"name":"Lillet Blanc Aperitif Wine","ingredientType":21},{"id":55,"name":"Lillet Rosé Aperitif Wine","ingredientType":21},{"id":56,"name":"Lillet Rouge Aperitif Wine","ingredientType":21},{"id":57,"name":"Bonal Gentiane-quina Aperitif Wine","ingredientType":21},{"id":58,"name":"Cocchi Americano Aperitif Wine","ingredientType":21},{"id":59,"name":"Dubonnet Rouge Aperitif Wine","ingredientType":21},{"id":60,"name":"Pasquet Pineau Des Charentes Aperitif Wine","ingredientType":21},{"id":61,"name":"Fuji Apple","ingredientType":22},{"id":62,"name":"Granny Smith Apple","ingredientType":22},{"id":63,"name":"Apple","ingredientType":22},{"id":64,"name":"Laird’s Bonded Apple Brandy","ingredientType":23},{"id":65,"name":"Laird’s AppleJack Brandy","ingredientType":23},{"id":66,"name":"Calvados Brandy","ingredientType":24},{"id":67,"name":"Daron Fine Calvados Brandy","ingredientType":24},{"id":68,"name":"Berentzen Apfelkorn Apple Liqueur","ingredientType":25},{"id":69,"name":"Drouhin Pommeau Liqueur","ingredientType":25},{"id":70,"name":"Schönauer Apfel Schnapps Liqueur","ingredientType":25},{"id":71,"name":"Bonne Maman Apricot Preserves","ingredientType":26},{"id":72,"name":"Marie Brizard Apricot Liqueur","ingredientType":27},{"id":73,"name":"Rothman & Winter Orchard Apricot Liqueur","ingredientType":27},{"id":74,"name":"Krogstad Aquavit","ingredientType":28},{"id":75,"name":"Linie Aquavit","ingredientType":28},{"id":76,"name":"Kümmel Liqueur","ingredientType":29},{"id":77,"name":"Tariquet Vs Classique Bas-Armagnac","ingredientType":30},{"id":78,"name":"Adam Elmegirab’s Boker’s Bitters","ingredientType":31},{"id":79,"name":"Angostura Bitters","ingredientType":31},{"id":80,"name":"Bitter Truth Aromatic Bitters","ingredientType":31},{"id":81,"name":"Fee Brothers Whiskey Barrel-Aged Bitters","ingredientType":31},{"id":82,"name":"Peychaud’s Bitters","ingredientType":31},{"id":83,"name":"Fee Brothers Old Fashion Bitters","ingredientType":31},{"id":84,"name":"Feldman’s Barrel-Aged Bitters","ingredientType":31},{"id":85,"name":"Abbott’s Bitters","ingredientType":31},{"id":86,"name":"The Bitter Truth Jerry Thomas Bitters","ingredientType":31},{"id":87,"name":"Asparagus","ingredientType":32},{"id":88,"name":"Aged Balsamic Vinegar","ingredientType":33},{"id":89,"name":"Brizard Crème de Banane Liqueur","ingredientType":34},{"id":90,"name":"Banana Syrup","ingredientType":35},{"id":91,"name":"Basil","ingredientType":36},{"id":92,"name":"van Oosten Batavia Arrack","ingredientType":37},{"id":93,"name":"Becherovka Liqueur","ingredientType":38},{"id":94,"name":"Negra Modelo Beer","ingredientType":39},{"id":95,"name":"Blanche de Bruxelles Beer","ingredientType":40},{"id":96,"name":"Red Bell Pepper","ingredientType":41},{"id":97,"name":"Green Bell Pepper","ingredientType":41},{"id":98,"name":"Bénédictine Liqueur","ingredientType":42},{"id":99,"name":"Bergerac Mix","ingredientType":43},{"id":100,"name":"Seasonal Berries","ingredientType":44},{"id":101,"name":"Martini Bianco Vermouth","ingredientType":45},{"id":102,"name":"Cinzano Bianco Vermouth","ingredientType":45},{"id":103,"name":"Contratta Vermouth Bianco","ingredientType":45},{"id":104,"name":"Aperol Liqueur","ingredientType":46},{"id":105,"name":"Campari Liqueur","ingredientType":47},{"id":106,"name":"Gran Classico Bitter Liqueur","ingredientType":48},{"id":107,"name":"American Fruits Black Currant Cordial","ingredientType":49},{"id":108,"name":"Black Peppercorns","ingredientType":50},{"id":109,"name":"Noval Black Port","ingredientType":51,"ingredientSuperType":52},{"id":110,"name":"Blackberry","ingredientType":53},{"id":111,"name":"Massenez Crème de Mûre Blackberry Liqueur","ingredientType":54},{"id":112,"name":"Blackberry Purée","ingredientType":55},{"id":113,"name":"Dolin Blanc Vermouth","ingredientType":56},{"id":114,"name":"El Tesoro Platinum Tequila","ingredientType":57,"ingredientSuperType":19},{"id":115,"name":"Siembra Azul Blanco Tequila","ingredientType":57,"ingredientSuperType":19},{"id":116,"name":"Tapatio 110 Blanco Tequila","ingredientType":57,"ingredientSuperType":19},{"id":117,"name":"Ocho 2012 Plata Tequila","ingredientType":57,"ingredientSuperType":19},{"id":118,"name":"Partida Blanco Tequila","ingredientType":57,"ingredientSuperType":19},{"id":119,"name":"Siete Leguas Blanco Tequila","ingredientType":57,"ingredientSuperType":19},{"id":120,"name":"Cabeza Blanco Tequila","ingredientType":57,"ingredientSuperType":19},{"id":121,"name":"Cabrito Blanco Tequila","ingredientType":57,"ingredientSuperType":19},{"id":122,"name":"Chinaco Verde Blanco Tequila","ingredientType":57,"ingredientSuperType":19},{"id":123,"name":"Don Julio Blanco Tequila","ingredientType":57,"ingredientSuperType":19},{"id":124,"name":"Gran Centenario Blanco Tequila","ingredientType":57,"ingredientSuperType":19},{"id":125,"name":"L & J Blanco Tequila","ingredientType":57,"ingredientSuperType":19},{"id":126,"name":"José Cuervo Platino Tequila","ingredientType":57,"ingredientSuperType":19},{"id":127,"name":"Banks 5 Island Rum","ingredientType":58,"ingredientSuperType":2},{"id":128,"name":"Compass Box Asyla Scotch Whisky","ingredientType":59,"ingredientSuperType":60},{"id":129,"name":"Famous Grouse Scotch Whisky","ingredientType":59,"ingredientSuperType":60},{"id":130,"name":"Chivas Regal 12-Year Blended Scotch Whisky","ingredientType":59,"ingredientSuperType":60},{"id":131,"name":"Compass Box Oak Cross Blended Malt Scotch Whisky","ingredientType":59,"ingredientSuperType":60},{"id":132,"name":"Williams & Humbert Dry Sack Medium Sherry","ingredientType":61,"ingredientSuperType":17},{"id":133,"name":"Blood Orange","ingredientType":62},{"id":134,"name":"Solerno Blood Orange Liqueur","ingredientType":63},{"id":135,"name":"Bloody Mary Mix","ingredientType":64},{"id":136,"name":"Blueberry","ingredientType":65},{"id":137,"name":"Baker's 107-proof Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":138,"name":"Baker’s Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":139,"name":"Buffalo Trace Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":140,"name":"Eagle Rare 10-Year Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":141,"name":"Elijah Craig 12-Year Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":142,"name":"Old Grand-Dad Bonded Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":143,"name":"Russell’s Reserve 10-Year Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":144,"name":"Woodford Reserve Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":145,"name":"Booker’s Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":146,"name":"Bulleit Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":147,"name":"Maker’s Mark Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":148,"name":"Old Weller Antique 107 Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":149,"name":"Stagg Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":150,"name":"Evan Williams Single-barrel Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":151,"name":"George T. Stagg Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":152,"name":"Knob Creek Bourbon Whiskey","ingredientType":66,"ingredientSuperType":15},{"id":153,"name":"Candied Ginger","ingredientType":67},{"id":154,"name":"Cantaloupe","ingredientType":68},{"id":155,"name":"Cardamom","ingredientType":69},{"id":156,"name":"Celery","ingredientType":70},{"id":157,"name":"Bitter Truth Celery Bitters","ingredientType":71},{"id":158,"name":"Chamomile Tea","ingredientType":72},{"id":159,"name":"Brut Champagne","ingredientType":73},{"id":160,"name":"Prosecco","ingredientType":73},{"id":161,"name":"Brut Prosecco","ingredientType":73},{"id":162,"name":"Perrier-Jouët Grand Brut Champagne","ingredientType":73},{"id":163,"name":"Zardetto Prosecco","ingredientType":73},{"id":164,"name":"Demi-Sec Champagne","ingredientType":73},{"id":165,"name":"Moët Imperial Champagne","ingredientType":74},{"id":166,"name":"Morro Bay Chardonnay Wine","ingredientType":75},{"id":167,"name":"Brandied Cherry","ingredientType":76},{"id":168,"name":"Cherry","ingredientType":76},{"id":169,"name":"Bittercube Cherry Bark and Vanilla Bitters","ingredientType":77},{"id":170,"name":"Clear Creek Kirschwasser Brandy","ingredientType":78},{"id":171,"name":"Massenez Kirsch Vieux Cherry Brandy","ingredientType":78},{"id":172,"name":"Kirsch Liqueur","ingredientType":79},{"id":173,"name":"Cherry Heering Liqueur","ingredientType":80},{"id":174,"name":"Black Cherry Purée","ingredientType":81},{"id":175,"name":"Dark Chocolate","ingredientType":82},{"id":176,"name":"Godiva Original Liqueur","ingredientType":83},{"id":177,"name":"Marie Brizard Crème de Cacao Liqueur","ingredientType":83},{"id":178,"name":"Marie Brizard Dark Crème de Cacao Liqueur","ingredientType":83},{"id":179,"name":"Alchemia Chocolate Vodka","ingredientType":84},{"id":180,"name":"Brooklyn Black Chocolate Stout Beer","ingredientType":85},{"id":181,"name":"Cholula","ingredientType":86},{"id":182,"name":"Cilantro","ingredientType":87},{"id":183,"name":"Cinnamon Stick","ingredientType":88},{"id":184,"name":"Ground Cinnamon","ingredientType":88},{"id":185,"name":"Cinnamon Bark Syrup","ingredientType":89},{"id":186,"name":"Hangar One Buddha’s Hand Vodka","ingredientType":90},{"id":187,"name":"Clove","ingredientType":91},{"id":188,"name":"Club Soda","ingredientType":92},{"id":189,"name":"Kalani Ron de Coco Coconut Liqueur","ingredientType":93},{"id":190,"name":"Ciao Bella Coconut Sorbet","ingredientType":94},{"id":191,"name":"Coconut Water","ingredientType":95},{"id":192,"name":"Coffee","ingredientType":96},{"id":193,"name":"9th Street Alphabet City Coffee Concentrate","ingredientType":97},{"id":194,"name":"Galliano Ristretto Liqueur","ingredientType":98},{"id":195,"name":"Illy Espresso Liqueur","ingredientType":98},{"id":196,"name":"Kahlúa","ingredientType":98},{"id":197,"name":"Martell V.S.O.P. Cognac","ingredientType":99},{"id":198,"name":"Pierre Ferrand 1840 Cognac","ingredientType":99},{"id":199,"name":"Pierre Ferrand Ambre Cognac","ingredientType":99},{"id":200,"name":"Rémy Martin V.S.O.P. Cognac","ingredientType":99},{"id":201,"name":"Cognac","ingredientType":99},{"id":202,"name":"Courvoisier Cognac","ingredientType":99},{"id":203,"name":"Courvoisier VS Cognac","ingredientType":99},{"id":204,"name":"Guillon-painturaud Cognac Grande Champagne Vsop","ingredientType":99},{"id":205,"name":"Hine H Cognac","ingredientType":99},{"id":206,"name":"Hine V.S.O.P. Cognac","ingredientType":99},{"id":207,"name":"Louis Royer Force 53 Cognac","ingredientType":99},{"id":208,"name":"Louis Royer Force 53 VSOP Cognac","ingredientType":99},{"id":209,"name":"Coca-Cola Classic","ingredientType":100},{"id":210,"name":"Glen Thunder Corn Whiskey","ingredientType":101,"ingredientSuperType":15},{"id":211,"name":"Cranberry","ingredientType":102},{"id":212,"name":"Cranberry Juice","ingredientType":103},{"id":213,"name":"Heavy Cream","ingredientType":104},{"id":214,"name":"Coco Lopez Cream of Coconut","ingredientType":105},{"id":215,"name":"Alvear Festival Pale Cream Sherry","ingredientType":106,"ingredientSuperType":17},{"id":216,"name":"Morenita Cream Sherry","ingredientType":106,"ingredientSuperType":17},{"id":217,"name":"Lustau East India Solera Sherry","ingredientType":106,"ingredientSuperType":17},{"id":218,"name":"Del Maguey Crema de Mezcal","ingredientType":107},{"id":219,"name":"Marie Brizard White Crème de Cacao Liqueur","ingredientType":83},{"id":220,"name":"Theuriet Crème de Cassis Liqueur","ingredientType":108},{"id":221,"name":"Crème de Cassis Liqueur","ingredientType":108},{"id":222,"name":"Merlet Crème de Fraise des Bois Strawberry Liqueur","ingredientType":109},{"id":223,"name":"Marie Brizard White Crème de Menthe Liqueur","ingredientType":110},{"id":224,"name":"Massenez Crème de Pêche Liqueur","ingredientType":111},{"id":225,"name":"Crème Yvette Liqueur","ingredientType":112},{"id":226,"name":"Rothman & Winter Crème de Violette Liqueur","ingredientType":112},{"id":227,"name":"Rhum Clément Créole Shrubb","ingredientType":113},{"id":228,"name":"Havana Club 7-Year Rum","ingredientType":114,"ingredientSuperType":2},{"id":229,"name":"Matusalem Gran Reserva Rum","ingredientType":114,"ingredientSuperType":2},{"id":230,"name":"Cucumber","ingredientType":115},{"id":231,"name":"Cumin Syrup","ingredientType":116},{"id":232,"name":"Curry Leaves","ingredientType":117},{"id":233,"name":"Cruzan Black Strap Rum","ingredientType":118,"ingredientSuperType":2},{"id":234,"name":"Gosling’s Black Seal Rum","ingredientType":118,"ingredientSuperType":2},{"id":235,"name":"Myers’s Dark Rum","ingredientType":118,"ingredientSuperType":2},{"id":236,"name":"El Dorado 12-Year Rum","ingredientType":119,"ingredientSuperType":2},{"id":237,"name":"El Dorado 15-Year Rum","ingredientType":119,"ingredientSuperType":2},{"id":238,"name":"El Dorado 3-Year Rum","ingredientType":119,"ingredientSuperType":2},{"id":239,"name":"Lemon Hart Original Rum","ingredientType":119,"ingredientSuperType":2},{"id":240,"name":"Tokaji Aszú 5 Puttonyos “Red Label” Wine","ingredientType":120},{"id":241,"name":"Dill","ingredientType":121},{"id":242,"name":"Donn’s Mix #1","ingredientType":122},{"id":243,"name":"Donn’s Spices #2","ingredientType":123},{"id":244,"name":"Drambuie Liqueur","ingredientType":124},{"id":245,"name":"Dried Banana Chip","ingredientType":125},{"id":246,"name":"Dried Persimmon","ingredientType":126},{"id":247,"name":"Dried Rose Buds","ingredientType":127},{"id":248,"name":"Anchor Junipero Gin","ingredientType":128,"ingredientSuperType":129},{"id":249,"name":"Beefeater 24 Gin","ingredientType":128,"ingredientSuperType":129},{"id":250,"name":"Beefeater London Dry Gin","ingredientType":128,"ingredientSuperType":129},{"id":251,"name":"Bombay London Dry Gin","ingredientType":128,"ingredientSuperType":129},{"id":252,"name":"Perry’s Tot Navy-strength Gin","ingredientType":128,"ingredientSuperType":129},{"id":253,"name":"Tanqueray No. 10 Gin","ingredientType":128,"ingredientSuperType":129},{"id":254,"name":"Aviation Gin","ingredientType":128,"ingredientSuperType":129},{"id":255,"name":"Dolin Dry Vermouth","ingredientType":130},{"id":256,"name":"Noilly Prat Dry Vermouth","ingredientType":130},{"id":257,"name":"Vya Dry Vermouth","ingredientType":130},{"id":258,"name":"Dry Vermouth","ingredientType":130},{"id":259,"name":"Vermouth de Provence","ingredientType":130},{"id":260,"name":"Egg","ingredientType":131},{"id":261,"name":"St-Germain Elderflower Liqueur","ingredientType":132},{"id":262,"name":"Élixir Combier Liqueur","ingredientType":133},{"id":263,"name":"Mount Gay Eclipse Amber Rum","ingredientType":134,"ingredientSuperType":2},{"id":264,"name":"Mount Gay Eclipse White Rum","ingredientType":134,"ingredientSuperType":2},{"id":265,"name":"Mount Gay X.O. Rum","ingredientType":134,"ingredientSuperType":2},{"id":266,"name":"Plantation Barbados 5-Year Rum","ingredientType":134,"ingredientSuperType":2},{"id":267,"name":"John D. Taylor’s Velvet Falernum Liqueur","ingredientType":135},{"id":268,"name":"Fennel Bulb","ingredientType":136},{"id":269,"name":"St. Dalfour Fig Jam","ingredientType":137},{"id":270,"name":"Fig Purée","ingredientType":138},{"id":271,"name":"Charbay Ruby Red Grapefruit Vodka","ingredientType":139},{"id":272,"name":"Galliano L’Autentico Liqueur","ingredientType":140},{"id":273,"name":"Dolin Génépy des Alpes Liqueur","ingredientType":141},{"id":274,"name":"Anchor Genevieve Gin","ingredientType":142},{"id":275,"name":"Bols Barrel-aged Genever","ingredientType":142},{"id":276,"name":"Bols Genever","ingredientType":142},{"id":277,"name":"Salers Aperitif Gentiane Liqueur","ingredientType":143},{"id":278,"name":"Ginger","ingredientType":144},{"id":279,"name":"Ginger Ale","ingredientType":145},{"id":280,"name":"Ginger Beer","ingredientType":145},{"id":281,"name":"Ginger Syrup","ingredientType":146},{"id":282,"name":"Herb Pharm Goldenseal Tincture","ingredientType":147},{"id":283,"name":"Granny Smith Apple Juice","ingredientType":148},{"id":284,"name":"Red Grape","ingredientType":149},{"id":285,"name":"Concord Grape","ingredientType":149},{"id":286,"name":"Concord Shrubb","ingredientType":150},{"id":287,"name":"Bittermens Hopped Grapefruit Bitters","ingredientType":151},{"id":288,"name":"Grapefruit","ingredientType":152},{"id":289,"name":"Combier Pamplemousse Rose Liqueur","ingredientType":153},{"id":290,"name":"San Pellegrino Pompelmo Grapefruit Soda","ingredientType":154},{"id":291,"name":"Ruby Red Grapefruit","ingredientType":155},{"id":292,"name":"Green Chartreuse Liqueur","ingredientType":156},{"id":293,"name":"Green Grape","ingredientType":157},{"id":294,"name":"Grenadine","ingredientType":158},{"id":295,"name":"Bittermens Hellfire Habanero Shrub","ingredientType":159},{"id":296,"name":"Hibiscus Cordial","ingredientType":160},{"id":297,"name":"Hibiscus Syrup","ingredientType":161},{"id":298,"name":"Chilled Brewed Hibiscus Tea","ingredientType":162},{"id":299,"name":"Honey","ingredientType":163},{"id":300,"name":"Bärenjäger Liqueur","ingredientType":164},{"id":301,"name":"Nonino Gioiello","ingredientType":164},{"id":302,"name":"Acacia Honey Syrup","ingredientType":165},{"id":303,"name":"Honey Syrup","ingredientType":165},{"id":304,"name":"Honeydew Melon","ingredientType":166},{"id":305,"name":"Horchata","ingredientType":167},{"id":306,"name":"Tabasco","ingredientType":168},{"id":307,"name":"Decorative Ice Block","ingredientType":169},{"id":308,"name":"Rose-infused Lillet Rosé Aperitif Wine","ingredientType":170},{"id":309,"name":"Chamomile-infused Bianco Vermouth","ingredientType":171},{"id":310,"name":"Fig-infused Elijah Craig Bourbon Whiskey","ingredientType":172},{"id":311,"name":"Goji Berry-Infused Four Roses Single Barrel Bourbon Whiskey","ingredientType":172},{"id":312,"name":"Peach-Infused Maker's Mark Bourbon Whiskey","ingredientType":172},{"id":313,"name":"Pecan-infused Buffalo Trace Bourbon Whiskey","ingredientType":172},{"id":314,"name":"Benton’s Bacon Fat-Infused Four Roses Bourbon Whiskey","ingredientType":172},{"id":315,"name":"Hibiscus-Infused Bernheim Wheat Whiskey","ingredientType":172},{"id":316,"name":"Lavender-infused Bernheim Original Wheat Whiskey","ingredientType":172},{"id":317,"name":"Cacao Nib–infused Campari","ingredientType":173},{"id":318,"name":"Coffee- and Chile-infused Campari Liqueur","ingredientType":173},{"id":319,"name":"Walnut-Infused Hine V.S.O.P. Cognac","ingredientType":174},{"id":320,"name":"Watermelon-infused Dolin Dry Vermouth","ingredientType":175},{"id":321,"name":"Lavender-Infused Plymouth Gin","ingredientType":176},{"id":322,"name":"Sugar Snap Pea–Infused Plymouth Gin","ingredientType":176},{"id":323,"name":"Szechuan Peppercorn–Infused Plymouth Gin","ingredientType":176},{"id":324,"name":"Pennyroyal-Infused Hayman’s Old Tom Gin","ingredientType":176},{"id":325,"name":"Scarlet Glow Tea–infused Macchu Pisco","ingredientType":177},{"id":326,"name":"Strawberry- and Pineapple-infused Macchu Pisco","ingredientType":177},{"id":327,"name":"Chamomile-Infused Barsol Quebranta Pisco","ingredientType":177},{"id":328,"name":"English Bishop Port Infusion","ingredientType":178},{"id":329,"name":"Sencha Green Tea-Infused Leblon Cachaça","ingredientType":179},{"id":330,"name":"Strawberry-Infused Mãe de Ouro Cachaça","ingredientType":179},{"id":331,"name":"Banana Chip–Infused Gosling’s Black Seal Rum","ingredientType":179},{"id":332,"name":"Granny Smith Apple–infused Barbancourt Rhum","ingredientType":179},{"id":333,"name":"Pineapple-Infused Flor de Caña Extra-dry White Rum","ingredientType":179},{"id":334,"name":"Popcorn-Infused Flor de Caña Silver Dry Rum","ingredientType":179},{"id":335,"name":"Summer Royale Tea–infused Flor de Caña White Rum","ingredientType":179},{"id":336,"name":"Birch-Infused Rittenhouse Bonded Rye Whiskey","ingredientType":180},{"id":337,"name":"Chamomile-infused Old Overholt Rye","ingredientType":180},{"id":338,"name":"Dried Currant–infused Wild Turkey Rye Whiskey","ingredientType":180},{"id":339,"name":"Red Thai Chile–infused Rittenhouse Rye Whiskey","ingredientType":180},{"id":340,"name":"Fuji Apple–infused Famous Grouse Scotch Whisky","ingredientType":181},{"id":341,"name":"Apricot-infused Famous Grouse Scotch Whisky","ingredientType":181},{"id":342,"name":"Coconut Green Tea–infused Famous Grouse Scotch Whisky","ingredientType":181},{"id":343,"name":"Ancho Chile-infused Dolin Rouge Sweet Vermouth","ingredientType":182},{"id":344,"name":"Cinnamon Orange Tea–Infused Sweet Vermouth","ingredientType":182},{"id":345,"name":"Coffee-Infused Carpano Antica Formula Sweet Vermouth","ingredientType":182},{"id":346,"name":"Grapefruit-Infused Punt e Mes Sweet Vermouth","ingredientType":182},{"id":347,"name":"Jujube Tea-Infused Vya Sweet Vermouth","ingredientType":182},{"id":348,"name":"Basil-infused Dolin Blanc Vermouth","ingredientType":182},{"id":349,"name":"Chai-Infused Cinzano Sweet Vermouth","ingredientType":182},{"id":350,"name":"Earl Grey–infused Dolin Blanc Vermouth","ingredientType":182},{"id":351,"name":"Red Bush–Infused Dolin Blanc Sweet Vermouth","ingredientType":182},{"id":352,"name":"Sage-infused Dolin Blanc Vermouth","ingredientType":182},{"id":353,"name":"Cacao Nib–infused Cabeza Blanco Tequila","ingredientType":183},{"id":354,"name":"Jalapeño-Infused Siembra Azul Blanco Tequila","ingredientType":183},{"id":355,"name":"Lapsang Souchong–Infused Siembra Azul Blanco Tequila","ingredientType":183},{"id":356,"name":"Queen of Earl Tea–infused Siembra Azul Reposado Tequila","ingredientType":183},{"id":357,"name":"Spiced Pear–infused Siembra Azul Blanco Tequila","ingredientType":183},{"id":358,"name":"Green Flash Ipa Beer","ingredientType":184},{"id":359,"name":"Redbreast 12-Year Irish Whiskey","ingredientType":185},{"id":360,"name":"Black Bush Irish Whiskey","ingredientType":185},{"id":361,"name":"Bushmills Irish Whiskey","ingredientType":185},{"id":362,"name":"Jameson 12-Year Irish Whiskey","ingredientType":185},{"id":363,"name":"Jameson Irish Whiskey","ingredientType":185},{"id":364,"name":"Clontarf 1014 Irish Whiskey","ingredientType":185},{"id":365,"name":"Bruichladdich Port Charlotte 7-Year Scotch Whisky","ingredientType":186,"ingredientSuperType":60},{"id":366,"name":"Ardbeg 10-Year Single Malt Scotch Whisky","ingredientType":187,"ingredientSuperType":60},{"id":367,"name":"Compass Box Peat Monster Blended Malt Scotch Whisky","ingredientType":187,"ingredientSuperType":60},{"id":368,"name":"Laphroaig 10-Year Scotch Whisky","ingredientType":187,"ingredientSuperType":60},{"id":369,"name":"Laphroaig 12-Year Scotch Whisky","ingredientType":187,"ingredientSuperType":60},{"id":370,"name":"Jalapeño","ingredientType":188},{"id":371,"name":"Appleton Estate Reserve Rum","ingredientType":189,"ingredientSuperType":2},{"id":372,"name":"Appleton Estate V/X Rum","ingredientType":189,"ingredientSuperType":2},{"id":373,"name":"Smith & Cross Jamaican Rum","ingredientType":189,"ingredientSuperType":2},{"id":374,"name":"Wray & Nephew Overproof Rum","ingredientType":189,"ingredientSuperType":2},{"id":375,"name":"Nikka Taketsuru 12-Year Japanese Malt Whisky","ingredientType":190},{"id":376,"name":"Suntory Hakushu 12-Year Whiskey","ingredientType":190},{"id":377,"name":"Yamazaki 12-Year Japanese Single Malt Whisky","ingredientType":190},{"id":378,"name":"Golden Star Sparkling White Jasmine Tea","ingredientType":191},{"id":379,"name":"Kaffir Lime Leaf","ingredientType":192},{"id":380,"name":"Boiron Kalamansi Puree","ingredientType":193},{"id":381,"name":"42 Below Kiwi Vodka","ingredientType":194},{"id":382,"name":"Kumquat","ingredientType":195},{"id":383,"name":"Full Sail Session Black Lager Beer","ingredientType":196},{"id":384,"name":"Scrappy’s Lavender Bitters","ingredientType":197},{"id":385,"name":"Lavender Tincture","ingredientType":198},{"id":386,"name":"Lemon","ingredientType":199},{"id":387,"name":"Lemon-Lime Soda","ingredientType":200},{"id":388,"name":"Licor 43 Liqueur","ingredientType":201},{"id":389,"name":"Toby’s Lime Cordial","ingredientType":202},{"id":390,"name":"Lime Cordial","ingredientType":202},{"id":391,"name":"Lime","ingredientType":203},{"id":392,"name":"Berkshire Mountain Distillers’ Greylock Gin","ingredientType":204,"ingredientSuperType":129},{"id":393,"name":"Fords Gin","ingredientType":204,"ingredientSuperType":129},{"id":394,"name":"Martin Miller’s Westbourne Strength 100-proof Gin","ingredientType":204,"ingredientSuperType":129},{"id":395,"name":"Blandy’s 5-Year Malmsey Madeira","ingredientType":205,"ingredientSuperType":52},{"id":396,"name":"Mandarine Napoléon Liqueur","ingredientType":206},{"id":397,"name":"Lustau Manzanilla Sherry","ingredientType":207,"ingredientSuperType":17},{"id":398,"name":"La Cigarrera Manzanilla Sherry","ingredientType":207,"ingredientSuperType":17},{"id":399,"name":"La Gitana Manzanilla Sherry","ingredientType":207,"ingredientSuperType":17},{"id":400,"name":"Maple Syrup","ingredientType":208},{"id":401,"name":"Grade B Maple Syrup","ingredientType":208},{"id":402,"name":"Luxardo Maraschino Liqueur","ingredientType":209},{"id":403,"name":"Maraska Maraschino Liqueur","ingredientType":209},{"id":404,"name":"Charbay Meyer Lemon Vodka","ingredientType":210},{"id":405,"name":"Sombra Mezcal","ingredientType":211},{"id":406,"name":"Del Maguey Chichicapa Mezcal","ingredientType":211},{"id":407,"name":"Del Maguey Espadin Especial Mezcal","ingredientType":211},{"id":408,"name":"Del Maguey San Luis Del Rio Mezcal","ingredientType":211},{"id":409,"name":"Del Maguey Vida Mezcal","ingredientType":211},{"id":410,"name":"Los Amantes Joven Mezcal","ingredientType":211},{"id":411,"name":"Los Nahuales Mezcal","ingredientType":211},{"id":412,"name":"Whole Milk","ingredientType":212},{"id":413,"name":"Mint","ingredientType":213},{"id":414,"name":"Bittermens Xocolatl Mole Bitters","ingredientType":214},{"id":415,"name":"Gulden’s Spicy Brown Mustard","ingredientType":215},{"id":416,"name":"Nectarine","ingredientType":216},{"id":417,"name":"Bruichladdich Botanist Gin","ingredientType":217,"ingredientSuperType":129},{"id":418,"name":"Cadenhead’s Old Raj Gin 55","ingredientType":217,"ingredientSuperType":129},{"id":419,"name":"Dorothy Parker Gin","ingredientType":217,"ingredientSuperType":129},{"id":420,"name":"Hendrick’s Gin","ingredientType":217,"ingredientSuperType":129},{"id":421,"name":"Monteverdi Nocino Liqueur","ingredientType":218},{"id":422,"name":"Nutmeg","ingredientType":219},{"id":423,"name":"High West Silver Oat Whiskey","ingredientType":220},{"id":424,"name":"Hayman’s Old Tom Gin","ingredientType":221,"ingredientSuperType":129},{"id":425,"name":"Ransom Old Tom Gin","ingredientType":221,"ingredientSuperType":129},{"id":426,"name":"Green Olive","ingredientType":222},{"id":427,"name":"Lustau Oloroso Sherry","ingredientType":223,"ingredientSuperType":17},{"id":428,"name":"Navel Orange","ingredientType":224},{"id":429,"name":"House Orange Bitters","ingredientType":225},{"id":430,"name":"Regan’s Orange Bitters","ingredientType":225},{"id":431,"name":"Orange Flower Water","ingredientType":226},{"id":432,"name":"Orange","ingredientType":227},{"id":433,"name":"Cointreau Liqueur","ingredientType":228},{"id":434,"name":"Gabriel Boudier Curaçao Liqueur","ingredientType":228},{"id":435,"name":"Grand Marnier Liqueur","ingredientType":228},{"id":436,"name":"Marie Brizard Orange Curaçao Liqueur","ingredientType":228},{"id":437,"name":"Pierre Ferrand Dry Curaçao Liqueur","ingredientType":228},{"id":438,"name":"San Pellegrino Aranciata","ingredientType":229},{"id":439,"name":"Oregano","ingredientType":230},{"id":440,"name":"Orgeat","ingredientType":231},{"id":441,"name":"Lustau Palo Cortado Sherry","ingredientType":232},{"id":442,"name":"Boiron Passion Fruit Purée","ingredientType":233},{"id":443,"name":"Passion Fruit Syrup","ingredientType":234},{"id":444,"name":"Ricard Pastis Liqueur","ingredientType":235},{"id":445,"name":"Peach","ingredientType":236},{"id":446,"name":"Fee Brothers Peach Bitters","ingredientType":237},{"id":447,"name":"Mathilde Pêche Liqueur","ingredientType":238},{"id":448,"name":"Pear","ingredientType":239},{"id":449,"name":"Anjou Pear","ingredientType":239},{"id":450,"name":"Bartlett Pear","ingredientType":239},{"id":451,"name":"Clear Creek Pear Brandy","ingredientType":240},{"id":452,"name":"Belle de Brillet Liqueur","ingredientType":241},{"id":453,"name":"Lustau Pedro Ximénez Sherry","ingredientType":242,"ingredientSuperType":17},{"id":454,"name":"Toro Albalá Pedro Ximénez Sherry","ingredientType":242,"ingredientSuperType":17},{"id":455,"name":"Pendennis Mix","ingredientType":243},{"id":456,"name":"Pickled Ramp Brine","ingredientType":244},{"id":457,"name":"Pimm’s No. 1 Cup Liqueur","ingredientType":245},{"id":458,"name":"Zirbenz Stone Pine Liqueur","ingredientType":246},{"id":459,"name":"Pineapple","ingredientType":247},{"id":460,"name":"Pineapple Leaf","ingredientType":248},{"id":461,"name":"Pineapple Syrup","ingredientType":249},{"id":462,"name":"Campo de Encanto Acholado Pisco","ingredientType":250},{"id":463,"name":"Waqar Pisco","ingredientType":250},{"id":464,"name":"Macchu Pisco","ingredientType":250},{"id":465,"name":"Pisco Capel Reservado Brandy","ingredientType":250},{"id":466,"name":"La Diablada Pisco","ingredientType":250},{"id":467,"name":"Barsol Pisco Quebranta Brandy","ingredientType":250},{"id":468,"name":"Clear Creek Plum Brandy","ingredientType":251},{"id":469,"name":"Plymouth Gin","ingredientType":252,"ingredientSuperType":129},{"id":470,"name":"Plymouth Navy Strength Gin","ingredientType":252,"ingredientSuperType":129},{"id":471,"name":"Pomegranate Juice","ingredientType":253},{"id":472,"name":"Pama Pomegranate Liqueur","ingredientType":254},{"id":473,"name":"Al Wadi Pomegranate Molasses","ingredientType":255},{"id":474,"name":"Pomegranate Molasses","ingredientType":255},{"id":475,"name":"Southampton Pumpkin Ale Beer","ingredientType":256},{"id":476,"name":"Pumpkin Butter","ingredientType":257},{"id":477,"name":"Pumpkin Puree","ingredientType":258},{"id":478,"name":"Libby’s Pumpkin Purée","ingredientType":258},{"id":479,"name":"Kronan Swedish Punsch Liqueur","ingredientType":259},{"id":480,"name":"Carlshamns Flaggpunsch Liqueur","ingredientType":259},{"id":481,"name":"Quince Shrubb","ingredientType":260},{"id":482,"name":"Raspberry","ingredientType":261},{"id":483,"name":"Massenez Crème de Framboise Liqueur","ingredientType":262},{"id":484,"name":"Pasquet Marie-Framboise Liqueur","ingredientType":262},{"id":485,"name":"Trimbach Framboise Liqueur","ingredientType":262},{"id":486,"name":"Dry Red Wine","ingredientType":263},{"id":487,"name":"Beaujolais Nouveau Wine","ingredientType":263},{"id":488,"name":"Paumanok Cabernet Franc Wine","ingredientType":263},{"id":489,"name":"Rioja Wine","ingredientType":263},{"id":490,"name":"El Tesoro Reposado Tequila","ingredientType":264,"ingredientSuperType":19},{"id":491,"name":"Partida Reposado Tequila","ingredientType":264,"ingredientSuperType":19},{"id":492,"name":"Pueblo Viejo Reposado Tequila","ingredientType":264,"ingredientSuperType":19},{"id":493,"name":"Siembra Azul Reposado Tequila","ingredientType":264,"ingredientSuperType":19},{"id":494,"name":"Siete Leguas Reposado Tequila","ingredientType":264,"ingredientSuperType":19},{"id":495,"name":"Centinela Reposado Tequila","ingredientType":264,"ingredientSuperType":19},{"id":496,"name":"Don Julio Reposado Tequila","ingredientType":264,"ingredientSuperType":19},{"id":497,"name":"Fortaleza Reposado Tequila","ingredientType":264,"ingredientSuperType":19},{"id":498,"name":"Gran Centenario Reposado Tequila","ingredientType":264,"ingredientSuperType":19},{"id":499,"name":"Jose Cuervo Tradicional Reposado Tequila","ingredientType":264,"ingredientSuperType":19},{"id":500,"name":"Fee Brothers Rhubarb Bitters","ingredientType":265},{"id":501,"name":"Boiron Rhubarb Purée","ingredientType":266},{"id":502,"name":"Ssal-Yut Rice Syrup","ingredientType":267},{"id":503,"name":"Dr. Konstantin Frank Dry Riesling Wine","ingredientType":268},{"id":504,"name":"Koval Rose Hip Liqueur","ingredientType":269},{"id":505,"name":"Mymoune Rose Syrup","ingredientType":270},{"id":506,"name":"Shinn Estate Rosé Wine","ingredientType":271},{"id":507,"name":"Rosemary","ingredientType":272},{"id":508,"name":"Royal Combier Liqueur","ingredientType":273},{"id":509,"name":"Ruby Port","ingredientType":274,"ingredientSuperType":52},{"id":510,"name":"Michter’s US No. 1 Rye Whiskey","ingredientType":275,"ingredientSuperType":15},{"id":511,"name":"Old Overholt Rye Whiskey","ingredientType":275,"ingredientSuperType":15},{"id":512,"name":"Rittenhouse Bonded Rye Whiskey","ingredientType":275,"ingredientSuperType":15},{"id":513,"name":"Russell’s Reserve Rye Whiskey","ingredientType":275,"ingredientSuperType":15},{"id":514,"name":"Templeton Rye Whiskey","ingredientType":275,"ingredientSuperType":15},{"id":515,"name":"Wild Turkey 101-proof Rye Whiskey","ingredientType":275,"ingredientSuperType":15},{"id":516,"name":"Wild Turkey Russell’s Reserve 6-Year Rye Whiskey","ingredientType":275,"ingredientSuperType":15},{"id":517,"name":"Old Potrero Hotaling’s Rye Whiskey","ingredientType":275,"ingredientSuperType":15},{"id":518,"name":"Sazerac 6-Year Rye Whiskey","ingredientType":275,"ingredientSuperType":15},{"id":519,"name":"Sage","ingredientType":276},{"id":520,"name":"Kamoizumi “Shusen” Sake","ingredientType":277},{"id":521,"name":"Kamoizumi Nigori Sake","ingredientType":277},{"id":522,"name":"Bek Se Ju “100-Year Wine”","ingredientType":277},{"id":523,"name":"Masumi “Okuden” Junmai Sake","ingredientType":277},{"id":524,"name":"Masumi Arabashiri Sake","ingredientType":277},{"id":525,"name":"Kosher Salt","ingredientType":278},{"id":526,"name":"Borsci Sambuca Liqueur","ingredientType":279},{"id":527,"name":"Sauvignon Blanc Wine","ingredientType":280},{"id":528,"name":"Scarlet Glow Syrup","ingredientType":281},{"id":529,"name":"Blandy’s Sercial Madeira","ingredientType":282,"ingredientSuperType":52},{"id":530,"name":"Shiso Leaves","ingredientType":283},{"id":531,"name":"Simple Syrup","ingredientType":284},{"id":532,"name":"Oban 14-Year Single Malt Scotch Whisky","ingredientType":285,"ingredientSuperType":286},{"id":533,"name":"Springbank 10-Year Scotch Whisky","ingredientType":285,"ingredientSuperType":286},{"id":534,"name":"Benromach 12-Year Single Malt Scotch Whisky","ingredientType":285,"ingredientSuperType":286},{"id":535,"name":"Macallan Fine Oak 10-Year Scotch Whisky","ingredientType":285,"ingredientSuperType":286},{"id":536,"name":"Talisker 10-Year Single Malt Scotch Whisky","ingredientType":285,"ingredientSuperType":286},{"id":537,"name":"Bowmore 12-Year Scotch Whisky","ingredientType":285,"ingredientSuperType":286},{"id":538,"name":"Highland Park 12-Year Scotch Whisky","ingredientType":285,"ingredientSuperType":286},{"id":539,"name":"Caol Ila 12-Year Scotch Whisky","ingredientType":285,"ingredientSuperType":286},{"id":540,"name":"Glenlivet 12-Year Single Malt Scotch Whisky","ingredientType":285,"ingredientSuperType":286},{"id":541,"name":"Knappogue Castle 12-Year Irish Whiskey","ingredientType":287},{"id":542,"name":"Plymouth Sloe Gin Liqueur","ingredientType":288,"ingredientSuperType":129},{"id":543,"name":"Sloe Gin Liqueur","ingredientType":289},{"id":544,"name":"Smoked Salt","ingredientType":290},{"id":545,"name":"Gran Duque D’Alba Brandy de Jerez","ingredientType":291},{"id":546,"name":"Zacapa Centenario 23 Rum","ingredientType":292,"ingredientSuperType":2},{"id":547,"name":"10 Cane Rum","ingredientType":292,"ingredientSuperType":2},{"id":548,"name":"Angostura 5-Year Rum","ingredientType":292,"ingredientSuperType":2},{"id":549,"name":"Bacardi 8 Rum","ingredientType":292,"ingredientSuperType":2},{"id":550,"name":"Bacardi Ron Superior Limited Edition Rum","ingredientType":292,"ingredientSuperType":2},{"id":551,"name":"Caña Brava Rum","ingredientType":292,"ingredientSuperType":2},{"id":552,"name":"Cruzan Single-barrel Rum","ingredientType":292,"ingredientSuperType":2},{"id":553,"name":"Diplomático Reserva Exclusiva Rum","ingredientType":292,"ingredientSuperType":2},{"id":554,"name":"Flor de Caña 12-Year-old Rum","ingredientType":292,"ingredientSuperType":2},{"id":555,"name":"Flor de Caña 7-Year Rum","ingredientType":292,"ingredientSuperType":2},{"id":556,"name":"Flor de Caña Silver Dry Rum","ingredientType":292,"ingredientSuperType":2},{"id":557,"name":"Santa Teresa 1796 Rum","ingredientType":292,"ingredientSuperType":2},{"id":558,"name":"Pampero Aniversario Rum","ingredientType":292,"ingredientSuperType":2},{"id":559,"name":"Ron del Barrilito 3-star Rum","ingredientType":292,"ingredientSuperType":2},{"id":560,"name":"Scarlet Ibis Rum","ingredientType":292,"ingredientSuperType":2},{"id":561,"name":"Llopart Cava Leopardi Brut Rosé","ingredientType":293},{"id":562,"name":"Sparkling Rosé Wine","ingredientType":294},{"id":563,"name":"Spiced Macchu Pisco","ingredientType":295},{"id":564,"name":"Mackeson Stout Beer","ingredientType":296},{"id":565,"name":"Strawberry","ingredientType":297},{"id":566,"name":"Bonne Maman Strawberry Preserves","ingredientType":298},{"id":567,"name":"Strawberry-Balsamic Gastrique","ingredientType":299},{"id":568,"name":"Strega Liqueur","ingredientType":300},{"id":569,"name":"Sugar","ingredientType":301},{"id":570,"name":"Superfine Sugar","ingredientType":301},{"id":571,"name":"Sugar Cube","ingredientType":301},{"id":572,"name":"Demerara Sugar","ingredientType":301},{"id":573,"name":"Angostura Bitters-soaked sugar cube","ingredientType":301},{"id":574,"name":"Martinique Cane Syrup","ingredientType":302},{"id":575,"name":"Suze Liqueur","ingredientType":303},{"id":576,"name":"Carpano Antica Formula Sweet Vermouth","ingredientType":304},{"id":577,"name":"Cinzano Sweet Vermouth","ingredientType":304},{"id":578,"name":"Dolin Rouge Sweet Vermouth","ingredientType":304},{"id":579,"name":"House Sweet Vermouth","ingredientType":304},{"id":580,"name":"Martini Sweet Vermouth","ingredientType":304},{"id":581,"name":"Punt e Mes Sweet Vermouth","ingredientType":304},{"id":582,"name":"Vya Sweet Vermouth","ingredientType":304},{"id":583,"name":"Contratto Americano Rosso Vermouth","ingredientType":304},{"id":584,"name":"Cocchi Vermouth di Torino","ingredientType":304},{"id":585,"name":"Tamarind Purée","ingredientType":305},{"id":586,"name":"Tangerine","ingredientType":306},{"id":587,"name":"Otima 10-Year Tawny Port","ingredientType":307,"ingredientSuperType":52},{"id":588,"name":"Dow’s Tawny Port","ingredientType":307,"ingredientSuperType":52},{"id":589,"name":"George Dickel No. 12 Tennessee Whisky","ingredientType":308},{"id":590,"name":"Thai Basil","ingredientType":309},{"id":591,"name":"Bittermens ’elemakule Tiki Bitters","ingredientType":310},{"id":592,"name":"Toasted Fennel Salt","ingredientType":311},{"id":593,"name":"Tonic Syrup","ingredientType":312},{"id":594,"name":"Trader Tiki’s Don’s Mix","ingredientType":313},{"id":595,"name":"Vanilla Bean","ingredientType":314},{"id":596,"name":"Vanilla Butter","ingredientType":315},{"id":597,"name":"Navan Vanilla Liqueur","ingredientType":316},{"id":598,"name":"Vanilla Syrup","ingredientType":317},{"id":599,"name":"Eurovanille Vanilla Syrup","ingredientType":317},{"id":600,"name":"Vegetable Skewer","ingredientType":318},{"id":601,"name":"A.B. Smeby Verbena Bitters","ingredientType":319},{"id":602,"name":"Fusion Verjus Blanc","ingredientType":320},{"id":603,"name":"Portuguese Vinho Verde Wine","ingredientType":321},{"id":604,"name":"Charbay Vodka","ingredientType":322},{"id":605,"name":"Russian Standard Vodka","ingredientType":322},{"id":606,"name":"Smirnoff Vodka","ingredientType":322},{"id":607,"name":"Belvedere Vodka","ingredientType":322},{"id":608,"name":"Luksusowa Potato Vodka","ingredientType":322},{"id":609,"name":"Karlsson’s Gold Vodka","ingredientType":322},{"id":610,"name":"Smirnoff Black Vodka","ingredientType":322},{"id":611,"name":"Water","ingredientType":323},{"id":612,"name":"Watermelon","ingredientType":324},{"id":613,"name":"Bernheim Wheat Whiskey","ingredientType":325,"ingredientSuperType":15},{"id":614,"name":"White Peach Purée","ingredientType":326},{"id":615,"name":"Channing Daughters Scuttlehole Chardonnay Wine","ingredientType":327},{"id":616,"name":"Yellow Chartreuse Liqueur","ingredientType":328},{"id":617,"name":"Greek Yogurt","ingredientType":329},{"id":618,"name":"Zombie Mix","ingredientType":330}],"ingredientTypes":[{"name":"151 Rum / Demerara Rum","id":1},{"name":"Rum","id":2},{"name":"Absinthe","id":3},{"name":"Absinthe Bitters","id":4},{"name":"Acid Phosphate","id":5},{"name":"Agave Nectar","id":6},{"name":"Agave Syrup","id":7},{"name":"Agricole Rum","id":8},{"name":"Allspice Bitters","id":9},{"name":"Allspice Dram","id":10},{"name":"Amaretto","id":11},{"name":"Amargo Bitters","id":12},{"name":"Amaro","id":13},{"name":"American Whiskey","id":14},{"name":"Whiskey (US)","id":15},{"name":"Amontillado Sherry","id":16},{"name":"Sherry","id":17},{"name":"Anejo Tequila","id":18},{"name":"Tequila","id":19},{"name":"Anise","id":20},{"name":"Aperitif Wine","id":21},{"name":"Apple","id":22},{"name":"Apple Brandy","id":23},{"name":"Apple Brandy / Calvados","id":24},{"name":"Apple Liqueuer","id":25},{"name":"Apricot Jam","id":26},{"name":"Apricot Liqueur","id":27},{"name":"Aquavit","id":28},{"name":"Aquavit / Kummel","id":29},{"name":"Armagnac","id":30},{"name":"Aromatic Bitters","id":31},{"name":"Asparagus","id":32},{"name":"Balsamic Vinegar","id":33},{"name":"Banana Liqueuer","id":34},{"name":"Banana Syrup","id":35},{"name":"Basil","id":36},{"name":"Batavia Arrack","id":37},{"name":"Becherovka","id":38},{"name":"Beer","id":39},{"name":"Belgian White Beer","id":40},{"name":"Bell Pepper","id":41},{"name":"Benedictine","id":42},{"name":"Bergerac Mix","id":43},{"name":"Berries","id":44},{"name":"Bianco Vermouth","id":45},{"name":"Bitter Amaro / Aperol","id":46},{"name":"Bitter Amaro / Campari","id":47},{"name":"Bitter Amaro / Gran Classico","id":48},{"name":"Black Currant","id":49},{"name":"Black Peppercorns","id":50},{"name":"Black Port","id":51},{"name":"Port","id":52},{"name":"Blackberry","id":53},{"name":"Blackberry Liqueur","id":54},{"name":"Blackberry Purée","id":55},{"name":"Blanc Vermouth","id":56},{"name":"Blanco Tequila","id":57},{"name":"Blended Rum","id":58},{"name":"Blended Scotch","id":59},{"name":"Whisky (Scotch)","id":60},{"name":"Blended Sherry","id":61},{"name":"Blood Orange","id":62},{"name":"Blood Orange Liqueur","id":63},{"name":"Bloody Mary Mix","id":64},{"name":"Blueberry","id":65},{"name":"Bourbon Whiskey","id":66},{"name":"Candied Ginger","id":67},{"name":"Cantaloupe","id":68},{"name":"Cardamom","id":69},{"name":"Celery","id":70},{"name":"Celery Bitters","id":71},{"name":"Chamomile Tea","id":72},{"name":"Champagne","id":73},{"name":"Chapmagne","id":74},{"name":"Chardonnay Wine","id":75},{"name":"Cherry","id":76},{"name":"Cherry Bark and Vanilla Bitters","id":77},{"name":"Cherry Brandy","id":78},{"name":"Cherry Liqueuer","id":79},{"name":"Cherry Liqueur","id":80},{"name":"Cherry Purée","id":81},{"name":"Chocolate","id":82},{"name":"Chocolate Liqueur","id":83},{"name":"Chocolate LIquor","id":84},{"name":"Chocolate Stout Beer","id":85},{"name":"Cholula","id":86},{"name":"Cilantro","id":87},{"name":"Cinnamon","id":88},{"name":"Cinnamon Bark Syrup","id":89},{"name":"Citrus Vodka","id":90},{"name":"Clove","id":91},{"name":"Club Soda","id":92},{"name":"Coconut Liqueur","id":93},{"name":"Coconut Sorbet","id":94},{"name":"Coconut Water","id":95},{"name":"Coffee","id":96},{"name":"Coffee Concentrate","id":97},{"name":"Coffee Liqueur","id":98},{"name":"Cognac","id":99},{"name":"Cola","id":100},{"name":"Corn Whiskey","id":101},{"name":"Cranberry","id":102},{"name":"Cranberry Juice","id":103},{"name":"Cream","id":104},{"name":"Cream of Coconut","id":105},{"name":"Cream Sherry","id":106},{"name":"Crema de Mezcal","id":107},{"name":"Cassis Liqueur","id":108},{"name":"Strawberry Liqueur","id":109},{"name":"Mint Liqueur","id":110},{"name":"Peach Liqueur","id":111},{"name":"Violet Liqueur","id":112},{"name":"Creole Shrubb","id":113},{"name":"Cuban Rum","id":114},{"name":"Cucumber","id":115},{"name":"Cumin Syrup","id":116},{"name":"Curry Leaves","id":117},{"name":"Dark Rum","id":118},{"name":"Demerara Rum","id":119},{"name":"Desert Wine","id":120},{"name":"Dill","id":121},{"name":"Donn’s Mix #1","id":122},{"name":"Donn’s Spices #2","id":123},{"name":"Drambuie","id":124},{"name":"Dried Banana Chip","id":125},{"name":"Dried Persimmon","id":126},{"name":"Dried Rose Buds","id":127},{"name":"Dry Gin","id":128},{"name":"Gin","id":129},{"name":"Dry Vermouth","id":130},{"name":"Egg","id":131},{"name":"Elderflower Liqueur","id":132},{"name":"Élixir Combier Liqueur","id":133},{"name":"English-style Rum","id":134},{"name":"Falernum","id":135},{"name":"Fennel Bulb","id":136},{"name":"Fig Jam","id":137},{"name":"Fig Puree","id":138},{"name":"Fruit Vodka","id":139},{"name":"Galliano","id":140},{"name":"Genepy","id":141},{"name":"Genever","id":142},{"name":"Gentiane Liqueur","id":143},{"name":"Ginger","id":144},{"name":"Ginger Beer","id":145},{"name":"Ginger Syrup","id":146},{"name":"Goldenseal Tincture","id":147},{"name":"Granny Smith Apple Juice","id":148},{"name":"Grape","id":149},{"name":"Grape Shrubb","id":150},{"name":"Grapefruit Bitters","id":151},{"name":"Grapefruit Juice","id":152},{"name":"Grapefruit Liqueuer","id":153},{"name":"Grapefruit Soda","id":154},{"name":"Graperfruit Juice","id":155},{"name":"Green Chartreuse","id":156},{"name":"Green Grape","id":157},{"name":"Grenadine","id":158},{"name":"Habanero Shrub","id":159},{"name":"Hibiscus Cordial","id":160},{"name":"Hibiscus Syrup","id":161},{"name":"Hibiscus Tea","id":162},{"name":"Honey","id":163},{"name":"Honey Liqueuer","id":164},{"name":"Honey Syrup","id":165},{"name":"Honeydew Melon","id":166},{"name":"Horchata","id":167},{"name":"Hot Sauce","id":168},{"name":"Ice Block","id":169},{"name":"Infused Aperitif Wine","id":170},{"name":"Infused Bianco Vermouth","id":171},{"name":"Infused Bourbon Whiskey","id":172},{"name":"Infused Campari","id":173},{"name":"Infused Cognac","id":174},{"name":"Infused Dry Vermouth","id":175},{"name":"Infused Gin","id":176},{"name":"Infused Pisco","id":177},{"name":"Infused Port Wine","id":178},{"name":"Infused Rum","id":179},{"name":"Infused Rye Whiskey","id":180},{"name":"Infused Scotch Whisky","id":181},{"name":"Infused Sweet Vermouth","id":182},{"name":"Infused Tequila","id":183},{"name":"IPA Beer","id":184},{"name":"Irish Whiskey","id":185},{"name":"Islay Scotch Whiskey","id":186},{"name":"Islay Scotch Whisky","id":187},{"name":"Jalapeno","id":188},{"name":"Jamaican Rum","id":189},{"name":"Japanese Whisky","id":190},{"name":"Jasmine Tea","id":191},{"name":"Kaffir Lime Leaf","id":192},{"name":"Kalamansi Puree","id":193},{"name":"Kiwi Vodka","id":194},{"name":"Kumquat","id":195},{"name":"Lager Beer","id":196},{"name":"Lavender Bitters","id":197},{"name":"Lavender Tincture","id":198},{"name":"Lemon Juice","id":199},{"name":"Lemon-Lime Soda","id":200},{"name":"Licor 43","id":201},{"name":"Lime Cordial","id":202},{"name":"Lime Juice","id":203},{"name":"London Dry Gin","id":204},{"name":"Malvasia Madeira","id":205},{"name":"Mandarin Liqueuer / Orange Liqueur","id":206},{"name":"Manzanilla Sherry","id":207},{"name":"Maple Syrup","id":208},{"name":"Maraschino Liqueur","id":209},{"name":"Meyer Lemon Vodka","id":210},{"name":"Mezcal","id":211},{"name":"Milk","id":212},{"name":"Mint","id":213},{"name":"Mole Bitters","id":214},{"name":"Mustard","id":215},{"name":"Nectarine","id":216},{"name":"New Style Gin","id":217},{"name":"Nocino","id":218},{"name":"Nutmeg","id":219},{"name":"Oat Whiskey","id":220},{"name":"Old Tom Gin","id":221},{"name":"Olive","id":222},{"name":"Oloroso Sherry","id":223},{"name":"Orange","id":224},{"name":"Orange Bitters","id":225},{"name":"Orange Flower Water","id":226},{"name":"Orange Juice","id":227},{"name":"Orange Liqueur","id":228},{"name":"Orange Soda","id":229},{"name":"Oregano","id":230},{"name":"Orgeat","id":231},{"name":"Palo Cortado Sherry","id":232},{"name":"Passion Fruit Puree","id":233},{"name":"Passion Fruit Syrup","id":234},{"name":"Pastis","id":235},{"name":"Peach","id":236},{"name":"Peach Bitters","id":237},{"name":"Peach Liqueuer","id":238},{"name":"Pear","id":239},{"name":"Pear Brandy","id":240},{"name":"Pear Liqueuer","id":241},{"name":"Pedro Ximenez Sherry","id":242},{"name":"Pendennis Mix","id":243},{"name":"Pickled Ramp Brine","id":244},{"name":"Pimm’s No. 1 Cup Liqueur","id":245},{"name":"Pine Liqueur","id":246},{"name":"Pineapple Juice","id":247},{"name":"Pineapple Leaf","id":248},{"name":"Pineapple Syrup","id":249},{"name":"Pisco","id":250},{"name":"Plum Brandy","id":251},{"name":"Plymouth Gin","id":252},{"name":"Pomegranate Juice","id":253},{"name":"Pomegranate Liquer","id":254},{"name":"Pomegranate Molasses","id":255},{"name":"Pumpkin Beer","id":256},{"name":"Pumpkin Butter","id":257},{"name":"Pumpkin Puree","id":258},{"name":"Punsch","id":259},{"name":"Quince Shrubb","id":260},{"name":"Raspberry","id":261},{"name":"Raspberry Liqueuer","id":262},{"name":"Red Wine","id":263},{"name":"Reposado Tequila","id":264},{"name":"Rhubarb Bitters","id":265},{"name":"Rhubarb Puree","id":266},{"name":"Rice Syrup","id":267},{"name":"Riesling Wine","id":268},{"name":"Rose Hip Liqueuer","id":269},{"name":"Rose Syrup","id":270},{"name":"Rose Wine","id":271},{"name":"Rosemary","id":272},{"name":"Royal Combier Liqueur","id":273},{"name":"Ruby Port","id":274},{"name":"Rye Whiskey","id":275},{"name":"Sage","id":276},{"name":"Sake","id":277},{"name":"Salt","id":278},{"name":"Sambuca","id":279},{"name":"Sauvignon Blanc Wine","id":280},{"name":"Scarlet Glow Syrup","id":281},{"name":"Sercial Madeira","id":282},{"name":"Shiso Leaves","id":283},{"name":"Simple Syrup","id":284},{"name":"Single Malt Scotch Whisky","id":285},{"name":"Whiskey (Scotch)","id":286},{"name":"Single Malt Irish Whiskey","id":287},{"name":"Sloe Gin","id":288},{"name":"Sloe Gin Liqueur","id":289},{"name":"Smoked Salt","id":290},{"name":"Spanish Brandy","id":291},{"name":"Spanish-Style Rum","id":292},{"name":"Sparkling Rose Wine","id":293},{"name":"Sparkling Rosé Wine","id":294},{"name":"Spiced Pisco","id":295},{"name":"Stout Beer","id":296},{"name":"Strawberry","id":297},{"name":"Strawberry Jam","id":298},{"name":"Strawberry-Balsamic Gastrique","id":299},{"name":"Strega","id":300},{"name":"Sugar","id":301},{"name":"Sugar Cane Syrup","id":302},{"name":"Suze","id":303},{"name":"Sweet Vermouth","id":304},{"name":"Tamarind Purée","id":305},{"name":"Tangerine","id":306},{"name":"Tawny Port","id":307},{"name":"Tennessee Whiskey","id":308},{"name":"Thai Basil","id":309},{"name":"Tiki Bitters","id":310},{"name":"Toasted Fennel Salt","id":311},{"name":"Tonic Syrup","id":312},{"name":"Trader Tiki’s Don’s Mix","id":313},{"name":"Vanilla Bean","id":314},{"name":"Vanilla Butter","id":315},{"name":"Vanilla Liqueuer","id":316},{"name":"Vanilla Syrup","id":317},{"name":"Vegetable Skewer","id":318},{"name":"Verbena Bitters","id":319},{"name":"Verjus","id":320},{"name":"Vinho Verde Wine","id":321},{"name":"Vodka","id":322},{"name":"Water","id":323},{"name":"Watermelon","id":324},{"name":"Wheat Whiskey","id":325},{"name":"White Peach Purée","id":326},{"name":"White Wine","id":327},{"name":"Yellow Chartreuse","id":328},{"name":"Yogurt","id":329},{"name":"Zombie Mix","id":330}],"drinks":[{"id":549,"name":"#3 Cup","source":"The PDT Cocktail Book","drinkIngredients":[3113,3114,3115,3116,3117,3118,3119,3120,3121],"ingredientTypes":[99,145,304,228,80,199,213,115,227],"ingredientSuperTypes":[]},{"id":548,"name":"#8","source":"The PDT Cocktail Book","drinkIngredients":[3109,3110,3111,3112],"ingredientTypes":[264,232,164,225],"ingredientSuperTypes":[19]},{"id":553,"name":"100 Year Punch","source":"The PDT Cocktail Book","drinkIngredients":[3132,3133,3134,3135],"ingredientTypes":[66,277,267,31],"ingredientSuperTypes":[15]},{"id":131,"name":"18th Century","source":"Death & Co","drinkIngredients":[711,712,713,714],"ingredientTypes":[37,83,304,203],"ingredientSuperTypes":[]},{"id":219,"name":"19th Century","source":"Death & Co","drinkIngredients":[1227,1228,1229,1230],"ingredientTypes":[66,21,83,199],"ingredientSuperTypes":[15]},{"id":220,"name":"202 Steps","source":"Death & Co","drinkIngredients":[1231,1232,1233,1234,1235],"ingredientTypes":[306,66,284,225,227],"ingredientSuperTypes":[15]},{"id":551,"name":"20th Century","source":"The PDT Cocktail Book","drinkIngredients":[3125,3126,3127,3128],"ingredientTypes":[252,83,21,199],"ingredientSuperTypes":[129]},{"id":1,"name":"20th Century","source":"Death & Co","drinkIngredients":[1,2,3,4],"ingredientTypes":[128,83,21,199],"ingredientSuperTypes":[129]},{"id":550,"name":"212","source":"The PDT Cocktail Book","drinkIngredients":[3122,3123,3124],"ingredientTypes":[264,155,46],"ingredientSuperTypes":[19]},{"id":552,"name":"21st Century","source":"The PDT Cocktail Book","drinkIngredients":[3129,3130,3131],"ingredientTypes":[57,83,199],"ingredientSuperTypes":[19]},{"id":383,"name":"6th Street Swizzle","source":"Death & Co","drinkIngredients":[2208,2209,2210,2211],"ingredientTypes":[8,203,284,31],"ingredientSuperTypes":[2]},{"id":554,"name":"Absinthe Drip","source":"The PDT Cocktail Book","drinkIngredients":[3136,3137,3138],"ingredientTypes":[3,323,301],"ingredientSuperTypes":[]},{"id":555,"name":"Against All Odds Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3139,3140,3141,3142],"ingredientTypes":[185,327,27,113],"ingredientSuperTypes":[]},{"id":556,"name":"Águil A Azteca","source":"The PDT Cocktail Book","drinkIngredients":[3143,3144,3145,3146],"ingredientTypes":[264,166,144,112],"ingredientSuperTypes":[19]},{"id":2,"name":"Airmail","source":"Death & Co","drinkIngredients":[5,6,7,8],"ingredientTypes":[292,203,165,73],"ingredientSuperTypes":[2]},{"id":557,"name":"Airmail","source":"The PDT Cocktail Book","drinkIngredients":[3147,3148,3149],"ingredientTypes":[58,203,165],"ingredientSuperTypes":[2]},{"id":166,"name":"Aka Cobbler","source":"Death & Co","drinkIngredients":[922,923,924,925,926,927,928,929],"ingredientTypes":[284,209,199,297,301,57,183,106],"ingredientSuperTypes":[19,17]},{"id":558,"name":"Albert Mathieu","source":"The PDT Cocktail Book","drinkIngredients":[3150,3151,3152,3153,3154],"ingredientTypes":[252,21,156,132,227],"ingredientSuperTypes":[129]},{"id":406,"name":"Alembic","source":"Death & Co","drinkIngredients":[2344,2345,2346,2347,2348],"ingredientTypes":[3,142,284,31,199],"ingredientSuperTypes":[]},{"id":560,"name":"Algonquin","source":"The PDT Cocktail Book","drinkIngredients":[3157,3158,3159],"ingredientTypes":[275,130,247],"ingredientSuperTypes":[15]},{"id":167,"name":"Almond Brother","source":"Death & Co","drinkIngredients":[930,931,932,933,934,935],"ingredientTypes":[264,11,27,203,231,208],"ingredientSuperTypes":[19]},{"id":197,"name":"Alta California","source":"Death & Co","drinkIngredients":[1103,1104,1105,1106],"ingredientTypes":[57,56,328,89],"ingredientSuperTypes":[19]},{"id":483,"name":"Amelia","source":"Speakeasy","drinkIngredients":[2749,2750,2751,2752,2753],"ingredientTypes":[322,132,55,199,213],"ingredientSuperTypes":[]},{"id":475,"name":"Americano","source":"Speakeasy","drinkIngredients":[2708,2709,2710,2711],"ingredientTypes":[47,304,227,92],"ingredientSuperTypes":[]},{"id":559,"name":"Americano Highball","source":"The PDT Cocktail Book","drinkIngredients":[3155,3156],"ingredientTypes":[304,47],"ingredientSuperTypes":[]},{"id":148,"name":"Amityville","source":"Death & Co","drinkIngredients":[813,814,815,816,817,818,819,820,821],"ingredientTypes":[292,58,56,3,148,317,5,225,22],"ingredientSuperTypes":[2,2]},{"id":149,"name":"Angie’s Secret","source":"Death & Co","drinkIngredients":[822,823,824,825,826],"ingredientTypes":[8,189,38,284,214],"ingredientSuperTypes":[2,2]},{"id":425,"name":"Angus Story Daiquiri","source":"Death & Co","drinkIngredients":[2442,2443,2444,2445,2446],"ingredientTypes":[189,292,8,203,284],"ingredientSuperTypes":[2,2,2]},{"id":76,"name":"Anjou Mama","source":"Death & Co","drinkIngredients":[397,398,399,400,401,402,403],"ingredientTypes":[239,176,128,199,231,89,165],"ingredientSuperTypes":[129]},{"id":365,"name":"Aperitivo Julep","source":"Death & Co","drinkIngredients":[2105,2106,2107,2108],"ingredientTypes":[130,13,111,213],"ingredientSuperTypes":[]},{"id":464,"name":"Aperol Spritz","source":"Speakeasy","drinkIngredients":[2661,2662,2663,2664],"ingredientTypes":[73,46,203,92],"ingredientSuperTypes":[]},{"id":561,"name":"Aperol Spritz","source":"The PDT Cocktail Book","drinkIngredients":[3160,3161,3162,3163],"ingredientTypes":[46,73,92,227],"ingredientSuperTypes":[]},{"id":562,"name":"Apple Daiquiri","source":"The PDT Cocktail Book","drinkIngredients":[3164,3165,3166,3167],"ingredientTypes":[292,203,25,284],"ingredientSuperTypes":[2]},{"id":564,"name":"Apple Malt Toddy","source":"The PDT Cocktail Book","drinkIngredients":[3172,3173,3174,3175,3176],"ingredientTypes":[22,59,25,10,208],"ingredientSuperTypes":[60]},{"id":563,"name":"Applejack Rabbit","source":"The PDT Cocktail Book","drinkIngredients":[3168,3169,3170,3171],"ingredientTypes":[23,199,227,208],"ingredientSuperTypes":[]},{"id":565,"name":"Apricot Flip","source":"The PDT Cocktail Book","drinkIngredients":[3177,3178,3179,3180],"ingredientTypes":[99,27,284,131],"ingredientSuperTypes":[]},{"id":566,"name":"Archangel","source":"The PDT Cocktail Book","drinkIngredients":[3181,3182,3183],"ingredientTypes":[252,46,115],"ingredientSuperTypes":[129]},{"id":343,"name":"Arrack Punch","source":"Death & Co","drinkIngredients":[1932,1933,1934,1935,1936,1937,1938],"ingredientTypes":[301,92,189,37,209,203,31],"ingredientSuperTypes":[2]},{"id":150,"name":"Arrack Strap","source":"Death & Co","drinkIngredients":[827,828,829,830,831,832,833,834],"ingredientTypes":[118,37,304,47,284,214,225,227],"ingredientSuperTypes":[2]},{"id":426,"name":"Arrackuiri","source":"Death & Co","drinkIngredients":[2447,2448,2449,2450,2451],"ingredientTypes":[37,203,284,255,213],"ingredientSuperTypes":[]},{"id":567,"name":"Astoria Bianco","source":"The PDT Cocktail Book","drinkIngredients":[3184,3185,3186],"ingredientTypes":[128,45,225],"ingredientSuperTypes":[129]},{"id":198,"name":"Augie March","source":"Death & Co","drinkIngredients":[1107,1108,1109,1110],"ingredientTypes":[264,304,13,76],"ingredientSuperTypes":[19]},{"id":427,"name":"Autumn Daiquiri","source":"Death & Co","drinkIngredients":[2452,2453,2454,2455,2456,2457],"ingredientTypes":[134,203,247,284,89,31],"ingredientSuperTypes":[2]},{"id":3,"name":"Aviation","source":"Death & Co","drinkIngredients":[9,10,11,12,13,14],"ingredientTypes":[252,209,112,199,284,76],"ingredientSuperTypes":[129]},{"id":568,"name":"Aviation","source":"The PDT Cocktail Book","drinkIngredients":[3187,3188,3189,3190],"ingredientTypes":[128,199,209,112],"ingredientSuperTypes":[129]},{"id":485,"name":"Aviation","source":"Speakeasy","drinkIngredients":[2759,2760,2761,2762,2763,2764],"ingredientTypes":[252,199,209,284,31,76],"ingredientSuperTypes":[129]},{"id":248,"name":"B.a.f.","source":"Death & Co","drinkIngredients":[1405,1406,1407,1408,1409],"ingredientTypes":[285,223,46,48,199],"ingredientSuperTypes":[286,17]},{"id":416,"name":"Baltasar And Blimunda","source":"Death & Co","drinkIngredients":[2403,2404,2405,2406,2407],"ingredientTypes":[128,304,47,307,227],"ingredientSuperTypes":[129,52]},{"id":4,"name":"Bamboo","source":"Death & Co","drinkIngredients":[15,16,17,18,19,20],"ingredientTypes":[56,16,284,225,31,199],"ingredientSuperTypes":[17]},{"id":268,"name":"Banana Cognac","source":"Death & Co","drinkIngredients":[1500,1501,1502,1503,1504,1505,1506,1507],"ingredientTypes":[99,8,199,227,35,231,31,125],"ingredientSuperTypes":[2]},{"id":221,"name":"Banks Of Islay","source":"Death & Co","drinkIngredients":[1236,1237,1238,1239,1240],"ingredientTypes":[117,187,203,284,158],"ingredientSuperTypes":[60]},{"id":407,"name":"Bay City Roller","source":"Death & Co","drinkIngredients":[2349,2350,2351,2352],"ingredientTypes":[59,13,284,227],"ingredientSuperTypes":[60]},{"id":569,"name":"Beachbum","source":"The PDT Cocktail Book","drinkIngredients":[3191,3192,3193,3194,3195,3196],"ingredientTypes":[134,292,247,203,27,231],"ingredientSuperTypes":[2,2]},{"id":5,"name":"Bee’s Knees","source":"Death & Co","drinkIngredients":[21,22,23,24,25],"ingredientTypes":[128,199,165,197,76],"ingredientSuperTypes":[129]},{"id":518,"name":"Bee’s Knees","source":"Speakeasy","drinkIngredients":[2931,2932,2933],"ingredientTypes":[217,165,199],"ingredientSuperTypes":[129]},{"id":572,"name":"Bee’s Knees","source":"The PDT Cocktail Book","drinkIngredients":[3203,3204,3205],"ingredientTypes":[252,199,165],"ingredientSuperTypes":[129]},{"id":573,"name":"Bee’s Sip","source":"The PDT Cocktail Book","drinkIngredients":[3206,3207,3208],"ingredientTypes":[177,277,164],"ingredientSuperTypes":[]},{"id":570,"name":"Beer And A Smoke","source":"The PDT Cocktail Book","drinkIngredients":[3197,3198,3199,3200],"ingredientTypes":[211,203,71,86],"ingredientSuperTypes":[]},{"id":571,"name":"Beer Cassis","source":"The PDT Cocktail Book","drinkIngredients":[3201,3202],"ingredientTypes":[21,108],"ingredientSuperTypes":[]},{"id":249,"name":"Bella Cohen","source":"Death & Co","drinkIngredients":[1410,1411,1412,1413,1414,1415],"ingredientTypes":[287,106,228,132,31,199],"ingredientSuperTypes":[17]},{"id":77,"name":"Bella Luna","source":"Death & Co","drinkIngredients":[404,405,406,407,408],"ingredientTypes":[252,132,112,199,284],"ingredientSuperTypes":[129]},{"id":535,"name":"Bellini","source":"Speakeasy","drinkIngredients":[3017,3018,3019],"ingredientTypes":[326,73,111],"ingredientSuperTypes":[]},{"id":428,"name":"Benjamin Barker Daiquiri","source":"Death & Co","drinkIngredients":[2458,2459,2460,2461,2462],"ingredientTypes":[118,47,3,203,284],"ingredientSuperTypes":[2]},{"id":574,"name":"Benton’s Old-fashioned","source":"The PDT Cocktail Book","drinkIngredients":[3209,3210,3211],"ingredientTypes":[172,208,31],"ingredientSuperTypes":[]},{"id":575,"name":"Berlioni","source":"The PDT Cocktail Book","drinkIngredients":[3212,3213,3214],"ingredientTypes":[128,13,130],"ingredientSuperTypes":[129]},{"id":576,"name":"Betsy Ross","source":"The PDT Cocktail Book","drinkIngredients":[3215,3216,3217,3218],"ingredientTypes":[99,274,228,31],"ingredientSuperTypes":[52]},{"id":577,"name":"Betula","source":"The PDT Cocktail Book","drinkIngredients":[3219,3220,3221,3222],"ingredientTypes":[180,114,199,208],"ingredientSuperTypes":[2]},{"id":578,"name":"Bijou","source":"The PDT Cocktail Book","drinkIngredients":[3223,3224,3225,3226],"ingredientTypes":[128,304,156,225],"ingredientSuperTypes":[129]},{"id":344,"name":"Billingsley Punch","source":"Death & Co","drinkIngredients":[1939,1940,1941,1942,1943,1944,1945],"ingredientTypes":[301,92,128,46,152,199,31],"ingredientSuperTypes":[129]},{"id":486,"name":"Billionaire Cocktail","source":"Speakeasy","drinkIngredients":[2765,2766,2767,2768,2769],"ingredientTypes":[66,199,284,158,4],"ingredientSuperTypes":[15]},{"id":302,"name":"Bitter French","source":"Death & Co","drinkIngredients":[1701,1702,1703,1704,1705,1706],"ingredientTypes":[252,47,199,284,73,152],"ingredientSuperTypes":[129]},{"id":579,"name":"Bizet","source":"The PDT Cocktail Book","drinkIngredients":[3227,3228,3229],"ingredientTypes":[271,13,13],"ingredientSuperTypes":[]},{"id":581,"name":"Black Flip","source":"The PDT Cocktail Book","drinkIngredients":[3236,3237,3238,3239],"ingredientTypes":[85,118,284,131],"ingredientSuperTypes":[2]},{"id":582,"name":"Black Jack","source":"The PDT Cocktail Book","drinkIngredients":[3240,3241,3242,3243],"ingredientTypes":[99,78,97,284],"ingredientSuperTypes":[]},{"id":286,"name":"Black Magic","source":"Death & Co","drinkIngredients":[1609,1610,1611,1612,1613,1614],"ingredientTypes":[3,99,292,110,13,284],"ingredientSuperTypes":[2]},{"id":287,"name":"Black Market Brandy","source":"Death & Co","drinkIngredients":[1615,1616,1617,1618,1619,1620],"ingredientTypes":[23,99,182,31,31,76],"ingredientSuperTypes":[]},{"id":250,"name":"Black Market Manhattan","source":"Death & Co","drinkIngredients":[1416,1417,1418,1419],"ingredientTypes":[325,182,31,199],"ingredientSuperTypes":[15]},{"id":397,"name":"Black Market Sling","source":"Death & Co","drinkIngredients":[2294,2295,2296,2297,2298,2299,2300],"ingredientTypes":[23,182,199,284,31,92,76],"ingredientSuperTypes":[]},{"id":584,"name":"Black Thorn (english)","source":"The PDT Cocktail Book","drinkIngredients":[3249,3250,3251,3252],"ingredientTypes":[252,288,304,225],"ingredientSuperTypes":[129,129]},{"id":585,"name":"Black Thorn (irish)","source":"The PDT Cocktail Book","drinkIngredients":[3253,3254,3255],"ingredientTypes":[185,130,31],"ingredientSuperTypes":[]},{"id":586,"name":"Black Thorn Rose","source":"The PDT Cocktail Book","drinkIngredients":[3256,3257,3258,3259],"ingredientTypes":[217,288,21,270],"ingredientSuperTypes":[129,129]},{"id":580,"name":"Blackbeard","source":"The PDT Cocktail Book","drinkIngredients":[3230,3231,3232,3233,3234,3235],"ingredientTypes":[128,28,247,199,7,53],"ingredientSuperTypes":[129]},{"id":583,"name":"Blackstar","source":"The PDT Cocktail Book","drinkIngredients":[3244,3245,3246,3247,3248],"ingredientTypes":[322,203,152,279,284],"ingredientSuperTypes":[]},{"id":222,"name":"Blazing Saddles","source":"Death & Co","drinkIngredients":[1241,1242,1243,1244,1245,1246],"ingredientTypes":[220,153,199,89,310,152],"ingredientSuperTypes":[]},{"id":587,"name":"Blinker","source":"The PDT Cocktail Book","drinkIngredients":[3260,3261,3262,3263],"ingredientTypes":[275,152,284,261],"ingredientSuperTypes":[15]},{"id":6,"name":"Blood And Sand","source":"Death & Co","drinkIngredients":[26,27,28,29,30,31],"ingredientTypes":[285,80,304,227,199,76],"ingredientSuperTypes":[286]},{"id":588,"name":"Blood And Sand","source":"The PDT Cocktail Book","drinkIngredients":[3264,3265,3266,3267],"ingredientTypes":[59,227,80,304],"ingredientSuperTypes":[60]},{"id":536,"name":"Blood Peach Bellini","source":"Speakeasy","drinkIngredients":[3020,3021,3022,3023],"ingredientTypes":[326,158,73,47],"ingredientSuperTypes":[]},{"id":345,"name":"Bloodhound Punch","source":"Death & Co","drinkIngredients":[1946,1947,1948,1949,1950],"ingredientTypes":[66,123,199,65,92],"ingredientSuperTypes":[15]},{"id":537,"name":"Bloody Mary","source":"Speakeasy","drinkIngredients":[3024,3025,3026,3027,3028],"ingredientTypes":[322,64,199,70,318],"ingredientSuperTypes":[]},{"id":223,"name":"Blue Run Sling","source":"Death & Co","drinkIngredients":[1247,1248,1249,1250,1251,1252,1253],"ingredientTypes":[66,13,22,199,317,225,31],"ingredientSuperTypes":[15]},{"id":589,"name":"Bobby Burns","source":"The PDT Cocktail Book","drinkIngredients":[3268,3269,3270],"ingredientTypes":[285,304,42],"ingredientSuperTypes":[286]},{"id":7,"name":"Bobby Burns","source":"Death & Co","drinkIngredients":[32,33,34,35,36],"ingredientTypes":[285,304,124,199,31],"ingredientSuperTypes":[286]},{"id":132,"name":"Boo-ya Cachaça","source":"Death & Co","drinkIngredients":[715,716,717,718,719,720],"ingredientTypes":[8,16,112,203,146,92],"ingredientSuperTypes":[2,17]},{"id":346,"name":"Bookhouse Boys Punch","source":"Death & Co","drinkIngredients":[1951,1952,1953,1954,1955,1956,1957,1958],"ingredientTypes":[180,66,122,152,199,165,146,92],"ingredientSuperTypes":[15]},{"id":303,"name":"Boomin’ Granny","source":"Death & Co","drinkIngredients":[1707,1708,1709,1710,1711,1712],"ingredientTypes":[99,148,203,165,73,22],"ingredientSuperTypes":[]},{"id":103,"name":"Botany Of Desire","source":"Death & Co","drinkIngredients":[563,564,565,566,567,568,569],"ingredientTypes":[217,24,133,320,284,225,22],"ingredientSuperTypes":[129]},{"id":429,"name":"Boukman Daiquiri","source":"Death & Co","drinkIngredients":[2463,2464,2465,2466],"ingredientTypes":[8,99,203,89],"ingredientSuperTypes":[2]},{"id":8,"name":"Boulevardier","source":"Death & Co","drinkIngredients":[37,38,39,40],"ingredientTypes":[66,304,47,199],"ingredientSuperTypes":[15]},{"id":384,"name":"Bourbonnais Swizzle","source":"Death & Co","drinkIngredients":[2212,2213,2214,2215],"ingredientTypes":[172,83,21,199],"ingredientSuperTypes":[]},{"id":590,"name":"Brandy Crusta","source":"The PDT Cocktail Book","drinkIngredients":[3271,3272,3273,3274],"ingredientTypes":[99,199,209,228],"ingredientSuperTypes":[]},{"id":591,"name":"Brazilian Tea Punch","source":"The PDT Cocktail Book","drinkIngredients":[3275,3276,3277],"ingredientTypes":[179,199,203],"ingredientSuperTypes":[]},{"id":592,"name":"Brewer’s Breakfast","source":"The PDT Cocktail Book","drinkIngredients":[3278,3279,3280],"ingredientTypes":[277,101,140],"ingredientSuperTypes":[15]},{"id":199,"name":"Broken Oath","source":"Death & Co","drinkIngredients":[1111,1112,1113,1114,1115],"ingredientTypes":[211,16,304,98,214],"ingredientSuperTypes":[17]},{"id":594,"name":"Bronx","source":"The PDT Cocktail Book","drinkIngredients":[3285,3286,3287,3288],"ingredientTypes":[128,227,130,304],"ingredientSuperTypes":[129]},{"id":9,"name":"Brooklyn","source":"Death & Co","drinkIngredients":[41,42,43,44],"ingredientTypes":[275,130,13,209],"ingredientSuperTypes":[15]},{"id":593,"name":"Brooklyn","source":"The PDT Cocktail Book","drinkIngredients":[3281,3282,3283,3284],"ingredientTypes":[275,130,209,13],"ingredientSuperTypes":[15]},{"id":595,"name":"Brown Bomber","source":"The PDT Cocktail Book","drinkIngredients":[3289,3290,3291],"ingredientTypes":[308,21,303],"ingredientSuperTypes":[]},{"id":10,"name":"Brown Derby","source":"Death & Co","drinkIngredients":[45,46,47,48],"ingredientTypes":[66,152,199,165],"ingredientSuperTypes":[15]},{"id":596,"name":"Brown Derby","source":"The PDT Cocktail Book","drinkIngredients":[3292,3293,3294],"ingredientTypes":[66,152,165],"ingredientSuperTypes":[15]},{"id":597,"name":"Bubbaloo","source":"The PDT Cocktail Book","drinkIngredients":[3295,3296,3297,3298],"ingredientTypes":[250,304,27,12],"ingredientSuperTypes":[]},{"id":251,"name":"Buffalo Soldier","source":"Death & Co","drinkIngredients":[1420,1421],"ingredientTypes":[172,284],"ingredientSuperTypes":[]},{"id":151,"name":"Bumboo","source":"Death & Co","drinkIngredients":[835,836,837,838,839,840,841],"ingredientTypes":[292,284,317,31,31,31,219],"ingredientSuperTypes":[2]},{"id":598,"name":"Buona Notte","source":"The PDT Cocktail Book","drinkIngredients":[3299,3300,3301],"ingredientTypes":[174,328,13],"ingredientSuperTypes":[]},{"id":78,"name":"Cádiz Collins","source":"Death & Co","drinkIngredients":[409,410,411,412,413,414,415],"ingredientTypes":[227,31,252,16,199,284,92],"ingredientSuperTypes":[129,17]},{"id":599,"name":"Café Arroz","source":"The PDT Cocktail Book","drinkIngredients":[3302,3303,3304],"ingredientTypes":[167,264,98],"ingredientSuperTypes":[19]},{"id":333,"name":"Café Sandinista","source":"Death & Co","drinkIngredients":[1867,1868,1869,1870,1871,1872,1873],"ingredientTypes":[106,173,227,203,284,278,96],"ingredientSuperTypes":[17]},{"id":11,"name":"Caipirinha","source":"Death & Co","drinkIngredients":[49,50,51,52],"ingredientTypes":[203,284,301,8],"ingredientSuperTypes":[2]},{"id":600,"name":"Caipirinha","source":"The PDT Cocktail Book","drinkIngredients":[3305,3306,3307],"ingredientTypes":[8,203,301],"ingredientSuperTypes":[2]},{"id":304,"name":"Calva Dorsa Royale","source":"Death & Co","drinkIngredients":[1713,1714,1715,1716],"ingredientTypes":[24,132,3,73],"ingredientSuperTypes":[]},{"id":515,"name":"Calvados Sidecar","source":"Speakeasy","drinkIngredients":[2917,2918,2919,2920,2921],"ingredientTypes":[199,301,24,228,227],"ingredientSuperTypes":[]},{"id":602,"name":"Cameron’s Kick","source":"The PDT Cocktail Book","drinkIngredients":[3312,3313,3314,3315],"ingredientTypes":[59,185,199,231],"ingredientSuperTypes":[60]},{"id":168,"name":"Camp Council","source":"Death & Co","drinkIngredients":[936,937,938,939,940,941],"ingredientTypes":[264,246,328,247,199,213],"ingredientSuperTypes":[19]},{"id":465,"name":"Campari Spritz","source":"Speakeasy","drinkIngredients":[2665,2666,2667,2668],"ingredientTypes":[73,92,47,222],"ingredientSuperTypes":[]},{"id":601,"name":"Caprice","source":"The PDT Cocktail Book","drinkIngredients":[3308,3309,3310,3311],"ingredientTypes":[128,130,42,225],"ingredientSuperTypes":[129]},{"id":133,"name":"Caribbean Shrub","source":"Death & Co","drinkIngredients":[721,722,723,724,725],"ingredientTypes":[189,8,299,284,297],"ingredientSuperTypes":[2,2]},{"id":252,"name":"Carroll Gardens","source":"Death & Co","drinkIngredients":[1422,1423,1424,1425,1426],"ingredientTypes":[275,304,13,209,199],"ingredientSuperTypes":[15]},{"id":288,"name":"Castle Of Córdoba","source":"Death & Co","drinkIngredients":[1621,1622,1623,1624,1625],"ingredientTypes":[24,99,106,31,22],"ingredientSuperTypes":[17]},{"id":224,"name":"Castle To Castle","source":"Death & Co","drinkIngredients":[1254,1255,1256,1257,1258],"ingredientTypes":[287,22,199,165,36],"ingredientSuperTypes":[]},{"id":603,"name":"Cavalier","source":"The PDT Cocktail Book","drinkIngredients":[3316,3317,3318,3319,3320,3321],"ingredientTypes":[99,199,228,231,26,225],"ingredientSuperTypes":[]},{"id":373,"name":"Celine Fizz","source":"Death & Co","drinkIngredients":[2143,2144,2145,2146,2147,2148],"ingredientTypes":[252,132,199,284,131,92],"ingredientSuperTypes":[129]},{"id":482,"name":"Champagne Cocktail","source":"Speakeasy","drinkIngredients":[2744,2745,2746,2747,2748],"ingredientTypes":[228,73,301,31,199],"ingredientSuperTypes":[]},{"id":604,"name":"Champagne Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3322,3323],"ingredientTypes":[74,301],"ingredientSuperTypes":[]},{"id":12,"name":"Champs-élysées","source":"Death & Co","drinkIngredients":[53,54,55,56,57],"ingredientTypes":[99,156,199,284,31],"ingredientSuperTypes":[]},{"id":605,"name":"Champs-élysées","source":"The PDT Cocktail Book","drinkIngredients":[3324,3325,3326,3327,3328],"ingredientTypes":[99,199,156,284,31],"ingredientSuperTypes":[]},{"id":13,"name":"Charleston Cocktail","source":"Death & Co","drinkIngredients":[58,59,60,61,62,63],"ingredientTypes":[128,78,130,304,228,209],"ingredientSuperTypes":[129]},{"id":606,"name":"Cherry Pop","source":"The PDT Cocktail Book","drinkIngredients":[3329,3330,3331,3332,3333],"ingredientTypes":[252,199,209,284,76],"ingredientSuperTypes":[129]},{"id":608,"name":"Chien Chaud","source":"The PDT Cocktail Book","drinkIngredients":[3338,3339,3340,3341],"ingredientTypes":[95,8,328,31],"ingredientSuperTypes":[2]},{"id":374,"name":"Chinese Fizz","source":"Death & Co","drinkIngredients":[2149,2150,2151,2152,2153,2154,2155,2156,2157],"ingredientTypes":[189,228,209,199,284,158,131,31,227],"ingredientSuperTypes":[2]},{"id":169,"name":"Chingon","source":"Death & Co","drinkIngredients":[942,943,944,945,946],"ingredientTypes":[264,42,227,203,231],"ingredientSuperTypes":[19]},{"id":607,"name":"Chrysanthemum","source":"The PDT Cocktail Book","drinkIngredients":[3334,3335,3336,3337],"ingredientTypes":[130,42,3,225],"ingredientSuperTypes":[]},{"id":305,"name":"Cider House Rules","source":"Death & Co","drinkIngredients":[1717,1718,1719,1720,1721,1722,1723],"ingredientTypes":[292,189,135,203,165,310,239],"ingredientSuperTypes":[2,2]},{"id":170,"name":"Cinder","source":"Death & Co","drinkIngredients":[947,948,949,950,951,952,953],"ingredientTypes":[290,264,183,211,203,284,31],"ingredientSuperTypes":[19]},{"id":609,"name":"Cinema Highball","source":"The PDT Cocktail Book","drinkIngredients":[3342,3343],"ingredientTypes":[100,179],"ingredientSuperTypes":[]},{"id":171,"name":"Cinnamon Girl","source":"Death & Co","drinkIngredients":[954,955,956,957,958,959,960],"ingredientTypes":[227,264,189,203,89,284,225],"ingredientSuperTypes":[19,2]},{"id":385,"name":"Cirque Swizzle","source":"Death & Co","drinkIngredients":[2216,2217,2218,2219,2220,2221],"ingredientTypes":[128,328,112,199,317,284],"ingredientSuperTypes":[129]},{"id":79,"name":"City Of Gold Sling","source":"Death & Co","drinkIngredients":[416,417,418,419,420,421,422,423],"ingredientTypes":[221,119,123,3,247,203,231,31],"ingredientSuperTypes":[129,2]},{"id":510,"name":"Classic Daiquiri","source":"Speakeasy","drinkIngredients":[2894,2895,2896],"ingredientTypes":[292,203,284],"ingredientSuperTypes":[2]},{"id":479,"name":"Classic Dry Martini","source":"Speakeasy","drinkIngredients":[2730,2731,2732,2733],"ingredientTypes":[128,130,225,199],"ingredientSuperTypes":[129]},{"id":471,"name":"Classic Martinez","source":"Speakeasy","drinkIngredients":[2691,2692,2693,2694,2695],"ingredientTypes":[128,304,209,225,199],"ingredientSuperTypes":[129]},{"id":520,"name":"Classic Pimm’s Cup","source":"Speakeasy","drinkIngredients":[2940,2941,2942,2943],"ingredientTypes":[245,115,213,200],"ingredientSuperTypes":[]},{"id":610,"name":"Cloister","source":"The PDT Cocktail Book","drinkIngredients":[3344,3345,3346,3347,3348],"ingredientTypes":[128,328,152,199,284],"ingredientSuperTypes":[129]},{"id":611,"name":"Clover Club","source":"The PDT Cocktail Book","drinkIngredients":[3349,3350,3351,3352,3353],"ingredientTypes":[252,199,284,261,131],"ingredientSuperTypes":[129]},{"id":152,"name":"Cobra Verde","source":"Death & Co","drinkIngredients":[842,843,844,845],"ingredientTypes":[8,180,328,156],"ingredientSuperTypes":[2]},{"id":14,"name":"Cobra’s Fang","source":"Death & Co","drinkIngredients":[64,65,66,67,68,69,70,71,72,73],"ingredientTypes":[189,1,111,3,203,227,234,89,146,31],"ingredientSuperTypes":[2,2]},{"id":612,"name":"Coconut Colada","source":"The PDT Cocktail Book","drinkIngredients":[3354,3355,3356,3357],"ingredientTypes":[292,247,203,94],"ingredientSuperTypes":[2]},{"id":613,"name":"Coda","source":"The PDT Cocktail Book","drinkIngredients":[3358,3359,3360,3361,3362,3363],"ingredientTypes":[292,8,203,10,284,131],"ingredientSuperTypes":[2,2]},{"id":253,"name":"Coffee And Cigarettes","source":"Death & Co","drinkIngredients":[1427,1428,1429,1430],"ingredientTypes":[285,98,304,214],"ingredientSuperTypes":[286]},{"id":615,"name":"Coffee Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3370,3371,3372,3373],"ingredientTypes":[99,51,284,131],"ingredientSuperTypes":[52]},{"id":386,"name":"Coffey Park Swizzle","source":"Death & Co","drinkIngredients":[2222,2223,2224,2225,2226,2227,2228],"ingredientTypes":[8,16,135,203,146,31,213],"ingredientSuperTypes":[2,17]},{"id":398,"name":"Coin Toss","source":"Death & Co","drinkIngredients":[2301,2302,2303,2304,2305],"ingredientTypes":[23,304,328,42,31],"ingredientSuperTypes":[]},{"id":134,"name":"Company Buck","source":"Death & Co","drinkIngredients":[726,727,728,729,730,731],"ingredientTypes":[118,247,203,146,31,92],"ingredientSuperTypes":[2]},{"id":614,"name":"Condiment Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3364,3365,3366,3367,3368,3369],"ingredientTypes":[264,42,232,203,71,215],"ingredientSuperTypes":[19]},{"id":454,"name":"Conference","source":"Death & Co","drinkIngredients":[2598,2599,2600,2601,2602,2603,2604,2605],"ingredientTypes":[275,66,24,99,284,31,214,227],"ingredientSuperTypes":[15,15]},{"id":616,"name":"Conquistador","source":"The PDT Cocktail Book","drinkIngredients":[3374,3375,3376,3377,3378,3379,3380],"ingredientTypes":[114,57,284,199,203,225,131],"ingredientSuperTypes":[2,19]},{"id":469,"name":"Contemporary Manhattan","source":"Speakeasy","drinkIngredients":[2682,2683,2684,2685],"ingredientTypes":[66,304,31,76],"ingredientSuperTypes":[15]},{"id":408,"name":"Cooper Union","source":"Death & Co","drinkIngredients":[2353,2354,2355,2356,2357],"ingredientTypes":[187,185,132,225,199],"ingredientSuperTypes":[60]},{"id":200,"name":"Coralillo","source":"Death & Co","drinkIngredients":[1116,1117,1118,1119,1120],"ingredientTypes":[18,328,24,240,22],"ingredientSuperTypes":[19]},{"id":15,"name":"Corpse Reviver #2","source":"Death & Co","drinkIngredients":[74,75,76,77,78],"ingredientTypes":[128,228,21,3,199],"ingredientSuperTypes":[129]},{"id":618,"name":"Corpse Reviver No. 2","source":"The PDT Cocktail Book","drinkIngredients":[3386,3387,3388,3389],"ingredientTypes":[252,228,21,199],"ingredientSuperTypes":[129]},{"id":153,"name":"Cortado","source":"Death & Co","drinkIngredients":[846,847,848,849,850,851,852,853],"ingredientTypes":[292,1,182,83,284,214,31,227],"ingredientSuperTypes":[2,2]},{"id":617,"name":"Cosmopoli Tan","source":"The PDT Cocktail Book","drinkIngredients":[3381,3382,3383,3384,3385],"ingredientTypes":[90,228,203,103,284],"ingredientSuperTypes":[]},{"id":484,"name":"Cosmopolitan","source":"Speakeasy","drinkIngredients":[2754,2755,2756,2757,2758],"ingredientTypes":[210,228,203,103,227],"ingredientSuperTypes":[]},{"id":619,"name":"Cranberry Cobbler","source":"The PDT Cocktail Book","drinkIngredients":[3390,3391,3392,3393,3394],"ingredientTypes":[128,106,102,227,199],"ingredientSuperTypes":[129,17]},{"id":225,"name":"Crane Kick","source":"Death & Co","drinkIngredients":[1259,1260,1261,1262,1263,1264,1265],"ingredientTypes":[190,187,93,227,199,231,31],"ingredientSuperTypes":[60]},{"id":409,"name":"Creole Saz","source":"Death & Co","drinkIngredients":[2358,2359,2360,2361,2362,2363],"ingredientTypes":[3,8,99,284,31,199],"ingredientSuperTypes":[2]},{"id":254,"name":"Cure For Pain","source":"Death & Co","drinkIngredients":[1431,1432,1433,1434,1435,1436,1437],"ingredientTypes":[275,66,307,304,47,83,227],"ingredientSuperTypes":[15,15,52]},{"id":620,"name":"Cuzco","source":"The PDT Cocktail Book","drinkIngredients":[3395,3396,3397,3398,3399],"ingredientTypes":[250,46,284,199,152],"ingredientSuperTypes":[]},{"id":334,"name":"Cynaro De Bergerac","source":"Death & Co","drinkIngredients":[1874,1875,1876,1877,1878,1879,1880],"ingredientTypes":[43,142,221,42,3,214,227],"ingredientSuperTypes":[129]},{"id":104,"name":"Cynartown","source":"Death & Co","drinkIngredients":[570,571,572,573],"ingredientTypes":[128,304,13,76],"ingredientSuperTypes":[129]},{"id":431,"name":"D.w.b.","source":"Death & Co","drinkIngredients":[2476,2477,2478,2479],"ingredientTypes":[8,37,203,284],"ingredientSuperTypes":[2]},{"id":430,"name":"Dai, Dai My Darling","source":"Death & Co","drinkIngredients":[2467,2468,2469,2470,2471,2472,2473,2474,2475],"ingredientTypes":[292,119,58,56,153,79,209,5,203],"ingredientSuperTypes":[2,2,2]},{"id":16,"name":"Daiquiri","source":"Death & Co","drinkIngredients":[79,80,81],"ingredientTypes":[292,203,284],"ingredientSuperTypes":[2]},{"id":622,"name":"Daiquiri","source":"The PDT Cocktail Book","drinkIngredients":[3405,3406,3407],"ingredientTypes":[58,203,284],"ingredientSuperTypes":[2]},{"id":442,"name":"Daisy Buchanan","source":"Death & Co","drinkIngredients":[2529,2530,2531,2532],"ingredientTypes":[180,130,46,328],"ingredientSuperTypes":[]},{"id":201,"name":"Dale Cooper","source":"Death & Co","drinkIngredients":[1121,1122,1123,1124,1125],"ingredientTypes":[264,182,156,89,214],"ingredientSuperTypes":[19]},{"id":226,"name":"Dangerous Liaisons","source":"Death & Co","drinkIngredients":[1266,1267,1268,1269,1270],"ingredientTypes":[172,56,152,199,165],"ingredientSuperTypes":[]},{"id":306,"name":"Dark ‘n’ Bubbly","source":"Death & Co","drinkIngredients":[1724,1725,1726,1727],"ingredientTypes":[118,203,146,73],"ingredientSuperTypes":[2]},{"id":17,"name":"Dark And Stormy","source":"Death & Co","drinkIngredients":[82,83,84,85,86],"ingredientTypes":[118,203,146,92,67],"ingredientSuperTypes":[2]},{"id":525,"name":"Dark And Stormy","source":"Speakeasy","drinkIngredients":[2969,2970,2971,2972],"ingredientTypes":[135,203,145,118],"ingredientSuperTypes":[2]},{"id":623,"name":"De La Louisiane","source":"The PDT Cocktail Book","drinkIngredients":[3408,3409,3410,3411,3412],"ingredientTypes":[275,304,42,3,31],"ingredientSuperTypes":[15]},{"id":227,"name":"Deadpan Fix","source":"Death & Co","drinkIngredients":[1271,1272,1273,1274,1275,1276,1277],"ingredientTypes":[275,47,228,152,199,146,227],"ingredientSuperTypes":[15]},{"id":621,"name":"Death Bed","source":"The PDT Cocktail Book","drinkIngredients":[3400,3401,3402,3403,3404],"ingredientTypes":[292,8,80,203,247],"ingredientSuperTypes":[2,2]},{"id":455,"name":"Death From Above","source":"Death & Co","drinkIngredients":[2606,2607,2608,2609,2610,2611,2612,2613],"ingredientTypes":[1,292,118,106,284,31,225,227],"ingredientSuperTypes":[2,2,2,17]},{"id":335,"name":"Derby Girl","source":"Death & Co","drinkIngredients":[1881,1882,1883,1884,1885,1886],"ingredientTypes":[216,21,303,269,165,213],"ingredientSuperTypes":[]},{"id":624,"name":"Desert Rose","source":"The PDT Cocktail Book","drinkIngredients":[3413,3414,3415,3416],"ingredientTypes":[252,199,239,284],"ingredientSuperTypes":[129]},{"id":625,"name":"Deshler","source":"The PDT Cocktail Book","drinkIngredients":[3417,3418,3419,3420],"ingredientTypes":[275,21,228,31],"ingredientSuperTypes":[15]},{"id":410,"name":"Devil Inside","source":"Death & Co","drinkIngredients":[2364,2365,2366,2367,2368,2369,2370],"ingredientTypes":[187,275,186,3,284,31,199],"ingredientSuperTypes":[60,15,60]},{"id":626,"name":"Dewey D.","source":"The PDT Cocktail Book","drinkIngredients":[3421,3422,3423,3424],"ingredientTypes":[275,106,46,31],"ingredientSuperTypes":[15,17]},{"id":172,"name":"Dhalgren","source":"Death & Co","drinkIngredients":[961,962,963,964,965],"ingredientTypes":[57,307,203,146,31],"ingredientSuperTypes":[19,52]},{"id":627,"name":"Diamondback","source":"The PDT Cocktail Book","drinkIngredients":[3425,3426,3427],"ingredientTypes":[275,23,328],"ingredientSuperTypes":[15]},{"id":18,"name":"Diamondback","source":"Death & Co","drinkIngredients":[87,88,89],"ingredientTypes":[275,23,328],"ingredientSuperTypes":[15]},{"id":307,"name":"Dick And Jane","source":"Death & Co","drinkIngredients":[1728,1729,1730,1731,1732,1733],"ingredientTypes":[128,132,199,161,31,73],"ingredientSuperTypes":[129]},{"id":105,"name":"Dick Brautigan","source":"Death & Co","drinkIngredients":[574,575,576,577],"ingredientTypes":[128,182,13,209],"ingredientSuperTypes":[129]},{"id":308,"name":"Dirty Mary, Crazy Larry","source":"Death & Co","drinkIngredients":[1734,1735],"ingredientTypes":[23,196],"ingredientSuperTypes":[]},{"id":387,"name":"Dj Flamethrower","source":"Death & Co","drinkIngredients":[2229,2230,2231,2232,2233,2234,2235,2236],"ingredientTypes":[264,211,304,152,203,89,31,88],"ingredientSuperTypes":[19]},{"id":309,"name":"Doc Daneeka Royale","source":"Death & Co","drinkIngredients":[1736,1737,1738,1739,1740,1741],"ingredientTypes":[252,199,208,151,73,152],"ingredientSuperTypes":[129]},{"id":228,"name":"Doc’s Dram","source":"Death & Co","drinkIngredients":[1278,1279,1280,1281,1282,1283,1284],"ingredientTypes":[275,221,106,199,208,22,31],"ingredientSuperTypes":[15,129,17]},{"id":388,"name":"Dolly Dagger","source":"Death & Co","drinkIngredients":[2237,2238,2239,2240,2241,2242],"ingredientTypes":[189,61,203,284,317,213],"ingredientSuperTypes":[2,17]},{"id":389,"name":"Dolores Park Swizzle","source":"Death & Co","drinkIngredients":[2243,2244,2245,2246,2247,2248,2249],"ingredientTypes":[18,16,135,203,146,31,213],"ingredientSuperTypes":[19,17]},{"id":269,"name":"Don’t Sit Under The Apple Tree","source":"Death & Co","drinkIngredients":[1508,1509,1510,1511,1512],"ingredientTypes":[23,199,22,131,31],"ingredientSuperTypes":[]},{"id":628,"name":"Donizetti","source":"The PDT Cocktail Book","drinkIngredients":[3428,3429,3430],"ingredientTypes":[128,13,27],"ingredientSuperTypes":[129]},{"id":173,"name":"Dos Besitos","source":"Death & Co","drinkIngredients":[966,967,968,969,970,971],"ingredientTypes":[264,57,247,203,7,158],"ingredientSuperTypes":[19,19]},{"id":229,"name":"Double Fill-up","source":"Death & Co","drinkIngredients":[1285,1286,1287,1288,1289],"ingredientTypes":[275,199,284,255,213],"ingredientSuperTypes":[15]},{"id":366,"name":"Double-barrel Julep","source":"Death & Co","drinkIngredients":[2109,2110,2111,2112,2113,2114,2115],"ingredientTypes":[66,292,111,284,189,31,213],"ingredientSuperTypes":[15,2,2]},{"id":230,"name":"Dr. Feelgood","source":"Death & Co","drinkIngredients":[1290,1291,1292,1293,1294,1295,1296,1297],"ingredientTypes":[172,22,228,199,148,231,146,31],"ingredientSuperTypes":[]},{"id":310,"name":"Dragon Lily","source":"Death & Co","drinkIngredients":[1742,1743,1744,1745],"ingredientTypes":[57,6,31,73],"ingredientSuperTypes":[19]},{"id":443,"name":"Drunken Dodo","source":"Death & Co","drinkIngredients":[2533,2534,2535,2536,2537],"ingredientTypes":[292,304,10,31,227],"ingredientSuperTypes":[2]},{"id":347,"name":"Drunken Punch","source":"Death & Co","drinkIngredients":[1959,1960,1961,1962,1963,1964,1965,1966],"ingredientTypes":[301,92,181,10,22,199,31,22],"ingredientSuperTypes":[]},{"id":311,"name":"Drunken Skull","source":"Death & Co","drinkIngredients":[1746,1747,1748,1749,1750,1751],"ingredientTypes":[119,189,3,203,158,73],"ingredientSuperTypes":[2,2]},{"id":629,"name":"Dry County Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3431,3432,3433,3434],"ingredientTypes":[308,130,144,199],"ingredientSuperTypes":[]},{"id":630,"name":"Duboudreau Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3435,3436,3437,3438],"ingredientTypes":[275,21,13,132],"ingredientSuperTypes":[15]},{"id":631,"name":"Dulce De Leche","source":"The PDT Cocktail Book","drinkIngredients":[3439,3440,3441,3442],"ingredientTypes":[18,242,104,131],"ingredientSuperTypes":[19,17]},{"id":154,"name":"Eagle-eye Cherry","source":"Death & Co","drinkIngredients":[854,855,856,857,858,859,860,861,862,863],"ingredientTypes":[292,80,106,106,84,304,303,77,227,76],"ingredientSuperTypes":[2,17,17]},{"id":632,"name":"East India Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3443,3444,3445,3446,3447],"ingredientTypes":[99,228,247,292,225],"ingredientSuperTypes":[2]},{"id":155,"name":"East India Trading Co.","source":"Death & Co","drinkIngredients":[864,865,866,867],"ingredientTypes":[189,106,13,214],"ingredientSuperTypes":[2,17]},{"id":348,"name":"East River Underground","source":"Death & Co","drinkIngredients":[1967,1968,1969,1970,1971,1972,1973,1974,1975],"ingredientTypes":[301,115,192,278,92,8,183,328,203],"ingredientSuperTypes":[2]},{"id":633,"name":"East Village Athletic Club Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3448,3449,3450,3451],"ingredientTypes":[57,199,328,228],"ingredientSuperTypes":[19]},{"id":634,"name":"Eclipse Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3452,3453,3454,3455],"ingredientTypes":[18,46,80,199],"ingredientSuperTypes":[19]},{"id":635,"name":"Edgewood","source":"The PDT Cocktail Book","drinkIngredients":[3456,3457,3458,3459],"ingredientTypes":[252,152,304,21],"ingredientSuperTypes":[129]},{"id":636,"name":"El Burro","source":"The PDT Cocktail Book","drinkIngredients":[3460,3461,3462,3463,3464,3465],"ingredientTypes":[264,145,203,247,284,3],"ingredientSuperTypes":[19]},{"id":174,"name":"El Compañero","source":"Death & Co","drinkIngredients":[972,973,974,975,976,977,978,979],"ingredientTypes":[264,183,203,6,168,278,87,39],"ingredientSuperTypes":[19]},{"id":637,"name":"El Diablo","source":"The PDT Cocktail Book","drinkIngredients":[3466,3467,3468,3469],"ingredientTypes":[57,145,108,199],"ingredientSuperTypes":[19]},{"id":638,"name":"El Molino","source":"The PDT Cocktail Book","drinkIngredients":[3470,3471,3472,3473],"ingredientTypes":[211,232,10,83],"ingredientSuperTypes":[]},{"id":639,"name":"El Puente","source":"The PDT Cocktail Book","drinkIngredients":[3474,3475,3476,3477],"ingredientTypes":[57,152,45,132],"ingredientSuperTypes":[19]},{"id":456,"name":"Elder Fashion","source":"Death & Co","drinkIngredients":[2614,2615,2616,2617],"ingredientTypes":[252,132,225,152],"ingredientSuperTypes":[129]},{"id":312,"name":"Elder Fashion Royale","source":"Death & Co","drinkIngredients":[1752,1753,1754,1755,1756],"ingredientTypes":[252,132,225,73,152],"ingredientSuperTypes":[129]},{"id":466,"name":"Elderflower Spritz","source":"Speakeasy","drinkIngredients":[2669,2670,2671,2672],"ingredientTypes":[73,92,199,132],"ingredientSuperTypes":[]},{"id":399,"name":"Electric Kool-aid Acid Test","source":"Death & Co","drinkIngredients":[2306,2307,2308,2309,2310,2311],"ingredientTypes":[23,289,199,284,53,209],"ingredientSuperTypes":[]},{"id":270,"name":"Enchanted Orchard","source":"Death & Co","drinkIngredients":[1513,1514,1515,1516,1517,1518,1519],"ingredientTypes":[250,24,42,247,199,165,88],"ingredientSuperTypes":[]},{"id":411,"name":"Enemy Lines","source":"Death & Co","drinkIngredients":[2371,2372,2373,2374,2375,2376],"ingredientTypes":[28,264,284,31,31,199],"ingredientSuperTypes":[19]},{"id":640,"name":"Ephemeral","source":"The PDT Cocktail Book","drinkIngredients":[3478,3479,3480,3481],"ingredientTypes":[221,56,132,71],"ingredientSuperTypes":[129]},{"id":175,"name":"Espadin Queen","source":"Death & Co","drinkIngredients":[980,981,982,983,984,985,986],"ingredientTypes":[3,211,132,152,203,122,284],"ingredientSuperTypes":[]},{"id":641,"name":"Espresso Bongo","source":"The PDT Cocktail Book","drinkIngredients":[3482,3483,3484,3485,3486,3487,3488],"ingredientTypes":[189,98,203,247,227,233,284],"ingredientSuperTypes":[2]},{"id":106,"name":"European Union","source":"Death & Co","drinkIngredients":[578,579,580,581,582],"ingredientTypes":[221,304,24,300,31],"ingredientSuperTypes":[129]},{"id":349,"name":"Evil Dead Punch","source":"Death & Co","drinkIngredients":[1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986],"ingredientTypes":[292,21,132,27,123,203,227,284,146,31,92],"ingredientSuperTypes":[2]},{"id":231,"name":"Eye Of The Torino","source":"Death & Co","drinkIngredients":[1298,1299,1300,1301,1302,1303,1304,1305,1306,1307],"ingredientTypes":[285,304,247,199,231,317,105,104,31,214],"ingredientSuperTypes":[286]},{"id":417,"name":"Fail-safe","source":"Death & Co","drinkIngredients":[2408,2409,2410,2411,2412],"ingredientTypes":[128,288,46,228,31],"ingredientSuperTypes":[129,129]},{"id":336,"name":"Fair Fault","source":"Death & Co","drinkIngredients":[1887,1888,1889,1890,1891,1892],"ingredientTypes":[21,292,148,199,284,118],"ingredientSuperTypes":[2,2]},{"id":313,"name":"Fair Lady","source":"Death & Co","drinkIngredients":[1757,1758,1759,1760,1761],"ingredientTypes":[182,28,152,284,73],"ingredientSuperTypes":[]},{"id":256,"name":"Faithful Scotsman","source":"Death & Co","drinkIngredients":[1443,1444,1445,1446,1447,1448],"ingredientTypes":[59,111,247,199,116,248],"ingredientSuperTypes":[60]},{"id":642,"name":"Falling Leaves","source":"The PDT Cocktail Book","drinkIngredients":[3489,3490,3491,3492,3493],"ingredientTypes":[268,240,228,165,31],"ingredientSuperTypes":[]},{"id":314,"name":"Fancy Holland Royale","source":"Death & Co","drinkIngredients":[1762,1763,1764,1765,1766],"ingredientTypes":[142,228,284,31,73],"ingredientSuperTypes":[]},{"id":19,"name":"Fancy-free","source":"Death & Co","drinkIngredients":[90,91,92,93,94],"ingredientTypes":[275,209,31,225,227],"ingredientSuperTypes":[15]},{"id":467,"name":"Fernando","source":"Speakeasy","drinkIngredients":[2673,2674,2675,2676],"ingredientTypes":[13,45,140,213],"ingredientSuperTypes":[]},{"id":643,"name":"Field Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3494,3495,3496],"ingredientTypes":[99,130,247],"ingredientSuperTypes":[]},{"id":644,"name":"Figetaboutit","source":"The PDT Cocktail Book","drinkIngredients":[3497,3498,3499,3500,3501],"ingredientTypes":[66,199,11,137,31],"ingredientSuperTypes":[15]},{"id":645,"name":"Fish House Punch","source":"The PDT Cocktail Book","drinkIngredients":[3502,3503,3504,3505,3506,3507],"ingredientTypes":[118,99,238,199,284,203],"ingredientSuperTypes":[2]},{"id":20,"name":"Fitzgerald","source":"Death & Co","drinkIngredients":[95,96,97,98],"ingredientTypes":[128,199,284,31],"ingredientSuperTypes":[129]},{"id":232,"name":"Fix Me Up","source":"Death & Co","drinkIngredients":[1308,1309,1310,1311,1312,1313,1314],"ingredientTypes":[275,16,199,227,231,31,92],"ingredientSuperTypes":[15,17]},{"id":21,"name":"Flamenco","source":"Death & Co","drinkIngredients":[99,100,101,102,103,104],"ingredientTypes":[16,142,227,199,231,31],"ingredientSuperTypes":[17]},{"id":315,"name":"Flaquita","source":"Death & Co","drinkIngredients":[1767,1768,1769,1770,1771,1772,1773],"ingredientTypes":[57,56,83,47,199,146,73],"ingredientSuperTypes":[19]},{"id":176,"name":"Flor De Jalisco","source":"Death & Co","drinkIngredients":[987,988,989,990],"ingredientTypes":[57,199,6,227],"ingredientSuperTypes":[19]},{"id":135,"name":"Flor De Jerez","source":"Death & Co","drinkIngredients":[732,733,734,735,736,737],"ingredientTypes":[189,16,27,199,284,31],"ingredientSuperTypes":[2,17]},{"id":646,"name":"Flora Astoria","source":"The PDT Cocktail Book","drinkIngredients":[3508,3509,3510,3511,3512],"ingredientTypes":[217,56,130,135,198],"ingredientSuperTypes":[129]},{"id":647,"name":"Flying Dutchman","source":"The PDT Cocktail Book","drinkIngredients":[3513,3514,3515,3516,3517,3518],"ingredientTypes":[251,142,112,199,247,209],"ingredientSuperTypes":[]},{"id":648,"name":"Fog Cutter","source":"The PDT Cocktail Book","drinkIngredients":[3519,3520,3521,3522,3523,3524],"ingredientTypes":[199,292,99,227,128,231],"ingredientSuperTypes":[2,129]},{"id":649,"name":"Foreign Legion","source":"The PDT Cocktail Book","drinkIngredients":[3525,3526,3527,3528,3529,3530],"ingredientTypes":[134,46,21,207,83,265],"ingredientSuperTypes":[2,17]},{"id":257,"name":"Four In Hand","source":"Death & Co","drinkIngredients":[1449,1450,1451,1452,1453,1454,1455],"ingredientTypes":[66,23,189,156,89,317,227],"ingredientSuperTypes":[15,2]},{"id":488,"name":"Fraise Sauvage","source":"Speakeasy","drinkIngredients":[2777,2778,2779,2780,2781],"ingredientTypes":[252,199,284,297,73],"ingredientSuperTypes":[129]},{"id":650,"name":"Framboise Fizz","source":"The PDT Cocktail Book","drinkIngredients":[3531,3532,3533],"ingredientTypes":[264,83,199],"ingredientSuperTypes":[19]},{"id":651,"name":"Frankfort Rose","source":"The PDT Cocktail Book","drinkIngredients":[3534,3535,3536,3537],"ingredientTypes":[172,199,284,131],"ingredientSuperTypes":[]},{"id":652,"name":"French 75","source":"The PDT Cocktail Book","drinkIngredients":[3538,3539,3540],"ingredientTypes":[128,199,284],"ingredientSuperTypes":[129]},{"id":22,"name":"French 75","source":"Death & Co","drinkIngredients":[105,106,107,108],"ingredientTypes":[252,199,284,73],"ingredientSuperTypes":[129]},{"id":489,"name":"French 75","source":"Speakeasy","drinkIngredients":[2782,2783,2784,2785,2786],"ingredientTypes":[128,199,284,73,227],"ingredientSuperTypes":[129]},{"id":23,"name":"French 95","source":"Death & Co","drinkIngredients":[109,110,111,112],"ingredientTypes":[66,199,284,73],"ingredientSuperTypes":[15]},{"id":653,"name":"French Maid","source":"The PDT Cocktail Book","drinkIngredients":[3541,3542,3543,3544,3545,3546,3547],"ingredientTypes":[99,145,203,284,135,115,213],"ingredientSuperTypes":[]},{"id":177,"name":"Fresa Brava","source":"Death & Co","drinkIngredients":[991,992,993,994,995],"ingredientTypes":[297,183,328,199,284],"ingredientSuperTypes":[]},{"id":654,"name":"Fresa Verde","source":"The PDT Cocktail Book","drinkIngredients":[3548,3549,3550,3551,3552],"ingredientTypes":[57,203,255,297,41],"ingredientSuperTypes":[19]},{"id":655,"name":"Frisco","source":"The PDT Cocktail Book","drinkIngredients":[3553,3554],"ingredientTypes":[275,42],"ingredientSuperTypes":[15]},{"id":81,"name":"Frisco Club","source":"Death & Co","drinkIngredients":[430,431,432,433,434,435],"ingredientTypes":[252,63,13,152,203,284],"ingredientSuperTypes":[129]},{"id":528,"name":"Frisco Sour","source":"Speakeasy","drinkIngredients":[2981,2982,2983,2984,2985,2986],"ingredientTypes":[275,42,199,203,284,76],"ingredientSuperTypes":[15]},{"id":136,"name":"Get Lucky","source":"Death & Co","drinkIngredients":[738,739,740,741,742,743,744],"ingredientTypes":[53,292,199,146,231,165,31],"ingredientSuperTypes":[2]},{"id":656,"name":"Gilchrist","source":"The PDT Cocktail Book","drinkIngredients":[3555,3556,3557,3558],"ingredientTypes":[59,240,152,13],"ingredientSuperTypes":[60]},{"id":178,"name":"Gilda Cocktail","source":"Death & Co","drinkIngredients":[996,997,998,999],"ingredientTypes":[57,247,203,89],"ingredientSuperTypes":[19]},{"id":657,"name":"Gimlet","source":"The PDT Cocktail Book","drinkIngredients":[3559,3560,3561],"ingredientTypes":[252,202,203],"ingredientSuperTypes":[129]},{"id":491,"name":"Gimlet","source":"Speakeasy","drinkIngredients":[2791,2792,2793],"ingredientTypes":[252,202,203],"ingredientSuperTypes":[129]},{"id":24,"name":"Gimlet","source":"Death & Co","drinkIngredients":[113,114,115],"ingredientTypes":[128,202,203],"ingredientSuperTypes":[129]},{"id":658,"name":"Gin & Tonic","source":"The PDT Cocktail Book","drinkIngredients":[3562,3563,3564],"ingredientTypes":[92,128,312],"ingredientSuperTypes":[129]},{"id":25,"name":"Gin Fizz","source":"Death & Co","drinkIngredients":[116,117,118,119,120],"ingredientTypes":[128,199,284,131,92],"ingredientSuperTypes":[129]},{"id":82,"name":"Gin Hound","source":"Death & Co","drinkIngredients":[436,437,438,439],"ingredientTypes":[128,70,203,165],"ingredientSuperTypes":[129]},{"id":494,"name":"Gin On Gin Julep","source":"Speakeasy","drinkIngredients":[2802,2803,2804,2805],"ingredientTypes":[213,142,252,92],"ingredientSuperTypes":[129]},{"id":545,"name":"Gin Punch","source":"Speakeasy","drinkIngredients":[3076,3077,3078,3079,3080,3081,3082,3083,3084,3085,3086,3087],"ingredientTypes":[169,224,199,203,261,247,252,284,231,262,323,73],"ingredientSuperTypes":[129]},{"id":26,"name":"Gin Rickey","source":"Death & Co","drinkIngredients":[121,122,123,124],"ingredientTypes":[128,203,284,92],"ingredientSuperTypes":[129]},{"id":493,"name":"Gin Rickey","source":"Speakeasy","drinkIngredients":[2798,2799,2800,2801],"ingredientTypes":[252,202,92,203],"ingredientSuperTypes":[129]},{"id":500,"name":"Ginger Smash, Fall Season","source":"Speakeasy","drinkIngredients":[2836,2837,2838,2839,2840,2841,2842],"ingredientTypes":[144,239,301,252,25,199,10],"ingredientSuperTypes":[129]},{"id":498,"name":"Ginger Smash, Spring Season","source":"Speakeasy","drinkIngredients":[2822,2823,2824,2825,2826,2827],"ingredientTypes":[144,195,301,57,113,203],"ingredientSuperTypes":[19]},{"id":499,"name":"Ginger Smash, Summer Season","source":"Speakeasy","drinkIngredients":[2828,2829,2830,2831,2832,2833,2834,2835],"ingredientTypes":[144,247,301,292,203,209,25,248],"ingredientSuperTypes":[2]},{"id":497,"name":"Ginger Smash, Winter Season","source":"Speakeasy","drinkIngredients":[2816,2817,2818,2819,2820,2821],"ingredientTypes":[144,102,301,252,25,199],"ingredientSuperTypes":[129]},{"id":271,"name":"Ginger Snap","source":"Death & Co","drinkIngredients":[1520,1521,1522,1523,1524,1525],"ingredientTypes":[99,189,113,199,89,146],"ingredientSuperTypes":[2]},{"id":659,"name":"Girl From Jerez","source":"The PDT Cocktail Book","drinkIngredients":[3565,3566,3567,3568,3569],"ingredientTypes":[8,8,203,242,10],"ingredientSuperTypes":[2,2,17]},{"id":179,"name":"Glandula Del Mono","source":"Death & Co","drinkIngredients":[1000,1001,1002,1003,1004],"ingredientTypes":[57,3,199,227,158],"ingredientSuperTypes":[19]},{"id":660,"name":"Gold Coast","source":"The PDT Cocktail Book","drinkIngredients":[3570,3571,3572],"ingredientTypes":[322,259,121],"ingredientSuperTypes":[]},{"id":662,"name":"Gold Rush","source":"The PDT Cocktail Book","drinkIngredients":[3579,3580,3581],"ingredientTypes":[66,165,199],"ingredientSuperTypes":[15]},{"id":180,"name":"Golden Beautiful","source":"Death & Co","drinkIngredients":[1005,1006,1007,1008,1009,1010],"ingredientTypes":[264,47,203,317,234,92],"ingredientSuperTypes":[19]},{"id":272,"name":"Golden Gate","source":"Death & Co","drinkIngredients":[1526,1527,1528,1529,1530],"ingredientTypes":[228,42,47,152,203],"ingredientSuperTypes":[]},{"id":661,"name":"Golden Star Fizz","source":"The PDT Cocktail Book","drinkIngredients":[3573,3574,3575,3576,3577,3578],"ingredientTypes":[191,28,199,247,115,121],"ingredientSuperTypes":[]},{"id":107,"name":"Gonzalez","source":"Death & Co","drinkIngredients":[583,584,585,586],"ingredientTypes":[128,304,209,31],"ingredientSuperTypes":[129]},{"id":83,"name":"Good Humor","source":"Death & Co","drinkIngredients":[440,441,442,443,444,445,446,447,448],"ingredientTypes":[297,142,142,66,109,199,231,317,104],"ingredientSuperTypes":[15]},{"id":502,"name":"Grand Fashioned","source":"Speakeasy","drinkIngredients":[2847,2848,2849,2850,2851],"ingredientTypes":[301,31,62,228,203],"ingredientSuperTypes":[]},{"id":108,"name":"Grand Street","source":"Death & Co","drinkIngredients":[587,588,589,590,591],"ingredientTypes":[152,128,304,13,209],"ingredientSuperTypes":[129]},{"id":432,"name":"Granny’s Daiquiri","source":"Death & Co","drinkIngredients":[2480,2481,2482],"ingredientTypes":[179,203,284],"ingredientSuperTypes":[]},{"id":492,"name":"Grapefruit Gimlet","source":"Speakeasy","drinkIngredients":[2794,2795,2796,2797],"ingredientTypes":[139,203,6,155],"ingredientSuperTypes":[]},{"id":27,"name":"Grasshopper","source":"Death & Co","drinkIngredients":[125,126,127,128],"ingredientTypes":[213,110,83,104],"ingredientSuperTypes":[]},{"id":402,"name":"Great Northern","source":"Death & Co","drinkIngredients":[2321,2322,2323,2324,2325,2326],"ingredientTypes":[28,21,228,199,165,227],"ingredientSuperTypes":[]},{"id":663,"name":"Great Pumpkin","source":"The PDT Cocktail Book","drinkIngredients":[3582,3583,3584,3585,3586],"ingredientTypes":[256,275,23,208,131],"ingredientSuperTypes":[15]},{"id":202,"name":"Green And Red","source":"Death & Co","drinkIngredients":[1126,1127,1128,1129,1130,1131],"ingredientTypes":[115,57,183,21,130,106],"ingredientSuperTypes":[19,17]},{"id":664,"name":"Green Deacon","source":"The PDT Cocktail Book","drinkIngredients":[3587,3588,3589],"ingredientTypes":[252,152,288],"ingredientSuperTypes":[129,129]},{"id":316,"name":"Green Flash","source":"Death & Co","drinkIngredients":[1774,1775,1776,1777,1778,1779],"ingredientTypes":[8,3,199,165,73,76],"ingredientSuperTypes":[2]},{"id":665,"name":"Green Harvest","source":"The PDT Cocktail Book","drinkIngredients":[3590,3591,3592,3593],"ingredientTypes":[162,57,156,149],"ingredientSuperTypes":[19]},{"id":666,"name":"Greenpoint","source":"The PDT Cocktail Book","drinkIngredients":[3594,3595,3596,3597],"ingredientTypes":[275,304,328,31],"ingredientSuperTypes":[15]},{"id":505,"name":"Greenwich Sour","source":"Speakeasy","drinkIngredients":[2865,2866,2867,2868,2869,2870,2871],"ingredientTypes":[275,199,284,131,227,76,263],"ingredientSuperTypes":[15]},{"id":521,"name":"Gringo Pisco Sour","source":"Speakeasy","drinkIngredients":[2944,2945,2946,2947,2948,2949,2950],"ingredientTypes":[250,284,199,227,131,31,76],"ingredientSuperTypes":[]},{"id":233,"name":"Grouse Rampant","source":"Death & Co","drinkIngredients":[1315,1316,1317,1318,1319,1320],"ingredientTypes":[181,199,165,89,131,31],"ingredientSuperTypes":[]},{"id":412,"name":"Guns And Rosé","source":"Death & Co","drinkIngredients":[2377,2378,2379,2380,2381],"ingredientTypes":[66,21,284,31,152],"ingredientSuperTypes":[15]},{"id":84,"name":"Gypsy Eyes","source":"Death & Co","drinkIngredients":[449,450,451,452,453,454],"ingredientTypes":[156,128,46,203,152,284],"ingredientSuperTypes":[129]},{"id":85,"name":"Gypsy Wedding","source":"Death & Co","drinkIngredients":[455,456,457,458,459,460,461,462],"ingredientTypes":[311,157,128,28,135,203,152,165],"ingredientSuperTypes":[129]},{"id":156,"name":"Hadley’s Tears","source":"Death & Co","drinkIngredients":[868,869,870,871,872,873,874],"ingredientTypes":[189,142,98,3,284,31,227],"ingredientSuperTypes":[2]},{"id":413,"name":"Hallyday","source":"Death & Co","drinkIngredients":[2382,2383,2384,2385,2386,2387,2388],"ingredientTypes":[3,99,130,273,240,31,199],"ingredientSuperTypes":[]},{"id":667,"name":"Hanky Panky","source":"The PDT Cocktail Book","drinkIngredients":[3598,3599,3600],"ingredientTypes":[128,304,13],"ingredientSuperTypes":[129]},{"id":28,"name":"Hanky-panky","source":"Death & Co","drinkIngredients":[129,130,131,132,133],"ingredientTypes":[204,304,304,13,199],"ingredientSuperTypes":[129]},{"id":668,"name":"Harvest Moon","source":"The PDT Cocktail Book","drinkIngredients":[3601,3602,3603,3604,3605],"ingredientTypes":[275,21,23,156,31],"ingredientSuperTypes":[15]},{"id":669,"name":"Harvest Sling","source":"The PDT Cocktail Book","drinkIngredients":[3606,3607,3608,3609,3610,3611],"ingredientTypes":[23,304,42,80,199,145],"ingredientSuperTypes":[]},{"id":496,"name":"Havana-style Mojito","source":"Speakeasy","drinkIngredients":[2810,2811,2812,2813,2814,2815],"ingredientTypes":[213,301,203,292,92,31],"ingredientSuperTypes":[2]},{"id":337,"name":"Have At It","source":"Death & Co","drinkIngredients":[1893,1894,1895,1896,1897,1898,1899,1900],"ingredientTypes":[61,204,152,199,284,31,92,227],"ingredientSuperTypes":[17,129]},{"id":181,"name":"Head Spin","source":"Death & Co","drinkIngredients":[1011,1012,1013,1014,1015,1016],"ingredientTypes":[57,227,203,195,317,92],"ingredientSuperTypes":[19]},{"id":457,"name":"Headstone","source":"Death & Co","drinkIngredients":[2618,2619,2620,2621,2622,2623],"ingredientTypes":[190,206,113,284,225,31],"ingredientSuperTypes":[]},{"id":273,"name":"Heart-shaped Box","source":"Death & Co","drinkIngredients":[1531,1532,1533,1534,1535,1536,1537],"ingredientTypes":[297,99,132,199,89,33,31],"ingredientSuperTypes":[]},{"id":670,"name":"Heirloom","source":"The PDT Cocktail Book","drinkIngredients":[3612,3613,3614,3615,3616],"ingredientTypes":[221,13,203,300,149],"ingredientSuperTypes":[129]},{"id":671,"name":"Hemingway Daiquiri","source":"The PDT Cocktail Book","drinkIngredients":[3617,3618,3619,3620],"ingredientTypes":[58,203,209,152],"ingredientSuperTypes":[2]},{"id":509,"name":"Hemingway Daiquiri","source":"Speakeasy","drinkIngredients":[2888,2889,2890,2891,2892,2893],"ingredientTypes":[292,209,203,152,284,76],"ingredientSuperTypes":[2]},{"id":672,"name":"Henry Hudson","source":"The PDT Cocktail Book","drinkIngredients":[3621,3622,3623,3624,3625],"ingredientTypes":[142,327,199,284,37],"ingredientSuperTypes":[]},{"id":157,"name":"Hispaniola","source":"Death & Co","drinkIngredients":[875,876,877,878],"ingredientTypes":[179,203,284,146],"ingredientSuperTypes":[]},{"id":274,"name":"Hoi Polloi","source":"Death & Co","drinkIngredients":[1538,1539,1540,1541,1542,1543,1544],"ingredientTypes":[99,180,83,247,199,284,31],"ingredientSuperTypes":[]},{"id":350,"name":"Hoist The Colours Punch","source":"Death & Co","drinkIngredients":[1987,1988,1989,1990,1991,1992,1993,1994,1995,1996],"ingredientTypes":[301,92,189,118,1,122,199,247,31,219],"ingredientSuperTypes":[2,2,2]},{"id":673,"name":"Honeymoon Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3626,3627,3628,3629],"ingredientTypes":[23,228,42,199],"ingredientSuperTypes":[]},{"id":29,"name":"Honeysuckle","source":"Death & Co","drinkIngredients":[134,135,136],"ingredientTypes":[292,203,165],"ingredientSuperTypes":[2]},{"id":234,"name":"Honshu Punch","source":"Death & Co","drinkIngredients":[1321,1322,1323,1324,1325,1326,1327],"ingredientTypes":[190,199,247,284,31,31,92],"ingredientSuperTypes":[]},{"id":109,"name":"Hostage Situation","source":"Death & Co","drinkIngredients":[592,593,594,595,596,597,598],"ingredientTypes":[221,182,304,113,225,31,227],"ingredientSuperTypes":[129]},{"id":674,"name":"Hot Buttered Pisco","source":"The PDT Cocktail Book","drinkIngredients":[3630,3631,3632],"ingredientTypes":[323,295,315],"ingredientSuperTypes":[]},{"id":203,"name":"Hot Lips","source":"Death & Co","drinkIngredients":[1132,1133,1134,1135,1136,1137,1138],"ingredientTypes":[278,183,211,199,247,317,284],"ingredientSuperTypes":[]},{"id":675,"name":"Hotel D’alsace","source":"The PDT Cocktail Book","drinkIngredients":[3633,3634,3635,3636],"ingredientTypes":[185,228,42,272],"ingredientSuperTypes":[]},{"id":676,"name":"Hotel Nacional Special","source":"The PDT Cocktail Book","drinkIngredients":[3637,3638,3639,3640,3641],"ingredientTypes":[292,247,203,284,27],"ingredientSuperTypes":[2]},{"id":418,"name":"House Of Payne","source":"Death & Co","drinkIngredients":[2413,2414,2415,2416],"ingredientTypes":[261,128,288,47],"ingredientSuperTypes":[129,129]},{"id":158,"name":"Howl On The Hill","source":"Death & Co","drinkIngredients":[879,880,881,882,883,884],"ingredientTypes":[119,292,304,13,328,3],"ingredientSuperTypes":[2,2]},{"id":110,"name":"Howlin’ At The Moon","source":"Death & Co","drinkIngredients":[599,600,601,602,603,604],"ingredientTypes":[199,142,83,284,77,227],"ingredientSuperTypes":[]},{"id":390,"name":"Hyde Park Swizzle","source":"Death & Co","drinkIngredients":[2250,2251,2252,2253,2254,2255],"ingredientTypes":[213,252,203,284,31,31],"ingredientSuperTypes":[129]},{"id":204,"name":"Imaginary Grace","source":"Death & Co","drinkIngredients":[1139,1140,1141,1142,1143,1144,1145],"ingredientTypes":[264,106,240,304,6,214,31],"ingredientSuperTypes":[19,17]},{"id":677,"name":"Imperial Blueberry Fizz","source":"The PDT Cocktail Book","drinkIngredients":[3642,3643,3644],"ingredientTypes":[99,112,65],"ingredientSuperTypes":[]},{"id":111,"name":"Imperial March","source":"Death & Co","drinkIngredients":[605,606,607,608,609,610],"ingredientTypes":[204,106,21,209,225,152],"ingredientSuperTypes":[129,17]},{"id":678,"name":"Imperial Silver Corn Fizz","source":"The PDT Cocktail Book","drinkIngredients":[3645,3646,3647,3648],"ingredientTypes":[308,323,165,131],"ingredientSuperTypes":[]},{"id":679,"name":"Improved Whiskey Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3649,3650,3651,3652],"ingredientTypes":[275,209,284,31],"ingredientSuperTypes":[15]},{"id":182,"name":"In-sandiary","source":"Death & Co","drinkIngredients":[1017,1018,1019,1020,1021],"ingredientTypes":[301,57,324,203,284],"ingredientSuperTypes":[19]},{"id":444,"name":"Ingénue","source":"Death & Co","drinkIngredients":[2538,2539,2540],"ingredientTypes":[99,304,89],"ingredientSuperTypes":[]},{"id":317,"name":"Irish Seelbach","source":"Death & Co","drinkIngredients":[1780,1781,1782,1783,1784,1785],"ingredientTypes":[185,228,31,31,73,227],"ingredientSuperTypes":[]},{"id":318,"name":"Iron Chancellor","source":"Death & Co","drinkIngredients":[1786,1787,1788],"ingredientTypes":[296,284,73],"ingredientSuperTypes":[]},{"id":512,"name":"Jack Rose","source":"Speakeasy","drinkIngredients":[2902,2903,2904,2905],"ingredientTypes":[23,199,284,158],"ingredientSuperTypes":[]},{"id":680,"name":"Jack Rose","source":"The PDT Cocktail Book","drinkIngredients":[3653,3654,3655],"ingredientTypes":[23,199,158],"ingredientSuperTypes":[]},{"id":30,"name":"Jack Rose","source":"Death & Co","drinkIngredients":[137,138,139,140,141,142],"ingredientTypes":[23,24,199,203,158,22],"ingredientSuperTypes":[]},{"id":375,"name":"Jack Sparrow Flip","source":"Death & Co","drinkIngredients":[2158,2159,2160,2161,2162,2163],"ingredientTypes":[292,323,284,131,31,88],"ingredientSuperTypes":[2]},{"id":391,"name":"Jalisco Swizzle","source":"Death & Co","drinkIngredients":[2256,2257,2258,2259,2260],"ingredientTypes":[57,211,203,284,31],"ingredientSuperTypes":[19]},{"id":319,"name":"Jane Rose","source":"Death & Co","drinkIngredients":[1789,1790,1791,1792,1793],"ingredientTypes":[23,199,202,158,73],"ingredientSuperTypes":[]},{"id":682,"name":"Japanese Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3661,3662,3663],"ingredientTypes":[99,231,31],"ingredientSuperTypes":[]},{"id":681,"name":"Japanese Courage","source":"The PDT Cocktail Book","drinkIngredients":[3656,3657,3658,3659,3660],"ingredientTypes":[277,142,328,144,165],"ingredientSuperTypes":[]},{"id":289,"name":"Jarnac Shrub","source":"Death & Co","drinkIngredients":[1626,1627,1628,1629,1630],"ingredientTypes":[99,304,76,225,76],"ingredientSuperTypes":[]},{"id":433,"name":"Javanese Daiquiri","source":"Death & Co","drinkIngredients":[2483,2484,2485,2486,2487],"ingredientTypes":[37,292,202,117,203],"ingredientSuperTypes":[2]},{"id":458,"name":"Jekyll And Hyde","source":"Death & Co","drinkIngredients":[2624,2625,2626,2627,2628,2629,2630],"ingredientTypes":[66,23,89,284,31,31,227],"ingredientSuperTypes":[15]},{"id":376,"name":"Jelly Roll Morton","source":"Death & Co","drinkIngredients":[2164,2165,2166,2167,2168,2169,2170],"ingredientTypes":[99,180,274,284,131,104,31],"ingredientSuperTypes":[52]},{"id":544,"name":"Jersey City Fish House Punch","source":"Speakeasy","drinkIngredients":[3067,3068,3069,3070,3071,3072,3073,3074,3075],"ingredientTypes":[169,22,239,199,203,189,23,323,111],"ingredientSuperTypes":[2]},{"id":511,"name":"Jersey Devil","source":"Speakeasy","drinkIngredients":[2897,2898,2899,2900,2901],"ingredientTypes":[178,23,25,31,227],"ingredientSuperTypes":[]},{"id":351,"name":"Jersey Lightning","source":"Death & Co","drinkIngredients":[1997,1998,1999,2000,2001,2002],"ingredientTypes":[301,92,23,182,199,88],"ingredientSuperTypes":[]},{"id":112,"name":"Jesper Lind","source":"Death & Co","drinkIngredients":[611,612,613,614,615],"ingredientTypes":[128,106,28,317,225],"ingredientSuperTypes":[129,17]},{"id":683,"name":"Jimmie Roosevelt","source":"The PDT Cocktail Book","drinkIngredients":[3664,3665,3666],"ingredientTypes":[99,301,156],"ingredientSuperTypes":[]},{"id":445,"name":"Jive Turkey","source":"Death & Co","drinkIngredients":[2541,2542,2543,2544,2545,2546,2547],"ingredientTypes":[66,275,275,13,130,132,31],"ingredientSuperTypes":[15,15,15]},{"id":684,"name":"Johnny Apple Collins","source":"The PDT Cocktail Book","drinkIngredients":[3667,3668,3669,3670],"ingredientTypes":[66,25,199,31],"ingredientSuperTypes":[15]},{"id":275,"name":"Joker’s Wild","source":"Death & Co","drinkIngredients":[1545,1546,1547,1548,1549],"ingredientTypes":[177,132,152,199,284],"ingredientSuperTypes":[]},{"id":434,"name":"Jovencourt Daiquiri","source":"Death & Co","drinkIngredients":[2488,2489,2490,2491],"ingredientTypes":[8,211,203,284],"ingredientSuperTypes":[2]},{"id":685,"name":"Judgment Day","source":"The PDT Cocktail Book","drinkIngredients":[3671,3672,3673,3674,3675,3676],"ingredientTypes":[250,132,203,199,284,131],"ingredientSuperTypes":[]},{"id":320,"name":"Julien Sorel","source":"Death & Co","drinkIngredients":[1794,1795,1796,1797,1798],"ingredientTypes":[99,156,209,199,73],"ingredientSuperTypes":[]},{"id":140,"name":"Julius Orange","source":"Death & Co","drinkIngredients":[763,764,765,766,767,768,769],"ingredientTypes":[228,292,199,317,104,225,219],"ingredientSuperTypes":[2]},{"id":686,"name":"Junior","source":"The PDT Cocktail Book","drinkIngredients":[3677,3678,3679,3680],"ingredientTypes":[275,203,42,31],"ingredientSuperTypes":[15]},{"id":367,"name":"Just Another Julep","source":"Death & Co","drinkIngredients":[2116,2117,2118,2119],"ingredientTypes":[213,66,284,118],"ingredientSuperTypes":[15,2]},{"id":687,"name":"Kansai Kick","source":"The PDT Cocktail Book","drinkIngredients":[3681,3682,3683,3684],"ingredientTypes":[190,282,203,231],"ingredientSuperTypes":[52]},{"id":141,"name":"Kerala","source":"Death & Co","drinkIngredients":[770,771,772,773,774,775,776,777],"ingredientTypes":[69,292,66,247,199,284,31,31],"ingredientSuperTypes":[2,15]},{"id":86,"name":"Kew Gardens Cooler","source":"Death & Co","drinkIngredients":[463,464,465,466,467],"ingredientTypes":[115,128,46,152,281],"ingredientSuperTypes":[129]},{"id":114,"name":"Key Party","source":"Death & Co","drinkIngredients":[621,622,623,624],"ingredientTypes":[252,21,13,156],"ingredientSuperTypes":[129]},{"id":352,"name":"Kill-devil Punch","source":"Death & Co","drinkIngredients":[2003,2004,2005,2006,2007,2008,2009],"ingredientTypes":[301,261,92,189,203,247,73],"ingredientSuperTypes":[2]},{"id":690,"name":"Kin Kan","source":"The PDT Cocktail Book","drinkIngredients":[3694,3695,3696],"ingredientTypes":[128,195,199],"ingredientSuperTypes":[129]},{"id":688,"name":"Kina Miele","source":"The PDT Cocktail Book","drinkIngredients":[3685,3686,3687,3688,3689],"ingredientTypes":[130,21,164,240,199],"ingredientSuperTypes":[]},{"id":689,"name":"King Bee","source":"The PDT Cocktail Book","drinkIngredients":[3690,3691,3692,3693],"ingredientTypes":[250,199,42,164],"ingredientSuperTypes":[]},{"id":419,"name":"Kingston Negroni","source":"Death & Co","drinkIngredients":[2417,2418,2419,2420],"ingredientTypes":[189,304,47,227],"ingredientSuperTypes":[2]},{"id":142,"name":"Koko B. Ware","source":"Death & Co","drinkIngredients":[778,779,780,781,782,783,784,785],"ingredientTypes":[189,8,203,231,317,104,31,219],"ingredientSuperTypes":[2,2]},{"id":691,"name":"Koyo","source":"The PDT Cocktail Book","drinkIngredients":[3697,3698,3699,3700],"ingredientTypes":[277,21,13,328],"ingredientSuperTypes":[]},{"id":704,"name":"L.e.s. Globetrotter","source":"The PDT Cocktail Book","drinkIngredients":[3754,3755,3756,3757],"ingredientTypes":[275,99,42,113],"ingredientSuperTypes":[15]},{"id":435,"name":"La Bomba Daiquiri","source":"Death & Co","drinkIngredients":[2492,2493,2494,2495,2496],"ingredientTypes":[261,8,203,284,255],"ingredientSuperTypes":[2]},{"id":459,"name":"La Conferencia","source":"Death & Co","drinkIngredients":[2631,2632,2633,2634,2635,2636,2637,2638],"ingredientTypes":[264,211,8,292,284,31,214,227],"ingredientSuperTypes":[19,2,2]},{"id":258,"name":"La Dolce Vita","source":"Death & Co","drinkIngredients":[1456,1457,1458],"ingredientTypes":[180,47,132],"ingredientSuperTypes":[]},{"id":353,"name":"La Fée Noir Punch","source":"Death & Co","drinkIngredients":[2010,2011,2012,2013,2014,2015,2016,2017],"ingredientTypes":[301,53,92,221,209,3,227,199],"ingredientSuperTypes":[129]},{"id":693,"name":"La Florida Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3704,3705,3706,3707,3708],"ingredientTypes":[58,203,83,304,158],"ingredientSuperTypes":[2]},{"id":695,"name":"La Louche","source":"The PDT Cocktail Book","drinkIngredients":[3713,3714,3715,3716,3717],"ingredientTypes":[217,21,203,328,284],"ingredientSuperTypes":[129]},{"id":696,"name":"La Perla","source":"The PDT Cocktail Book","drinkIngredients":[3718,3719,3720],"ingredientTypes":[264,207,239],"ingredientSuperTypes":[19,17]},{"id":31,"name":"La Rosita","source":"Death & Co","drinkIngredients":[143,144,145,146,147,148],"ingredientTypes":[264,47,304,130,31,227],"ingredientSuperTypes":[19]},{"id":183,"name":"La Valentina","source":"Death & Co","drinkIngredients":[1022,1023,1024,1025,1026,1027,1028],"ingredientTypes":[261,57,152,203,284,278,40],"ingredientSuperTypes":[19]},{"id":259,"name":"La Viáa","source":"Death & Co","drinkIngredients":[1459,1460,1461,1462],"ingredientTypes":[275,13,106,225],"ingredientSuperTypes":[15,17]},{"id":692,"name":"Lacrimosa","source":"The PDT Cocktail Book","drinkIngredients":[3701,3702,3703],"ingredientTypes":[275,13,13],"ingredientSuperTypes":[15]},{"id":694,"name":"Lake George","source":"The PDT Cocktail Book","drinkIngredients":[3709,3710,3711,3712],"ingredientTypes":[185,285,124,199],"ingredientSuperTypes":[286]},{"id":205,"name":"Last Train To Oaxaca","source":"Death & Co","drinkIngredients":[1146,1147,1148,1149,1150],"ingredientTypes":[18,211,21,123,227],"ingredientSuperTypes":[19]},{"id":697,"name":"Last Word","source":"The PDT Cocktail Book","drinkIngredients":[3721,3722,3723,3724],"ingredientTypes":[128,209,156,203],"ingredientSuperTypes":[129]},{"id":32,"name":"Last Word","source":"Death & Co","drinkIngredients":[149,150,151,152],"ingredientTypes":[128,156,209,203],"ingredientSuperTypes":[129]},{"id":414,"name":"Latin Quarter","source":"Death & Co","drinkIngredients":[2389,2390,2391,2392,2393,2394,2395],"ingredientTypes":[3,292,284,31,31,214,199],"ingredientSuperTypes":[2]},{"id":698,"name":"Lawn Dart","source":"The PDT Cocktail Book","drinkIngredients":[3725,3726,3727,3728,3729,3730],"ingredientTypes":[57,128,203,7,156,41],"ingredientSuperTypes":[19,129]},{"id":115,"name":"Le Bateleur","source":"Death & Co","drinkIngredients":[625,626,627,628,629,630],"ingredientTypes":[128,304,300,13,31,227],"ingredientSuperTypes":[129]},{"id":377,"name":"Le Gigot Flip","source":"Death & Co","drinkIngredients":[2171,2172,2173,2174,2175,2176,2177],"ingredientTypes":[292,80,284,131,104,214,76],"ingredientSuperTypes":[2]},{"id":702,"name":"Le Père Bis","source":"The PDT Cocktail Book","drinkIngredients":[3746,3747,3748,3749],"ingredientTypes":[72,187,132,165],"ingredientSuperTypes":[60]},{"id":116,"name":"Le Subtil","source":"Death & Co","drinkIngredients":[631,632,633,634,635],"ingredientTypes":[142,13,304,151,152],"ingredientSuperTypes":[]},{"id":699,"name":"Leapfrog","source":"The PDT Cocktail Book","drinkIngredients":[3731,3732,3733,3734,3735],"ingredientTypes":[252,199,27,284,225],"ingredientSuperTypes":[129]},{"id":701,"name":"Left Coast","source":"The PDT Cocktail Book","drinkIngredients":[3740,3741,3742,3743,3744,3745],"ingredientTypes":[251,142,209,199,247,112],"ingredientSuperTypes":[]},{"id":700,"name":"Left Hand Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3736,3737,3738,3739],"ingredientTypes":[66,304,47,214],"ingredientSuperTypes":[15]},{"id":290,"name":"Legend","source":"Death & Co","drinkIngredients":[1631,1632,1633,1634,1635,1636,1637],"ingredientTypes":[99,189,16,13,284,31,31],"ingredientSuperTypes":[2,17]},{"id":291,"name":"Les Verts Monts","source":"Death & Co","drinkIngredients":[1638,1639,1640,1641,1642,1643,1644,1645,1646],"ingredientTypes":[30,99,24,56,106,208,31,199,22],"ingredientSuperTypes":[17]},{"id":117,"name":"Light And Day","source":"Death & Co","drinkIngredients":[636,637,638,639,640],"ingredientTypes":[252,328,209,227,31],"ingredientSuperTypes":[129]},{"id":354,"name":"Lights Out Punch","source":"Death & Co","drinkIngredients":[2018,2019,2020,2021,2022,2023,2024,2025,2026],"ingredientTypes":[264,182,22,199,284,31,31,92,88],"ingredientSuperTypes":[19]},{"id":321,"name":"Lily’s Cartel","source":"Death & Co","drinkIngredients":[1799,1800,1801,1802,1803,1804],"ingredientTypes":[250,46,62,199,284,73],"ingredientSuperTypes":[]},{"id":292,"name":"Lilywhacker","source":"Death & Co","drinkIngredients":[1647,1648,1649,1650],"ingredientTypes":[23,304,228,214],"ingredientSuperTypes":[]},{"id":436,"name":"Linbaba Daiquiri","source":"Death & Co","drinkIngredients":[2497,2498,2499,2500,2501,2502,2503,2504],"ingredientTypes":[292,189,203,89,231,146,117,31],"ingredientSuperTypes":[2,2]},{"id":703,"name":"Lion’s Tooth","source":"The PDT Cocktail Book","drinkIngredients":[3750,3751,3752,3753],"ingredientTypes":[275,232,328,132],"ingredientSuperTypes":[15]},{"id":705,"name":"Little Bit Country","source":"The PDT Cocktail Book","drinkIngredients":[3758,3759,3760,3761,3762,3763,3764],"ingredientTypes":[66,199,208,209,188,31,225],"ingredientSuperTypes":[15]},{"id":235,"name":"Little Engine","source":"Death & Co","drinkIngredients":[1328,1329,1330,1331,1332],"ingredientTypes":[59,307,199,208,22],"ingredientSuperTypes":[60,52]},{"id":400,"name":"Little Kingdom","source":"Death & Co","drinkIngredients":[2312,2313,2314,2315],"ingredientTypes":[264,304,13,76],"ingredientSuperTypes":[19]},{"id":276,"name":"Little Miss Annabelle","source":"Death & Co","drinkIngredients":[1550,1551,1552,1553,1554,1555],"ingredientTypes":[99,239,42,199,284,31],"ingredientSuperTypes":[]},{"id":293,"name":"Little Sparrow","source":"Death & Co","drinkIngredients":[1651,1652,1653,1654,1655,1656],"ingredientTypes":[24,23,304,132,31,199],"ingredientSuperTypes":[]},{"id":322,"name":"Live Free Or Die","source":"Death & Co","drinkIngredients":[1805,1806,1807,1808,1809],"ingredientTypes":[252,228,209,199,73],"ingredientSuperTypes":[129]},{"id":184,"name":"Los Amargos","source":"Death & Co","drinkIngredients":[1029,1030,1031,1032,1033],"ingredientTypes":[264,13,13,209,199],"ingredientSuperTypes":[19]},{"id":706,"name":"Luau","source":"The PDT Cocktail Book","drinkIngredients":[3765,3766,3767,3768,3769,3770,3771,3772],"ingredientTypes":[189,189,119,203,284,233,231,31],"ingredientSuperTypes":[2,2,2]},{"id":33,"name":"Lucien Gaudin","source":"Death & Co","drinkIngredients":[153,154,155,156,157],"ingredientTypes":[128,130,47,228,199],"ingredientSuperTypes":[129]},{"id":118,"name":"Lucino’s Delight","source":"Death & Co","drinkIngredients":[641,642,643,644],"ingredientTypes":[128,304,209,13],"ingredientSuperTypes":[129]},{"id":355,"name":"Lust For Life Punch","source":"Death & Co","drinkIngredients":[2027,2028,2029,2030,2031,2032,2033,2034],"ingredientTypes":[301,227,92,199,247,28,182,73],"ingredientSuperTypes":[]},{"id":708,"name":"Mae West Royal Diamond Fizz","source":"The PDT Cocktail Book","drinkIngredients":[3778,3779,3780,3781],"ingredientTypes":[172,152,254,131],"ingredientSuperTypes":[]},{"id":277,"name":"Maggie Smith","source":"Death & Co","drinkIngredients":[1556,1557,1558,1559,1560,1561],"ingredientTypes":[250,58,227,203,231,165],"ingredientSuperTypes":[2]},{"id":34,"name":"Mai Tai","source":"Death & Co","drinkIngredients":[158,159,160,161,162,163,164,165],"ingredientTypes":[203,119,189,8,113,231,31,213],"ingredientSuperTypes":[2,2,2]},{"id":513,"name":"Mai Tai","source":"Speakeasy","drinkIngredients":[2906,2907,2908,2909,2910],"ingredientTypes":[292,228,231,203,213],"ingredientSuperTypes":[2]},{"id":707,"name":"Mai-tai","source":"The PDT Cocktail Book","drinkIngredients":[3773,3774,3775,3776,3777],"ingredientTypes":[58,8,203,228,231],"ingredientSuperTypes":[2,2]},{"id":119,"name":"Mainland","source":"Death & Co","drinkIngredients":[645,646,647,648,649],"ingredientTypes":[152,128,140,284,31],"ingredientSuperTypes":[129]},{"id":420,"name":"Mañanita","source":"Death & Co","drinkIngredients":[2421,2422,2423,2424],"ingredientTypes":[211,173,304,227],"ingredientSuperTypes":[]},{"id":35,"name":"Manhattan","source":"Death & Co","drinkIngredients":[166,167,168,169],"ingredientTypes":[275,304,31,76],"ingredientSuperTypes":[15]},{"id":709,"name":"Manhattan","source":"The PDT Cocktail Book","drinkIngredients":[3782,3783,3784],"ingredientTypes":[275,304,31],"ingredientSuperTypes":[15]},{"id":468,"name":"Manhattan Cocktail","source":"Speakeasy","drinkIngredients":[2677,2678,2679,2680,2681],"ingredientTypes":[275,304,228,31,199],"ingredientSuperTypes":[15]},{"id":260,"name":"Manhattan Transfer","source":"Death & Co","drinkIngredients":[1463,1464,1465,1466],"ingredientTypes":[275,130,13,225],"ingredientSuperTypes":[15]},{"id":368,"name":"Maple Julep","source":"Death & Co","drinkIngredients":[2120,2121,2122],"ingredientTypes":[275,208,213],"ingredientSuperTypes":[15]},{"id":36,"name":"Margarita","source":"Death & Co","drinkIngredients":[170,171,172,173,174],"ingredientTypes":[278,57,228,203,6],"ingredientSuperTypes":[19]},{"id":710,"name":"Margarita","source":"The PDT Cocktail Book","drinkIngredients":[3785,3786,3787,3788],"ingredientTypes":[57,228,203,7],"ingredientSuperTypes":[19]},{"id":711,"name":"Mariner","source":"The PDT Cocktail Book","drinkIngredients":[3789,3790,3791,3792],"ingredientTypes":[59,69,247,199],"ingredientSuperTypes":[60]},{"id":294,"name":"Martica","source":"Death & Co","drinkIngredients":[1657,1658,1659,1660,1661],"ingredientTypes":[99,189,304,209,31],"ingredientSuperTypes":[2]},{"id":470,"name":"Martinez","source":"Speakeasy","drinkIngredients":[2686,2687,2688,2689,2690],"ingredientTypes":[128,209,56,4,199],"ingredientSuperTypes":[129]},{"id":712,"name":"Martinez","source":"The PDT Cocktail Book","drinkIngredients":[3793,3794,3795,3796],"ingredientTypes":[221,304,209,31],"ingredientSuperTypes":[129]},{"id":37,"name":"Martinez","source":"Death & Co","drinkIngredients":[175,176,177,178,179,180,181],"ingredientTypes":[221,221,304,209,78,225,199],"ingredientSuperTypes":[129,129]},{"id":713,"name":"Martini","source":"The PDT Cocktail Book","drinkIngredients":[3797,3798],"ingredientTypes":[252,130],"ingredientSuperTypes":[129]},{"id":38,"name":"Martini","source":"Death & Co","drinkIngredients":[182,183,184,185],"ingredientTypes":[128,130,225,199],"ingredientSuperTypes":[129]},{"id":714,"name":"Mary Pickford","source":"The PDT Cocktail Book","drinkIngredients":[3799,3800,3801,3802],"ingredientTypes":[58,247,209,158],"ingredientSuperTypes":[2]},{"id":715,"name":"Masataka Swizzle","source":"The PDT Cocktail Book","drinkIngredients":[3803,3804,3805,3806],"ingredientTypes":[190,11,199,284],"ingredientSuperTypes":[]},{"id":716,"name":"Master Cleanse","source":"The PDT Cocktail Book","drinkIngredients":[3807,3808,3809,3810,3811],"ingredientTypes":[23,199,208,188,147],"ingredientSuperTypes":[]},{"id":514,"name":"Mata Hari","source":"Speakeasy","drinkIngredients":[2911,2912,2913,2914,2915,2916],"ingredientTypes":[99,182,199,253,284,127],"ingredientSuperTypes":[]},{"id":717,"name":"May Daisy","source":"The PDT Cocktail Book","drinkIngredients":[3812,3813,3814,3815],"ingredientTypes":[99,199,156,284],"ingredientSuperTypes":[]},{"id":718,"name":"May Day","source":"The PDT Cocktail Book","drinkIngredients":[3816,3817,3818,3819,3820],"ingredientTypes":[252,46,199,284,265],"ingredientSuperTypes":[129]},{"id":120,"name":"May Fair","source":"Death & Co","drinkIngredients":[650,651,652,653,654,655,656,657],"ingredientTypes":[128,28,28,304,42,31,31,227],"ingredientSuperTypes":[129]},{"id":517,"name":"Mediterra","source":"Speakeasy","drinkIngredients":[2927,2928,2929,2930],"ingredientTypes":[322,165,138,199],"ingredientSuperTypes":[]},{"id":338,"name":"Melancholy Summer","source":"Death & Co","drinkIngredients":[1901,1902,1903,1904,1905,1906,1907],"ingredientTypes":[115,207,204,303,68,199,165],"ingredientSuperTypes":[17,129]},{"id":719,"name":"Melon Stand","source":"The PDT Cocktail Book","drinkIngredients":[3821,3822,3823,3824,3825],"ingredientTypes":[252,324,199,46,284],"ingredientSuperTypes":[129]},{"id":437,"name":"Meridian Daiquiri","source":"Death & Co","drinkIngredients":[2505,2506,2507,2508,2509,2510],"ingredientTypes":[69,28,292,247,203,146],"ingredientSuperTypes":[2]},{"id":121,"name":"Mexi-gin Martini","source":"Death & Co","drinkIngredients":[658,659,660,661,662,663],"ingredientTypes":[252,130,107,183,156,71],"ingredientSuperTypes":[129]},{"id":39,"name":"Mexican Firing Squad","source":"Death & Co","drinkIngredients":[186,187,188,189,190,191],"ingredientTypes":[57,203,284,158,159,76],"ingredientSuperTypes":[19]},{"id":720,"name":"Mexicano","source":"The PDT Cocktail Book","drinkIngredients":[3826,3827,3828],"ingredientTypes":[264,48,115],"ingredientSuperTypes":[19]},{"id":721,"name":"Mezcal Mule","source":"The PDT Cocktail Book","drinkIngredients":[3829,3830,3831,3832,3833,3834],"ingredientTypes":[211,145,203,233,7,115],"ingredientSuperTypes":[]},{"id":446,"name":"Mi Amaro","source":"Death & Co","drinkIngredients":[2548,2549,2550,2551,2552],"ingredientTypes":[264,13,304,132,152],"ingredientSuperTypes":[19]},{"id":538,"name":"Mid-morning Fizz","source":"Speakeasy","drinkIngredients":[3029,3030,3031,3032,3033,3034,3035,3036],"ingredientTypes":[156,92,204,199,284,226,131,227],"ingredientSuperTypes":[129]},{"id":722,"name":"Midnight Express","source":"The PDT Cocktail Book","drinkIngredients":[3835,3836,3837,3838],"ingredientTypes":[96,174,11,284],"ingredientSuperTypes":[]},{"id":159,"name":"Midnight Mass","source":"Death & Co","drinkIngredients":[885,886,887,888,889],"ingredientTypes":[292,13,42,31,227],"ingredientSuperTypes":[2]},{"id":339,"name":"Midnight Mountain","source":"Death & Co","drinkIngredients":[1908,1909,1910,1911,1912],"ingredientTypes":[13,304,110,83,227],"ingredientSuperTypes":[]},{"id":723,"name":"Milk Punch","source":"The PDT Cocktail Book","drinkIngredients":[3839,3840,3841,3842],"ingredientTypes":[212,99,118,284],"ingredientSuperTypes":[2]},{"id":487,"name":"Millionaire Cocktail","source":"Speakeasy","drinkIngredients":[2770,2771,2772,2773,2774,2775,2776],"ingredientTypes":[66,228,131,158,235,199,219],"ingredientSuperTypes":[15]},{"id":724,"name":"Mint Apple Crisp","source":"The PDT Cocktail Book","drinkIngredients":[3843,3844,3845,3846,3847],"ingredientTypes":[22,277,284,22,213],"ingredientSuperTypes":[]},{"id":495,"name":"Mint Julep","source":"Speakeasy","drinkIngredients":[2806,2807,2808,2809],"ingredientTypes":[213,31,92,66],"ingredientSuperTypes":[15]},{"id":725,"name":"Mint Julep","source":"The PDT Cocktail Book","drinkIngredients":[3848,3849,3850],"ingredientTypes":[66,284,213],"ingredientSuperTypes":[15]},{"id":40,"name":"Mintjulep","source":"Death & Co","drinkIngredients":[192,193,194],"ingredientTypes":[66,284,213],"ingredientSuperTypes":[15]},{"id":323,"name":"Miss Behavin’","source":"Death & Co","drinkIngredients":[1810,1811,1812,1813,1814,1815],"ingredientTypes":[240,23,199,284,73,239],"ingredientSuperTypes":[]},{"id":41,"name":"Mojito","source":"Death & Co","drinkIngredients":[195,196,197,198,199],"ingredientTypes":[213,284,292,203,31],"ingredientSuperTypes":[2]},{"id":726,"name":"Mojito","source":"The PDT Cocktail Book","drinkIngredients":[3851,3852,3853,3854],"ingredientTypes":[58,284,203,213],"ingredientSuperTypes":[2]},{"id":728,"name":"Monkey Gland","source":"The PDT Cocktail Book","drinkIngredients":[3858,3859,3860],"ingredientTypes":[128,227,255],"ingredientSuperTypes":[129]},{"id":236,"name":"Monongahela Mule","source":"Death & Co","drinkIngredients":[1333,1334,1335,1336,1337],"ingredientTypes":[261,213,275,199,146],"ingredientSuperTypes":[15]},{"id":727,"name":"Montgomery Smith","source":"The PDT Cocktail Book","drinkIngredients":[3855,3856,3857],"ingredientTypes":[99,42,13],"ingredientSuperTypes":[]},{"id":123,"name":"Moon Cocktail","source":"Death & Co","drinkIngredients":[670,671,672,673,674],"ingredientTypes":[252,16,111,165,199],"ingredientSuperTypes":[129,17]},{"id":729,"name":"Morango Fizz","source":"The PDT Cocktail Book","drinkIngredients":[3861,3862,3863,3864],"ingredientTypes":[179,199,284,131],"ingredientSuperTypes":[]},{"id":324,"name":"Morfeo","source":"Death & Co","drinkIngredients":[1816,1817,1818,1819,1820],"ingredientTypes":[180,140,199,165,73],"ingredientSuperTypes":[]},{"id":278,"name":"Morning Buzz","source":"Death & Co","drinkIngredients":[1562,1563,1564,1565,1566,1567,1568],"ingredientTypes":[99,292,16,231,165,163,131],"ingredientSuperTypes":[2,17]},{"id":87,"name":"Mortal Enemy","source":"Death & Co","drinkIngredients":[468,469,470,471,472,473],"ingredientTypes":[217,83,49,3,203,284],"ingredientSuperTypes":[129]},{"id":42,"name":"Moscow Mule","source":"Death & Co","drinkIngredients":[200,201,202,203,204],"ingredientTypes":[322,203,146,92,67],"ingredientSuperTypes":[]},{"id":526,"name":"Moscow Mule","source":"Speakeasy","drinkIngredients":[2973,2974,2975],"ingredientTypes":[322,203,145],"ingredientSuperTypes":[]},{"id":730,"name":"Moscow Mule","source":"The PDT Cocktail Book","drinkIngredients":[3865,3866,3867,3868],"ingredientTypes":[322,145,284,203],"ingredientSuperTypes":[]},{"id":438,"name":"Mosquito Coast","source":"Death & Co","drinkIngredients":[2511,2512,2513,2514],"ingredientTypes":[292,10,203,284],"ingredientSuperTypes":[2]},{"id":356,"name":"Mother’s Ruin Punch","source":"Death & Co","drinkIngredients":[2035,2036,2037,2038,2039,2040,2041],"ingredientTypes":[301,92,252,182,152,199,73],"ingredientSuperTypes":[129]},{"id":731,"name":"Mount Vernon","source":"The PDT Cocktail Book","drinkIngredients":[3869,3870,3871,3872,3873],"ingredientTypes":[78,291,152,242,80],"ingredientSuperTypes":[17]},{"id":237,"name":"Mrs. Doyle","source":"Death & Co","drinkIngredients":[1338,1339,1340,1341],"ingredientTypes":[185,259,199,284],"ingredientSuperTypes":[]},{"id":279,"name":"Mucho Picchu","source":"Death & Co","drinkIngredients":[1569,1570,1571,1572,1573],"ingredientTypes":[250,209,152,284,73],"ingredientSuperTypes":[]},{"id":88,"name":"Muddled Mission","source":"Death & Co","drinkIngredients":[474,475,476,477,478],"ingredientTypes":[297,128,132,328,199],"ingredientSuperTypes":[129]},{"id":43,"name":"Mudslideflip","source":"Death & Co","drinkIngredients":[205,206,207,208,209,210,211],"ingredientTypes":[185,182,284,131,104,31,82],"ingredientSuperTypes":[]},{"id":732,"name":"Mum’s Apple Pie","source":"The PDT Cocktail Book","drinkIngredients":[3874,3875,3876,3877],"ingredientTypes":[114,22,199,284],"ingredientSuperTypes":[2]},{"id":392,"name":"Myra Breckinridge","source":"Death & Co","drinkIngredients":[2261,2262,2263,2264,2265],"ingredientTypes":[187,3,203,284,213],"ingredientSuperTypes":[60]},{"id":185,"name":"Naked And Famous","source":"Death & Co","drinkIngredients":[1034,1035,1036,1037],"ingredientTypes":[211,328,46,203],"ingredientSuperTypes":[]},{"id":447,"name":"Navigator","source":"Death & Co","drinkIngredients":[2553,2554,2555,2556,2557],"ingredientTypes":[181,205,284,317,31],"ingredientSuperTypes":[52]},{"id":733,"name":"Navy Grog","source":"The PDT Cocktail Book","drinkIngredients":[3878,3879,3880,3881,3882,3883],"ingredientTypes":[118,189,119,203,152,165],"ingredientSuperTypes":[2,2,2]},{"id":473,"name":"Negroni","source":"Speakeasy","drinkIngredients":[2700,2701,2702,2703],"ingredientTypes":[252,47,304,227],"ingredientSuperTypes":[129]},{"id":734,"name":"Negroni","source":"The PDT Cocktail Book","drinkIngredients":[3884,3885,3886],"ingredientTypes":[128,47,304],"ingredientSuperTypes":[129]},{"id":44,"name":"Negroni","source":"Death & Co","drinkIngredients":[212,213,214,215],"ingredientTypes":[128,47,304,227],"ingredientSuperTypes":[129]},{"id":472,"name":"Nerina","source":"Speakeasy","drinkIngredients":[2696,2697,2698,2699],"ingredientTypes":[252,13,304,227],"ingredientSuperTypes":[129]},{"id":735,"name":"New Amsterdam","source":"The PDT Cocktail Book","drinkIngredients":[3887,3888,3889,3890],"ingredientTypes":[142,78,284,31],"ingredientSuperTypes":[]},{"id":738,"name":"New York Flip","source":"The PDT Cocktail Book","drinkIngredients":[3900,3901,3902,3903],"ingredientTypes":[66,104,284,131],"ingredientSuperTypes":[15]},{"id":506,"name":"New York Sour","source":"Speakeasy","drinkIngredients":[2872,2873,2874,2875,2876,2877],"ingredientTypes":[275,199,284,263,227,76],"ingredientSuperTypes":[15]},{"id":508,"name":"New Yorker","source":"Speakeasy","drinkIngredients":[2883,2884,2885,2886,2887],"ingredientTypes":[275,199,284,92,263],"ingredientSuperTypes":[15]},{"id":736,"name":"Newark","source":"The PDT Cocktail Book","drinkIngredients":[3891,3892,3893,3894],"ingredientTypes":[23,304,13,209],"ingredientSuperTypes":[]},{"id":737,"name":"Newfangled","source":"The PDT Cocktail Book","drinkIngredients":[3895,3896,3897,3898,3899],"ingredientTypes":[66,284,31,227,76],"ingredientSuperTypes":[15]},{"id":295,"name":"Night Owl","source":"Death & Co","drinkIngredients":[1662,1663,1664,1665],"ingredientTypes":[99,304,106,37],"ingredientSuperTypes":[17]},{"id":124,"name":"Night Watch","source":"Death & Co","drinkIngredients":[675,676,677,678,679],"ingredientTypes":[221,118,106,284,31],"ingredientSuperTypes":[129,2,17]},{"id":739,"name":"Nigori Milk Punch","source":"The PDT Cocktail Book","drinkIngredients":[3904,3905,3906,3907],"ingredientTypes":[277,99,316,31],"ingredientSuperTypes":[]},{"id":206,"name":"Nitty-gritty","source":"Death & Co","drinkIngredients":[1151,1152,1153,1154,1155,1156,1157,1158],"ingredientTypes":[211,207,42,239,6,22,31,199],"ingredientSuperTypes":[17]},{"id":740,"name":"Noce Royale","source":"The PDT Cocktail Book","drinkIngredients":[3908,3909,3910],"ingredientTypes":[128,288,218],"ingredientSuperTypes":[129,129]},{"id":741,"name":"Norman Inversion","source":"The PDT Cocktail Book","drinkIngredients":[3911,3912,3913,3914,3915],"ingredientTypes":[128,25,152,284,227],"ingredientSuperTypes":[129]},{"id":325,"name":"North By Northwest","source":"Death & Co","drinkIngredients":[1821,1822,1823,1824,1825],"ingredientTypes":[128,3,199,284,73],"ingredientSuperTypes":[129]},{"id":460,"name":"North Garden","source":"Death & Co","drinkIngredients":[2639,2640,2641,2642,2643],"ingredientTypes":[23,66,187,284,31],"ingredientSuperTypes":[15,60]},{"id":369,"name":"Not-quite-georgia Julep","source":"Death & Co","drinkIngredients":[2123,2124,2125,2126,2127],"ingredientTypes":[99,23,111,284,213],"ingredientSuperTypes":[]},{"id":742,"name":"Nouveau Carré","source":"The PDT Cocktail Book","drinkIngredients":[3916,3917,3918,3919],"ingredientTypes":[18,21,42,31],"ingredientSuperTypes":[19]},{"id":743,"name":"Nouveau Sangaree","source":"The PDT Cocktail Book","drinkIngredients":[3920,3921,3922,3923,3924],"ingredientTypes":[263,23,288,208,31],"ingredientSuperTypes":[129]},{"id":744,"name":"Noval Cup","source":"The PDT Cocktail Book","drinkIngredients":[3925,3926,3927,3928],"ingredientTypes":[51,199,284,297],"ingredientSuperTypes":[52]},{"id":745,"name":"Nth Degree","source":"The PDT Cocktail Book","drinkIngredients":[3929,3930,3931,3932,3933],"ingredientTypes":[8,23,156,301,31],"ingredientSuperTypes":[2]},{"id":357,"name":"Nuts And Sherry Punch","source":"Death & Co","drinkIngredients":[2042,2043,2044,2045,2046,2047,2048,2049],"ingredientTypes":[301,92,106,172,10,203,247,214],"ingredientSuperTypes":[17]},{"id":461,"name":"Oaxaca Old-fashioned","source":"Death & Co","drinkIngredients":[2644,2645,2646,2647,2648],"ingredientTypes":[264,211,6,31,227],"ingredientSuperTypes":[19]},{"id":746,"name":"Occidental","source":"The PDT Cocktail Book","drinkIngredients":[3934,3935,3936],"ingredientTypes":[28,228,13],"ingredientSuperTypes":[]},{"id":503,"name":"Old Fashioned #1","source":"Speakeasy","drinkIngredients":[2852,2853,2854,2855,2856],"ingredientTypes":[301,31,323,14,199],"ingredientSuperTypes":[15]},{"id":504,"name":"Old Fashioned #2","source":"Speakeasy","drinkIngredients":[2857,2858,2859,2860,2861,2862,2863,2864],"ingredientTypes":[301,301,31,227,76,199,92,275],"ingredientSuperTypes":[15]},{"id":748,"name":"Old Flame","source":"The PDT Cocktail Book","drinkIngredients":[3940,3941,3942,3943],"ingredientTypes":[252,199,284,131],"ingredientSuperTypes":[129]},{"id":160,"name":"Old Ironsides","source":"Death & Co","drinkIngredients":[890,891,892,893,894],"ingredientTypes":[292,118,304,11,31],"ingredientSuperTypes":[2,2]},{"id":749,"name":"Old Maid","source":"The PDT Cocktail Book","drinkIngredients":[3944,3945,3946,3947,3948],"ingredientTypes":[252,203,284,213,115],"ingredientSuperTypes":[129]},{"id":46,"name":"Old Pal","source":"Death & Co","drinkIngredients":[221,222,223,224],"ingredientTypes":[275,47,130,199],"ingredientSuperTypes":[15]},{"id":750,"name":"Old Pal","source":"The PDT Cocktail Book","drinkIngredients":[3949,3950,3951],"ingredientTypes":[275,130,47],"ingredientSuperTypes":[15]},{"id":45,"name":"Old-fashioned","source":"Death & Co","drinkIngredients":[216,217,218,219,220],"ingredientTypes":[66,284,31,31,227],"ingredientSuperTypes":[15]},{"id":747,"name":"Old-fashioned Whiskey Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3937,3938,3939],"ingredientTypes":[275,301,31],"ingredientSuperTypes":[15]},{"id":403,"name":"One, One, One","source":"Death & Co","drinkIngredients":[2327,2328,2329,2330],"ingredientTypes":[28,128,56,225],"ingredientSuperTypes":[129]},{"id":751,"name":"Opera Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3952,3953,3954,3955],"ingredientTypes":[252,21,206,225],"ingredientSuperTypes":[129]},{"id":448,"name":"Orkney Chapel","source":"Death & Co","drinkIngredients":[2558,2559,2560,2561,2562,2563],"ingredientTypes":[285,130,16,228,284,227],"ingredientSuperTypes":[286,17]},{"id":404,"name":"Over And Out","source":"Death & Co","drinkIngredients":[2331,2332,2333,2334,2335,2336,2337],"ingredientTypes":[28,57,203,324,284,71,225],"ingredientSuperTypes":[19]},{"id":89,"name":"Overhead Smash","source":"Death & Co","drinkIngredients":[479,480,481,482,483,484,485,486,487,488,489],"ingredientTypes":[297,115,128,21,304,199,231,146,31,225,92],"ingredientSuperTypes":[129]},{"id":358,"name":"P-five Punch","source":"Death & Co","drinkIngredients":[2050,2051,2052,2053,2054,2055,2056,2057],"ingredientTypes":[301,231,250,22,217,152,199,38],"ingredientSuperTypes":[129]},{"id":752,"name":"Paddington","source":"The PDT Cocktail Book","drinkIngredients":[3956,3957,3958,3959,3960],"ingredientTypes":[58,21,152,199,227],"ingredientSuperTypes":[2]},{"id":238,"name":"Paddy Melt","source":"Death & Co","drinkIngredients":[1342,1343,1344,1345,1346],"ingredientTypes":[287,180,13,199,284],"ingredientSuperTypes":[]},{"id":753,"name":"Paddy Wallbanger","source":"The PDT Cocktail Book","drinkIngredients":[3961,3962,3963,3964],"ingredientTypes":[185,130,140,225],"ingredientSuperTypes":[]},{"id":47,"name":"Paloma","source":"Death & Co","drinkIngredients":[225,226,227,228,229,230],"ingredientTypes":[278,203,57,152,284,154],"ingredientSuperTypes":[19]},{"id":754,"name":"Paloma","source":"The PDT Cocktail Book","drinkIngredients":[3965,3966],"ingredientTypes":[264,203],"ingredientSuperTypes":[19]},{"id":393,"name":"Park Life Swizzle","source":"Death & Co","drinkIngredients":[2266,2267,2268,2269,2270,2271,2272],"ingredientTypes":[221,16,135,203,146,31,213],"ingredientSuperTypes":[129,17]},{"id":755,"name":"Parkside Fizz","source":"The PDT Cocktail Book","drinkIngredients":[3967,3968,3969,3970],"ingredientTypes":[90,199,231,213],"ingredientSuperTypes":[]},{"id":161,"name":"Passing Aden","source":"Death & Co","drinkIngredients":[895,896,897,898,899,900],"ingredientTypes":[37,182,284,31,88,199],"ingredientSuperTypes":[]},{"id":143,"name":"Patois Punch","source":"Death & Co","drinkIngredients":[786,787,788,789,790,791],"ingredientTypes":[292,24,123,199,208,258],"ingredientSuperTypes":[2]},{"id":756,"name":"Paul’s Club Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[3971,3972,3973],"ingredientTypes":[128,150,284],"ingredientSuperTypes":[129]},{"id":280,"name":"Peachy Pachacuti","source":"Death & Co","drinkIngredients":[1574,1575,1576,1577,1578,1579],"ingredientTypes":[236,250,203,199,165,329],"ingredientSuperTypes":[]},{"id":757,"name":"Pearl Button","source":"The PDT Cocktail Book","drinkIngredients":[3974,3975,3976],"ingredientTypes":[8,21,203],"ingredientSuperTypes":[2]},{"id":758,"name":"Pearl Of Puebla","source":"The PDT Cocktail Book","drinkIngredients":[3977,3978,3979,3980,3981,3982],"ingredientTypes":[211,328,203,230,235,6],"ingredientSuperTypes":[]},{"id":378,"name":"Pearls Before Swine","source":"Death & Co","drinkIngredients":[2178,2179,2180,2181,2182],"ingredientTypes":[204,199,231,329,323],"ingredientSuperTypes":[129]},{"id":476,"name":"Pêche Bourbon","source":"Speakeasy","drinkIngredients":[2712,2713,2714,2715,2716,2717,2718],"ingredientTypes":[111,301,301,31,237,172,213],"ingredientSuperTypes":[]},{"id":144,"name":"Pelée’s Blood","source":"Death & Co","drinkIngredients":[792,793,794,795,796,797,798],"ingredientTypes":[8,123,3,203,158,284,76],"ingredientSuperTypes":[2]},{"id":48,"name":"Pendennis Club Cocktail","source":"Death & Co","drinkIngredients":[231,232,233,234],"ingredientTypes":[252,243,203,31],"ingredientSuperTypes":[129]},{"id":207,"name":"Perfect Crime","source":"Death & Co","drinkIngredients":[1159,1160,1161,1162,1163,1164],"ingredientTypes":[211,262,13,317,225,261],"ingredientSuperTypes":[]},{"id":759,"name":"Perfect Pear","source":"The PDT Cocktail Book","drinkIngredients":[3983,3984,3985,3986],"ingredientTypes":[240,199,227,284],"ingredientSuperTypes":[]},{"id":761,"name":"Persephone","source":"The PDT Cocktail Book","drinkIngredients":[3992,3993,3994,3995,3996],"ingredientTypes":[23,304,288,199,284],"ingredientSuperTypes":[129]},{"id":522,"name":"Peruvian Pisco Sour","source":"Speakeasy","drinkIngredients":[2951,2952,2953,2954,2955,2956],"ingredientTypes":[250,203,284,131,31,219],"ingredientSuperTypes":[]},{"id":239,"name":"Pete’s Word","source":"Death & Co","drinkIngredients":[1347,1348,1349,1350],"ingredientTypes":[187,209,156,203],"ingredientSuperTypes":[60]},{"id":90,"name":"Petticoat","source":"Death & Co","drinkIngredients":[490,491,492,493,494],"ingredientTypes":[176,135,27,203,284],"ingredientSuperTypes":[]},{"id":760,"name":"Pharaoh Cooler","source":"The PDT Cocktail Book","drinkIngredients":[3987,3988,3989,3990,3991],"ingredientTypes":[57,324,158,203,323],"ingredientSuperTypes":[19]},{"id":359,"name":"Pic-a-de-crop Punch","source":"Death & Co","drinkIngredients":[2058,2059,2060,2061,2062,2063,2064,2065,2066,2067,2068],"ingredientTypes":[134,1,37,27,203,247,152,284,31,92,219],"ingredientSuperTypes":[2,2]},{"id":326,"name":"Pillow Talk","source":"Death & Co","drinkIngredients":[1826,1827,1828,1829,1830,1831],"ingredientTypes":[128,288,112,152,317,294],"ingredientSuperTypes":[129,129]},{"id":519,"name":"Pimm’s Cup","source":"Speakeasy","drinkIngredients":[2934,2935,2936,2937,2938,2939],"ingredientTypes":[245,228,203,115,213,145],"ingredientSuperTypes":[]},{"id":542,"name":"Pimm’s Fruit Cup","source":"Speakeasy","drinkIngredients":[3053,3054,3055,3056,3057,3058,3059,3060,3061],"ingredientTypes":[213,245,228,203,115,297,22,239,145],"ingredientSuperTypes":[]},{"id":762,"name":"Pimms Cup","source":"The PDT Cocktail Book","drinkIngredients":[3997,3998,3999,4000],"ingredientTypes":[245,199,284,115],"ingredientSuperTypes":[]},{"id":49,"name":"Piña Colada","source":"Death & Co","drinkIngredients":[235,236,237,238,239,240,241,242,243],"ingredientTypes":[189,1,119,93,247,203,105,31,213],"ingredientSuperTypes":[2,2,2]},{"id":162,"name":"Piña Colada Deconstruction","source":"Death & Co","drinkIngredients":[901,902,903,904,905],"ingredientTypes":[179,93,95,284,31],"ingredientSuperTypes":[]},{"id":186,"name":"Pinche Chivo","source":"Death & Co","drinkIngredients":[1038,1039,1040,1041,1042],"ingredientTypes":[115,57,182,203,165],"ingredientSuperTypes":[19]},{"id":50,"name":"Ping-pong Cocktail","source":"Death & Co","drinkIngredients":[244,245,246,247,248],"ingredientTypes":[288,130,304,225,199],"ingredientSuperTypes":[129]},{"id":91,"name":"Pink Elephant","source":"Death & Co","drinkIngredients":[495,496,497,498,499,500],"ingredientTypes":[128,209,54,152,203,284],"ingredientSuperTypes":[129]},{"id":92,"name":"Pink Flag","source":"Death & Co","drinkIngredients":[501,502,503,504,505,506],"ingredientTypes":[276,128,112,199,247,231],"ingredientSuperTypes":[129]},{"id":763,"name":"Pink Lady","source":"The PDT Cocktail Book","drinkIngredients":[4001,4002,4003,4004,4005,4006],"ingredientTypes":[252,199,23,284,158,131],"ingredientSuperTypes":[129]},{"id":51,"name":"Pink Lady","source":"Death & Co","drinkIngredients":[249,250,251,252,253,254,255],"ingredientTypes":[252,23,199,165,158,131,76],"ingredientSuperTypes":[129]},{"id":449,"name":"Pisco Inferno","source":"Death & Co","drinkIngredients":[2564,2565,2566,2567,2568,2569,2570],"ingredientTypes":[250,182,80,78,31,225,227],"ingredientSuperTypes":[]},{"id":523,"name":"Pisco Punch","source":"Speakeasy","drinkIngredients":[2957,2958,2959,2960,2961,2962],"ingredientTypes":[247,249,250,199,203,71],"ingredientSuperTypes":[]},{"id":360,"name":"Pisco Punch","source":"Death & Co","drinkIngredients":[2069,2070,2071,2072,2073,2074],"ingredientTypes":[301,92,177,209,203,297],"ingredientSuperTypes":[]},{"id":764,"name":"Pisco Sour","source":"The PDT Cocktail Book","drinkIngredients":[4007,4008,4009,4010],"ingredientTypes":[250,203,284,131],"ingredientSuperTypes":[]},{"id":52,"name":"Pisco Sour","source":"Death & Co","drinkIngredients":[256,257,258,259,260,261],"ingredientTypes":[250,199,203,284,131,31],"ingredientSuperTypes":[]},{"id":379,"name":"Pit Stop Flip","source":"Death & Co","drinkIngredients":[2183,2184,2185,2186,2187,2188],"ingredientTypes":[23,323,208,131,104,219],"ingredientSuperTypes":[]},{"id":765,"name":"Plátanos En Mole Old Fashioned","source":"The PDT Cocktail Book","drinkIngredients":[4011,4012,4013],"ingredientTypes":[292,34,214],"ingredientSuperTypes":[2]},{"id":281,"name":"Poire Man’s Cobbler","source":"Death & Co","drinkIngredients":[1580,1581,1582,1583],"ingredientTypes":[239,24,42,31],"ingredientSuperTypes":[]},{"id":361,"name":"Porfirian Punch","source":"Death & Co","drinkIngredients":[2075,2076,2077,2078,2079,2080,2081],"ingredientTypes":[301,92,183,182,207,199,239],"ingredientSuperTypes":[17]},{"id":53,"name":"Port Au Prince","source":"Death & Co","drinkIngredients":[262,263,264,265,266,267,268,269,270,271],"ingredientTypes":[8,119,1,135,203,247,158,146,310,76],"ingredientSuperTypes":[2,2,2]},{"id":282,"name":"Port Authority","source":"Death & Co","drinkIngredients":[1584,1585,1586,1587,1588,1589],"ingredientTypes":[53,99,307,108,199,214],"ingredientSuperTypes":[52]},{"id":54,"name":"Preakness","source":"Death & Co","drinkIngredients":[272,273,274,275,276],"ingredientTypes":[66,304,42,31,227],"ingredientSuperTypes":[15]},{"id":125,"name":"Pressure Drop","source":"Death & Co","drinkIngredients":[680,681,682,683,684],"ingredientTypes":[221,13,130,240,31],"ingredientSuperTypes":[129]},{"id":93,"name":"Pretty Bird","source":"Death & Co","drinkIngredients":[507,508,509,510,511,512,513],"ingredientTypes":[128,113,152,203,158,89,76],"ingredientSuperTypes":[129]},{"id":208,"name":"Prima China","source":"Death & Co","drinkIngredients":[1165,1166,1167,1168,1169,1170],"ingredientTypes":[18,182,13,83,214,152],"ingredientSuperTypes":[19]},{"id":766,"name":"Primavera","source":"The PDT Cocktail Book","drinkIngredients":[4014,4015,4016,4017,4018,4019],"ingredientTypes":[28,228,199,32,136,70],"ingredientSuperTypes":[]},{"id":767,"name":"Prince Edward","source":"The PDT Cocktail Book","drinkIngredients":[4020,4021,4022,4023],"ingredientTypes":[59,21,124,225],"ingredientSuperTypes":[60]},{"id":768,"name":"Prince Of Wales","source":"The PDT Cocktail Book","drinkIngredients":[4024,4025,4026,4027],"ingredientTypes":[99,282,228,31],"ingredientSuperTypes":[52]},{"id":770,"name":"Professor","source":"The PDT Cocktail Book","drinkIngredients":[4034,4035,4036,4037,4038],"ingredientTypes":[8,307,304,31,225],"ingredientSuperTypes":[2,52]},{"id":478,"name":"Provençal","source":"Speakeasy","drinkIngredients":[2726,2727,2728,2729],"ingredientTypes":[176,130,228,227],"ingredientSuperTypes":[]},{"id":163,"name":"Puerto Rican Racer","source":"Death & Co","drinkIngredients":[906,907,908,909,910],"ingredientTypes":[292,23,328,158,31],"ingredientSuperTypes":[2]},{"id":769,"name":"Pumpkin Toddy","source":"The PDT Cocktail Book","drinkIngredients":[4028,4029,4030,4031,4032,4033],"ingredientTypes":[23,275,199,208,258,31],"ingredientSuperTypes":[15]},{"id":94,"name":"Queen Palm","source":"Death & Co","drinkIngredients":[514,515,516,517,518,519,520],"ingredientTypes":[252,123,93,152,203,95,284],"ingredientSuperTypes":[129]},{"id":55,"name":"Queen’s Parkswizzle","source":"Death & Co","drinkIngredients":[277,278,279,280,281,282,283],"ingredientTypes":[213,284,301,292,203,31,31],"ingredientSuperTypes":[2]},{"id":771,"name":"Queens Park Swizzle","source":"The PDT Cocktail Book","drinkIngredients":[4039,4040,4041,4042],"ingredientTypes":[8,203,284,213],"ingredientSuperTypes":[2]},{"id":524,"name":"Quiet Storm","source":"Speakeasy","drinkIngredients":[2963,2964,2965,2966,2967,2968],"ingredientTypes":[66,182,199,284,145,213],"ingredientSuperTypes":[15]},{"id":772,"name":"Rack & Rye","source":"The PDT Cocktail Book","drinkIngredients":[4043,4044,4045,4046,4047],"ingredientTypes":[275,37,284,31,227],"ingredientSuperTypes":[15]},{"id":370,"name":"Racketeer Julep","source":"Death & Co","drinkIngredients":[2128,2129,2130,2131,2132,2133],"ingredientTypes":[213,142,189,284,317,31],"ingredientSuperTypes":[2]},{"id":327,"name":"Radio Days","source":"Death & Co","drinkIngredients":[1832,1833,1834,1835,1836,1837,1838],"ingredientTypes":[227,31,128,143,199,165,73],"ingredientSuperTypes":[129]},{"id":380,"name":"Raisin Burn","source":"Death & Co","drinkIngredients":[2189,2190,2191,2192,2193,2194],"ingredientTypes":[180,106,131,104,31,88],"ingredientSuperTypes":[17]},{"id":95,"name":"Ramble","source":"Death & Co","drinkIngredients":[521,522,523,524],"ingredientTypes":[252,199,284,261],"ingredientSuperTypes":[129]},{"id":773,"name":"Ramos Gin Fizz","source":"The PDT Cocktail Book","drinkIngredients":[4048,4049,4050,4051,4052,4053,4054],"ingredientTypes":[128,104,284,203,199,226,131],"ingredientSuperTypes":[129]},{"id":539,"name":"Ramos Gin Fizz","source":"Speakeasy","drinkIngredients":[3037,3038,3039,3040,3041,3042,3043],"ingredientTypes":[92,204,199,284,226,131,104],"ingredientSuperTypes":[129]},{"id":56,"name":"Ramos Ginfizz","source":"Death & Co","drinkIngredients":[284,285,286,287,288,289,290,291],"ingredientTypes":[252,199,203,284,104,131,226,92],"ingredientSuperTypes":[129]},{"id":421,"name":"Range Life","source":"Death & Co","drinkIngredients":[2425,2426,2427,2428],"ingredientTypes":[264,47,228,304],"ingredientSuperTypes":[19]},{"id":774,"name":"Rapscallion","source":"The PDT Cocktail Book","drinkIngredients":[4055,4056],"ingredientTypes":[285,242],"ingredientSuperTypes":[286,17]},{"id":775,"name":"Raspberries Reaching","source":"The PDT Cocktail Book","drinkIngredients":[4057,4058,4059,4060],"ingredientTypes":[262,120,254,323],"ingredientSuperTypes":[]},{"id":776,"name":"Rattlesnake","source":"The PDT Cocktail Book","drinkIngredients":[4061,4062,4063,4064],"ingredientTypes":[275,199,284,131],"ingredientSuperTypes":[15]},{"id":362,"name":"Razzle-dazzle Punch","source":"Death & Co","drinkIngredients":[2082,2083,2084,2085,2086,2087,2088,2089,2090],"ingredientTypes":[261,301,227,275,29,199,152,284,73],"ingredientSuperTypes":[15]},{"id":209,"name":"Rebel Rebel","source":"Death & Co","drinkIngredients":[1171,1172,1173,1174,1175,1176,1177],"ingredientTypes":[76,57,175,21,320,278,225],"ingredientSuperTypes":[19]},{"id":450,"name":"Red Ant","source":"Death & Co","drinkIngredients":[2571,2572,2573,2574,2575,2576,2577],"ingredientTypes":[275,211,78,80,89,214,76],"ingredientSuperTypes":[15]},{"id":777,"name":"Red Devil","source":"The PDT Cocktail Book","drinkIngredients":[4065,4066,4067,4068],"ingredientTypes":[142,182,126,31],"ingredientSuperTypes":[]},{"id":779,"name":"Red-headed Saint","source":"The PDT Cocktail Book","drinkIngredients":[4073,4074,4075,4076,4077],"ingredientTypes":[8,203,7,328,319],"ingredientSuperTypes":[2]},{"id":780,"name":"Remember Maine","source":"The PDT Cocktail Book","drinkIngredients":[4078,4079,4080,4081],"ingredientTypes":[8,22,10,31],"ingredientSuperTypes":[2]},{"id":778,"name":"Remember The Maine","source":"The PDT Cocktail Book","drinkIngredients":[4069,4070,4071,4072],"ingredientTypes":[275,304,80,3],"ingredientSuperTypes":[15]},{"id":57,"name":"Remember The Maine","source":"Death & Co","drinkIngredients":[292,293,294,295,296,297],"ingredientTypes":[3,275,304,80,78,199],"ingredientSuperTypes":[15]},{"id":781,"name":"Resting Point","source":"The PDT Cocktail Book","drinkIngredients":[4082,4083,4084,4085,4086,4087],"ingredientTypes":[264,328,304,199,7,297],"ingredientSuperTypes":[19]},{"id":782,"name":"Reverend Palmer","source":"The PDT Cocktail Book","drinkIngredients":[4088,4089,4090],"ingredientTypes":[66,199,31],"ingredientSuperTypes":[15]},{"id":783,"name":"Rhubarbarita","source":"The PDT Cocktail Book","drinkIngredients":[4091,4092,4093,4094,4095],"ingredientTypes":[57,199,228,266,158],"ingredientSuperTypes":[19]},{"id":784,"name":"Rhum Club","source":"The PDT Cocktail Book","drinkIngredients":[4096,4097,4098,4099,4100,4101],"ingredientTypes":[58,203,113,302,31,227],"ingredientSuperTypes":[2]},{"id":96,"name":"Rigadoon","source":"Death & Co","drinkIngredients":[525,526,527,528,529],"ingredientTypes":[128,193,199,284,309],"ingredientSuperTypes":[129]},{"id":785,"name":"Rio Bravo","source":"The PDT Cocktail Book","drinkIngredients":[4102,4103,4104,4105],"ingredientTypes":[8,203,231,144],"ingredientSuperTypes":[2]},{"id":786,"name":"Rite Of Spring","source":"The PDT Cocktail Book","drinkIngredients":[4106,4107,4108],"ingredientTypes":[128,130,244],"ingredientSuperTypes":[129]},{"id":787,"name":"Rob Roy","source":"The PDT Cocktail Book","drinkIngredients":[4109,4110,4111],"ingredientTypes":[59,304,227],"ingredientSuperTypes":[60]},{"id":58,"name":"Rob Roy","source":"Death & Co","drinkIngredients":[298,299,300,301],"ingredientTypes":[59,304,31,76],"ingredientSuperTypes":[60]},{"id":394,"name":"Robert Johnson Swizzle","source":"Death & Co","drinkIngredients":[2273,2274,2275,2276,2277,2278,2279],"ingredientTypes":[66,307,199,317,31,31,213],"ingredientSuperTypes":[15,52]},{"id":164,"name":"Rock, Paper, Scissors","source":"Death & Co","drinkIngredients":[911,912,913,914,915,916,917],"ingredientTypes":[292,304,307,83,84,214,31],"ingredientSuperTypes":[2,52]},{"id":788,"name":"Romeo Y Julieta","source":"The PDT Cocktail Book","drinkIngredients":[4112,4113,4114],"ingredientTypes":[292,304,47],"ingredientSuperTypes":[2]},{"id":789,"name":"Rose","source":"The PDT Cocktail Book","drinkIngredients":[4115,4116,4117],"ingredientTypes":[130,78,261],"ingredientSuperTypes":[]},{"id":490,"name":"Roselle","source":"Speakeasy","drinkIngredients":[2787,2788,2789,2790],"ingredientTypes":[128,160,203,152],"ingredientSuperTypes":[129]},{"id":790,"name":"Rosita","source":"The PDT Cocktail Book","drinkIngredients":[4118,4119,4120,4121,4122],"ingredientTypes":[264,304,130,47,31],"ingredientSuperTypes":[19]},{"id":792,"name":"Royal Bermuda Yacht Club Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[4129,4130,4131,4132],"ingredientTypes":[134,203,228,135],"ingredientSuperTypes":[2]},{"id":527,"name":"Ruby Tuesday","source":"Speakeasy","drinkIngredients":[2976,2977,2978,2979,2980],"ingredientTypes":[275,42,199,284,81],"ingredientSuperTypes":[15]},{"id":363,"name":"Rugby Punch","source":"Death & Co","drinkIngredients":[2091,2092,2093,2094,2095,2096,2097],"ingredientTypes":[301,199,92,181,13,228,73],"ingredientSuperTypes":[]},{"id":59,"name":"Rumjulep","source":"Death & Co","drinkIngredients":[302,303,304,305,306,307,308,309,310],"ingredientTypes":[1,119,189,135,123,227,203,165,213],"ingredientSuperTypes":[2,2,2]},{"id":328,"name":"Run For The Roses","source":"Death & Co","drinkIngredients":[1839,1840,1841,1842,1843],"ingredientTypes":[287,170,78,284,73],"ingredientSuperTypes":[]},{"id":791,"name":"Rust Belt","source":"The PDT Cocktail Book","drinkIngredients":[4123,4124,4125,4126,4127,4128],"ingredientTypes":[8,316,199,203,231,131],"ingredientSuperTypes":[2]},{"id":60,"name":"Rusty Nail","source":"Death & Co","drinkIngredients":[311,312,313,314],"ingredientTypes":[285,124,31,199],"ingredientSuperTypes":[286]},{"id":793,"name":"Rusty Nail","source":"The PDT Cocktail Book","drinkIngredients":[4133,4134],"ingredientTypes":[59,124],"ingredientSuperTypes":[60]},{"id":794,"name":"Rye Witch","source":"The PDT Cocktail Book","drinkIngredients":[4135,4136,4137,4138,4139],"ingredientTypes":[275,300,232,301,225],"ingredientSuperTypes":[15]},{"id":296,"name":"Sade’s Taboo","source":"Death & Co","drinkIngredients":[1666,1667,1668,1669],"ingredientTypes":[99,21,304,151],"ingredientSuperTypes":[]},{"id":795,"name":"Sage Old Buck","source":"The PDT Cocktail Book","drinkIngredients":[4140,4141,4142,4143,4144,4145,4146],"ingredientTypes":[285,199,145,284,241,317,50],"ingredientSuperTypes":[286]},{"id":547,"name":"Sangria Blanca","source":"Speakeasy","drinkIngredients":[3101,3102,3103,3104,3105,3106,3107,3108],"ingredientTypes":[321,284,111,199,68,236,157,149],"ingredientSuperTypes":[]},{"id":395,"name":"Sangria Swizzle","source":"Death & Co","drinkIngredients":[2280,2281,2282,2283,2284,2285,2286],"ingredientTypes":[180,263,228,203,284,214,227],"ingredientSuperTypes":[]},{"id":210,"name":"Saramago","source":"Death & Co","drinkIngredients":[1178,1179,1180,1181,1182,1183],"ingredientTypes":[211,57,56,132,225,152],"ingredientSuperTypes":[19]},{"id":381,"name":"Saturday Morning Flip","source":"Death & Co","drinkIngredients":[2195,2196,2197,2198,2199,2200],"ingredientTypes":[189,118,274,284,131,31],"ingredientSuperTypes":[2,2,52]},{"id":415,"name":"Saz Who?","source":"Death & Co","drinkIngredients":[2396,2397,2398,2399,2400,2401,2402],"ingredientTypes":[292,240,3,284,31,31,199],"ingredientSuperTypes":[2]},{"id":477,"name":"Sazerac","source":"Speakeasy","drinkIngredients":[2719,2720,2721,2722,2723,2724,2725],"ingredientTypes":[4,301,301,31,31,275,199],"ingredientSuperTypes":[15]},{"id":796,"name":"Sazerac","source":"The PDT Cocktail Book","drinkIngredients":[4147,4148,4149,4150],"ingredientTypes":[275,31,31,301],"ingredientSuperTypes":[15]},{"id":61,"name":"Sazerac","source":"Death & Co","drinkIngredients":[315,316,317,318,319,320,321],"ingredientTypes":[3,275,99,284,31,31,199],"ingredientSuperTypes":[15]},{"id":340,"name":"Schuman’s Alley","source":"Death & Co","drinkIngredients":[1913,1914,1915,1916,1917,1918,1919,1920],"ingredientTypes":[45,130,21,204,328,151,9,199],"ingredientSuperTypes":[129]},{"id":62,"name":"Scofflaw","source":"Death & Co","drinkIngredients":[322,323,324,325,326],"ingredientTypes":[275,56,130,199,158],"ingredientSuperTypes":[15]},{"id":261,"name":"Scotch Dram","source":"Death & Co","drinkIngredients":[1467,1468,1469,1470],"ingredientTypes":[59,304,124,31],"ingredientSuperTypes":[60]},{"id":240,"name":"Scotch Lady","source":"Death & Co","drinkIngredients":[1351,1352,1353,1354,1355,1356,1357],"ingredientTypes":[59,23,199,284,158,131,76],"ingredientSuperTypes":[60]},{"id":145,"name":"Sea B3","source":"Death & Co","drinkIngredients":[799,800,801,802],"ingredientTypes":[118,199,227,158],"ingredientSuperTypes":[2]},{"id":481,"name":"Secret Crush","source":"Speakeasy","drinkIngredients":[2739,2740,2741,2742,2743],"ingredientTypes":[293,301,31,47,199],"ingredientSuperTypes":[]},{"id":329,"name":"Seda De Naranja","source":"Death & Co","drinkIngredients":[1844,1845,1846,1847],"ingredientTypes":[264,228,225,73],"ingredientSuperTypes":[19]},{"id":797,"name":"Seelbach Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[4151,4152,4153,4154],"ingredientTypes":[66,228,31,31],"ingredientSuperTypes":[15]},{"id":146,"name":"Seersucker","source":"Death & Co","drinkIngredients":[803,804,805,806],"ingredientTypes":[297,292,199,89],"ingredientSuperTypes":[2]},{"id":126,"name":"Sentimental Journey","source":"Death & Co","drinkIngredients":[685,686,687,688],"ingredientTypes":[128,75,89,199],"ingredientSuperTypes":[129]},{"id":211,"name":"Sergio Leone","source":"Death & Co","drinkIngredients":[1184,1185,1186,1187],"ingredientTypes":[264,304,63,214],"ingredientSuperTypes":[19]},{"id":451,"name":"Sforzando","source":"Death & Co","drinkIngredients":[2578,2579,2580,2581,2582,2583],"ingredientTypes":[275,211,42,130,214,227],"ingredientSuperTypes":[15]},{"id":798,"name":"Shaddock Rose","source":"The PDT Cocktail Book","drinkIngredients":[4155,4156,4157,4158],"ingredientTypes":[264,152,31,225],"ingredientSuperTypes":[19]},{"id":212,"name":"Shattered Glasser","source":"Death & Co","drinkIngredients":[1188,1189,1190,1191,1192,1193,1194],"ingredientTypes":[264,211,304,37,10,42,214],"ingredientSuperTypes":[19]},{"id":799,"name":"Shiso Delicious","source":"The PDT Cocktail Book","drinkIngredients":[4159,4160,4161,4162,4163,4164],"ingredientTypes":[128,199,152,302,283,41],"ingredientSuperTypes":[129]},{"id":800,"name":"Shiso Malt Sour","source":"The PDT Cocktail Book","drinkIngredients":[4165,4166,4167,4168,4169,4170],"ingredientTypes":[190,203,284,3,283,131],"ingredientSuperTypes":[]},{"id":341,"name":"Shoots And Ladders","source":"Death & Co","drinkIngredients":[1921,1922,1923,1924],"ingredientTypes":[182,16,183,284],"ingredientSuperTypes":[17]},{"id":187,"name":"Short Rib","source":"Death & Co","drinkIngredients":[1043,1044,1045,1046],"ingredientTypes":[183,203,284,255],"ingredientSuperTypes":[]},{"id":262,"name":"Shruff’s End","source":"Death & Co","drinkIngredients":[1471,1472,1473,1474],"ingredientTypes":[187,23,42,31],"ingredientSuperTypes":[60]},{"id":63,"name":"Sidecar","source":"Death & Co","drinkIngredients":[327,328,329,330,331],"ingredientTypes":[99,228,199,284,227],"ingredientSuperTypes":[]},{"id":801,"name":"Sidecar","source":"The PDT Cocktail Book","drinkIngredients":[4171,4172,4173,4174],"ingredientTypes":[99,228,199,284],"ingredientSuperTypes":[]},{"id":516,"name":"Sidecar","source":"Speakeasy","drinkIngredients":[2922,2923,2924,2925,2926],"ingredientTypes":[199,301,99,228,227],"ingredientSuperTypes":[]},{"id":297,"name":"Sidewinder","source":"Death & Co","drinkIngredients":[1670,1671,1672,1673,1674,1675],"ingredientTypes":[99,23,42,328,3,31],"ingredientSuperTypes":[]},{"id":802,"name":"Siesta","source":"The PDT Cocktail Book","drinkIngredients":[4175,4176,4177,4178,4179],"ingredientTypes":[57,47,203,152,284],"ingredientSuperTypes":[19]},{"id":803,"name":"Silk Road","source":"The PDT Cocktail Book","drinkIngredients":[4180,4181,4182,4183],"ingredientTypes":[28,284,31,31],"ingredientSuperTypes":[]},{"id":804,"name":"Silver Lining","source":"The PDT Cocktail Book","drinkIngredients":[4184,4185,4186,4187,4188],"ingredientTypes":[275,201,199,284,131],"ingredientSuperTypes":[15]},{"id":188,"name":"Silver Monk","source":"Death & Co","drinkIngredients":[1047,1048,1049,1050,1051,1052,1053],"ingredientTypes":[115,213,278,57,328,203,284],"ingredientSuperTypes":[19]},{"id":805,"name":"Silver Root Beer Fizz","source":"The PDT Cocktail Book","drinkIngredients":[4189,4190,4191,4192,4193],"ingredientTypes":[134,189,199,247,131],"ingredientSuperTypes":[2,2]},{"id":806,"name":"Silver Sangaree","source":"The PDT Cocktail Book","drinkIngredients":[4194,4195,4196,4197,4198,4199,4200],"ingredientTypes":[263,199,59,274,91,76,131],"ingredientSuperTypes":[60,52]},{"id":64,"name":"Singapore Sling","source":"Death & Co","drinkIngredients":[332,333,334,335,336,337,338,339,340],"ingredientTypes":[128,80,228,42,247,203,158,31,76],"ingredientSuperTypes":[129]},{"id":807,"name":"Singapore Sling","source":"The PDT Cocktail Book","drinkIngredients":[4201,4202,4203,4204,4205,4206,4207,4208],"ingredientTypes":[247,252,80,158,228,42,203,31],"ingredientSuperTypes":[129]},{"id":808,"name":"Single Malt Sangaree","source":"The PDT Cocktail Book","drinkIngredients":[4209,4210,4211,4212,4213],"ingredientTypes":[263,285,21,228,284],"ingredientSuperTypes":[286]},{"id":189,"name":"Single Origin","source":"Death & Co","drinkIngredients":[1054,1055,1056,1057,1058],"ingredientTypes":[183,98,247,199,284],"ingredientSuperTypes":[]},{"id":405,"name":"Slap ‘n’ Pickle","source":"Death & Co","drinkIngredients":[2338,2339,2340,2341,2342,2343],"ingredientTypes":[115,28,203,284,158,71],"ingredientSuperTypes":[]},{"id":382,"name":"Sleepy Hollow Fizz","source":"Death & Co","drinkIngredients":[2201,2202,2203,2204,2205,2206,2207],"ingredientTypes":[292,1,199,208,131,258,92],"ingredientSuperTypes":[2,2]},{"id":147,"name":"Sling Of Aphrodite","source":"Death & Co","drinkIngredients":[807,808,809,810,811,812],"ingredientTypes":[8,240,22,199,89,22],"ingredientSuperTypes":[2]},{"id":809,"name":"Sloe Gin Fizz","source":"The PDT Cocktail Book","drinkIngredients":[4214,4215,4216,4217],"ingredientTypes":[288,252,199,284],"ingredientSuperTypes":[129,129]},{"id":283,"name":"Sloe Scobeyville Sling","source":"Death & Co","drinkIngredients":[1590,1591,1592,1593,1594,1595,1596],"ingredientTypes":[23,288,199,284,31,92,22],"ingredientSuperTypes":[129]},{"id":190,"name":"Smoked Horchata","source":"Death & Co","drinkIngredients":[1059,1060,1061,1062,1063,1064],"ingredientTypes":[264,107,89,167,31,88],"ingredientSuperTypes":[19]},{"id":371,"name":"Smoked Julep","source":"Death & Co","drinkIngredients":[2134,2135,2136,2137],"ingredientTypes":[187,23,208,22],"ingredientSuperTypes":[60]},{"id":810,"name":"Smoky Grove","source":"The PDT Cocktail Book","drinkIngredients":[4218,4219,4220,4221,4222],"ingredientTypes":[187,304,130,31,225],"ingredientSuperTypes":[60]},{"id":396,"name":"Snake Hips Swizzle","source":"Death & Co","drinkIngredients":[2287,2288,2289,2290,2291,2292,2293],"ingredientTypes":[99,228,106,199,208,89,31],"ingredientSuperTypes":[17]},{"id":284,"name":"Solera Sidecar","source":"Death & Co","drinkIngredients":[1597,1598,1599,1600,1601,1602],"ingredientTypes":[99,106,228,11,199,284],"ingredientSuperTypes":[17]},{"id":811,"name":"Solstice","source":"The PDT Cocktail Book","drinkIngredients":[4223,4224,4225,4226,4227],"ingredientTypes":[275,23,13,21,158],"ingredientSuperTypes":[15]},{"id":298,"name":"Soul Clench","source":"Death & Co","drinkIngredients":[1676,1677,1678,1679,1680,1681],"ingredientTypes":[250,130,153,132,135,152],"ingredientSuperTypes":[]},{"id":533,"name":"South Side","source":"Speakeasy","drinkIngredients":[3007,3008,3009,3010,3011],"ingredientTypes":[252,199,284,213,92],"ingredientSuperTypes":[129]},{"id":65,"name":"South Side","source":"Death & Co","drinkIngredients":[341,342,343,344,345],"ingredientTypes":[213,128,203,284,31],"ingredientSuperTypes":[129]},{"id":330,"name":"South Sider","source":"Death & Co","drinkIngredients":[1848,1849,1850,1851,1852,1853],"ingredientTypes":[119,304,31,31,73,227],"ingredientSuperTypes":[2]},{"id":813,"name":"South Slope","source":"The PDT Cocktail Book","drinkIngredients":[4232,4233,4234,4235,4236],"ingredientTypes":[128,46,21,228,199],"ingredientSuperTypes":[129]},{"id":191,"name":"Southern Exposure","source":"Death & Co","drinkIngredients":[1065,1066,1067,1068,1069,1070],"ingredientTypes":[183,211,203,284,41,278],"ingredientSuperTypes":[]},{"id":812,"name":"Southside","source":"The PDT Cocktail Book","drinkIngredients":[4228,4229,4230,4231],"ingredientTypes":[252,199,284,213],"ingredientSuperTypes":[129]},{"id":213,"name":"Spaghetti Western","source":"Death & Co","drinkIngredients":[1195,1196,1197,1198,1199],"ingredientTypes":[264,211,13,225,152],"ingredientSuperTypes":[19]},{"id":214,"name":"Spanish Caravan","source":"Death & Co","drinkIngredients":[1200,1201,1202,1203,1204,1205],"ingredientTypes":[183,11,228,42,228,227],"ingredientSuperTypes":[]},{"id":814,"name":"Spice Market","source":"The PDT Cocktail Book","drinkIngredients":[4237,4238,4239],"ingredientTypes":[277,128,135],"ingredientSuperTypes":[129]},{"id":546,"name":"Spiced Sangria Roja","source":"Speakeasy","drinkIngredients":[3088,3089,3090,3091,3092,3093,3094,3095,3096,3097,3098,3099,3100],"ingredientTypes":[323,301,91,88,20,314,144,263,227,203,199,166,149],"ingredientSuperTypes":[]},{"id":192,"name":"Spicy Paloma","source":"Death & Co","drinkIngredients":[1071,1072,1073,1074,1075,1076],"ingredientTypes":[278,183,152,203,284,92],"ingredientSuperTypes":[]},{"id":401,"name":"St-germain Redux","source":"Death & Co","drinkIngredients":[2316,2317,2318,2319,2320],"ingredientTypes":[57,73,132,92,199],"ingredientSuperTypes":[19]},{"id":263,"name":"St. Columbus Rill","source":"Death & Co","drinkIngredients":[1475,1476,1477,1478],"ingredientTypes":[185,56,156,209],"ingredientSuperTypes":[]},{"id":452,"name":"St. James Infirmary","source":"Death & Co","drinkIngredients":[2584,2585,2586,2587,2588,2589,2590,2591],"ingredientTypes":[134,8,304,106,284,310,31,227],"ingredientSuperTypes":[2,2,17]},{"id":193,"name":"St. Matilda","source":"Death & Co","drinkIngredients":[1077,1078,1079,1080,1081],"ingredientTypes":[239,57,239,199,284],"ingredientSuperTypes":[19]},{"id":817,"name":"St. Rita","source":"The PDT Cocktail Book","drinkIngredients":[4248,4249,4250,4251],"ingredientTypes":[251,203,13,165],"ingredientSuperTypes":[]},{"id":815,"name":"Staggerac","source":"The PDT Cocktail Book","drinkIngredients":[4240,4241,4242,4243],"ingredientTypes":[66,31,31,301],"ingredientSuperTypes":[15]},{"id":816,"name":"Statesman","source":"The PDT Cocktail Book","drinkIngredients":[4244,4245,4246,4247],"ingredientTypes":[128,239,156,227],"ingredientSuperTypes":[129]},{"id":529,"name":"Steve-o’s Tuxedo","source":"Speakeasy","drinkIngredients":[2987,2988,2989,2990,2991,2992],"ingredientTypes":[252,131,199,284,225,227],"ingredientSuperTypes":[129]},{"id":285,"name":"Stick The Landing","source":"Death & Co","drinkIngredients":[1603,1604,1605,1606,1607,1608],"ingredientTypes":[99,185,111,199,284,31],"ingredientSuperTypes":[]},{"id":66,"name":"Stinger","source":"Death & Co","drinkIngredients":[346,347,348,349],"ingredientTypes":[99,110,284,213],"ingredientSuperTypes":[]},{"id":453,"name":"Stolen Huffy","source":"Death & Co","drinkIngredients":[2592,2593,2594,2595,2596,2597],"ingredientTypes":[180,211,304,228,284,31],"ingredientSuperTypes":[]},{"id":98,"name":"Strange Brew","source":"Death & Co","drinkIngredients":[535,536,537,538,539,540],"ingredientTypes":[128,135,247,199,184,213],"ingredientSuperTypes":[129]},{"id":241,"name":"Straw Dog","source":"Death & Co","drinkIngredients":[1358,1359,1360,1361,1362,1363],"ingredientTypes":[297,59,56,199,284,151],"ingredientSuperTypes":[60]},{"id":342,"name":"Stringer Bell","source":"Death & Co","drinkIngredients":[1925,1926,1927,1928,1929,1930,1931],"ingredientTypes":[16,183,13,203,70,284,278],"ingredientSuperTypes":[17]},{"id":127,"name":"Summer Shack","source":"Death & Co","drinkIngredients":[689,690,691,692,693,694],"ingredientTypes":[204,21,280,132,284,227],"ingredientSuperTypes":[129]},{"id":439,"name":"Sunset At Gowanus","source":"Death & Co","drinkIngredients":[2515,2516,2517,2518,2519],"ingredientTypes":[292,23,328,203,208],"ingredientSuperTypes":[2]},{"id":99,"name":"Sunset Gun","source":"Death & Co","drinkIngredients":[541,542,543,544,545],"ingredientTypes":[192,217,135,203,231],"ingredientSuperTypes":[129]},{"id":128,"name":"Sure Shot","source":"Death & Co","drinkIngredients":[695,696,697,698,699,700],"ingredientTypes":[221,142,182,98,284,225],"ingredientSuperTypes":[129]},{"id":331,"name":"Susie Q","source":"Death & Co","drinkIngredients":[1854,1855,1856,1857,1858,1859,1860],"ingredientTypes":[24,199,89,146,317,31,294],"ingredientSuperTypes":[]},{"id":242,"name":"Swearengen Sling","source":"Death & Co","drinkIngredients":[1364,1365,1366,1367,1368,1369],"ingredientTypes":[76,66,13,80,199,284],"ingredientSuperTypes":[15]},{"id":243,"name":"Sweep The Leg","source":"Death & Co","drinkIngredients":[1370,1371,1372,1373,1374,1375,1376,1377,1378,1379],"ingredientTypes":[190,231,16,199,227,165,13,31,214,76],"ingredientSuperTypes":[17]},{"id":264,"name":"Sweet And Vicious","source":"Death & Co","drinkIngredients":[1479,1480,1481,1482,1483,1484],"ingredientTypes":[22,275,130,13,208,22],"ingredientSuperTypes":[15]},{"id":299,"name":"Sweet Hereafter","source":"Death & Co","drinkIngredients":[1682,1683,1684,1685,1686,1687],"ingredientTypes":[152,250,21,56,132,151],"ingredientSuperTypes":[]},{"id":818,"name":"Swiss Mist","source":"The PDT Cocktail Book","drinkIngredients":[4252,4253,4254,4255],"ingredientTypes":[252,199,152,131],"ingredientSuperTypes":[129]},{"id":819,"name":"Swollen Gland","source":"The PDT Cocktail Book","drinkIngredients":[4256,4257,4258,4259],"ingredientTypes":[204,227,328,31],"ingredientSuperTypes":[129]},{"id":829,"name":"T & T","source":"The PDT Cocktail Book","drinkIngredients":[4293,4294,4295,4296,4297],"ingredientTypes":[305,57,211,42,31],"ingredientSuperTypes":[19]},{"id":67,"name":"Tailspin","source":"Death & Co","drinkIngredients":[350,351,352,353,354,355],"ingredientTypes":[47,128,304,156,225,199],"ingredientSuperTypes":[129]},{"id":440,"name":"Take Two","source":"Death & Co","drinkIngredients":[2520,2521,2522,2523,2524],"ingredientTypes":[292,43,3,203,284],"ingredientSuperTypes":[2]},{"id":820,"name":"Talbott Leaf","source":"The PDT Cocktail Book","drinkIngredients":[4260,4261,4262,4263,4264,4265],"ingredientTypes":[66,199,156,13,298,213],"ingredientSuperTypes":[15]},{"id":821,"name":"Tao Of Pooh","source":"The PDT Cocktail Book","drinkIngredients":[4266,4267,4268,4269],"ingredientTypes":[95,163,140,199],"ingredientSuperTypes":[]},{"id":215,"name":"Te Amo","source":"Death & Co","drinkIngredients":[1206,1207,1208,1209,1210,1211,1212,1213],"ingredientTypes":[18,304,83,13,225,214,159,227],"ingredientSuperTypes":[19]},{"id":265,"name":"Tea In The Sahara","source":"Death & Co","drinkIngredients":[1485,1486,1487,1488],"ingredientTypes":[199,181,300,165],"ingredientSuperTypes":[]},{"id":462,"name":"Tea Time At Guillermo’s","source":"Death & Co","drinkIngredients":[2649,2650,2651,2652,2653,2654,2655],"ingredientTypes":[264,292,183,124,208,225,31],"ingredientSuperTypes":[19,2]},{"id":100,"name":"Tenement Yard","source":"Death & Co","drinkIngredients":[546,547,548,549],"ingredientTypes":[176,141,199,231],"ingredientSuperTypes":[]},{"id":216,"name":"Terrible Love","source":"Death & Co","drinkIngredients":[1214,1215,1216,1217,1218],"ingredientTypes":[211,303,132,225,152],"ingredientSuperTypes":[]},{"id":301,"name":"The Bittenbender","source":"Death & Co","drinkIngredients":[1694,1695,1696,1697,1698,1699,1700],"ingredientTypes":[261,199,227,66,173,146,73],"ingredientSuperTypes":[15]},{"id":441,"name":"The Black Prince","source":"Death & Co","drinkIngredients":[2525,2526,2527,2528],"ingredientTypes":[292,304,13,225],"ingredientSuperTypes":[2]},{"id":80,"name":"The Commandant","source":"Death & Co","drinkIngredients":[424,425,426,427,428,429],"ingredientTypes":[128,259,135,203,105,192],"ingredientSuperTypes":[129]},{"id":255,"name":"The Dangerous Summer","source":"Death & Co","drinkIngredients":[1438,1439,1440,1441,1442],"ingredientTypes":[190,304,63,78,227],"ingredientSuperTypes":[]},{"id":137,"name":"The Gift Shop","source":"Death & Co","drinkIngredients":[745,746,747,748,749,750],"ingredientTypes":[115,58,13,203,284,31],"ingredientSuperTypes":[2]},{"id":138,"name":"The Great Pretender","source":"Death & Co","drinkIngredients":[751,752,753,754,755,756],"ingredientTypes":[88,189,247,203,317,89],"ingredientSuperTypes":[2]},{"id":139,"name":"The Green Mile","source":"Death & Co","drinkIngredients":[757,758,759,760,761,762],"ingredientTypes":[8,156,3,203,284,309],"ingredientSuperTypes":[2]},{"id":113,"name":"The Joy Division","source":"Death & Co","drinkIngredients":[616,617,618,619,620],"ingredientTypes":[128,130,228,3,199],"ingredientSuperTypes":[129]},{"id":541,"name":"The Last Word","source":"Speakeasy","drinkIngredients":[3049,3050,3051,3052],"ingredientTypes":[128,156,209,203],"ingredientSuperTypes":[129]},{"id":122,"name":"The Monroe","source":"Death & Co","drinkIngredients":[664,665,666,667,668,669],"ingredientTypes":[128,111,231,31,225,92],"ingredientSuperTypes":[129]},{"id":97,"name":"The Risk Pool","source":"Death & Co","drinkIngredients":[530,531,532,533,534],"ingredientTypes":[221,112,203,152,284],"ingredientSuperTypes":[129]},{"id":423,"name":"The Vanderbilt","source":"Death & Co","drinkIngredients":[2435,2436,2437],"ingredientTypes":[23,48,239],"ingredientSuperTypes":[]},{"id":822,"name":"There Will Be Blood","source":"The PDT Cocktail Book","drinkIngredients":[4270,4271,4272],"ingredientTypes":[66,83,62],"ingredientSuperTypes":[15]},{"id":68,"name":"Ti Punch","source":"Death & Co","drinkIngredients":[356,357,358],"ingredientTypes":[203,284,8],"ingredientSuperTypes":[2]},{"id":824,"name":"Ti-punch","source":"The PDT Cocktail Book","drinkIngredients":[4275,4276,4277],"ingredientTypes":[8,302,203],"ingredientSuperTypes":[2]},{"id":474,"name":"Tifozi","source":"Speakeasy","drinkIngredients":[2704,2705,2706,2707],"ingredientTypes":[47,304,203,229],"ingredientSuperTypes":[]},{"id":463,"name":"Tiki-tiki Tom-tom","source":"Death & Co","drinkIngredients":[2656,2657,2658,2659,2660],"ingredientTypes":[119,292,124,300,165],"ingredientSuperTypes":[2,2]},{"id":823,"name":"Tipperary Cocktail","source":"The PDT Cocktail Book","drinkIngredients":[4273,4274],"ingredientTypes":[185,304],"ingredientSuperTypes":[]},{"id":101,"name":"Tom Bomb","source":"Death & Co","drinkIngredients":[550,551,552,553,554,555],"ingredientTypes":[221,123,199,247,231,165],"ingredientSuperTypes":[129]},{"id":69,"name":"Tom Collins","source":"Death & Co","drinkIngredients":[359,360,361,362,363],"ingredientTypes":[128,199,284,92,76],"ingredientSuperTypes":[129]},{"id":825,"name":"Tom Collins","source":"The PDT Cocktail Book","drinkIngredients":[4278,4279,4280],"ingredientTypes":[221,199,284],"ingredientSuperTypes":[129]},{"id":194,"name":"Tommy And The Ron-dels","source":"Death & Co","drinkIngredients":[1082,1083,1084,1085,1086,1087,1088,1089],"ingredientTypes":[264,211,292,140,3,203,6,310],"ingredientSuperTypes":[19,2]},{"id":826,"name":"Tommy’s Margarita","source":"The PDT Cocktail Book","drinkIngredients":[4281,4282,4283],"ingredientTypes":[57,203,7],"ingredientSuperTypes":[19]},{"id":70,"name":"Toronto","source":"Death & Co","drinkIngredients":[364,365,366,367],"ingredientTypes":[275,13,284,199],"ingredientSuperTypes":[15]},{"id":332,"name":"Trapeze","source":"Death & Co","drinkIngredients":[1861,1862,1863,1864,1865,1866],"ingredientTypes":[273,328,47,31,73,227],"ingredientSuperTypes":[]},{"id":266,"name":"Trembling Bell","source":"Death & Co","drinkIngredients":[1489,1490,1491,1492,1493,1494],"ingredientTypes":[180,287,21,111,165,199],"ingredientSuperTypes":[]},{"id":827,"name":"Triborough","source":"The PDT Cocktail Book","drinkIngredients":[4284,4285,4286,4287,4288],"ingredientTypes":[275,78,304,13,31],"ingredientSuperTypes":[15]},{"id":828,"name":"Trident","source":"The PDT Cocktail Book","drinkIngredients":[4289,4290,4291,4292],"ingredientTypes":[28,207,13,237],"ingredientSuperTypes":[17]},{"id":830,"name":"Tuxedo","source":"The PDT Cocktail Book","drinkIngredients":[4298,4299,4300,4301],"ingredientTypes":[252,130,209,225],"ingredientSuperTypes":[129]},{"id":195,"name":"Ty Cobbler","source":"Death & Co","drinkIngredients":[1090,1091,1092,1093,1094,1095],"ingredientTypes":[76,301,57,13,214,227],"ingredientSuperTypes":[19]},{"id":422,"name":"Uno, Dos, Tres","source":"Death & Co","drinkIngredients":[2429,2430,2431,2432,2433,2434],"ingredientTypes":[264,182,47,13,214,227],"ingredientSuperTypes":[19]},{"id":831,"name":"Up To Date","source":"The PDT Cocktail Book","drinkIngredients":[4302,4303,4304,4305],"ingredientTypes":[275,207,228,31],"ingredientSuperTypes":[15,17]},{"id":832,"name":"Vaccari","source":"The PDT Cocktail Book","drinkIngredients":[4306,4307,4308,4309,4310],"ingredientTypes":[59,130,140,152,199],"ingredientSuperTypes":[60]},{"id":364,"name":"Valley Of Kings Punch","source":"Death & Co","drinkIngredients":[2098,2099,2100,2101,2102,2103,2104],"ingredientTypes":[301,92,177,247,152,203,73],"ingredientSuperTypes":[]},{"id":244,"name":"Vampire Blues","source":"Death & Co","drinkIngredients":[1380,1381,1382,1383,1384,1385,1386],"ingredientTypes":[66,106,199,284,257,31,88],"ingredientSuperTypes":[15,17]},{"id":833,"name":"Vauvert Slim","source":"The PDT Cocktail Book","drinkIngredients":[4311,4312,4313,4314,4315],"ingredientTypes":[152,156,203,213,131],"ingredientSuperTypes":[]},{"id":245,"name":"Vejk Sling","source":"Death & Co","drinkIngredients":[1387,1388,1389,1390,1391,1392],"ingredientTypes":[59,171,199,284,225,92],"ingredientSuperTypes":[60]},{"id":834,"name":"Velvet Club","source":"The PDT Cocktail Book","drinkIngredients":[4316,4317,4318],"ingredientTypes":[99,21,83],"ingredientSuperTypes":[]},{"id":165,"name":"Velvet Warhol","source":"Death & Co","drinkIngredients":[918,919,920,921],"ingredientTypes":[179,83,31,104],"ingredientSuperTypes":[]},{"id":71,"name":"Vesper","source":"Death & Co","drinkIngredients":[368,369,370,371],"ingredientTypes":[252,322,21,199],"ingredientSuperTypes":[129]},{"id":480,"name":"Vesper","source":"Speakeasy","drinkIngredients":[2734,2735,2736,2737,2738],"ingredientTypes":[322,252,21,31,199],"ingredientSuperTypes":[129]},{"id":835,"name":"Vesper","source":"The PDT Cocktail Book","drinkIngredients":[4319,4320,4321],"ingredientTypes":[252,322,21],"ingredientSuperTypes":[129]},{"id":72,"name":"Vieux Carré","source":"Death & Co","drinkIngredients":[372,373,374,375,376,377,378],"ingredientTypes":[275,99,304,42,31,31,199],"ingredientSuperTypes":[15]},{"id":837,"name":"Vieux Carré","source":"The PDT Cocktail Book","drinkIngredients":[4326,4327,4328,4329,4330,4331],"ingredientTypes":[275,99,304,42,31,31],"ingredientSuperTypes":[15]},{"id":836,"name":"Vieux Mot","source":"The PDT Cocktail Book","drinkIngredients":[4322,4323,4324,4325],"ingredientTypes":[252,199,132,284],"ingredientSuperTypes":[129]},{"id":196,"name":"Village To Village","source":"Death & Co","drinkIngredients":[1096,1097,1098,1099,1100,1101,1102],"ingredientTypes":[57,10,22,199,165,146,31],"ingredientSuperTypes":[19]},{"id":217,"name":"Vipera","source":"Death & Co","drinkIngredients":[1219,1220,1221,1222],"ingredientTypes":[183,23,328,239],"ingredientSuperTypes":[]},{"id":73,"name":"Ward 8","source":"Death & Co","drinkIngredients":[379,380,381,382,383],"ingredientTypes":[275,199,227,284,255],"ingredientSuperTypes":[15]},{"id":838,"name":"Ward Eight","source":"The PDT Cocktail Book","drinkIngredients":[4332,4333,4334,4335,4336],"ingredientTypes":[275,199,227,284,255],"ingredientSuperTypes":[15]},{"id":246,"name":"Warehouse C","source":"Death & Co","drinkIngredients":[1393,1394,1395,1396,1397,1398,1399,1400],"ingredientTypes":[297,66,199,203,231,89,146,31],"ingredientSuperTypes":[15]},{"id":839,"name":"Water Lily","source":"The PDT Cocktail Book","drinkIngredients":[4337,4338,4339,4340],"ingredientTypes":[252,112,228,199],"ingredientSuperTypes":[129]},{"id":531,"name":"Waterloo","source":"Speakeasy","drinkIngredients":[2997,2998,2999,3000,3001],"ingredientTypes":[324,284,252,199,47],"ingredientSuperTypes":[129]},{"id":102,"name":"Waterloo Sunset","source":"Death & Co","drinkIngredients":[556,557,558,559,560,561,562],"ingredientTypes":[213,284,176,128,56,324,203],"ingredientSuperTypes":[129]},{"id":840,"name":"Weeski","source":"The PDT Cocktail Book","drinkIngredients":[4341,4342,4343,4344],"ingredientTypes":[185,21,228,225],"ingredientSuperTypes":[]},{"id":841,"name":"Wellington Fizz","source":"The PDT Cocktail Book","drinkIngredients":[4345,4346,4347,4348,4349,4350],"ingredientTypes":[194,104,203,233,231,131],"ingredientSuperTypes":[]},{"id":532,"name":"West Side","source":"Speakeasy","drinkIngredients":[3002,3003,3004,3005,3006],"ingredientTypes":[210,199,284,213,92],"ingredientSuperTypes":[]},{"id":543,"name":"West Side Punch","source":"Speakeasy","drinkIngredients":[3062,3063,3064,3065,3066],"ingredientTypes":[213,210,199,284,92],"ingredientSuperTypes":[]},{"id":247,"name":"Whirling Tiger","source":"Death & Co","drinkIngredients":[1401,1402,1403,1404],"ingredientTypes":[66,22,199,146],"ingredientSuperTypes":[15]},{"id":501,"name":"Whiskey Smash","source":"Speakeasy","drinkIngredients":[2843,2844,2845,2846],"ingredientTypes":[227,213,275,44],"ingredientSuperTypes":[15]},{"id":842,"name":"Whiskey Smash","source":"The PDT Cocktail Book","drinkIngredients":[4351,4352,4353,4354],"ingredientTypes":[275,199,284,213],"ingredientSuperTypes":[15]},{"id":74,"name":"Whiskey Sour","source":"Death & Co","drinkIngredients":[384,385,386,387,388],"ingredientTypes":[66,199,284,131,31],"ingredientSuperTypes":[15]},{"id":507,"name":"Whiskey Sour","source":"Speakeasy","drinkIngredients":[2878,2879,2880,2881,2882],"ingredientTypes":[275,199,227,284,76],"ingredientSuperTypes":[15]},{"id":843,"name":"White Birch Fizz","source":"The PDT Cocktail Book","drinkIngredients":[4355,4356,4357,4358,4359],"ingredientTypes":[252,199,300,27,131],"ingredientSuperTypes":[129]},{"id":844,"name":"White Lady","source":"The PDT Cocktail Book","drinkIngredients":[4360,4361,4362,4363,4364],"ingredientTypes":[128,228,199,284,131],"ingredientSuperTypes":[129]},{"id":530,"name":"White Lady","source":"Speakeasy","drinkIngredients":[2993,2994,2995,2996],"ingredientTypes":[252,228,199,227],"ingredientSuperTypes":[129]},{"id":424,"name":"White Negroni","source":"Death & Co","drinkIngredients":[2438,2439,2440,2441],"ingredientTypes":[204,56,303,199],"ingredientSuperTypes":[129]},{"id":845,"name":"White Negroni","source":"The PDT Cocktail Book","drinkIngredients":[4365,4366,4367],"ingredientTypes":[252,21,303],"ingredientSuperTypes":[129]},{"id":267,"name":"Wicked Kiss","source":"Death & Co","drinkIngredients":[1495,1496,1497,1498,1499],"ingredientTypes":[275,23,328,42,31],"ingredientSuperTypes":[15]},{"id":540,"name":"Widow’s Kiss","source":"Speakeasy","drinkIngredients":[3044,3045,3046,3047,3048],"ingredientTypes":[24,328,42,31,199],"ingredientSuperTypes":[]},{"id":846,"name":"Widow’s Kiss","source":"The PDT Cocktail Book","drinkIngredients":[4368,4369,4370,4371],"ingredientTypes":[23,328,42,31],"ingredientSuperTypes":[]},{"id":300,"name":"Widow’s Laurel","source":"Death & Co","drinkIngredients":[1688,1689,1690,1691,1692,1693],"ingredientTypes":[24,124,304,10,31,76],"ingredientSuperTypes":[]},{"id":847,"name":"Witch’s Kiss","source":"The PDT Cocktail Book","drinkIngredients":[4372,4373,4374,4375],"ingredientTypes":[57,199,300,22],"ingredientSuperTypes":[19]},{"id":129,"name":"Wooden Ship","source":"Death & Co","drinkIngredients":[701,702,703,704,705,706],"ingredientTypes":[128,142,228,284,31,199],"ingredientSuperTypes":[129]},{"id":848,"name":"Woolworth","source":"The PDT Cocktail Book","drinkIngredients":[4376,4377,4378,4379],"ingredientTypes":[59,207,42,225],"ingredientSuperTypes":[60,17]},{"id":849,"name":"Wrong Aisle","source":"The PDT Cocktail Book","drinkIngredients":[4380,4381,4382,4383],"ingredientTypes":[23,21,260,31],"ingredientSuperTypes":[]},{"id":218,"name":"Yama Blanca","source":"Death & Co","drinkIngredients":[1223,1224,1225,1226],"ingredientTypes":[264,183,56,135],"ingredientSuperTypes":[19]},{"id":534,"name":"Yellow Jacket","source":"Speakeasy","drinkIngredients":[3012,3013,3014,3015,3016],"ingredientTypes":[264,132,328,225,199],"ingredientSuperTypes":[19]},{"id":130,"name":"Yeomen Warder","source":"Death & Co","drinkIngredients":[707,708,709,710],"ingredientTypes":[128,130,13,209],"ingredientSuperTypes":[129]},{"id":372,"name":"Zihuatanejo Julep","source":"Death & Co","drinkIngredients":[2138,2139,2140,2141,2142],"ingredientTypes":[213,264,284,211,88],"ingredientSuperTypes":[19]},{"id":75,"name":"Zombie Punch","source":"Death & Co","drinkIngredients":[389,390,391,392,393,394,395,396],"ingredientTypes":[189,292,1,330,123,203,31,213],"ingredientSuperTypes":[2,2,2]},{"id":850,"name":"Zombie Punch","source":"The PDT Cocktail Book","drinkIngredients":[4384,4385,4386,4387,4388,4389,4390,4391,4392],"ingredientTypes":[189,292,199,203,135,313,158,3,31],"ingredientSuperTypes":[2,2]}],"drinkIngredients":[{"ingredientId":250,"id":1,"amount":1,"unit":"oz"},{"ingredientId":219,"id":2,"amount":1,"unit":"oz"},{"ingredientId":58,"id":3,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4,"amount":1,"unit":"oz"},{"ingredientId":559,"id":5,"amount":1,"unit":"oz"},{"ingredientId":391,"id":6,"amount":1,"unit":"oz"},{"ingredientId":302,"id":7,"amount":1,"unit":"oz"},{"ingredientId":159,"id":8,"amount":1,"unit":"oz"},{"ingredientId":469,"id":9,"amount":1,"unit":"oz"},{"ingredientId":402,"id":10,"amount":1,"unit":"oz"},{"ingredientId":225,"id":11,"amount":1,"unit":"oz"},{"ingredientId":386,"id":12,"amount":1,"unit":"oz"},{"ingredientId":531,"id":13,"amount":1,"unit":"oz"},{"ingredientId":167,"id":14,"amount":1,"unit":"oz"},{"ingredientId":113,"id":15,"amount":1,"unit":"oz"},{"ingredientId":45,"id":16,"amount":1,"unit":"oz"},{"ingredientId":531,"id":17,"amount":1,"unit":"oz"},{"ingredientId":429,"id":18,"amount":1,"unit":"oz"},{"ingredientId":79,"id":19,"amount":1,"unit":"oz"},{"ingredientId":386,"id":20,"amount":1,"unit":"oz"},{"ingredientId":253,"id":21,"amount":1,"unit":"oz"},{"ingredientId":386,"id":22,"amount":1,"unit":"oz"},{"ingredientId":302,"id":23,"amount":1,"unit":"oz"},{"ingredientId":384,"id":24,"amount":1,"unit":"oz"},{"ingredientId":167,"id":25,"amount":1,"unit":"oz"},{"ingredientId":533,"id":26,"amount":1,"unit":"oz"},{"ingredientId":173,"id":27,"amount":1,"unit":"oz"},{"ingredientId":579,"id":28,"amount":1,"unit":"oz"},{"ingredientId":432,"id":29,"amount":1,"unit":"oz"},{"ingredientId":386,"id":30,"amount":1,"unit":"oz"},{"ingredientId":167,"id":31,"amount":1,"unit":"oz"},{"ingredientId":533,"id":32,"amount":1,"unit":"oz"},{"ingredientId":579,"id":33,"amount":1,"unit":"oz"},{"ingredientId":244,"id":34,"amount":1,"unit":"oz"},{"ingredientId":386,"id":35,"amount":1,"unit":"oz"},{"ingredientId":79,"id":36,"amount":1,"unit":"oz"},{"ingredientId":141,"id":37,"amount":1,"unit":"oz"},{"ingredientId":579,"id":38,"amount":1,"unit":"oz"},{"ingredientId":105,"id":39,"amount":1,"unit":"oz"},{"ingredientId":386,"id":40,"amount":1,"unit":"oz"},{"ingredientId":512,"id":41,"amount":1,"unit":"oz"},{"ingredientId":255,"id":42,"amount":1,"unit":"oz"},{"ingredientId":31,"id":43,"amount":1,"unit":"oz"},{"ingredientId":402,"id":44,"amount":1,"unit":"oz"},{"ingredientId":141,"id":45,"amount":1,"unit":"oz"},{"ingredientId":288,"id":46,"amount":1,"unit":"oz"},{"ingredientId":386,"id":47,"amount":1,"unit":"oz"},{"ingredientId":302,"id":48,"amount":1,"unit":"oz"},{"ingredientId":391,"id":49,"amount":1,"unit":"oz"},{"ingredientId":531,"id":50,"amount":1,"unit":"oz"},{"ingredientId":571,"id":51,"amount":1,"unit":"oz"},{"ingredientId":10,"id":52,"amount":1,"unit":"oz"},{"ingredientId":199,"id":53,"amount":1,"unit":"oz"},{"ingredientId":292,"id":54,"amount":1,"unit":"oz"},{"ingredientId":386,"id":55,"amount":1,"unit":"oz"},{"ingredientId":531,"id":56,"amount":1,"unit":"oz"},{"ingredientId":79,"id":57,"amount":1,"unit":"oz"},{"ingredientId":248,"id":58,"amount":1,"unit":"oz"},{"ingredientId":171,"id":59,"amount":1,"unit":"oz"},{"ingredientId":255,"id":60,"amount":1,"unit":"oz"},{"ingredientId":581,"id":61,"amount":1,"unit":"oz"},{"ingredientId":434,"id":62,"amount":1,"unit":"oz"},{"ingredientId":403,"id":63,"amount":1,"unit":"oz"},{"ingredientId":371,"id":64,"amount":1,"unit":"oz"},{"ingredientId":1,"id":65,"amount":1,"unit":"oz"},{"ingredientId":224,"id":66,"amount":1,"unit":"oz"},{"ingredientId":4,"id":67,"amount":1,"unit":"oz"},{"ingredientId":391,"id":68,"amount":1,"unit":"oz"},{"ingredientId":432,"id":69,"amount":1,"unit":"oz"},{"ingredientId":443,"id":70,"amount":1,"unit":"oz"},{"ingredientId":185,"id":71,"amount":1,"unit":"oz"},{"ingredientId":281,"id":72,"amount":1,"unit":"oz"},{"ingredientId":79,"id":73,"amount":1,"unit":"oz"},{"ingredientId":250,"id":74,"amount":1,"unit":"oz"},{"ingredientId":433,"id":75,"amount":1,"unit":"oz"},{"ingredientId":54,"id":76,"amount":1,"unit":"oz"},{"ingredientId":4,"id":77,"amount":1,"unit":"oz"},{"ingredientId":386,"id":78,"amount":1,"unit":"oz"},{"ingredientId":556,"id":79,"amount":1,"unit":"oz"},{"ingredientId":391,"id":80,"amount":1,"unit":"oz"},{"ingredientId":531,"id":81,"amount":1,"unit":"oz"},{"ingredientId":234,"id":82,"amount":1,"unit":"oz"},{"ingredientId":391,"id":83,"amount":1,"unit":"oz"},{"ingredientId":281,"id":84,"amount":1,"unit":"oz"},{"ingredientId":188,"id":85,"amount":1,"unit":"oz"},{"ingredientId":153,"id":86,"amount":1,"unit":"oz"},{"ingredientId":512,"id":87,"amount":1,"unit":"oz"},{"ingredientId":64,"id":88,"amount":1,"unit":"oz"},{"ingredientId":616,"id":89,"amount":1,"unit":"oz"},{"ingredientId":512,"id":90,"amount":1,"unit":"oz"},{"ingredientId":402,"id":91,"amount":1,"unit":"oz"},{"ingredientId":79,"id":92,"amount":1,"unit":"oz"},{"ingredientId":429,"id":93,"amount":1,"unit":"oz"},{"ingredientId":432,"id":94,"amount":1,"unit":"oz"},{"ingredientId":250,"id":95,"amount":1,"unit":"oz"},{"ingredientId":386,"id":96,"amount":1,"unit":"oz"},{"ingredientId":531,"id":97,"amount":1,"unit":"oz"},{"ingredientId":79,"id":98,"amount":1,"unit":"oz"},{"ingredientId":46,"id":99,"amount":1,"unit":"oz"},{"ingredientId":276,"id":100,"amount":1,"unit":"oz"},{"ingredientId":432,"id":101,"amount":1,"unit":"oz"},{"ingredientId":386,"id":102,"amount":1,"unit":"oz"},{"ingredientId":440,"id":103,"amount":1,"unit":"oz"},{"ingredientId":79,"id":104,"amount":1,"unit":"oz"},{"ingredientId":469,"id":105,"amount":1,"unit":"oz"},{"ingredientId":386,"id":106,"amount":1,"unit":"oz"},{"ingredientId":531,"id":107,"amount":1,"unit":"oz"},{"ingredientId":159,"id":108,"amount":1,"unit":"oz"},{"ingredientId":139,"id":109,"amount":1,"unit":"oz"},{"ingredientId":386,"id":110,"amount":1,"unit":"oz"},{"ingredientId":531,"id":111,"amount":1,"unit":"oz"},{"ingredientId":159,"id":112,"amount":1,"unit":"oz"},{"ingredientId":252,"id":113,"amount":1,"unit":"oz"},{"ingredientId":389,"id":114,"amount":1,"unit":"oz"},{"ingredientId":391,"id":115,"amount":1,"unit":"oz"},{"ingredientId":250,"id":116,"amount":1,"unit":"oz"},{"ingredientId":386,"id":117,"amount":1,"unit":"oz"},{"ingredientId":531,"id":118,"amount":1,"unit":"oz"},{"ingredientId":260,"id":119,"amount":1,"unit":"oz"},{"ingredientId":188,"id":120,"amount":1,"unit":"oz"},{"ingredientId":250,"id":121,"amount":1,"unit":"oz"},{"ingredientId":391,"id":122,"amount":1,"unit":"oz"},{"ingredientId":531,"id":123,"amount":1,"unit":"oz"},{"ingredientId":188,"id":124,"amount":1,"unit":"oz"},{"ingredientId":413,"id":125,"amount":1,"unit":"oz"},{"ingredientId":223,"id":126,"amount":1,"unit":"oz"},{"ingredientId":219,"id":127,"amount":1,"unit":"oz"},{"ingredientId":213,"id":128,"amount":1,"unit":"oz"},{"ingredientId":393,"id":129,"amount":1,"unit":"oz"},{"ingredientId":583,"id":130,"amount":1,"unit":"oz"},{"ingredientId":576,"id":131,"amount":1,"unit":"oz"},{"ingredientId":39,"id":132,"amount":1,"unit":"oz"},{"ingredientId":386,"id":133,"amount":1,"unit":"oz"},{"ingredientId":556,"id":134,"amount":1,"unit":"oz"},{"ingredientId":391,"id":135,"amount":1,"unit":"oz"},{"ingredientId":302,"id":136,"amount":1,"unit":"oz"},{"ingredientId":64,"id":137,"amount":1,"unit":"oz"},{"ingredientId":66,"id":138,"amount":1,"unit":"oz"},{"ingredientId":386,"id":139,"amount":1,"unit":"oz"},{"ingredientId":391,"id":140,"amount":1,"unit":"oz"},{"ingredientId":294,"id":141,"amount":1,"unit":"oz"},{"ingredientId":63,"id":142,"amount":1,"unit":"oz"},{"ingredientId":490,"id":143,"amount":1,"unit":"oz"},{"ingredientId":105,"id":144,"amount":1,"unit":"oz"},{"ingredientId":584,"id":145,"amount":1,"unit":"oz"},{"ingredientId":255,"id":146,"amount":1,"unit":"oz"},{"ingredientId":79,"id":147,"amount":1,"unit":"oz"},{"ingredientId":432,"id":148,"amount":1,"unit":"oz"},{"ingredientId":250,"id":149,"amount":1,"unit":"oz"},{"ingredientId":292,"id":150,"amount":1,"unit":"oz"},{"ingredientId":402,"id":151,"amount":1,"unit":"oz"},{"ingredientId":391,"id":152,"amount":1,"unit":"oz"},{"ingredientId":253,"id":153,"amount":1,"unit":"oz"},{"ingredientId":255,"id":154,"amount":1,"unit":"oz"},{"ingredientId":105,"id":155,"amount":1,"unit":"oz"},{"ingredientId":433,"id":156,"amount":1,"unit":"oz"},{"ingredientId":386,"id":157,"amount":1,"unit":"oz"},{"ingredientId":391,"id":158,"amount":1,"unit":"oz"},{"ingredientId":237,"id":159,"amount":1,"unit":"oz"},{"ingredientId":372,"id":160,"amount":1,"unit":"oz"},{"ingredientId":12,"id":161,"amount":1,"unit":"oz"},{"ingredientId":227,"id":162,"amount":1,"unit":"oz"},{"ingredientId":440,"id":163,"amount":1,"unit":"oz"},{"ingredientId":79,"id":164,"amount":1,"unit":"oz"},{"ingredientId":413,"id":165,"amount":1,"unit":"oz"},{"ingredientId":512,"id":166,"amount":1,"unit":"oz"},{"ingredientId":579,"id":167,"amount":1,"unit":"oz"},{"ingredientId":79,"id":168,"amount":1,"unit":"oz"},{"ingredientId":167,"id":169,"amount":1,"unit":"oz"},{"ingredientId":525,"id":170,"amount":1,"unit":"oz"},{"ingredientId":115,"id":171,"amount":1,"unit":"oz"},{"ingredientId":433,"id":172,"amount":1,"unit":"oz"},{"ingredientId":391,"id":173,"amount":1,"unit":"oz"},{"ingredientId":8,"id":174,"amount":1,"unit":"oz"},{"ingredientId":424,"id":175,"amount":1,"unit":"oz"},{"ingredientId":425,"id":176,"amount":1,"unit":"oz"},{"ingredientId":579,"id":177,"amount":1,"unit":"oz"},{"ingredientId":402,"id":178,"amount":1,"unit":"oz"},{"ingredientId":171,"id":179,"amount":1,"unit":"oz"},{"ingredientId":429,"id":180,"amount":1,"unit":"oz"},{"ingredientId":386,"id":181,"amount":1,"unit":"oz"},{"ingredientId":253,"id":182,"amount":1,"unit":"oz"},{"ingredientId":255,"id":183,"amount":1,"unit":"oz"},{"ingredientId":429,"id":184,"amount":1,"unit":"oz"},{"ingredientId":386,"id":185,"amount":1,"unit":"oz"},{"ingredientId":116,"id":186,"amount":1,"unit":"oz"},{"ingredientId":391,"id":187,"amount":1,"unit":"oz"},{"ingredientId":531,"id":188,"amount":1,"unit":"oz"},{"ingredientId":294,"id":189,"amount":1,"unit":"oz"},{"ingredientId":295,"id":190,"amount":1,"unit":"oz"},{"ingredientId":168,"id":191,"amount":1,"unit":"oz"},{"ingredientId":138,"id":192,"amount":1,"unit":"oz"},{"ingredientId":531,"id":193,"amount":1,"unit":"oz"},{"ingredientId":413,"id":194,"amount":1,"unit":"oz"},{"ingredientId":413,"id":195,"amount":1,"unit":"oz"},{"ingredientId":531,"id":196,"amount":1,"unit":"oz"},{"ingredientId":551,"id":197,"amount":1,"unit":"oz"},{"ingredientId":391,"id":198,"amount":1,"unit":"oz"},{"ingredientId":79,"id":199,"amount":1,"unit":"oz"},{"ingredientId":604,"id":200,"amount":1,"unit":"oz"},{"ingredientId":391,"id":201,"amount":1,"unit":"oz"},{"ingredientId":281,"id":202,"amount":1,"unit":"oz"},{"ingredientId":188,"id":203,"amount":1,"unit":"oz"},{"ingredientId":153,"id":204,"amount":1,"unit":"oz"},{"ingredientId":359,"id":205,"amount":1,"unit":"oz"},{"ingredientId":345,"id":206,"amount":1,"unit":"oz"},{"ingredientId":531,"id":207,"amount":1,"unit":"oz"},{"ingredientId":260,"id":208,"amount":1,"unit":"oz"},{"ingredientId":213,"id":209,"amount":1,"unit":"oz"},{"ingredientId":79,"id":210,"amount":1,"unit":"oz"},{"ingredientId":175,"id":211,"amount":1,"unit":"oz"},{"ingredientId":253,"id":212,"amount":1,"unit":"oz"},{"ingredientId":105,"id":213,"amount":1,"unit":"oz"},{"ingredientId":579,"id":214,"amount":1,"unit":"oz"},{"ingredientId":432,"id":215,"amount":1,"unit":"oz"},{"ingredientId":140,"id":216,"amount":1,"unit":"oz"},{"ingredientId":531,"id":217,"amount":1,"unit":"oz"},{"ingredientId":79,"id":218,"amount":1,"unit":"oz"},{"ingredientId":80,"id":219,"amount":1,"unit":"oz"},{"ingredientId":432,"id":220,"amount":1,"unit":"oz"},{"ingredientId":512,"id":221,"amount":1,"unit":"oz"},{"ingredientId":105,"id":222,"amount":1,"unit":"oz"},{"ingredientId":255,"id":223,"amount":1,"unit":"oz"},{"ingredientId":386,"id":224,"amount":1,"unit":"oz"},{"ingredientId":525,"id":225,"amount":1,"unit":"oz"},{"ingredientId":391,"id":226,"amount":1,"unit":"oz"},{"ingredientId":114,"id":227,"amount":1,"unit":"oz"},{"ingredientId":288,"id":228,"amount":1,"unit":"oz"},{"ingredientId":531,"id":229,"amount":1,"unit":"oz"},{"ingredientId":290,"id":230,"amount":1,"unit":"oz"},{"ingredientId":469,"id":231,"amount":1,"unit":"oz"},{"ingredientId":455,"id":232,"amount":1,"unit":"oz"},{"ingredientId":391,"id":233,"amount":1,"unit":"oz"},{"ingredientId":82,"id":234,"amount":1,"unit":"oz"},{"ingredientId":373,"id":235,"amount":1,"unit":"oz"},{"ingredientId":1,"id":236,"amount":1,"unit":"oz"},{"ingredientId":238,"id":237,"amount":1,"unit":"oz"},{"ingredientId":189,"id":238,"amount":1,"unit":"oz"},{"ingredientId":459,"id":239,"amount":1,"unit":"oz"},{"ingredientId":391,"id":240,"amount":1,"unit":"oz"},{"ingredientId":214,"id":241,"amount":1,"unit":"oz"},{"ingredientId":79,"id":242,"amount":1,"unit":"oz"},{"ingredientId":413,"id":243,"amount":1,"unit":"oz"},{"ingredientId":542,"id":244,"amount":1,"unit":"oz"},{"ingredientId":255,"id":245,"amount":1,"unit":"oz"},{"ingredientId":581,"id":246,"amount":1,"unit":"oz"},{"ingredientId":429,"id":247,"amount":1,"unit":"oz"},{"ingredientId":386,"id":248,"amount":1,"unit":"oz"},{"ingredientId":469,"id":249,"amount":1,"unit":"oz"},{"ingredientId":64,"id":250,"amount":1,"unit":"oz"},{"ingredientId":386,"id":251,"amount":1,"unit":"oz"},{"ingredientId":302,"id":252,"amount":1,"unit":"oz"},{"ingredientId":294,"id":253,"amount":1,"unit":"oz"},{"ingredientId":260,"id":254,"amount":1,"unit":"oz"},{"ingredientId":167,"id":255,"amount":1,"unit":"oz"},{"ingredientId":462,"id":256,"amount":1,"unit":"oz"},{"ingredientId":386,"id":257,"amount":1,"unit":"oz"},{"ingredientId":391,"id":258,"amount":1,"unit":"oz"},{"ingredientId":531,"id":259,"amount":1,"unit":"oz"},{"ingredientId":260,"id":260,"amount":1,"unit":"oz"},{"ingredientId":79,"id":261,"amount":1,"unit":"oz"},{"ingredientId":18,"id":262,"amount":1,"unit":"oz"},{"ingredientId":238,"id":263,"amount":1,"unit":"oz"},{"ingredientId":2,"id":264,"amount":1,"unit":"oz"},{"ingredientId":267,"id":265,"amount":1,"unit":"oz"},{"ingredientId":391,"id":266,"amount":1,"unit":"oz"},{"ingredientId":459,"id":267,"amount":1,"unit":"oz"},{"ingredientId":294,"id":268,"amount":1,"unit":"oz"},{"ingredientId":281,"id":269,"amount":1,"unit":"oz"},{"ingredientId":591,"id":270,"amount":1,"unit":"oz"},{"ingredientId":167,"id":271,"amount":1,"unit":"oz"},{"ingredientId":142,"id":272,"amount":1,"unit":"oz"},{"ingredientId":576,"id":273,"amount":1,"unit":"oz"},{"ingredientId":98,"id":274,"amount":1,"unit":"oz"},{"ingredientId":80,"id":275,"amount":1,"unit":"oz"},{"ingredientId":432,"id":276,"amount":1,"unit":"oz"},{"ingredientId":413,"id":277,"amount":1,"unit":"oz"},{"ingredientId":531,"id":278,"amount":1,"unit":"oz"},{"ingredientId":571,"id":279,"amount":1,"unit":"oz"},{"ingredientId":551,"id":280,"amount":1,"unit":"oz"},{"ingredientId":391,"id":281,"amount":1,"unit":"oz"},{"ingredientId":82,"id":282,"amount":1,"unit":"oz"},{"ingredientId":79,"id":283,"amount":1,"unit":"oz"},{"ingredientId":469,"id":284,"amount":1,"unit":"oz"},{"ingredientId":386,"id":285,"amount":1,"unit":"oz"},{"ingredientId":391,"id":286,"amount":1,"unit":"oz"},{"ingredientId":531,"id":287,"amount":1,"unit":"oz"},{"ingredientId":213,"id":288,"amount":1,"unit":"oz"},{"ingredientId":260,"id":289,"amount":1,"unit":"oz"},{"ingredientId":431,"id":290,"amount":1,"unit":"oz"},{"ingredientId":188,"id":291,"amount":1,"unit":"oz"},{"ingredientId":4,"id":292,"amount":1,"unit":"oz"},{"ingredientId":512,"id":293,"amount":1,"unit":"oz"},{"ingredientId":584,"id":294,"amount":1,"unit":"oz"},{"ingredientId":173,"id":295,"amount":1,"unit":"oz"},{"ingredientId":171,"id":296,"amount":1,"unit":"oz"},{"ingredientId":386,"id":297,"amount":1,"unit":"oz"},{"ingredientId":128,"id":298,"amount":1,"unit":"oz"},{"ingredientId":576,"id":299,"amount":1,"unit":"oz"},{"ingredientId":79,"id":300,"amount":1,"unit":"oz"},{"ingredientId":167,"id":301,"amount":1,"unit":"oz"},{"ingredientId":2,"id":302,"amount":1,"unit":"oz"},{"ingredientId":239,"id":303,"amount":1,"unit":"oz"},{"ingredientId":372,"id":304,"amount":1,"unit":"oz"},{"ingredientId":267,"id":305,"amount":1,"unit":"oz"},{"ingredientId":243,"id":306,"amount":1,"unit":"oz"},{"ingredientId":432,"id":307,"amount":1,"unit":"oz"},{"ingredientId":391,"id":308,"amount":1,"unit":"oz"},{"ingredientId":302,"id":309,"amount":1,"unit":"oz"},{"ingredientId":413,"id":310,"amount":1,"unit":"oz"},{"ingredientId":533,"id":311,"amount":1,"unit":"oz"},{"ingredientId":244,"id":312,"amount":1,"unit":"oz"},{"ingredientId":80,"id":313,"amount":1,"unit":"oz"},{"ingredientId":386,"id":314,"amount":1,"unit":"oz"},{"ingredientId":4,"id":315,"amount":1,"unit":"oz"},{"ingredientId":512,"id":316,"amount":1,"unit":"oz"},{"ingredientId":198,"id":317,"amount":1,"unit":"oz"},{"ingredientId":531,"id":318,"amount":1,"unit":"oz"},{"ingredientId":82,"id":319,"amount":1,"unit":"oz"},{"ingredientId":79,"id":320,"amount":1,"unit":"oz"},{"ingredientId":386,"id":321,"amount":1,"unit":"oz"},{"ingredientId":514,"id":322,"amount":1,"unit":"oz"},{"ingredientId":113,"id":323,"amount":1,"unit":"oz"},{"ingredientId":255,"id":324,"amount":1,"unit":"oz"},{"ingredientId":386,"id":325,"amount":1,"unit":"oz"},{"ingredientId":294,"id":326,"amount":1,"unit":"oz"},{"ingredientId":198,"id":327,"amount":1,"unit":"oz"},{"ingredientId":433,"id":328,"amount":1,"unit":"oz"},{"ingredientId":386,"id":329,"amount":1,"unit":"oz"},{"ingredientId":531,"id":330,"amount":1,"unit":"oz"},{"ingredientId":432,"id":331,"amount":1,"unit":"oz"},{"ingredientId":250,"id":332,"amount":1,"unit":"oz"},{"ingredientId":173,"id":333,"amount":1,"unit":"oz"},{"ingredientId":433,"id":334,"amount":1,"unit":"oz"},{"ingredientId":98,"id":335,"amount":1,"unit":"oz"},{"ingredientId":459,"id":336,"amount":1,"unit":"oz"},{"ingredientId":391,"id":337,"amount":1,"unit":"oz"},{"ingredientId":294,"id":338,"amount":1,"unit":"oz"},{"ingredientId":79,"id":339,"amount":1,"unit":"oz"},{"ingredientId":167,"id":340,"amount":1,"unit":"oz"},{"ingredientId":413,"id":341,"amount":1,"unit":"oz"},{"ingredientId":250,"id":342,"amount":1,"unit":"oz"},{"ingredientId":391,"id":343,"amount":1,"unit":"oz"},{"ingredientId":531,"id":344,"amount":1,"unit":"oz"},{"ingredientId":79,"id":345,"amount":1,"unit":"oz"},{"ingredientId":198,"id":346,"amount":1,"unit":"oz"},{"ingredientId":223,"id":347,"amount":1,"unit":"oz"},{"ingredientId":531,"id":348,"amount":1,"unit":"oz"},{"ingredientId":413,"id":349,"amount":1,"unit":"oz"},{"ingredientId":105,"id":350,"amount":1,"unit":"oz"},{"ingredientId":250,"id":351,"amount":1,"unit":"oz"},{"ingredientId":576,"id":352,"amount":1,"unit":"oz"},{"ingredientId":292,"id":353,"amount":1,"unit":"oz"},{"ingredientId":429,"id":354,"amount":1,"unit":"oz"},{"ingredientId":386,"id":355,"amount":1,"unit":"oz"},{"ingredientId":391,"id":356,"amount":1,"unit":"oz"},{"ingredientId":531,"id":357,"amount":1,"unit":"oz"},{"ingredientId":12,"id":358,"amount":1,"unit":"oz"},{"ingredientId":250,"id":359,"amount":1,"unit":"oz"},{"ingredientId":386,"id":360,"amount":1,"unit":"oz"},{"ingredientId":531,"id":361,"amount":1,"unit":"oz"},{"ingredientId":188,"id":362,"amount":1,"unit":"oz"},{"ingredientId":168,"id":363,"amount":1,"unit":"oz"},{"ingredientId":512,"id":364,"amount":1,"unit":"oz"},{"ingredientId":39,"id":365,"amount":1,"unit":"oz"},{"ingredientId":531,"id":366,"amount":1,"unit":"oz"},{"ingredientId":386,"id":367,"amount":1,"unit":"oz"},{"ingredientId":469,"id":368,"amount":1,"unit":"oz"},{"ingredientId":604,"id":369,"amount":1,"unit":"oz"},{"ingredientId":58,"id":370,"amount":1,"unit":"oz"},{"ingredientId":386,"id":371,"amount":1,"unit":"oz"},{"ingredientId":512,"id":372,"amount":1,"unit":"oz"},{"ingredientId":199,"id":373,"amount":1,"unit":"oz"},{"ingredientId":576,"id":374,"amount":1,"unit":"oz"},{"ingredientId":98,"id":375,"amount":1,"unit":"oz"},{"ingredientId":79,"id":376,"amount":1,"unit":"oz"},{"ingredientId":82,"id":377,"amount":1,"unit":"oz"},{"ingredientId":386,"id":378,"amount":1,"unit":"oz"},{"ingredientId":511,"id":379,"amount":1,"unit":"oz"},{"ingredientId":386,"id":380,"amount":1,"unit":"oz"},{"ingredientId":432,"id":381,"amount":1,"unit":"oz"},{"ingredientId":531,"id":382,"amount":1,"unit":"oz"},{"ingredientId":474,"id":383,"amount":1,"unit":"oz"},{"ingredientId":139,"id":384,"amount":1,"unit":"oz"},{"ingredientId":386,"id":385,"amount":1,"unit":"oz"},{"ingredientId":531,"id":386,"amount":1,"unit":"oz"},{"ingredientId":260,"id":387,"amount":1,"unit":"oz"},{"ingredientId":79,"id":388,"amount":1,"unit":"oz"},{"ingredientId":372,"id":389,"amount":1,"unit":"oz"},{"ingredientId":559,"id":390,"amount":1,"unit":"oz"},{"ingredientId":2,"id":391,"amount":1,"unit":"oz"},{"ingredientId":618,"id":392,"amount":1,"unit":"oz"},{"ingredientId":243,"id":393,"amount":1,"unit":"oz"},{"ingredientId":391,"id":394,"amount":1,"unit":"oz"},{"ingredientId":79,"id":395,"amount":1,"unit":"oz"},{"ingredientId":413,"id":396,"amount":1,"unit":"oz"},{"ingredientId":449,"id":397,"amount":1,"unit":"oz"},{"ingredientId":324,"id":398,"amount":1,"unit":"oz"},{"ingredientId":253,"id":399,"amount":1,"unit":"oz"},{"ingredientId":386,"id":400,"amount":1,"unit":"oz"},{"ingredientId":440,"id":401,"amount":1,"unit":"oz"},{"ingredientId":185,"id":402,"amount":1,"unit":"oz"},{"ingredientId":302,"id":403,"amount":1,"unit":"oz"},{"ingredientId":469,"id":404,"amount":1,"unit":"oz"},{"ingredientId":261,"id":405,"amount":1,"unit":"oz"},{"ingredientId":225,"id":406,"amount":1,"unit":"oz"},{"ingredientId":386,"id":407,"amount":1,"unit":"oz"},{"ingredientId":531,"id":408,"amount":1,"unit":"oz"},{"ingredientId":432,"id":409,"amount":1,"unit":"oz"},{"ingredientId":81,"id":410,"amount":1,"unit":"oz"},{"ingredientId":469,"id":411,"amount":1,"unit":"oz"},{"ingredientId":46,"id":412,"amount":1,"unit":"oz"},{"ingredientId":386,"id":413,"amount":1,"unit":"oz"},{"ingredientId":531,"id":414,"amount":1,"unit":"oz"},{"ingredientId":188,"id":415,"amount":1,"unit":"oz"},{"ingredientId":424,"id":416,"amount":1,"unit":"oz"},{"ingredientId":236,"id":417,"amount":1,"unit":"oz"},{"ingredientId":243,"id":418,"amount":1,"unit":"oz"},{"ingredientId":4,"id":419,"amount":1,"unit":"oz"},{"ingredientId":459,"id":420,"amount":1,"unit":"oz"},{"ingredientId":391,"id":421,"amount":1,"unit":"oz"},{"ingredientId":440,"id":422,"amount":1,"unit":"oz"},{"ingredientId":82,"id":423,"amount":1,"unit":"oz"},{"ingredientId":252,"id":424,"amount":1,"unit":"oz"},{"ingredientId":479,"id":425,"amount":1,"unit":"oz"},{"ingredientId":267,"id":426,"amount":1,"unit":"oz"},{"ingredientId":391,"id":427,"amount":1,"unit":"oz"},{"ingredientId":214,"id":428,"amount":1,"unit":"oz"},{"ingredientId":379,"id":429,"amount":1,"unit":"oz"},{"ingredientId":469,"id":430,"amount":1,"unit":"oz"},{"ingredientId":134,"id":431,"amount":1,"unit":"oz"},{"ingredientId":39,"id":432,"amount":1,"unit":"oz"},{"ingredientId":288,"id":433,"amount":1,"unit":"oz"},{"ingredientId":391,"id":434,"amount":1,"unit":"oz"},{"ingredientId":531,"id":435,"amount":1,"unit":"oz"},{"ingredientId":253,"id":436,"amount":1,"unit":"oz"},{"ingredientId":156,"id":437,"amount":1,"unit":"oz"},{"ingredientId":391,"id":438,"amount":1,"unit":"oz"},{"ingredientId":302,"id":439,"amount":1,"unit":"oz"},{"ingredientId":565,"id":440,"amount":1,"unit":"oz"},{"ingredientId":276,"id":441,"amount":1,"unit":"oz"},{"ingredientId":275,"id":442,"amount":1,"unit":"oz"},{"ingredientId":141,"id":443,"amount":1,"unit":"oz"},{"ingredientId":222,"id":444,"amount":1,"unit":"oz"},{"ingredientId":386,"id":445,"amount":1,"unit":"oz"},{"ingredientId":440,"id":446,"amount":1,"unit":"oz"},{"ingredientId":598,"id":447,"amount":1,"unit":"oz"},{"ingredientId":213,"id":448,"amount":1,"unit":"oz"},{"ingredientId":292,"id":449,"amount":1,"unit":"oz"},{"ingredientId":250,"id":450,"amount":1,"unit":"oz"},{"ingredientId":104,"id":451,"amount":1,"unit":"oz"},{"ingredientId":391,"id":452,"amount":1,"unit":"oz"},{"ingredientId":288,"id":453,"amount":1,"unit":"oz"},{"ingredientId":531,"id":454,"amount":1,"unit":"oz"},{"ingredientId":592,"id":455,"amount":1,"unit":"oz"},{"ingredientId":293,"id":456,"amount":1,"unit":"oz"},{"ingredientId":251,"id":457,"amount":1,"unit":"oz"},{"ingredientId":74,"id":458,"amount":1,"unit":"oz"},{"ingredientId":267,"id":459,"amount":1,"unit":"oz"},{"ingredientId":391,"id":460,"amount":1,"unit":"oz"},{"ingredientId":288,"id":461,"amount":1,"unit":"oz"},{"ingredientId":302,"id":462,"amount":1,"unit":"oz"},{"ingredientId":230,"id":463,"amount":1,"unit":"oz"},{"ingredientId":249,"id":464,"amount":1,"unit":"oz"},{"ingredientId":104,"id":465,"amount":1,"unit":"oz"},{"ingredientId":288,"id":466,"amount":1,"unit":"oz"},{"ingredientId":528,"id":467,"amount":1,"unit":"oz"},{"ingredientId":419,"id":468,"amount":1,"unit":"oz"},{"ingredientId":219,"id":469,"amount":1,"unit":"oz"},{"ingredientId":107,"id":470,"amount":1,"unit":"oz"},{"ingredientId":4,"id":471,"amount":1,"unit":"oz"},{"ingredientId":391,"id":472,"amount":1,"unit":"oz"},{"ingredientId":531,"id":473,"amount":1,"unit":"oz"},{"ingredientId":565,"id":474,"amount":1,"unit":"oz"},{"ingredientId":248,"id":475,"amount":1,"unit":"oz"},{"ingredientId":261,"id":476,"amount":1,"unit":"oz"},{"ingredientId":616,"id":477,"amount":1,"unit":"oz"},{"ingredientId":386,"id":478,"amount":1,"unit":"oz"},{"ingredientId":565,"id":479,"amount":1,"unit":"oz"},{"ingredientId":230,"id":480,"amount":1,"unit":"oz"},{"ingredientId":253,"id":481,"amount":1,"unit":"oz"},{"ingredientId":57,"id":482,"amount":1,"unit":"oz"},{"ingredientId":576,"id":483,"amount":1,"unit":"oz"},{"ingredientId":386,"id":484,"amount":1,"unit":"oz"},{"ingredientId":440,"id":485,"amount":1,"unit":"oz"},{"ingredientId":281,"id":486,"amount":1,"unit":"oz"},{"ingredientId":79,"id":487,"amount":1,"unit":"oz"},{"ingredientId":429,"id":488,"amount":1,"unit":"oz"},{"ingredientId":188,"id":489,"amount":1,"unit":"oz"},{"ingredientId":323,"id":490,"amount":1,"unit":"oz"},{"ingredientId":267,"id":491,"amount":1,"unit":"oz"},{"ingredientId":72,"id":492,"amount":1,"unit":"oz"},{"ingredientId":391,"id":493,"amount":1,"unit":"oz"},{"ingredientId":531,"id":494,"amount":1,"unit":"oz"},{"ingredientId":253,"id":495,"amount":1,"unit":"oz"},{"ingredientId":402,"id":496,"amount":1,"unit":"oz"},{"ingredientId":111,"id":497,"amount":1,"unit":"oz"},{"ingredientId":288,"id":498,"amount":1,"unit":"oz"},{"ingredientId":391,"id":499,"amount":1,"unit":"oz"},{"ingredientId":531,"id":500,"amount":1,"unit":"oz"},{"ingredientId":519,"id":501,"amount":1,"unit":"oz"},{"ingredientId":253,"id":502,"amount":1,"unit":"oz"},{"ingredientId":225,"id":503,"amount":1,"unit":"oz"},{"ingredientId":386,"id":504,"amount":1,"unit":"oz"},{"ingredientId":459,"id":505,"amount":1,"unit":"oz"},{"ingredientId":440,"id":506,"amount":1,"unit":"oz"},{"ingredientId":251,"id":507,"amount":1,"unit":"oz"},{"ingredientId":227,"id":508,"amount":1,"unit":"oz"},{"ingredientId":288,"id":509,"amount":1,"unit":"oz"},{"ingredientId":391,"id":510,"amount":1,"unit":"oz"},{"ingredientId":294,"id":511,"amount":1,"unit":"oz"},{"ingredientId":185,"id":512,"amount":1,"unit":"oz"},{"ingredientId":168,"id":513,"amount":1,"unit":"oz"},{"ingredientId":469,"id":514,"amount":1,"unit":"oz"},{"ingredientId":243,"id":515,"amount":1,"unit":"oz"},{"ingredientId":189,"id":516,"amount":1,"unit":"oz"},{"ingredientId":288,"id":517,"amount":1,"unit":"oz"},{"ingredientId":391,"id":518,"amount":1,"unit":"oz"},{"ingredientId":191,"id":519,"amount":1,"unit":"oz"},{"ingredientId":531,"id":520,"amount":1,"unit":"oz"},{"ingredientId":469,"id":521,"amount":1,"unit":"oz"},{"ingredientId":386,"id":522,"amount":1,"unit":"oz"},{"ingredientId":531,"id":523,"amount":1,"unit":"oz"},{"ingredientId":482,"id":524,"amount":1,"unit":"oz"},{"ingredientId":253,"id":525,"amount":1,"unit":"oz"},{"ingredientId":380,"id":526,"amount":1,"unit":"oz"},{"ingredientId":386,"id":527,"amount":1,"unit":"oz"},{"ingredientId":531,"id":528,"amount":1,"unit":"oz"},{"ingredientId":590,"id":529,"amount":1,"unit":"oz"},{"ingredientId":424,"id":530,"amount":1,"unit":"oz"},{"ingredientId":226,"id":531,"amount":1,"unit":"oz"},{"ingredientId":391,"id":532,"amount":1,"unit":"oz"},{"ingredientId":288,"id":533,"amount":1,"unit":"oz"},{"ingredientId":531,"id":534,"amount":1,"unit":"oz"},{"ingredientId":253,"id":535,"amount":1,"unit":"oz"},{"ingredientId":267,"id":536,"amount":1,"unit":"oz"},{"ingredientId":459,"id":537,"amount":1,"unit":"oz"},{"ingredientId":386,"id":538,"amount":1,"unit":"oz"},{"ingredientId":358,"id":539,"amount":1,"unit":"oz"},{"ingredientId":413,"id":540,"amount":1,"unit":"oz"},{"ingredientId":379,"id":541,"amount":1,"unit":"oz"},{"ingredientId":419,"id":542,"amount":1,"unit":"oz"},{"ingredientId":267,"id":543,"amount":1,"unit":"oz"},{"ingredientId":391,"id":544,"amount":1,"unit":"oz"},{"ingredientId":440,"id":545,"amount":1,"unit":"oz"},{"ingredientId":322,"id":546,"amount":1,"unit":"oz"},{"ingredientId":273,"id":547,"amount":1,"unit":"oz"},{"ingredientId":386,"id":548,"amount":1,"unit":"oz"},{"ingredientId":440,"id":549,"amount":1,"unit":"oz"},{"ingredientId":425,"id":550,"amount":1,"unit":"oz"},{"ingredientId":243,"id":551,"amount":1,"unit":"oz"},{"ingredientId":386,"id":552,"amount":1,"unit":"oz"},{"ingredientId":459,"id":553,"amount":1,"unit":"oz"},{"ingredientId":440,"id":554,"amount":1,"unit":"oz"},{"ingredientId":302,"id":555,"amount":1,"unit":"oz"},{"ingredientId":413,"id":556,"amount":1,"unit":"oz"},{"ingredientId":531,"id":557,"amount":1,"unit":"oz"},{"ingredientId":323,"id":558,"amount":1,"unit":"oz"},{"ingredientId":250,"id":559,"amount":1,"unit":"oz"},{"ingredientId":113,"id":560,"amount":1,"unit":"oz"},{"ingredientId":612,"id":561,"amount":1,"unit":"oz"},{"ingredientId":391,"id":562,"amount":1,"unit":"oz"},{"ingredientId":417,"id":563,"amount":1,"unit":"oz"},{"ingredientId":66,"id":564,"amount":1,"unit":"oz"},{"ingredientId":262,"id":565,"amount":1,"unit":"oz"},{"ingredientId":602,"id":566,"amount":1,"unit":"oz"},{"ingredientId":531,"id":567,"amount":1,"unit":"oz"},{"ingredientId":429,"id":568,"amount":1,"unit":"oz"},{"ingredientId":63,"id":569,"amount":1,"unit":"oz"},{"ingredientId":250,"id":570,"amount":1,"unit":"oz"},{"ingredientId":576,"id":571,"amount":1,"unit":"oz"},{"ingredientId":38,"id":572,"amount":1,"unit":"oz"},{"ingredientId":167,"id":573,"amount":1,"unit":"oz"},{"ingredientId":250,"id":574,"amount":1,"unit":"oz"},{"ingredientId":346,"id":575,"amount":1,"unit":"oz"},{"ingredientId":32,"id":576,"amount":1,"unit":"oz"},{"ingredientId":402,"id":577,"amount":1,"unit":"oz"},{"ingredientId":424,"id":578,"amount":1,"unit":"oz"},{"ingredientId":580,"id":579,"amount":1,"unit":"oz"},{"ingredientId":66,"id":580,"amount":1,"unit":"oz"},{"ingredientId":568,"id":581,"amount":1,"unit":"oz"},{"ingredientId":80,"id":582,"amount":1,"unit":"oz"},{"ingredientId":250,"id":583,"amount":1,"unit":"oz"},{"ingredientId":581,"id":584,"amount":1,"unit":"oz"},{"ingredientId":402,"id":585,"amount":1,"unit":"oz"},{"ingredientId":80,"id":586,"amount":1,"unit":"oz"},{"ingredientId":288,"id":587,"amount":1,"unit":"oz"},{"ingredientId":250,"id":588,"amount":1,"unit":"oz"},{"ingredientId":581,"id":589,"amount":1,"unit":"oz"},{"ingredientId":38,"id":590,"amount":1,"unit":"oz"},{"ingredientId":402,"id":591,"amount":1,"unit":"oz"},{"ingredientId":425,"id":592,"amount":1,"unit":"oz"},{"ingredientId":345,"id":593,"amount":1,"unit":"oz"},{"ingredientId":576,"id":594,"amount":1,"unit":"oz"},{"ingredientId":227,"id":595,"amount":1,"unit":"oz"},{"ingredientId":430,"id":596,"amount":1,"unit":"oz"},{"ingredientId":79,"id":597,"amount":1,"unit":"oz"},{"ingredientId":432,"id":598,"amount":1,"unit":"oz"},{"ingredientId":386,"id":599,"amount":1,"unit":"oz"},{"ingredientId":275,"id":600,"amount":1,"unit":"oz"},{"ingredientId":219,"id":601,"amount":1,"unit":"oz"},{"ingredientId":531,"id":602,"amount":1,"unit":"oz"},{"ingredientId":169,"id":603,"amount":1,"unit":"oz"},{"ingredientId":432,"id":604,"amount":1,"unit":"oz"},{"ingredientId":394,"id":605,"amount":1,"unit":"oz"},{"ingredientId":215,"id":606,"amount":1,"unit":"oz"},{"ingredientId":58,"id":607,"amount":1,"unit":"oz"},{"ingredientId":402,"id":608,"amount":1,"unit":"oz"},{"ingredientId":429,"id":609,"amount":1,"unit":"oz"},{"ingredientId":288,"id":610,"amount":1,"unit":"oz"},{"ingredientId":250,"id":611,"amount":1,"unit":"oz"},{"ingredientId":217,"id":612,"amount":1,"unit":"oz"},{"ingredientId":75,"id":613,"amount":1,"unit":"oz"},{"ingredientId":598,"id":614,"amount":1,"unit":"oz"},{"ingredientId":429,"id":615,"amount":1,"unit":"oz"},{"ingredientId":250,"id":616,"amount":1,"unit":"oz"},{"ingredientId":255,"id":617,"amount":1,"unit":"oz"},{"ingredientId":433,"id":618,"amount":1,"unit":"oz"},{"ingredientId":4,"id":619,"amount":1,"unit":"oz"},{"ingredientId":386,"id":620,"amount":1,"unit":"oz"},{"ingredientId":469,"id":621,"amount":1,"unit":"oz"},{"ingredientId":57,"id":622,"amount":1,"unit":"oz"},{"ingredientId":34,"id":623,"amount":1,"unit":"oz"},{"ingredientId":292,"id":624,"amount":1,"unit":"oz"},{"ingredientId":250,"id":625,"amount":1,"unit":"oz"},{"ingredientId":581,"id":626,"amount":1,"unit":"oz"},{"ingredientId":568,"id":627,"amount":1,"unit":"oz"},{"ingredientId":38,"id":628,"amount":1,"unit":"oz"},{"ingredientId":79,"id":629,"amount":1,"unit":"oz"},{"ingredientId":432,"id":630,"amount":1,"unit":"oz"},{"ingredientId":276,"id":631,"amount":1,"unit":"oz"},{"ingredientId":37,"id":632,"amount":1,"unit":"oz"},{"ingredientId":576,"id":633,"amount":1,"unit":"oz"},{"ingredientId":287,"id":634,"amount":1,"unit":"oz"},{"ingredientId":288,"id":635,"amount":1,"unit":"oz"},{"ingredientId":469,"id":636,"amount":1,"unit":"oz"},{"ingredientId":616,"id":637,"amount":1,"unit":"oz"},{"ingredientId":403,"id":638,"amount":1,"unit":"oz"},{"ingredientId":432,"id":639,"amount":1,"unit":"oz"},{"ingredientId":82,"id":640,"amount":1,"unit":"oz"},{"ingredientId":250,"id":641,"amount":1,"unit":"oz"},{"ingredientId":576,"id":642,"amount":1,"unit":"oz"},{"ingredientId":402,"id":643,"amount":1,"unit":"oz"},{"ingredientId":32,"id":644,"amount":1,"unit":"oz"},{"ingredientId":288,"id":645,"amount":1,"unit":"oz"},{"ingredientId":253,"id":646,"amount":1,"unit":"oz"},{"ingredientId":272,"id":647,"amount":1,"unit":"oz"},{"ingredientId":531,"id":648,"amount":1,"unit":"oz"},{"ingredientId":79,"id":649,"amount":1,"unit":"oz"},{"ingredientId":253,"id":650,"amount":1,"unit":"oz"},{"ingredientId":74,"id":651,"amount":1,"unit":"oz"},{"ingredientId":75,"id":652,"amount":1,"unit":"oz"},{"ingredientId":579,"id":653,"amount":1,"unit":"oz"},{"ingredientId":98,"id":654,"amount":1,"unit":"oz"},{"ingredientId":79,"id":655,"amount":1,"unit":"oz"},{"ingredientId":82,"id":656,"amount":1,"unit":"oz"},{"ingredientId":432,"id":657,"amount":1,"unit":"oz"},{"ingredientId":469,"id":658,"amount":1,"unit":"oz"},{"ingredientId":255,"id":659,"amount":1,"unit":"oz"},{"ingredientId":218,"id":660,"amount":1,"unit":"oz"},{"ingredientId":354,"id":661,"amount":1,"unit":"oz"},{"ingredientId":292,"id":662,"amount":1,"unit":"oz"},{"ingredientId":157,"id":663,"amount":1,"unit":"oz"},{"ingredientId":248,"id":664,"amount":1,"unit":"oz"},{"ingredientId":224,"id":665,"amount":1,"unit":"oz"},{"ingredientId":440,"id":666,"amount":1,"unit":"oz"},{"ingredientId":82,"id":667,"amount":1,"unit":"oz"},{"ingredientId":429,"id":668,"amount":1,"unit":"oz"},{"ingredientId":188,"id":669,"amount":1,"unit":"oz"},{"ingredientId":469,"id":670,"amount":1,"unit":"oz"},{"ingredientId":46,"id":671,"amount":1,"unit":"oz"},{"ingredientId":224,"id":672,"amount":1,"unit":"oz"},{"ingredientId":302,"id":673,"amount":1,"unit":"oz"},{"ingredientId":386,"id":674,"amount":1,"unit":"oz"},{"ingredientId":425,"id":675,"amount":1,"unit":"oz"},{"ingredientId":233,"id":676,"amount":1,"unit":"oz"},{"ingredientId":217,"id":677,"amount":1,"unit":"oz"},{"ingredientId":531,"id":678,"amount":1,"unit":"oz"},{"ingredientId":79,"id":679,"amount":1,"unit":"oz"},{"ingredientId":425,"id":680,"amount":1,"unit":"oz"},{"ingredientId":33,"id":681,"amount":1,"unit":"oz"},{"ingredientId":255,"id":682,"amount":1,"unit":"oz"},{"ingredientId":451,"id":683,"amount":1,"unit":"oz"},{"ingredientId":79,"id":684,"amount":1,"unit":"oz"},{"ingredientId":253,"id":685,"amount":1,"unit":"oz"},{"ingredientId":166,"id":686,"amount":1,"unit":"oz"},{"ingredientId":185,"id":687,"amount":1,"unit":"oz"},{"ingredientId":386,"id":688,"amount":1,"unit":"oz"},{"ingredientId":394,"id":689,"amount":1,"unit":"oz"},{"ingredientId":54,"id":690,"amount":1,"unit":"oz"},{"ingredientId":527,"id":691,"amount":1,"unit":"oz"},{"ingredientId":261,"id":692,"amount":1,"unit":"oz"},{"ingredientId":531,"id":693,"amount":1,"unit":"oz"},{"ingredientId":432,"id":694,"amount":1,"unit":"oz"},{"ingredientId":424,"id":695,"amount":1,"unit":"oz"},{"ingredientId":276,"id":696,"amount":1,"unit":"oz"},{"ingredientId":343,"id":697,"amount":1,"unit":"oz"},{"ingredientId":194,"id":698,"amount":1,"unit":"oz"},{"ingredientId":531,"id":699,"amount":1,"unit":"oz"},{"ingredientId":429,"id":700,"amount":1,"unit":"oz"},{"ingredientId":253,"id":701,"amount":1,"unit":"oz"},{"ingredientId":276,"id":702,"amount":1,"unit":"oz"},{"ingredientId":435,"id":703,"amount":1,"unit":"oz"},{"ingredientId":531,"id":704,"amount":1,"unit":"oz"},{"ingredientId":81,"id":705,"amount":1,"unit":"oz"},{"ingredientId":386,"id":706,"amount":1,"unit":"oz"},{"ingredientId":250,"id":707,"amount":1,"unit":"oz"},{"ingredientId":255,"id":708,"amount":1,"unit":"oz"},{"ingredientId":38,"id":709,"amount":1,"unit":"oz"},{"ingredientId":402,"id":710,"amount":1,"unit":"oz"},{"ingredientId":92,"id":711,"amount":1,"unit":"oz"},{"ingredientId":219,"id":712,"amount":1,"unit":"oz"},{"ingredientId":576,"id":713,"amount":1,"unit":"oz"},{"ingredientId":391,"id":714,"amount":1,"unit":"oz"},{"ingredientId":12,"id":715,"amount":1,"unit":"oz"},{"ingredientId":47,"id":716,"amount":1,"unit":"oz"},{"ingredientId":225,"id":717,"amount":1,"unit":"oz"},{"ingredientId":391,"id":718,"amount":1,"unit":"oz"},{"ingredientId":281,"id":719,"amount":1,"unit":"oz"},{"ingredientId":188,"id":720,"amount":1,"unit":"oz"},{"ingredientId":372,"id":721,"amount":1,"unit":"oz"},{"ingredientId":12,"id":722,"amount":1,"unit":"oz"},{"ingredientId":567,"id":723,"amount":1,"unit":"oz"},{"ingredientId":531,"id":724,"amount":1,"unit":"oz"},{"ingredientId":565,"id":725,"amount":1,"unit":"oz"},{"ingredientId":234,"id":726,"amount":1,"unit":"oz"},{"ingredientId":459,"id":727,"amount":1,"unit":"oz"},{"ingredientId":391,"id":728,"amount":1,"unit":"oz"},{"ingredientId":281,"id":729,"amount":1,"unit":"oz"},{"ingredientId":79,"id":730,"amount":1,"unit":"oz"},{"ingredientId":188,"id":731,"amount":1,"unit":"oz"},{"ingredientId":371,"id":732,"amount":1,"unit":"oz"},{"ingredientId":46,"id":733,"amount":1,"unit":"oz"},{"ingredientId":73,"id":734,"amount":1,"unit":"oz"},{"ingredientId":386,"id":735,"amount":1,"unit":"oz"},{"ingredientId":531,"id":736,"amount":1,"unit":"oz"},{"ingredientId":79,"id":737,"amount":1,"unit":"oz"},{"ingredientId":110,"id":738,"amount":1,"unit":"oz"},{"ingredientId":556,"id":739,"amount":1,"unit":"oz"},{"ingredientId":386,"id":740,"amount":1,"unit":"oz"},{"ingredientId":281,"id":741,"amount":1,"unit":"oz"},{"ingredientId":440,"id":742,"amount":1,"unit":"oz"},{"ingredientId":302,"id":743,"amount":1,"unit":"oz"},{"ingredientId":82,"id":744,"amount":1,"unit":"oz"},{"ingredientId":230,"id":745,"amount":1,"unit":"oz"},{"ingredientId":127,"id":746,"amount":1,"unit":"oz"},{"ingredientId":37,"id":747,"amount":1,"unit":"oz"},{"ingredientId":391,"id":748,"amount":1,"unit":"oz"},{"ingredientId":531,"id":749,"amount":1,"unit":"oz"},{"ingredientId":79,"id":750,"amount":1,"unit":"oz"},{"ingredientId":184,"id":751,"amount":1,"unit":"oz"},{"ingredientId":373,"id":752,"amount":1,"unit":"oz"},{"ingredientId":459,"id":753,"amount":1,"unit":"oz"},{"ingredientId":391,"id":754,"amount":1,"unit":"oz"},{"ingredientId":598,"id":755,"amount":1,"unit":"oz"},{"ingredientId":185,"id":756,"amount":1,"unit":"oz"},{"ingredientId":20,"id":757,"amount":1,"unit":"oz"},{"ingredientId":292,"id":758,"amount":1,"unit":"oz"},{"ingredientId":4,"id":759,"amount":1,"unit":"oz"},{"ingredientId":391,"id":760,"amount":1,"unit":"oz"},{"ingredientId":531,"id":761,"amount":1,"unit":"oz"},{"ingredientId":590,"id":762,"amount":1,"unit":"oz"},{"ingredientId":437,"id":763,"amount":1,"unit":"oz"},{"ingredientId":552,"id":764,"amount":1,"unit":"oz"},{"ingredientId":386,"id":765,"amount":1,"unit":"oz"},{"ingredientId":598,"id":766,"amount":1,"unit":"oz"},{"ingredientId":213,"id":767,"amount":1,"unit":"oz"},{"ingredientId":429,"id":768,"amount":1,"unit":"oz"},{"ingredientId":422,"id":769,"amount":1,"unit":"oz"},{"ingredientId":155,"id":770,"amount":1,"unit":"oz"},{"ingredientId":560,"id":771,"amount":1,"unit":"oz"},{"ingredientId":139,"id":772,"amount":1,"unit":"oz"},{"ingredientId":459,"id":773,"amount":1,"unit":"oz"},{"ingredientId":386,"id":774,"amount":1,"unit":"oz"},{"ingredientId":531,"id":775,"amount":1,"unit":"oz"},{"ingredientId":79,"id":776,"amount":1,"unit":"oz"},{"ingredientId":82,"id":777,"amount":1,"unit":"oz"},{"ingredientId":372,"id":778,"amount":1,"unit":"oz"},{"ingredientId":11,"id":779,"amount":1,"unit":"oz"},{"ingredientId":391,"id":780,"amount":1,"unit":"oz"},{"ingredientId":440,"id":781,"amount":1,"unit":"oz"},{"ingredientId":598,"id":782,"amount":1,"unit":"oz"},{"ingredientId":213,"id":783,"amount":1,"unit":"oz"},{"ingredientId":79,"id":784,"amount":1,"unit":"oz"},{"ingredientId":422,"id":785,"amount":1,"unit":"oz"},{"ingredientId":559,"id":786,"amount":1,"unit":"oz"},{"ingredientId":66,"id":787,"amount":1,"unit":"oz"},{"ingredientId":243,"id":788,"amount":1,"unit":"oz"},{"ingredientId":386,"id":789,"amount":1,"unit":"oz"},{"ingredientId":400,"id":790,"amount":1,"unit":"oz"},{"ingredientId":477,"id":791,"amount":1,"unit":"oz"},{"ingredientId":14,"id":792,"amount":1,"unit":"oz"},{"ingredientId":243,"id":793,"amount":1,"unit":"oz"},{"ingredientId":4,"id":794,"amount":1,"unit":"oz"},{"ingredientId":391,"id":795,"amount":1,"unit":"oz"},{"ingredientId":294,"id":796,"amount":1,"unit":"oz"},{"ingredientId":531,"id":797,"amount":1,"unit":"oz"},{"ingredientId":168,"id":798,"amount":1,"unit":"oz"},{"ingredientId":234,"id":799,"amount":1,"unit":"oz"},{"ingredientId":386,"id":800,"amount":1,"unit":"oz"},{"ingredientId":432,"id":801,"amount":1,"unit":"oz"},{"ingredientId":294,"id":802,"amount":1,"unit":"oz"},{"ingredientId":565,"id":803,"amount":1,"unit":"oz"},{"ingredientId":556,"id":804,"amount":1,"unit":"oz"},{"ingredientId":386,"id":805,"amount":1,"unit":"oz"},{"ingredientId":185,"id":806,"amount":1,"unit":"oz"},{"ingredientId":11,"id":807,"amount":1,"unit":"oz"},{"ingredientId":451,"id":808,"amount":1,"unit":"oz"},{"ingredientId":61,"id":809,"amount":1,"unit":"oz"},{"ingredientId":386,"id":810,"amount":1,"unit":"oz"},{"ingredientId":185,"id":811,"amount":1,"unit":"oz"},{"ingredientId":63,"id":812,"amount":1,"unit":"oz"},{"ingredientId":550,"id":813,"amount":1,"unit":"oz"},{"ingredientId":127,"id":814,"amount":1,"unit":"oz"},{"ingredientId":113,"id":815,"amount":1,"unit":"oz"},{"ingredientId":4,"id":816,"amount":1,"unit":"oz"},{"ingredientId":283,"id":817,"amount":1,"unit":"oz"},{"ingredientId":598,"id":818,"amount":1,"unit":"oz"},{"ingredientId":7,"id":819,"amount":1,"unit":"oz"},{"ingredientId":429,"id":820,"amount":1,"unit":"oz"},{"ingredientId":62,"id":821,"amount":1,"unit":"oz"},{"ingredientId":20,"id":822,"amount":1,"unit":"oz"},{"ingredientId":372,"id":823,"amount":1,"unit":"oz"},{"ingredientId":93,"id":824,"amount":1,"unit":"oz"},{"ingredientId":531,"id":825,"amount":1,"unit":"oz"},{"ingredientId":414,"id":826,"amount":1,"unit":"oz"},{"ingredientId":233,"id":827,"amount":1,"unit":"oz"},{"ingredientId":92,"id":828,"amount":1,"unit":"oz"},{"ingredientId":584,"id":829,"amount":1,"unit":"oz"},{"ingredientId":105,"id":830,"amount":1,"unit":"oz"},{"ingredientId":531,"id":831,"amount":1,"unit":"oz"},{"ingredientId":414,"id":832,"amount":1,"unit":"oz"},{"ingredientId":429,"id":833,"amount":1,"unit":"oz"},{"ingredientId":432,"id":834,"amount":1,"unit":"oz"},{"ingredientId":557,"id":835,"amount":1,"unit":"oz"},{"ingredientId":531,"id":836,"amount":1,"unit":"oz"},{"ingredientId":598,"id":837,"amount":1,"unit":"oz"},{"ingredientId":82,"id":838,"amount":1,"unit":"oz"},{"ingredientId":85,"id":839,"amount":1,"unit":"oz"},{"ingredientId":86,"id":840,"amount":1,"unit":"oz"},{"ingredientId":422,"id":841,"amount":1,"unit":"oz"},{"ingredientId":13,"id":842,"amount":1,"unit":"oz"},{"ingredientId":337,"id":843,"amount":1,"unit":"oz"},{"ingredientId":616,"id":844,"amount":1,"unit":"oz"},{"ingredientId":292,"id":845,"amount":1,"unit":"oz"},{"ingredientId":558,"id":846,"amount":1,"unit":"oz"},{"ingredientId":2,"id":847,"amount":1,"unit":"oz"},{"ingredientId":345,"id":848,"amount":1,"unit":"oz"},{"ingredientId":219,"id":849,"amount":1,"unit":"oz"},{"ingredientId":531,"id":850,"amount":1,"unit":"oz"},{"ingredientId":414,"id":851,"amount":1,"unit":"oz"},{"ingredientId":79,"id":852,"amount":1,"unit":"oz"},{"ingredientId":432,"id":853,"amount":1,"unit":"oz"},{"ingredientId":555,"id":854,"amount":1,"unit":"oz"},{"ingredientId":173,"id":855,"amount":1,"unit":"oz"},{"ingredientId":215,"id":856,"amount":1,"unit":"oz"},{"ingredientId":217,"id":857,"amount":1,"unit":"oz"},{"ingredientId":179,"id":858,"amount":1,"unit":"oz"},{"ingredientId":576,"id":859,"amount":1,"unit":"oz"},{"ingredientId":575,"id":860,"amount":1,"unit":"oz"},{"ingredientId":169,"id":861,"amount":1,"unit":"oz"},{"ingredientId":432,"id":862,"amount":1,"unit":"oz"},{"ingredientId":167,"id":863,"amount":1,"unit":"oz"},{"ingredientId":371,"id":864,"amount":1,"unit":"oz"},{"ingredientId":217,"id":865,"amount":1,"unit":"oz"},{"ingredientId":41,"id":866,"amount":1,"unit":"oz"},{"ingredientId":414,"id":867,"amount":1,"unit":"oz"},{"ingredientId":372,"id":868,"amount":1,"unit":"oz"},{"ingredientId":276,"id":869,"amount":1,"unit":"oz"},{"ingredientId":194,"id":870,"amount":1,"unit":"oz"},{"ingredientId":3,"id":871,"amount":1,"unit":"oz"},{"ingredientId":531,"id":872,"amount":1,"unit":"oz"},{"ingredientId":80,"id":873,"amount":1,"unit":"oz"},{"ingredientId":432,"id":874,"amount":1,"unit":"oz"},{"ingredientId":335,"id":875,"amount":1,"unit":"oz"},{"ingredientId":391,"id":876,"amount":1,"unit":"oz"},{"ingredientId":531,"id":877,"amount":1,"unit":"oz"},{"ingredientId":281,"id":878,"amount":1,"unit":"oz"},{"ingredientId":237,"id":879,"amount":1,"unit":"oz"},{"ingredientId":557,"id":880,"amount":1,"unit":"oz"},{"ingredientId":576,"id":881,"amount":1,"unit":"oz"},{"ingredientId":39,"id":882,"amount":1,"unit":"oz"},{"ingredientId":616,"id":883,"amount":1,"unit":"oz"},{"ingredientId":4,"id":884,"amount":1,"unit":"oz"},{"ingredientId":560,"id":885,"amount":1,"unit":"oz"},{"ingredientId":37,"id":886,"amount":1,"unit":"oz"},{"ingredientId":98,"id":887,"amount":1,"unit":"oz"},{"ingredientId":86,"id":888,"amount":1,"unit":"oz"},{"ingredientId":432,"id":889,"amount":1,"unit":"oz"},{"ingredientId":560,"id":890,"amount":1,"unit":"oz"},{"ingredientId":233,"id":891,"amount":1,"unit":"oz"},{"ingredientId":578,"id":892,"amount":1,"unit":"oz"},{"ingredientId":27,"id":893,"amount":1,"unit":"oz"},{"ingredientId":81,"id":894,"amount":1,"unit":"oz"},{"ingredientId":92,"id":895,"amount":1,"unit":"oz"},{"ingredientId":344,"id":896,"amount":1,"unit":"oz"},{"ingredientId":531,"id":897,"amount":1,"unit":"oz"},{"ingredientId":80,"id":898,"amount":1,"unit":"oz"},{"ingredientId":183,"id":899,"amount":1,"unit":"oz"},{"ingredientId":386,"id":900,"amount":1,"unit":"oz"},{"ingredientId":333,"id":901,"amount":1,"unit":"oz"},{"ingredientId":189,"id":902,"amount":1,"unit":"oz"},{"ingredientId":191,"id":903,"amount":1,"unit":"oz"},{"ingredientId":531,"id":904,"amount":1,"unit":"oz"},{"ingredientId":79,"id":905,"amount":1,"unit":"oz"},{"ingredientId":559,"id":906,"amount":1,"unit":"oz"},{"ingredientId":64,"id":907,"amount":1,"unit":"oz"},{"ingredientId":616,"id":908,"amount":1,"unit":"oz"},{"ingredientId":294,"id":909,"amount":1,"unit":"oz"},{"ingredientId":82,"id":910,"amount":1,"unit":"oz"},{"ingredientId":546,"id":911,"amount":1,"unit":"oz"},{"ingredientId":576,"id":912,"amount":1,"unit":"oz"},{"ingredientId":587,"id":913,"amount":1,"unit":"oz"},{"ingredientId":219,"id":914,"amount":1,"unit":"oz"},{"ingredientId":179,"id":915,"amount":1,"unit":"oz"},{"ingredientId":414,"id":916,"amount":1,"unit":"oz"},{"ingredientId":79,"id":917,"amount":1,"unit":"oz"},{"ingredientId":331,"id":918,"amount":1,"unit":"oz"},{"ingredientId":219,"id":919,"amount":1,"unit":"oz"},{"ingredientId":80,"id":920,"amount":1,"unit":"oz"},{"ingredientId":213,"id":921,"amount":1,"unit":"oz"},{"ingredientId":531,"id":922,"amount":1,"unit":"oz"},{"ingredientId":402,"id":923,"amount":1,"unit":"oz"},{"ingredientId":386,"id":924,"amount":1,"unit":"oz"},{"ingredientId":565,"id":925,"amount":1,"unit":"oz"},{"ingredientId":571,"id":926,"amount":1,"unit":"oz"},{"ingredientId":115,"id":927,"amount":1,"unit":"oz"},{"ingredientId":354,"id":928,"amount":1,"unit":"oz"},{"ingredientId":217,"id":929,"amount":1,"unit":"oz"},{"ingredientId":494,"id":930,"amount":1,"unit":"oz"},{"ingredientId":26,"id":931,"amount":1,"unit":"oz"},{"ingredientId":73,"id":932,"amount":1,"unit":"oz"},{"ingredientId":391,"id":933,"amount":1,"unit":"oz"},{"ingredientId":440,"id":934,"amount":1,"unit":"oz"},{"ingredientId":400,"id":935,"amount":1,"unit":"oz"},{"ingredientId":494,"id":936,"amount":1,"unit":"oz"},{"ingredientId":458,"id":937,"amount":1,"unit":"oz"},{"ingredientId":616,"id":938,"amount":1,"unit":"oz"},{"ingredientId":459,"id":939,"amount":1,"unit":"oz"},{"ingredientId":386,"id":940,"amount":1,"unit":"oz"},{"ingredientId":413,"id":941,"amount":1,"unit":"oz"},{"ingredientId":494,"id":942,"amount":1,"unit":"oz"},{"ingredientId":98,"id":943,"amount":1,"unit":"oz"},{"ingredientId":432,"id":944,"amount":1,"unit":"oz"},{"ingredientId":391,"id":945,"amount":1,"unit":"oz"},{"ingredientId":440,"id":946,"amount":1,"unit":"oz"},{"ingredientId":544,"id":947,"amount":1,"unit":"oz"},{"ingredientId":492,"id":948,"amount":1,"unit":"oz"},{"ingredientId":354,"id":949,"amount":1,"unit":"oz"},{"ingredientId":409,"id":950,"amount":1,"unit":"oz"},{"ingredientId":391,"id":951,"amount":1,"unit":"oz"},{"ingredientId":531,"id":952,"amount":1,"unit":"oz"},{"ingredientId":79,"id":953,"amount":1,"unit":"oz"},{"ingredientId":432,"id":954,"amount":1,"unit":"oz"},{"ingredientId":494,"id":955,"amount":1,"unit":"oz"},{"ingredientId":373,"id":956,"amount":1,"unit":"oz"},{"ingredientId":391,"id":957,"amount":1,"unit":"oz"},{"ingredientId":185,"id":958,"amount":1,"unit":"oz"},{"ingredientId":531,"id":959,"amount":1,"unit":"oz"},{"ingredientId":429,"id":960,"amount":1,"unit":"oz"},{"ingredientId":115,"id":961,"amount":1,"unit":"oz"},{"ingredientId":587,"id":962,"amount":1,"unit":"oz"},{"ingredientId":391,"id":963,"amount":1,"unit":"oz"},{"ingredientId":281,"id":964,"amount":1,"unit":"oz"},{"ingredientId":79,"id":965,"amount":1,"unit":"oz"},{"ingredientId":490,"id":966,"amount":1,"unit":"oz"},{"ingredientId":119,"id":967,"amount":1,"unit":"oz"},{"ingredientId":459,"id":968,"amount":1,"unit":"oz"},{"ingredientId":391,"id":969,"amount":1,"unit":"oz"},{"ingredientId":9,"id":970,"amount":1,"unit":"oz"},{"ingredientId":294,"id":971,"amount":1,"unit":"oz"},{"ingredientId":490,"id":972,"amount":1,"unit":"oz"},{"ingredientId":354,"id":973,"amount":1,"unit":"oz"},{"ingredientId":391,"id":974,"amount":1,"unit":"oz"},{"ingredientId":8,"id":975,"amount":1,"unit":"oz"},{"ingredientId":306,"id":976,"amount":1,"unit":"oz"},{"ingredientId":525,"id":977,"amount":1,"unit":"oz"},{"ingredientId":182,"id":978,"amount":1,"unit":"oz"},{"ingredientId":94,"id":979,"amount":1,"unit":"oz"},{"ingredientId":4,"id":980,"amount":1,"unit":"oz"},{"ingredientId":409,"id":981,"amount":1,"unit":"oz"},{"ingredientId":261,"id":982,"amount":1,"unit":"oz"},{"ingredientId":288,"id":983,"amount":1,"unit":"oz"},{"ingredientId":391,"id":984,"amount":1,"unit":"oz"},{"ingredientId":242,"id":985,"amount":1,"unit":"oz"},{"ingredientId":531,"id":986,"amount":1,"unit":"oz"},{"ingredientId":115,"id":987,"amount":1,"unit":"oz"},{"ingredientId":386,"id":988,"amount":1,"unit":"oz"},{"ingredientId":8,"id":989,"amount":1,"unit":"oz"},{"ingredientId":432,"id":990,"amount":1,"unit":"oz"},{"ingredientId":565,"id":991,"amount":1,"unit":"oz"},{"ingredientId":354,"id":992,"amount":1,"unit":"oz"},{"ingredientId":616,"id":993,"amount":1,"unit":"oz"},{"ingredientId":386,"id":994,"amount":1,"unit":"oz"},{"ingredientId":531,"id":995,"amount":1,"unit":"oz"},{"ingredientId":115,"id":996,"amount":1,"unit":"oz"},{"ingredientId":459,"id":997,"amount":1,"unit":"oz"},{"ingredientId":391,"id":998,"amount":1,"unit":"oz"},{"ingredientId":185,"id":999,"amount":1,"unit":"oz"},{"ingredientId":115,"id":1000,"amount":1,"unit":"oz"},{"ingredientId":4,"id":1001,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1002,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1003,"amount":1,"unit":"oz"},{"ingredientId":294,"id":1004,"amount":1,"unit":"oz"},{"ingredientId":494,"id":1005,"amount":1,"unit":"oz"},{"ingredientId":105,"id":1006,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1007,"amount":1,"unit":"oz"},{"ingredientId":598,"id":1008,"amount":1,"unit":"oz"},{"ingredientId":443,"id":1009,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1010,"amount":1,"unit":"oz"},{"ingredientId":120,"id":1011,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1012,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1013,"amount":1,"unit":"oz"},{"ingredientId":382,"id":1014,"amount":1,"unit":"oz"},{"ingredientId":598,"id":1015,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1016,"amount":1,"unit":"oz"},{"ingredientId":569,"id":1017,"amount":1,"unit":"oz"},{"ingredientId":115,"id":1018,"amount":1,"unit":"oz"},{"ingredientId":612,"id":1019,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1020,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1021,"amount":1,"unit":"oz"},{"ingredientId":482,"id":1022,"amount":1,"unit":"oz"},{"ingredientId":123,"id":1023,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1024,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1025,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1026,"amount":1,"unit":"oz"},{"ingredientId":525,"id":1027,"amount":1,"unit":"oz"},{"ingredientId":95,"id":1028,"amount":1,"unit":"oz"},{"ingredientId":495,"id":1029,"amount":1,"unit":"oz"},{"ingredientId":35,"id":1030,"amount":1,"unit":"oz"},{"ingredientId":37,"id":1031,"amount":1,"unit":"oz"},{"ingredientId":403,"id":1032,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1033,"amount":1,"unit":"oz"},{"ingredientId":406,"id":1034,"amount":1,"unit":"oz"},{"ingredientId":616,"id":1035,"amount":1,"unit":"oz"},{"ingredientId":104,"id":1036,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1037,"amount":1,"unit":"oz"},{"ingredientId":230,"id":1038,"amount":1,"unit":"oz"},{"ingredientId":121,"id":1039,"amount":1,"unit":"oz"},{"ingredientId":352,"id":1040,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1041,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1042,"amount":1,"unit":"oz"},{"ingredientId":354,"id":1043,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1044,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1045,"amount":1,"unit":"oz"},{"ingredientId":474,"id":1046,"amount":1,"unit":"oz"},{"ingredientId":230,"id":1047,"amount":1,"unit":"oz"},{"ingredientId":413,"id":1048,"amount":1,"unit":"oz"},{"ingredientId":525,"id":1049,"amount":1,"unit":"oz"},{"ingredientId":115,"id":1050,"amount":1,"unit":"oz"},{"ingredientId":616,"id":1051,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1052,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1053,"amount":1,"unit":"oz"},{"ingredientId":353,"id":1054,"amount":1,"unit":"oz"},{"ingredientId":194,"id":1055,"amount":1,"unit":"oz"},{"ingredientId":459,"id":1056,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1057,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1058,"amount":1,"unit":"oz"},{"ingredientId":497,"id":1059,"amount":1,"unit":"oz"},{"ingredientId":218,"id":1060,"amount":1,"unit":"oz"},{"ingredientId":185,"id":1061,"amount":1,"unit":"oz"},{"ingredientId":305,"id":1062,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1063,"amount":1,"unit":"oz"},{"ingredientId":183,"id":1064,"amount":1,"unit":"oz"},{"ingredientId":354,"id":1065,"amount":1,"unit":"oz"},{"ingredientId":410,"id":1066,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1067,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1068,"amount":1,"unit":"oz"},{"ingredientId":96,"id":1069,"amount":1,"unit":"oz"},{"ingredientId":525,"id":1070,"amount":1,"unit":"oz"},{"ingredientId":525,"id":1071,"amount":1,"unit":"oz"},{"ingredientId":354,"id":1072,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1073,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1074,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1075,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1076,"amount":1,"unit":"oz"},{"ingredientId":450,"id":1077,"amount":1,"unit":"oz"},{"ingredientId":115,"id":1078,"amount":1,"unit":"oz"},{"ingredientId":448,"id":1079,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1080,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1081,"amount":1,"unit":"oz"},{"ingredientId":490,"id":1082,"amount":1,"unit":"oz"},{"ingredientId":406,"id":1083,"amount":1,"unit":"oz"},{"ingredientId":559,"id":1084,"amount":1,"unit":"oz"},{"ingredientId":272,"id":1085,"amount":1,"unit":"oz"},{"ingredientId":4,"id":1086,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1087,"amount":1,"unit":"oz"},{"ingredientId":8,"id":1088,"amount":1,"unit":"oz"},{"ingredientId":591,"id":1089,"amount":1,"unit":"oz"},{"ingredientId":167,"id":1090,"amount":1,"unit":"oz"},{"ingredientId":571,"id":1091,"amount":1,"unit":"oz"},{"ingredientId":119,"id":1092,"amount":1,"unit":"oz"},{"ingredientId":38,"id":1093,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1094,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1095,"amount":1,"unit":"oz"},{"ingredientId":122,"id":1096,"amount":1,"unit":"oz"},{"ingredientId":25,"id":1097,"amount":1,"unit":"oz"},{"ingredientId":61,"id":1098,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1099,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1100,"amount":1,"unit":"oz"},{"ingredientId":281,"id":1101,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1102,"amount":1,"unit":"oz"},{"ingredientId":115,"id":1103,"amount":1,"unit":"oz"},{"ingredientId":113,"id":1104,"amount":1,"unit":"oz"},{"ingredientId":616,"id":1105,"amount":1,"unit":"oz"},{"ingredientId":185,"id":1106,"amount":1,"unit":"oz"},{"ingredientId":490,"id":1107,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1108,"amount":1,"unit":"oz"},{"ingredientId":38,"id":1109,"amount":1,"unit":"oz"},{"ingredientId":167,"id":1110,"amount":1,"unit":"oz"},{"ingredientId":405,"id":1111,"amount":1,"unit":"oz"},{"ingredientId":46,"id":1112,"amount":1,"unit":"oz"},{"ingredientId":584,"id":1113,"amount":1,"unit":"oz"},{"ingredientId":194,"id":1114,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1115,"amount":1,"unit":"oz"},{"ingredientId":52,"id":1116,"amount":1,"unit":"oz"},{"ingredientId":616,"id":1117,"amount":1,"unit":"oz"},{"ingredientId":66,"id":1118,"amount":1,"unit":"oz"},{"ingredientId":451,"id":1119,"amount":1,"unit":"oz"},{"ingredientId":61,"id":1120,"amount":1,"unit":"oz"},{"ingredientId":494,"id":1121,"amount":1,"unit":"oz"},{"ingredientId":345,"id":1122,"amount":1,"unit":"oz"},{"ingredientId":292,"id":1123,"amount":1,"unit":"oz"},{"ingredientId":185,"id":1124,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1125,"amount":1,"unit":"oz"},{"ingredientId":230,"id":1126,"amount":1,"unit":"oz"},{"ingredientId":119,"id":1127,"amount":1,"unit":"oz"},{"ingredientId":354,"id":1128,"amount":1,"unit":"oz"},{"ingredientId":58,"id":1129,"amount":1,"unit":"oz"},{"ingredientId":255,"id":1130,"amount":1,"unit":"oz"},{"ingredientId":215,"id":1131,"amount":1,"unit":"oz"},{"ingredientId":525,"id":1132,"amount":1,"unit":"oz"},{"ingredientId":354,"id":1133,"amount":1,"unit":"oz"},{"ingredientId":410,"id":1134,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1135,"amount":1,"unit":"oz"},{"ingredientId":459,"id":1136,"amount":1,"unit":"oz"},{"ingredientId":598,"id":1137,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1138,"amount":1,"unit":"oz"},{"ingredientId":494,"id":1139,"amount":1,"unit":"oz"},{"ingredientId":216,"id":1140,"amount":1,"unit":"oz"},{"ingredientId":451,"id":1141,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1142,"amount":1,"unit":"oz"},{"ingredientId":8,"id":1143,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1144,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1145,"amount":1,"unit":"oz"},{"ingredientId":49,"id":1146,"amount":1,"unit":"oz"},{"ingredientId":410,"id":1147,"amount":1,"unit":"oz"},{"ingredientId":54,"id":1148,"amount":1,"unit":"oz"},{"ingredientId":243,"id":1149,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1150,"amount":1,"unit":"oz"},{"ingredientId":407,"id":1151,"amount":1,"unit":"oz"},{"ingredientId":398,"id":1152,"amount":1,"unit":"oz"},{"ingredientId":98,"id":1153,"amount":1,"unit":"oz"},{"ingredientId":448,"id":1154,"amount":1,"unit":"oz"},{"ingredientId":8,"id":1155,"amount":1,"unit":"oz"},{"ingredientId":63,"id":1156,"amount":1,"unit":"oz"},{"ingredientId":80,"id":1157,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1158,"amount":1,"unit":"oz"},{"ingredientId":405,"id":1159,"amount":1,"unit":"oz"},{"ingredientId":484,"id":1160,"amount":1,"unit":"oz"},{"ingredientId":30,"id":1161,"amount":1,"unit":"oz"},{"ingredientId":598,"id":1162,"amount":1,"unit":"oz"},{"ingredientId":429,"id":1163,"amount":1,"unit":"oz"},{"ingredientId":482,"id":1164,"amount":1,"unit":"oz"},{"ingredientId":50,"id":1165,"amount":1,"unit":"oz"},{"ingredientId":350,"id":1166,"amount":1,"unit":"oz"},{"ingredientId":38,"id":1167,"amount":1,"unit":"oz"},{"ingredientId":219,"id":1168,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1169,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1170,"amount":1,"unit":"oz"},{"ingredientId":168,"id":1171,"amount":1,"unit":"oz"},{"ingredientId":119,"id":1172,"amount":1,"unit":"oz"},{"ingredientId":320,"id":1173,"amount":1,"unit":"oz"},{"ingredientId":58,"id":1174,"amount":1,"unit":"oz"},{"ingredientId":602,"id":1175,"amount":1,"unit":"oz"},{"ingredientId":525,"id":1176,"amount":1,"unit":"oz"},{"ingredientId":429,"id":1177,"amount":1,"unit":"oz"},{"ingredientId":409,"id":1178,"amount":1,"unit":"oz"},{"ingredientId":115,"id":1179,"amount":1,"unit":"oz"},{"ingredientId":113,"id":1180,"amount":1,"unit":"oz"},{"ingredientId":261,"id":1181,"amount":1,"unit":"oz"},{"ingredientId":429,"id":1182,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1183,"amount":1,"unit":"oz"},{"ingredientId":490,"id":1184,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1185,"amount":1,"unit":"oz"},{"ingredientId":134,"id":1186,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1187,"amount":1,"unit":"oz"},{"ingredientId":490,"id":1188,"amount":1,"unit":"oz"},{"ingredientId":410,"id":1189,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1190,"amount":1,"unit":"oz"},{"ingredientId":92,"id":1191,"amount":1,"unit":"oz"},{"ingredientId":25,"id":1192,"amount":1,"unit":"oz"},{"ingredientId":98,"id":1193,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1194,"amount":1,"unit":"oz"},{"ingredientId":494,"id":1195,"amount":1,"unit":"oz"},{"ingredientId":411,"id":1196,"amount":1,"unit":"oz"},{"ingredientId":35,"id":1197,"amount":1,"unit":"oz"},{"ingredientId":429,"id":1198,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1199,"amount":1,"unit":"oz"},{"ingredientId":355,"id":1200,"amount":1,"unit":"oz"},{"ingredientId":27,"id":1201,"amount":1,"unit":"oz"},{"ingredientId":435,"id":1202,"amount":1,"unit":"oz"},{"ingredientId":98,"id":1203,"amount":1,"unit":"oz"},{"ingredientId":433,"id":1204,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1205,"amount":1,"unit":"oz"},{"ingredientId":52,"id":1206,"amount":1,"unit":"oz"},{"ingredientId":584,"id":1207,"amount":1,"unit":"oz"},{"ingredientId":219,"id":1208,"amount":1,"unit":"oz"},{"ingredientId":38,"id":1209,"amount":1,"unit":"oz"},{"ingredientId":429,"id":1210,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1211,"amount":1,"unit":"oz"},{"ingredientId":295,"id":1212,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1213,"amount":1,"unit":"oz"},{"ingredientId":406,"id":1214,"amount":1,"unit":"oz"},{"ingredientId":575,"id":1215,"amount":1,"unit":"oz"},{"ingredientId":261,"id":1216,"amount":1,"unit":"oz"},{"ingredientId":429,"id":1217,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1218,"amount":1,"unit":"oz"},{"ingredientId":357,"id":1219,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1220,"amount":1,"unit":"oz"},{"ingredientId":616,"id":1221,"amount":1,"unit":"oz"},{"ingredientId":449,"id":1222,"amount":1,"unit":"oz"},{"ingredientId":495,"id":1223,"amount":1,"unit":"oz"},{"ingredientId":354,"id":1224,"amount":1,"unit":"oz"},{"ingredientId":113,"id":1225,"amount":1,"unit":"oz"},{"ingredientId":267,"id":1226,"amount":1,"unit":"oz"},{"ingredientId":144,"id":1227,"amount":1,"unit":"oz"},{"ingredientId":56,"id":1228,"amount":1,"unit":"oz"},{"ingredientId":219,"id":1229,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1230,"amount":1,"unit":"oz"},{"ingredientId":586,"id":1231,"amount":1,"unit":"oz"},{"ingredientId":138,"id":1232,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1233,"amount":1,"unit":"oz"},{"ingredientId":429,"id":1234,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1235,"amount":1,"unit":"oz"},{"ingredientId":232,"id":1236,"amount":1,"unit":"oz"},{"ingredientId":368,"id":1237,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1238,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1239,"amount":1,"unit":"oz"},{"ingredientId":294,"id":1240,"amount":1,"unit":"oz"},{"ingredientId":423,"id":1241,"amount":1,"unit":"oz"},{"ingredientId":289,"id":1242,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1243,"amount":1,"unit":"oz"},{"ingredientId":185,"id":1244,"amount":1,"unit":"oz"},{"ingredientId":591,"id":1245,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1246,"amount":1,"unit":"oz"},{"ingredientId":141,"id":1247,"amount":1,"unit":"oz"},{"ingredientId":30,"id":1248,"amount":1,"unit":"oz"},{"ingredientId":61,"id":1249,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1250,"amount":1,"unit":"oz"},{"ingredientId":598,"id":1251,"amount":1,"unit":"oz"},{"ingredientId":429,"id":1252,"amount":1,"unit":"oz"},{"ingredientId":81,"id":1253,"amount":1,"unit":"oz"},{"ingredientId":541,"id":1254,"amount":1,"unit":"oz"},{"ingredientId":61,"id":1255,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1256,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1257,"amount":1,"unit":"oz"},{"ingredientId":91,"id":1258,"amount":1,"unit":"oz"},{"ingredientId":377,"id":1259,"amount":1,"unit":"oz"},{"ingredientId":368,"id":1260,"amount":1,"unit":"oz"},{"ingredientId":189,"id":1261,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1262,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1263,"amount":1,"unit":"oz"},{"ingredientId":440,"id":1264,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1265,"amount":1,"unit":"oz"},{"ingredientId":316,"id":1266,"amount":1,"unit":"oz"},{"ingredientId":113,"id":1267,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1268,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1269,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1270,"amount":1,"unit":"oz"},{"ingredientId":512,"id":1271,"amount":1,"unit":"oz"},{"ingredientId":105,"id":1272,"amount":1,"unit":"oz"},{"ingredientId":435,"id":1273,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1274,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1275,"amount":1,"unit":"oz"},{"ingredientId":281,"id":1276,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1277,"amount":1,"unit":"oz"},{"ingredientId":511,"id":1278,"amount":1,"unit":"oz"},{"ingredientId":425,"id":1279,"amount":1,"unit":"oz"},{"ingredientId":217,"id":1280,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1281,"amount":1,"unit":"oz"},{"ingredientId":400,"id":1282,"amount":1,"unit":"oz"},{"ingredientId":63,"id":1283,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1284,"amount":1,"unit":"oz"},{"ingredientId":512,"id":1285,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1286,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1287,"amount":1,"unit":"oz"},{"ingredientId":474,"id":1288,"amount":1,"unit":"oz"},{"ingredientId":413,"id":1289,"amount":1,"unit":"oz"},{"ingredientId":310,"id":1290,"amount":1,"unit":"oz"},{"ingredientId":63,"id":1291,"amount":1,"unit":"oz"},{"ingredientId":435,"id":1292,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1293,"amount":1,"unit":"oz"},{"ingredientId":283,"id":1294,"amount":1,"unit":"oz"},{"ingredientId":440,"id":1295,"amount":1,"unit":"oz"},{"ingredientId":281,"id":1296,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1297,"amount":1,"unit":"oz"},{"ingredientId":537,"id":1298,"amount":1,"unit":"oz"},{"ingredientId":584,"id":1299,"amount":1,"unit":"oz"},{"ingredientId":459,"id":1300,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1301,"amount":1,"unit":"oz"},{"ingredientId":440,"id":1302,"amount":1,"unit":"oz"},{"ingredientId":598,"id":1303,"amount":1,"unit":"oz"},{"ingredientId":214,"id":1304,"amount":1,"unit":"oz"},{"ingredientId":213,"id":1305,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1306,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1307,"amount":1,"unit":"oz"},{"ingredientId":518,"id":1308,"amount":1,"unit":"oz"},{"ingredientId":46,"id":1309,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1310,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1311,"amount":1,"unit":"oz"},{"ingredientId":440,"id":1312,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1313,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1314,"amount":1,"unit":"oz"},{"ingredientId":340,"id":1315,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1316,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1317,"amount":1,"unit":"oz"},{"ingredientId":185,"id":1318,"amount":1,"unit":"oz"},{"ingredientId":260,"id":1319,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1320,"amount":1,"unit":"oz"},{"ingredientId":377,"id":1321,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1322,"amount":1,"unit":"oz"},{"ingredientId":459,"id":1323,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1324,"amount":1,"unit":"oz"},{"ingredientId":81,"id":1325,"amount":1,"unit":"oz"},{"ingredientId":80,"id":1326,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1327,"amount":1,"unit":"oz"},{"ingredientId":129,"id":1328,"amount":1,"unit":"oz"},{"ingredientId":587,"id":1329,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1330,"amount":1,"unit":"oz"},{"ingredientId":400,"id":1331,"amount":1,"unit":"oz"},{"ingredientId":63,"id":1332,"amount":1,"unit":"oz"},{"ingredientId":482,"id":1333,"amount":1,"unit":"oz"},{"ingredientId":413,"id":1334,"amount":1,"unit":"oz"},{"ingredientId":511,"id":1335,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1336,"amount":1,"unit":"oz"},{"ingredientId":281,"id":1337,"amount":1,"unit":"oz"},{"ingredientId":359,"id":1338,"amount":1,"unit":"oz"},{"ingredientId":479,"id":1339,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1340,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1341,"amount":1,"unit":"oz"},{"ingredientId":541,"id":1342,"amount":1,"unit":"oz"},{"ingredientId":337,"id":1343,"amount":1,"unit":"oz"},{"ingredientId":33,"id":1344,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1345,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1346,"amount":1,"unit":"oz"},{"ingredientId":368,"id":1347,"amount":1,"unit":"oz"},{"ingredientId":402,"id":1348,"amount":1,"unit":"oz"},{"ingredientId":292,"id":1349,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1350,"amount":1,"unit":"oz"},{"ingredientId":129,"id":1351,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1352,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1353,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1354,"amount":1,"unit":"oz"},{"ingredientId":294,"id":1355,"amount":1,"unit":"oz"},{"ingredientId":260,"id":1356,"amount":1,"unit":"oz"},{"ingredientId":167,"id":1357,"amount":1,"unit":"oz"},{"ingredientId":565,"id":1358,"amount":1,"unit":"oz"},{"ingredientId":128,"id":1359,"amount":1,"unit":"oz"},{"ingredientId":113,"id":1360,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1361,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1362,"amount":1,"unit":"oz"},{"ingredientId":287,"id":1363,"amount":1,"unit":"oz"},{"ingredientId":167,"id":1364,"amount":1,"unit":"oz"},{"ingredientId":146,"id":1365,"amount":1,"unit":"oz"},{"ingredientId":35,"id":1366,"amount":1,"unit":"oz"},{"ingredientId":173,"id":1367,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1368,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1369,"amount":1,"unit":"oz"},{"ingredientId":376,"id":1370,"amount":1,"unit":"oz"},{"ingredientId":440,"id":1371,"amount":1,"unit":"oz"},{"ingredientId":46,"id":1372,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1373,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1374,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1375,"amount":1,"unit":"oz"},{"ingredientId":40,"id":1376,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1377,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1378,"amount":1,"unit":"oz"},{"ingredientId":167,"id":1379,"amount":1,"unit":"oz"},{"ingredientId":148,"id":1380,"amount":1,"unit":"oz"},{"ingredientId":217,"id":1381,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1382,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1383,"amount":1,"unit":"oz"},{"ingredientId":476,"id":1384,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1385,"amount":1,"unit":"oz"},{"ingredientId":183,"id":1386,"amount":1,"unit":"oz"},{"ingredientId":128,"id":1387,"amount":1,"unit":"oz"},{"ingredientId":309,"id":1388,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1389,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1390,"amount":1,"unit":"oz"},{"ingredientId":429,"id":1391,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1392,"amount":1,"unit":"oz"},{"ingredientId":565,"id":1393,"amount":1,"unit":"oz"},{"ingredientId":139,"id":1394,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1395,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1396,"amount":1,"unit":"oz"},{"ingredientId":440,"id":1397,"amount":1,"unit":"oz"},{"ingredientId":185,"id":1398,"amount":1,"unit":"oz"},{"ingredientId":281,"id":1399,"amount":1,"unit":"oz"},{"ingredientId":80,"id":1400,"amount":1,"unit":"oz"},{"ingredientId":139,"id":1401,"amount":1,"unit":"oz"},{"ingredientId":61,"id":1402,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1403,"amount":1,"unit":"oz"},{"ingredientId":281,"id":1404,"amount":1,"unit":"oz"},{"ingredientId":535,"id":1405,"amount":1,"unit":"oz"},{"ingredientId":427,"id":1406,"amount":1,"unit":"oz"},{"ingredientId":104,"id":1407,"amount":1,"unit":"oz"},{"ingredientId":106,"id":1408,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1409,"amount":1,"unit":"oz"},{"ingredientId":541,"id":1410,"amount":1,"unit":"oz"},{"ingredientId":215,"id":1411,"amount":1,"unit":"oz"},{"ingredientId":433,"id":1412,"amount":1,"unit":"oz"},{"ingredientId":261,"id":1413,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1414,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1415,"amount":1,"unit":"oz"},{"ingredientId":613,"id":1416,"amount":1,"unit":"oz"},{"ingredientId":344,"id":1417,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1418,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1419,"amount":1,"unit":"oz"},{"ingredientId":313,"id":1420,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1421,"amount":1,"unit":"oz"},{"ingredientId":512,"id":1422,"amount":1,"unit":"oz"},{"ingredientId":581,"id":1423,"amount":1,"unit":"oz"},{"ingredientId":34,"id":1424,"amount":1,"unit":"oz"},{"ingredientId":402,"id":1425,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1426,"amount":1,"unit":"oz"},{"ingredientId":539,"id":1427,"amount":1,"unit":"oz"},{"ingredientId":194,"id":1428,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1429,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1430,"amount":1,"unit":"oz"},{"ingredientId":512,"id":1431,"amount":1,"unit":"oz"},{"ingredientId":149,"id":1432,"amount":1,"unit":"oz"},{"ingredientId":587,"id":1433,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1434,"amount":1,"unit":"oz"},{"ingredientId":105,"id":1435,"amount":1,"unit":"oz"},{"ingredientId":219,"id":1436,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1437,"amount":1,"unit":"oz"},{"ingredientId":377,"id":1438,"amount":1,"unit":"oz"},{"ingredientId":578,"id":1439,"amount":1,"unit":"oz"},{"ingredientId":134,"id":1440,"amount":1,"unit":"oz"},{"ingredientId":171,"id":1441,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1442,"amount":1,"unit":"oz"},{"ingredientId":128,"id":1443,"amount":1,"unit":"oz"},{"ingredientId":224,"id":1444,"amount":1,"unit":"oz"},{"ingredientId":459,"id":1445,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1446,"amount":1,"unit":"oz"},{"ingredientId":231,"id":1447,"amount":1,"unit":"oz"},{"ingredientId":460,"id":1448,"amount":1,"unit":"oz"},{"ingredientId":142,"id":1449,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1450,"amount":1,"unit":"oz"},{"ingredientId":373,"id":1451,"amount":1,"unit":"oz"},{"ingredientId":292,"id":1452,"amount":1,"unit":"oz"},{"ingredientId":185,"id":1453,"amount":1,"unit":"oz"},{"ingredientId":598,"id":1454,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1455,"amount":1,"unit":"oz"},{"ingredientId":337,"id":1456,"amount":1,"unit":"oz"},{"ingredientId":105,"id":1457,"amount":1,"unit":"oz"},{"ingredientId":261,"id":1458,"amount":1,"unit":"oz"},{"ingredientId":513,"id":1459,"amount":1,"unit":"oz"},{"ingredientId":35,"id":1460,"amount":1,"unit":"oz"},{"ingredientId":217,"id":1461,"amount":1,"unit":"oz"},{"ingredientId":430,"id":1462,"amount":1,"unit":"oz"},{"ingredientId":512,"id":1463,"amount":1,"unit":"oz"},{"ingredientId":258,"id":1464,"amount":1,"unit":"oz"},{"ingredientId":41,"id":1465,"amount":1,"unit":"oz"},{"ingredientId":429,"id":1466,"amount":1,"unit":"oz"},{"ingredientId":128,"id":1467,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1468,"amount":1,"unit":"oz"},{"ingredientId":244,"id":1469,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1470,"amount":1,"unit":"oz"},{"ingredientId":368,"id":1471,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1472,"amount":1,"unit":"oz"},{"ingredientId":98,"id":1473,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1474,"amount":1,"unit":"oz"},{"ingredientId":361,"id":1475,"amount":1,"unit":"oz"},{"ingredientId":113,"id":1476,"amount":1,"unit":"oz"},{"ingredientId":292,"id":1477,"amount":1,"unit":"oz"},{"ingredientId":402,"id":1478,"amount":1,"unit":"oz"},{"ingredientId":61,"id":1479,"amount":1,"unit":"oz"},{"ingredientId":511,"id":1480,"amount":1,"unit":"oz"},{"ingredientId":255,"id":1481,"amount":1,"unit":"oz"},{"ingredientId":35,"id":1482,"amount":1,"unit":"oz"},{"ingredientId":400,"id":1483,"amount":1,"unit":"oz"},{"ingredientId":63,"id":1484,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1485,"amount":1,"unit":"oz"},{"ingredientId":342,"id":1486,"amount":1,"unit":"oz"},{"ingredientId":568,"id":1487,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1488,"amount":1,"unit":"oz"},{"ingredientId":337,"id":1489,"amount":1,"unit":"oz"},{"ingredientId":541,"id":1490,"amount":1,"unit":"oz"},{"ingredientId":58,"id":1491,"amount":1,"unit":"oz"},{"ingredientId":224,"id":1492,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1493,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1494,"amount":1,"unit":"oz"},{"ingredientId":512,"id":1495,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1496,"amount":1,"unit":"oz"},{"ingredientId":616,"id":1497,"amount":1,"unit":"oz"},{"ingredientId":98,"id":1498,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1499,"amount":1,"unit":"oz"},{"ingredientId":198,"id":1500,"amount":1,"unit":"oz"},{"ingredientId":10,"id":1501,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1502,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1503,"amount":1,"unit":"oz"},{"ingredientId":90,"id":1504,"amount":1,"unit":"oz"},{"ingredientId":440,"id":1505,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1506,"amount":1,"unit":"oz"},{"ingredientId":245,"id":1507,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1508,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1509,"amount":1,"unit":"oz"},{"ingredientId":63,"id":1510,"amount":1,"unit":"oz"},{"ingredientId":260,"id":1511,"amount":1,"unit":"oz"},{"ingredientId":81,"id":1512,"amount":1,"unit":"oz"},{"ingredientId":462,"id":1513,"amount":1,"unit":"oz"},{"ingredientId":66,"id":1514,"amount":1,"unit":"oz"},{"ingredientId":98,"id":1515,"amount":1,"unit":"oz"},{"ingredientId":459,"id":1516,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1517,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1518,"amount":1,"unit":"oz"},{"ingredientId":183,"id":1519,"amount":1,"unit":"oz"},{"ingredientId":199,"id":1520,"amount":1,"unit":"oz"},{"ingredientId":373,"id":1521,"amount":1,"unit":"oz"},{"ingredientId":227,"id":1522,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1523,"amount":1,"unit":"oz"},{"ingredientId":185,"id":1524,"amount":1,"unit":"oz"},{"ingredientId":281,"id":1525,"amount":1,"unit":"oz"},{"ingredientId":435,"id":1526,"amount":1,"unit":"oz"},{"ingredientId":98,"id":1527,"amount":1,"unit":"oz"},{"ingredientId":105,"id":1528,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1529,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1530,"amount":1,"unit":"oz"},{"ingredientId":565,"id":1531,"amount":1,"unit":"oz"},{"ingredientId":205,"id":1532,"amount":1,"unit":"oz"},{"ingredientId":261,"id":1533,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1534,"amount":1,"unit":"oz"},{"ingredientId":185,"id":1535,"amount":1,"unit":"oz"},{"ingredientId":88,"id":1536,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1537,"amount":1,"unit":"oz"},{"ingredientId":205,"id":1538,"amount":1,"unit":"oz"},{"ingredientId":338,"id":1539,"amount":1,"unit":"oz"},{"ingredientId":219,"id":1540,"amount":1,"unit":"oz"},{"ingredientId":459,"id":1541,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1542,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1543,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1544,"amount":1,"unit":"oz"},{"ingredientId":326,"id":1545,"amount":1,"unit":"oz"},{"ingredientId":261,"id":1546,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1547,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1548,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1549,"amount":1,"unit":"oz"},{"ingredientId":199,"id":1550,"amount":1,"unit":"oz"},{"ingredientId":448,"id":1551,"amount":1,"unit":"oz"},{"ingredientId":98,"id":1552,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1553,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1554,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1555,"amount":1,"unit":"oz"},{"ingredientId":462,"id":1556,"amount":1,"unit":"oz"},{"ingredientId":127,"id":1557,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1558,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1559,"amount":1,"unit":"oz"},{"ingredientId":440,"id":1560,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1561,"amount":1,"unit":"oz"},{"ingredientId":205,"id":1562,"amount":1,"unit":"oz"},{"ingredientId":546,"id":1563,"amount":1,"unit":"oz"},{"ingredientId":46,"id":1564,"amount":1,"unit":"oz"},{"ingredientId":440,"id":1565,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1566,"amount":1,"unit":"oz"},{"ingredientId":299,"id":1567,"amount":1,"unit":"oz"},{"ingredientId":260,"id":1568,"amount":1,"unit":"oz"},{"ingredientId":464,"id":1569,"amount":1,"unit":"oz"},{"ingredientId":402,"id":1570,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1571,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1572,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1573,"amount":1,"unit":"oz"},{"ingredientId":445,"id":1574,"amount":1,"unit":"oz"},{"ingredientId":464,"id":1575,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1576,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1577,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1578,"amount":1,"unit":"oz"},{"ingredientId":617,"id":1579,"amount":1,"unit":"oz"},{"ingredientId":450,"id":1580,"amount":1,"unit":"oz"},{"ingredientId":66,"id":1581,"amount":1,"unit":"oz"},{"ingredientId":98,"id":1582,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1583,"amount":1,"unit":"oz"},{"ingredientId":110,"id":1584,"amount":1,"unit":"oz"},{"ingredientId":201,"id":1585,"amount":1,"unit":"oz"},{"ingredientId":587,"id":1586,"amount":1,"unit":"oz"},{"ingredientId":221,"id":1587,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1588,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1589,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1590,"amount":1,"unit":"oz"},{"ingredientId":542,"id":1591,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1592,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1593,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1594,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1595,"amount":1,"unit":"oz"},{"ingredientId":61,"id":1596,"amount":1,"unit":"oz"},{"ingredientId":205,"id":1597,"amount":1,"unit":"oz"},{"ingredientId":217,"id":1598,"amount":1,"unit":"oz"},{"ingredientId":435,"id":1599,"amount":1,"unit":"oz"},{"ingredientId":27,"id":1600,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1601,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1602,"amount":1,"unit":"oz"},{"ingredientId":207,"id":1603,"amount":1,"unit":"oz"},{"ingredientId":359,"id":1604,"amount":1,"unit":"oz"},{"ingredientId":224,"id":1605,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1606,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1607,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1608,"amount":1,"unit":"oz"},{"ingredientId":4,"id":1609,"amount":1,"unit":"oz"},{"ingredientId":205,"id":1610,"amount":1,"unit":"oz"},{"ingredientId":548,"id":1611,"amount":1,"unit":"oz"},{"ingredientId":223,"id":1612,"amount":1,"unit":"oz"},{"ingredientId":39,"id":1613,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1614,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1615,"amount":1,"unit":"oz"},{"ingredientId":205,"id":1616,"amount":1,"unit":"oz"},{"ingredientId":344,"id":1617,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1618,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1619,"amount":1,"unit":"oz"},{"ingredientId":167,"id":1620,"amount":1,"unit":"oz"},{"ingredientId":66,"id":1621,"amount":1,"unit":"oz"},{"ingredientId":199,"id":1622,"amount":1,"unit":"oz"},{"ingredientId":215,"id":1623,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1624,"amount":1,"unit":"oz"},{"ingredientId":63,"id":1625,"amount":1,"unit":"oz"},{"ingredientId":205,"id":1626,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1627,"amount":1,"unit":"oz"},{"ingredientId":168,"id":1628,"amount":1,"unit":"oz"},{"ingredientId":429,"id":1629,"amount":1,"unit":"oz"},{"ingredientId":167,"id":1630,"amount":1,"unit":"oz"},{"ingredientId":198,"id":1631,"amount":1,"unit":"oz"},{"ingredientId":372,"id":1632,"amount":1,"unit":"oz"},{"ingredientId":46,"id":1633,"amount":1,"unit":"oz"},{"ingredientId":35,"id":1634,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1635,"amount":1,"unit":"oz"},{"ingredientId":80,"id":1636,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1637,"amount":1,"unit":"oz"},{"ingredientId":77,"id":1638,"amount":1,"unit":"oz"},{"ingredientId":204,"id":1639,"amount":1,"unit":"oz"},{"ingredientId":66,"id":1640,"amount":1,"unit":"oz"},{"ingredientId":113,"id":1641,"amount":1,"unit":"oz"},{"ingredientId":215,"id":1642,"amount":1,"unit":"oz"},{"ingredientId":400,"id":1643,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1644,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1645,"amount":1,"unit":"oz"},{"ingredientId":61,"id":1646,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1647,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1648,"amount":1,"unit":"oz"},{"ingredientId":433,"id":1649,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1650,"amount":1,"unit":"oz"},{"ingredientId":66,"id":1651,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1652,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1653,"amount":1,"unit":"oz"},{"ingredientId":261,"id":1654,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1655,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1656,"amount":1,"unit":"oz"},{"ingredientId":205,"id":1657,"amount":1,"unit":"oz"},{"ingredientId":372,"id":1658,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1659,"amount":1,"unit":"oz"},{"ingredientId":402,"id":1660,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1661,"amount":1,"unit":"oz"},{"ingredientId":199,"id":1662,"amount":1,"unit":"oz"},{"ingredientId":581,"id":1663,"amount":1,"unit":"oz"},{"ingredientId":217,"id":1664,"amount":1,"unit":"oz"},{"ingredientId":92,"id":1665,"amount":1,"unit":"oz"},{"ingredientId":205,"id":1666,"amount":1,"unit":"oz"},{"ingredientId":58,"id":1667,"amount":1,"unit":"oz"},{"ingredientId":578,"id":1668,"amount":1,"unit":"oz"},{"ingredientId":287,"id":1669,"amount":1,"unit":"oz"},{"ingredientId":205,"id":1670,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1671,"amount":1,"unit":"oz"},{"ingredientId":98,"id":1672,"amount":1,"unit":"oz"},{"ingredientId":616,"id":1673,"amount":1,"unit":"oz"},{"ingredientId":4,"id":1674,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1675,"amount":1,"unit":"oz"},{"ingredientId":463,"id":1676,"amount":1,"unit":"oz"},{"ingredientId":255,"id":1677,"amount":1,"unit":"oz"},{"ingredientId":289,"id":1678,"amount":1,"unit":"oz"},{"ingredientId":261,"id":1679,"amount":1,"unit":"oz"},{"ingredientId":267,"id":1680,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1681,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1682,"amount":1,"unit":"oz"},{"ingredientId":462,"id":1683,"amount":1,"unit":"oz"},{"ingredientId":58,"id":1684,"amount":1,"unit":"oz"},{"ingredientId":113,"id":1685,"amount":1,"unit":"oz"},{"ingredientId":261,"id":1686,"amount":1,"unit":"oz"},{"ingredientId":287,"id":1687,"amount":1,"unit":"oz"},{"ingredientId":66,"id":1688,"amount":1,"unit":"oz"},{"ingredientId":244,"id":1689,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1690,"amount":1,"unit":"oz"},{"ingredientId":25,"id":1691,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1692,"amount":1,"unit":"oz"},{"ingredientId":167,"id":1693,"amount":1,"unit":"oz"},{"ingredientId":482,"id":1694,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1695,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1696,"amount":1,"unit":"oz"},{"ingredientId":143,"id":1697,"amount":1,"unit":"oz"},{"ingredientId":317,"id":1698,"amount":1,"unit":"oz"},{"ingredientId":281,"id":1699,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1700,"amount":1,"unit":"oz"},{"ingredientId":469,"id":1701,"amount":1,"unit":"oz"},{"ingredientId":105,"id":1702,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1703,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1704,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1705,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1706,"amount":1,"unit":"oz"},{"ingredientId":205,"id":1707,"amount":1,"unit":"oz"},{"ingredientId":283,"id":1708,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1709,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1710,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1711,"amount":1,"unit":"oz"},{"ingredientId":62,"id":1712,"amount":1,"unit":"oz"},{"ingredientId":66,"id":1713,"amount":1,"unit":"oz"},{"ingredientId":261,"id":1714,"amount":1,"unit":"oz"},{"ingredientId":4,"id":1715,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1716,"amount":1,"unit":"oz"},{"ingredientId":556,"id":1717,"amount":1,"unit":"oz"},{"ingredientId":372,"id":1718,"amount":1,"unit":"oz"},{"ingredientId":267,"id":1719,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1720,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1721,"amount":1,"unit":"oz"},{"ingredientId":591,"id":1722,"amount":1,"unit":"oz"},{"ingredientId":448,"id":1723,"amount":1,"unit":"oz"},{"ingredientId":234,"id":1724,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1725,"amount":1,"unit":"oz"},{"ingredientId":281,"id":1726,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1727,"amount":1,"unit":"oz"},{"ingredientId":253,"id":1728,"amount":1,"unit":"oz"},{"ingredientId":261,"id":1729,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1730,"amount":1,"unit":"oz"},{"ingredientId":297,"id":1731,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1732,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1733,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1734,"amount":1,"unit":"oz"},{"ingredientId":383,"id":1735,"amount":1,"unit":"oz"},{"ingredientId":469,"id":1736,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1737,"amount":1,"unit":"oz"},{"ingredientId":401,"id":1738,"amount":1,"unit":"oz"},{"ingredientId":287,"id":1739,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1740,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1741,"amount":1,"unit":"oz"},{"ingredientId":115,"id":1742,"amount":1,"unit":"oz"},{"ingredientId":8,"id":1743,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1744,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1745,"amount":1,"unit":"oz"},{"ingredientId":236,"id":1746,"amount":1,"unit":"oz"},{"ingredientId":372,"id":1747,"amount":1,"unit":"oz"},{"ingredientId":4,"id":1748,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1749,"amount":1,"unit":"oz"},{"ingredientId":294,"id":1750,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1751,"amount":1,"unit":"oz"},{"ingredientId":469,"id":1752,"amount":1,"unit":"oz"},{"ingredientId":261,"id":1753,"amount":1,"unit":"oz"},{"ingredientId":429,"id":1754,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1755,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1756,"amount":1,"unit":"oz"},{"ingredientId":352,"id":1757,"amount":1,"unit":"oz"},{"ingredientId":74,"id":1758,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1759,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1760,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1761,"amount":1,"unit":"oz"},{"ingredientId":276,"id":1762,"amount":1,"unit":"oz"},{"ingredientId":435,"id":1763,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1764,"amount":1,"unit":"oz"},{"ingredientId":81,"id":1765,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1766,"amount":1,"unit":"oz"},{"ingredientId":114,"id":1767,"amount":1,"unit":"oz"},{"ingredientId":113,"id":1768,"amount":1,"unit":"oz"},{"ingredientId":219,"id":1769,"amount":1,"unit":"oz"},{"ingredientId":105,"id":1770,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1771,"amount":1,"unit":"oz"},{"ingredientId":281,"id":1772,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1773,"amount":1,"unit":"oz"},{"ingredientId":14,"id":1774,"amount":1,"unit":"oz"},{"ingredientId":4,"id":1775,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1776,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1777,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1778,"amount":1,"unit":"oz"},{"ingredientId":167,"id":1779,"amount":1,"unit":"oz"},{"ingredientId":364,"id":1780,"amount":1,"unit":"oz"},{"ingredientId":433,"id":1781,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1782,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1783,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1784,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1785,"amount":1,"unit":"oz"},{"ingredientId":564,"id":1786,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1787,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1788,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1789,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1790,"amount":1,"unit":"oz"},{"ingredientId":389,"id":1791,"amount":1,"unit":"oz"},{"ingredientId":294,"id":1792,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1793,"amount":1,"unit":"oz"},{"ingredientId":202,"id":1794,"amount":1,"unit":"oz"},{"ingredientId":292,"id":1795,"amount":1,"unit":"oz"},{"ingredientId":402,"id":1796,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1797,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1798,"amount":1,"unit":"oz"},{"ingredientId":464,"id":1799,"amount":1,"unit":"oz"},{"ingredientId":104,"id":1800,"amount":1,"unit":"oz"},{"ingredientId":133,"id":1801,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1802,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1803,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1804,"amount":1,"unit":"oz"},{"ingredientId":469,"id":1805,"amount":1,"unit":"oz"},{"ingredientId":433,"id":1806,"amount":1,"unit":"oz"},{"ingredientId":402,"id":1807,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1808,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1809,"amount":1,"unit":"oz"},{"ingredientId":451,"id":1810,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1811,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1812,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1813,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1814,"amount":1,"unit":"oz"},{"ingredientId":449,"id":1815,"amount":1,"unit":"oz"},{"ingredientId":337,"id":1816,"amount":1,"unit":"oz"},{"ingredientId":272,"id":1817,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1818,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1819,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1820,"amount":1,"unit":"oz"},{"ingredientId":254,"id":1821,"amount":1,"unit":"oz"},{"ingredientId":3,"id":1822,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1823,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1824,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1825,"amount":1,"unit":"oz"},{"ingredientId":249,"id":1826,"amount":1,"unit":"oz"},{"ingredientId":542,"id":1827,"amount":1,"unit":"oz"},{"ingredientId":225,"id":1828,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1829,"amount":1,"unit":"oz"},{"ingredientId":598,"id":1830,"amount":1,"unit":"oz"},{"ingredientId":562,"id":1831,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1832,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1833,"amount":1,"unit":"oz"},{"ingredientId":253,"id":1834,"amount":1,"unit":"oz"},{"ingredientId":277,"id":1835,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1836,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1837,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1838,"amount":1,"unit":"oz"},{"ingredientId":541,"id":1839,"amount":1,"unit":"oz"},{"ingredientId":308,"id":1840,"amount":1,"unit":"oz"},{"ingredientId":171,"id":1841,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1842,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1843,"amount":1,"unit":"oz"},{"ingredientId":490,"id":1844,"amount":1,"unit":"oz"},{"ingredientId":435,"id":1845,"amount":1,"unit":"oz"},{"ingredientId":429,"id":1846,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1847,"amount":1,"unit":"oz"},{"ingredientId":236,"id":1848,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1849,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1850,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1851,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1852,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1853,"amount":1,"unit":"oz"},{"ingredientId":66,"id":1854,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1855,"amount":1,"unit":"oz"},{"ingredientId":185,"id":1856,"amount":1,"unit":"oz"},{"ingredientId":281,"id":1857,"amount":1,"unit":"oz"},{"ingredientId":598,"id":1858,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1859,"amount":1,"unit":"oz"},{"ingredientId":562,"id":1860,"amount":1,"unit":"oz"},{"ingredientId":508,"id":1861,"amount":1,"unit":"oz"},{"ingredientId":616,"id":1862,"amount":1,"unit":"oz"},{"ingredientId":105,"id":1863,"amount":1,"unit":"oz"},{"ingredientId":81,"id":1864,"amount":1,"unit":"oz"},{"ingredientId":159,"id":1865,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1866,"amount":1,"unit":"oz"},{"ingredientId":217,"id":1867,"amount":1,"unit":"oz"},{"ingredientId":318,"id":1868,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1869,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1870,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1871,"amount":1,"unit":"oz"},{"ingredientId":525,"id":1872,"amount":1,"unit":"oz"},{"ingredientId":192,"id":1873,"amount":1,"unit":"oz"},{"ingredientId":99,"id":1874,"amount":1,"unit":"oz"},{"ingredientId":275,"id":1875,"amount":1,"unit":"oz"},{"ingredientId":424,"id":1876,"amount":1,"unit":"oz"},{"ingredientId":98,"id":1877,"amount":1,"unit":"oz"},{"ingredientId":4,"id":1878,"amount":1,"unit":"oz"},{"ingredientId":414,"id":1879,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1880,"amount":1,"unit":"oz"},{"ingredientId":416,"id":1881,"amount":1,"unit":"oz"},{"ingredientId":54,"id":1882,"amount":1,"unit":"oz"},{"ingredientId":575,"id":1883,"amount":1,"unit":"oz"},{"ingredientId":504,"id":1884,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1885,"amount":1,"unit":"oz"},{"ingredientId":413,"id":1886,"amount":1,"unit":"oz"},{"ingredientId":60,"id":1887,"amount":1,"unit":"oz"},{"ingredientId":552,"id":1888,"amount":1,"unit":"oz"},{"ingredientId":283,"id":1889,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1890,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1891,"amount":1,"unit":"oz"},{"ingredientId":233,"id":1892,"amount":1,"unit":"oz"},{"ingredientId":132,"id":1893,"amount":1,"unit":"oz"},{"ingredientId":393,"id":1894,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1895,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1896,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1897,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1898,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1899,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1900,"amount":1,"unit":"oz"},{"ingredientId":230,"id":1901,"amount":1,"unit":"oz"},{"ingredientId":397,"id":1902,"amount":1,"unit":"oz"},{"ingredientId":393,"id":1903,"amount":1,"unit":"oz"},{"ingredientId":575,"id":1904,"amount":1,"unit":"oz"},{"ingredientId":154,"id":1905,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1906,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1907,"amount":1,"unit":"oz"},{"ingredientId":34,"id":1908,"amount":1,"unit":"oz"},{"ingredientId":576,"id":1909,"amount":1,"unit":"oz"},{"ingredientId":223,"id":1910,"amount":1,"unit":"oz"},{"ingredientId":219,"id":1911,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1912,"amount":1,"unit":"oz"},{"ingredientId":103,"id":1913,"amount":1,"unit":"oz"},{"ingredientId":255,"id":1914,"amount":1,"unit":"oz"},{"ingredientId":58,"id":1915,"amount":1,"unit":"oz"},{"ingredientId":393,"id":1916,"amount":1,"unit":"oz"},{"ingredientId":616,"id":1917,"amount":1,"unit":"oz"},{"ingredientId":287,"id":1918,"amount":1,"unit":"oz"},{"ingredientId":24,"id":1919,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1920,"amount":1,"unit":"oz"},{"ingredientId":348,"id":1921,"amount":1,"unit":"oz"},{"ingredientId":46,"id":1922,"amount":1,"unit":"oz"},{"ingredientId":354,"id":1923,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1924,"amount":1,"unit":"oz"},{"ingredientId":46,"id":1925,"amount":1,"unit":"oz"},{"ingredientId":354,"id":1926,"amount":1,"unit":"oz"},{"ingredientId":38,"id":1927,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1928,"amount":1,"unit":"oz"},{"ingredientId":156,"id":1929,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1930,"amount":1,"unit":"oz"},{"ingredientId":525,"id":1931,"amount":1,"unit":"oz"},{"ingredientId":572,"id":1932,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1933,"amount":1,"unit":"oz"},{"ingredientId":372,"id":1934,"amount":1,"unit":"oz"},{"ingredientId":92,"id":1935,"amount":1,"unit":"oz"},{"ingredientId":402,"id":1936,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1937,"amount":1,"unit":"oz"},{"ingredientId":80,"id":1938,"amount":1,"unit":"oz"},{"ingredientId":571,"id":1939,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1940,"amount":1,"unit":"oz"},{"ingredientId":253,"id":1941,"amount":1,"unit":"oz"},{"ingredientId":104,"id":1942,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1943,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1944,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1945,"amount":1,"unit":"oz"},{"ingredientId":141,"id":1946,"amount":1,"unit":"oz"},{"ingredientId":243,"id":1947,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1948,"amount":1,"unit":"oz"},{"ingredientId":136,"id":1949,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1950,"amount":1,"unit":"oz"},{"ingredientId":337,"id":1951,"amount":1,"unit":"oz"},{"ingredientId":148,"id":1952,"amount":1,"unit":"oz"},{"ingredientId":242,"id":1953,"amount":1,"unit":"oz"},{"ingredientId":288,"id":1954,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1955,"amount":1,"unit":"oz"},{"ingredientId":302,"id":1956,"amount":1,"unit":"oz"},{"ingredientId":281,"id":1957,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1958,"amount":1,"unit":"oz"},{"ingredientId":572,"id":1959,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1960,"amount":1,"unit":"oz"},{"ingredientId":340,"id":1961,"amount":1,"unit":"oz"},{"ingredientId":25,"id":1962,"amount":1,"unit":"oz"},{"ingredientId":61,"id":1963,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1964,"amount":1,"unit":"oz"},{"ingredientId":82,"id":1965,"amount":1,"unit":"oz"},{"ingredientId":63,"id":1966,"amount":1,"unit":"oz"},{"ingredientId":571,"id":1967,"amount":1,"unit":"oz"},{"ingredientId":230,"id":1968,"amount":1,"unit":"oz"},{"ingredientId":379,"id":1969,"amount":1,"unit":"oz"},{"ingredientId":525,"id":1970,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1971,"amount":1,"unit":"oz"},{"ingredientId":12,"id":1972,"amount":1,"unit":"oz"},{"ingredientId":354,"id":1973,"amount":1,"unit":"oz"},{"ingredientId":616,"id":1974,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1975,"amount":1,"unit":"oz"},{"ingredientId":557,"id":1976,"amount":1,"unit":"oz"},{"ingredientId":57,"id":1977,"amount":1,"unit":"oz"},{"ingredientId":261,"id":1978,"amount":1,"unit":"oz"},{"ingredientId":73,"id":1979,"amount":1,"unit":"oz"},{"ingredientId":243,"id":1980,"amount":1,"unit":"oz"},{"ingredientId":391,"id":1981,"amount":1,"unit":"oz"},{"ingredientId":432,"id":1982,"amount":1,"unit":"oz"},{"ingredientId":531,"id":1983,"amount":1,"unit":"oz"},{"ingredientId":281,"id":1984,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1985,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1986,"amount":1,"unit":"oz"},{"ingredientId":571,"id":1987,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1988,"amount":1,"unit":"oz"},{"ingredientId":372,"id":1989,"amount":1,"unit":"oz"},{"ingredientId":234,"id":1990,"amount":1,"unit":"oz"},{"ingredientId":1,"id":1991,"amount":1,"unit":"oz"},{"ingredientId":242,"id":1992,"amount":1,"unit":"oz"},{"ingredientId":386,"id":1993,"amount":1,"unit":"oz"},{"ingredientId":459,"id":1994,"amount":1,"unit":"oz"},{"ingredientId":79,"id":1995,"amount":1,"unit":"oz"},{"ingredientId":422,"id":1996,"amount":1,"unit":"oz"},{"ingredientId":571,"id":1997,"amount":1,"unit":"oz"},{"ingredientId":188,"id":1998,"amount":1,"unit":"oz"},{"ingredientId":64,"id":1999,"amount":1,"unit":"oz"},{"ingredientId":344,"id":2000,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2001,"amount":1,"unit":"oz"},{"ingredientId":183,"id":2002,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2003,"amount":1,"unit":"oz"},{"ingredientId":482,"id":2004,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2005,"amount":1,"unit":"oz"},{"ingredientId":372,"id":2006,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2007,"amount":1,"unit":"oz"},{"ingredientId":459,"id":2008,"amount":1,"unit":"oz"},{"ingredientId":159,"id":2009,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2010,"amount":1,"unit":"oz"},{"ingredientId":110,"id":2011,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2012,"amount":1,"unit":"oz"},{"ingredientId":424,"id":2013,"amount":1,"unit":"oz"},{"ingredientId":402,"id":2014,"amount":1,"unit":"oz"},{"ingredientId":3,"id":2015,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2016,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2017,"amount":1,"unit":"oz"},{"ingredientId":495,"id":2018,"amount":1,"unit":"oz"},{"ingredientId":344,"id":2019,"amount":1,"unit":"oz"},{"ingredientId":63,"id":2020,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2021,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2022,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2023,"amount":1,"unit":"oz"},{"ingredientId":81,"id":2024,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2025,"amount":1,"unit":"oz"},{"ingredientId":184,"id":2026,"amount":1,"unit":"oz"},{"ingredientId":572,"id":2027,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2028,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2029,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2030,"amount":1,"unit":"oz"},{"ingredientId":459,"id":2031,"amount":1,"unit":"oz"},{"ingredientId":74,"id":2032,"amount":1,"unit":"oz"},{"ingredientId":346,"id":2033,"amount":1,"unit":"oz"},{"ingredientId":159,"id":2034,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2035,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2036,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2037,"amount":1,"unit":"oz"},{"ingredientId":344,"id":2038,"amount":1,"unit":"oz"},{"ingredientId":288,"id":2039,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2040,"amount":1,"unit":"oz"},{"ingredientId":159,"id":2041,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2042,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2043,"amount":1,"unit":"oz"},{"ingredientId":217,"id":2044,"amount":1,"unit":"oz"},{"ingredientId":313,"id":2045,"amount":1,"unit":"oz"},{"ingredientId":25,"id":2046,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2047,"amount":1,"unit":"oz"},{"ingredientId":459,"id":2048,"amount":1,"unit":"oz"},{"ingredientId":414,"id":2049,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2050,"amount":1,"unit":"oz"},{"ingredientId":440,"id":2051,"amount":1,"unit":"oz"},{"ingredientId":462,"id":2052,"amount":1,"unit":"oz"},{"ingredientId":63,"id":2053,"amount":1,"unit":"oz"},{"ingredientId":418,"id":2054,"amount":1,"unit":"oz"},{"ingredientId":288,"id":2055,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2056,"amount":1,"unit":"oz"},{"ingredientId":93,"id":2057,"amount":1,"unit":"oz"},{"ingredientId":266,"id":2058,"amount":1,"unit":"oz"},{"ingredientId":1,"id":2059,"amount":1,"unit":"oz"},{"ingredientId":92,"id":2060,"amount":1,"unit":"oz"},{"ingredientId":73,"id":2061,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2062,"amount":1,"unit":"oz"},{"ingredientId":459,"id":2063,"amount":1,"unit":"oz"},{"ingredientId":288,"id":2064,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2065,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2066,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2067,"amount":1,"unit":"oz"},{"ingredientId":422,"id":2068,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2069,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2070,"amount":1,"unit":"oz"},{"ingredientId":326,"id":2071,"amount":1,"unit":"oz"},{"ingredientId":402,"id":2072,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2073,"amount":1,"unit":"oz"},{"ingredientId":565,"id":2074,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2075,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2076,"amount":1,"unit":"oz"},{"ingredientId":357,"id":2077,"amount":1,"unit":"oz"},{"ingredientId":344,"id":2078,"amount":1,"unit":"oz"},{"ingredientId":399,"id":2079,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2080,"amount":1,"unit":"oz"},{"ingredientId":448,"id":2081,"amount":1,"unit":"oz"},{"ingredientId":482,"id":2082,"amount":1,"unit":"oz"},{"ingredientId":570,"id":2083,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2084,"amount":1,"unit":"oz"},{"ingredientId":511,"id":2085,"amount":1,"unit":"oz"},{"ingredientId":76,"id":2086,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2087,"amount":1,"unit":"oz"},{"ingredientId":288,"id":2088,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2089,"amount":1,"unit":"oz"},{"ingredientId":159,"id":2090,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2091,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2092,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2093,"amount":1,"unit":"oz"},{"ingredientId":342,"id":2094,"amount":1,"unit":"oz"},{"ingredientId":35,"id":2095,"amount":1,"unit":"oz"},{"ingredientId":435,"id":2096,"amount":1,"unit":"oz"},{"ingredientId":159,"id":2097,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2098,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2099,"amount":1,"unit":"oz"},{"ingredientId":325,"id":2100,"amount":1,"unit":"oz"},{"ingredientId":459,"id":2101,"amount":1,"unit":"oz"},{"ingredientId":288,"id":2102,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2103,"amount":1,"unit":"oz"},{"ingredientId":159,"id":2104,"amount":1,"unit":"oz"},{"ingredientId":255,"id":2105,"amount":1,"unit":"oz"},{"ingredientId":31,"id":2106,"amount":1,"unit":"oz"},{"ingredientId":224,"id":2107,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2108,"amount":1,"unit":"oz"},{"ingredientId":142,"id":2109,"amount":1,"unit":"oz"},{"ingredientId":553,"id":2110,"amount":1,"unit":"oz"},{"ingredientId":224,"id":2111,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2112,"amount":1,"unit":"oz"},{"ingredientId":373,"id":2113,"amount":1,"unit":"oz"},{"ingredientId":81,"id":2114,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2115,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2116,"amount":1,"unit":"oz"},{"ingredientId":139,"id":2117,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2118,"amount":1,"unit":"oz"},{"ingredientId":234,"id":2119,"amount":1,"unit":"oz"},{"ingredientId":511,"id":2120,"amount":1,"unit":"oz"},{"ingredientId":400,"id":2121,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2122,"amount":1,"unit":"oz"},{"ingredientId":201,"id":2123,"amount":1,"unit":"oz"},{"ingredientId":64,"id":2124,"amount":1,"unit":"oz"},{"ingredientId":224,"id":2125,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2126,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2127,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2128,"amount":1,"unit":"oz"},{"ingredientId":276,"id":2129,"amount":1,"unit":"oz"},{"ingredientId":373,"id":2130,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2131,"amount":1,"unit":"oz"},{"ingredientId":598,"id":2132,"amount":1,"unit":"oz"},{"ingredientId":80,"id":2133,"amount":1,"unit":"oz"},{"ingredientId":369,"id":2134,"amount":1,"unit":"oz"},{"ingredientId":64,"id":2135,"amount":1,"unit":"oz"},{"ingredientId":400,"id":2136,"amount":1,"unit":"oz"},{"ingredientId":63,"id":2137,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2138,"amount":1,"unit":"oz"},{"ingredientId":490,"id":2139,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2140,"amount":1,"unit":"oz"},{"ingredientId":406,"id":2141,"amount":1,"unit":"oz"},{"ingredientId":183,"id":2142,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2143,"amount":1,"unit":"oz"},{"ingredientId":261,"id":2144,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2145,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2146,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2147,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2148,"amount":1,"unit":"oz"},{"ingredientId":372,"id":2149,"amount":1,"unit":"oz"},{"ingredientId":433,"id":2150,"amount":1,"unit":"oz"},{"ingredientId":402,"id":2151,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2152,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2153,"amount":1,"unit":"oz"},{"ingredientId":294,"id":2154,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2155,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2156,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2157,"amount":1,"unit":"oz"},{"ingredientId":555,"id":2158,"amount":1,"unit":"oz"},{"ingredientId":611,"id":2159,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2160,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2161,"amount":1,"unit":"oz"},{"ingredientId":81,"id":2162,"amount":1,"unit":"oz"},{"ingredientId":184,"id":2163,"amount":1,"unit":"oz"},{"ingredientId":205,"id":2164,"amount":1,"unit":"oz"},{"ingredientId":338,"id":2165,"amount":1,"unit":"oz"},{"ingredientId":509,"id":2166,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2167,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2168,"amount":1,"unit":"oz"},{"ingredientId":213,"id":2169,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2170,"amount":1,"unit":"oz"},{"ingredientId":557,"id":2171,"amount":1,"unit":"oz"},{"ingredientId":173,"id":2172,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2173,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2174,"amount":1,"unit":"oz"},{"ingredientId":213,"id":2175,"amount":1,"unit":"oz"},{"ingredientId":414,"id":2176,"amount":1,"unit":"oz"},{"ingredientId":167,"id":2177,"amount":1,"unit":"oz"},{"ingredientId":394,"id":2178,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2179,"amount":1,"unit":"oz"},{"ingredientId":440,"id":2180,"amount":1,"unit":"oz"},{"ingredientId":617,"id":2181,"amount":1,"unit":"oz"},{"ingredientId":611,"id":2182,"amount":1,"unit":"oz"},{"ingredientId":64,"id":2183,"amount":1,"unit":"oz"},{"ingredientId":611,"id":2184,"amount":1,"unit":"oz"},{"ingredientId":400,"id":2185,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2186,"amount":1,"unit":"oz"},{"ingredientId":213,"id":2187,"amount":1,"unit":"oz"},{"ingredientId":422,"id":2188,"amount":1,"unit":"oz"},{"ingredientId":338,"id":2189,"amount":1,"unit":"oz"},{"ingredientId":217,"id":2190,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2191,"amount":1,"unit":"oz"},{"ingredientId":213,"id":2192,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2193,"amount":1,"unit":"oz"},{"ingredientId":184,"id":2194,"amount":1,"unit":"oz"},{"ingredientId":372,"id":2195,"amount":1,"unit":"oz"},{"ingredientId":234,"id":2196,"amount":1,"unit":"oz"},{"ingredientId":509,"id":2197,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2198,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2199,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2200,"amount":1,"unit":"oz"},{"ingredientId":555,"id":2201,"amount":1,"unit":"oz"},{"ingredientId":1,"id":2202,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2203,"amount":1,"unit":"oz"},{"ingredientId":400,"id":2204,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2205,"amount":1,"unit":"oz"},{"ingredientId":477,"id":2206,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2207,"amount":1,"unit":"oz"},{"ingredientId":12,"id":2208,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2209,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2210,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2211,"amount":1,"unit":"oz"},{"ingredientId":313,"id":2212,"amount":1,"unit":"oz"},{"ingredientId":219,"id":2213,"amount":1,"unit":"oz"},{"ingredientId":56,"id":2214,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2215,"amount":1,"unit":"oz"},{"ingredientId":248,"id":2216,"amount":1,"unit":"oz"},{"ingredientId":616,"id":2217,"amount":1,"unit":"oz"},{"ingredientId":225,"id":2218,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2219,"amount":1,"unit":"oz"},{"ingredientId":598,"id":2220,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2221,"amount":1,"unit":"oz"},{"ingredientId":18,"id":2222,"amount":1,"unit":"oz"},{"ingredientId":46,"id":2223,"amount":1,"unit":"oz"},{"ingredientId":267,"id":2224,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2225,"amount":1,"unit":"oz"},{"ingredientId":281,"id":2226,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2227,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2228,"amount":1,"unit":"oz"},{"ingredientId":494,"id":2229,"amount":1,"unit":"oz"},{"ingredientId":409,"id":2230,"amount":1,"unit":"oz"},{"ingredientId":578,"id":2231,"amount":1,"unit":"oz"},{"ingredientId":288,"id":2232,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2233,"amount":1,"unit":"oz"},{"ingredientId":185,"id":2234,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2235,"amount":1,"unit":"oz"},{"ingredientId":183,"id":2236,"amount":1,"unit":"oz"},{"ingredientId":373,"id":2237,"amount":1,"unit":"oz"},{"ingredientId":132,"id":2238,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2239,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2240,"amount":1,"unit":"oz"},{"ingredientId":598,"id":2241,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2242,"amount":1,"unit":"oz"},{"ingredientId":52,"id":2243,"amount":1,"unit":"oz"},{"ingredientId":46,"id":2244,"amount":1,"unit":"oz"},{"ingredientId":267,"id":2245,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2246,"amount":1,"unit":"oz"},{"ingredientId":281,"id":2247,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2248,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2249,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2250,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2251,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2252,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2253,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2254,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2255,"amount":1,"unit":"oz"},{"ingredientId":115,"id":2256,"amount":1,"unit":"oz"},{"ingredientId":409,"id":2257,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2258,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2259,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2260,"amount":1,"unit":"oz"},{"ingredientId":368,"id":2261,"amount":1,"unit":"oz"},{"ingredientId":4,"id":2262,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2263,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2264,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2265,"amount":1,"unit":"oz"},{"ingredientId":425,"id":2266,"amount":1,"unit":"oz"},{"ingredientId":46,"id":2267,"amount":1,"unit":"oz"},{"ingredientId":267,"id":2268,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2269,"amount":1,"unit":"oz"},{"ingredientId":281,"id":2270,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2271,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2272,"amount":1,"unit":"oz"},{"ingredientId":150,"id":2273,"amount":1,"unit":"oz"},{"ingredientId":587,"id":2274,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2275,"amount":1,"unit":"oz"},{"ingredientId":598,"id":2276,"amount":1,"unit":"oz"},{"ingredientId":81,"id":2277,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2278,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2279,"amount":1,"unit":"oz"},{"ingredientId":338,"id":2280,"amount":1,"unit":"oz"},{"ingredientId":489,"id":2281,"amount":1,"unit":"oz"},{"ingredientId":433,"id":2282,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2283,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2284,"amount":1,"unit":"oz"},{"ingredientId":414,"id":2285,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2286,"amount":1,"unit":"oz"},{"ingredientId":205,"id":2287,"amount":1,"unit":"oz"},{"ingredientId":435,"id":2288,"amount":1,"unit":"oz"},{"ingredientId":216,"id":2289,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2290,"amount":1,"unit":"oz"},{"ingredientId":400,"id":2291,"amount":1,"unit":"oz"},{"ingredientId":185,"id":2292,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2293,"amount":1,"unit":"oz"},{"ingredientId":64,"id":2294,"amount":1,"unit":"oz"},{"ingredientId":344,"id":2295,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2296,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2297,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2298,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2299,"amount":1,"unit":"oz"},{"ingredientId":167,"id":2300,"amount":1,"unit":"oz"},{"ingredientId":64,"id":2301,"amount":1,"unit":"oz"},{"ingredientId":576,"id":2302,"amount":1,"unit":"oz"},{"ingredientId":616,"id":2303,"amount":1,"unit":"oz"},{"ingredientId":98,"id":2304,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2305,"amount":1,"unit":"oz"},{"ingredientId":64,"id":2306,"amount":1,"unit":"oz"},{"ingredientId":543,"id":2307,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2308,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2309,"amount":1,"unit":"oz"},{"ingredientId":110,"id":2310,"amount":1,"unit":"oz"},{"ingredientId":402,"id":2311,"amount":1,"unit":"oz"},{"ingredientId":490,"id":2312,"amount":1,"unit":"oz"},{"ingredientId":576,"id":2313,"amount":1,"unit":"oz"},{"ingredientId":38,"id":2314,"amount":1,"unit":"oz"},{"ingredientId":167,"id":2315,"amount":1,"unit":"oz"},{"ingredientId":115,"id":2316,"amount":1,"unit":"oz"},{"ingredientId":159,"id":2317,"amount":1,"unit":"oz"},{"ingredientId":261,"id":2318,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2319,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2320,"amount":1,"unit":"oz"},{"ingredientId":75,"id":2321,"amount":1,"unit":"oz"},{"ingredientId":54,"id":2322,"amount":1,"unit":"oz"},{"ingredientId":433,"id":2323,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2324,"amount":1,"unit":"oz"},{"ingredientId":302,"id":2325,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2326,"amount":1,"unit":"oz"},{"ingredientId":74,"id":2327,"amount":1,"unit":"oz"},{"ingredientId":250,"id":2328,"amount":1,"unit":"oz"},{"ingredientId":113,"id":2329,"amount":1,"unit":"oz"},{"ingredientId":430,"id":2330,"amount":1,"unit":"oz"},{"ingredientId":74,"id":2331,"amount":1,"unit":"oz"},{"ingredientId":117,"id":2332,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2333,"amount":1,"unit":"oz"},{"ingredientId":612,"id":2334,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2335,"amount":1,"unit":"oz"},{"ingredientId":157,"id":2336,"amount":1,"unit":"oz"},{"ingredientId":429,"id":2337,"amount":1,"unit":"oz"},{"ingredientId":230,"id":2338,"amount":1,"unit":"oz"},{"ingredientId":74,"id":2339,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2340,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2341,"amount":1,"unit":"oz"},{"ingredientId":294,"id":2342,"amount":1,"unit":"oz"},{"ingredientId":157,"id":2343,"amount":1,"unit":"oz"},{"ingredientId":4,"id":2344,"amount":1,"unit":"oz"},{"ingredientId":274,"id":2345,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2346,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2347,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2348,"amount":1,"unit":"oz"},{"ingredientId":128,"id":2349,"amount":1,"unit":"oz"},{"ingredientId":30,"id":2350,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2351,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2352,"amount":1,"unit":"oz"},{"ingredientId":368,"id":2353,"amount":1,"unit":"oz"},{"ingredientId":359,"id":2354,"amount":1,"unit":"oz"},{"ingredientId":261,"id":2355,"amount":1,"unit":"oz"},{"ingredientId":429,"id":2356,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2357,"amount":1,"unit":"oz"},{"ingredientId":4,"id":2358,"amount":1,"unit":"oz"},{"ingredientId":18,"id":2359,"amount":1,"unit":"oz"},{"ingredientId":198,"id":2360,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2361,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2362,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2363,"amount":1,"unit":"oz"},{"ingredientId":368,"id":2364,"amount":1,"unit":"oz"},{"ingredientId":512,"id":2365,"amount":1,"unit":"oz"},{"ingredientId":365,"id":2366,"amount":1,"unit":"oz"},{"ingredientId":4,"id":2367,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2368,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2369,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2370,"amount":1,"unit":"oz"},{"ingredientId":75,"id":2371,"amount":1,"unit":"oz"},{"ingredientId":490,"id":2372,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2373,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2374,"amount":1,"unit":"oz"},{"ingredientId":80,"id":2375,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2376,"amount":1,"unit":"oz"},{"ingredientId":142,"id":2377,"amount":1,"unit":"oz"},{"ingredientId":55,"id":2378,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2379,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2380,"amount":1,"unit":"oz"},{"ingredientId":288,"id":2381,"amount":1,"unit":"oz"},{"ingredientId":4,"id":2382,"amount":1,"unit":"oz"},{"ingredientId":205,"id":2383,"amount":1,"unit":"oz"},{"ingredientId":255,"id":2384,"amount":1,"unit":"oz"},{"ingredientId":508,"id":2385,"amount":1,"unit":"oz"},{"ingredientId":451,"id":2386,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2387,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2388,"amount":1,"unit":"oz"},{"ingredientId":4,"id":2389,"amount":1,"unit":"oz"},{"ingredientId":546,"id":2390,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2391,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2392,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2393,"amount":1,"unit":"oz"},{"ingredientId":414,"id":2394,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2395,"amount":1,"unit":"oz"},{"ingredientId":552,"id":2396,"amount":1,"unit":"oz"},{"ingredientId":451,"id":2397,"amount":1,"unit":"oz"},{"ingredientId":4,"id":2398,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2399,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2400,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2401,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2402,"amount":1,"unit":"oz"},{"ingredientId":250,"id":2403,"amount":1,"unit":"oz"},{"ingredientId":581,"id":2404,"amount":1,"unit":"oz"},{"ingredientId":105,"id":2405,"amount":1,"unit":"oz"},{"ingredientId":587,"id":2406,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2407,"amount":1,"unit":"oz"},{"ingredientId":252,"id":2408,"amount":1,"unit":"oz"},{"ingredientId":542,"id":2409,"amount":1,"unit":"oz"},{"ingredientId":104,"id":2410,"amount":1,"unit":"oz"},{"ingredientId":437,"id":2411,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2412,"amount":1,"unit":"oz"},{"ingredientId":482,"id":2413,"amount":1,"unit":"oz"},{"ingredientId":250,"id":2414,"amount":1,"unit":"oz"},{"ingredientId":542,"id":2415,"amount":1,"unit":"oz"},{"ingredientId":105,"id":2416,"amount":1,"unit":"oz"},{"ingredientId":373,"id":2417,"amount":1,"unit":"oz"},{"ingredientId":576,"id":2418,"amount":1,"unit":"oz"},{"ingredientId":105,"id":2419,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2420,"amount":1,"unit":"oz"},{"ingredientId":405,"id":2421,"amount":1,"unit":"oz"},{"ingredientId":318,"id":2422,"amount":1,"unit":"oz"},{"ingredientId":579,"id":2423,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2424,"amount":1,"unit":"oz"},{"ingredientId":490,"id":2425,"amount":1,"unit":"oz"},{"ingredientId":105,"id":2426,"amount":1,"unit":"oz"},{"ingredientId":435,"id":2427,"amount":1,"unit":"oz"},{"ingredientId":581,"id":2428,"amount":1,"unit":"oz"},{"ingredientId":493,"id":2429,"amount":1,"unit":"oz"},{"ingredientId":346,"id":2430,"amount":1,"unit":"oz"},{"ingredientId":105,"id":2431,"amount":1,"unit":"oz"},{"ingredientId":38,"id":2432,"amount":1,"unit":"oz"},{"ingredientId":414,"id":2433,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2434,"amount":1,"unit":"oz"},{"ingredientId":64,"id":2435,"amount":1,"unit":"oz"},{"ingredientId":106,"id":2436,"amount":1,"unit":"oz"},{"ingredientId":448,"id":2437,"amount":1,"unit":"oz"},{"ingredientId":393,"id":2438,"amount":1,"unit":"oz"},{"ingredientId":113,"id":2439,"amount":1,"unit":"oz"},{"ingredientId":575,"id":2440,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2441,"amount":1,"unit":"oz"},{"ingredientId":372,"id":2442,"amount":1,"unit":"oz"},{"ingredientId":559,"id":2443,"amount":1,"unit":"oz"},{"ingredientId":12,"id":2444,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2445,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2446,"amount":1,"unit":"oz"},{"ingredientId":92,"id":2447,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2448,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2449,"amount":1,"unit":"oz"},{"ingredientId":474,"id":2450,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2451,"amount":1,"unit":"oz"},{"ingredientId":263,"id":2452,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2453,"amount":1,"unit":"oz"},{"ingredientId":459,"id":2454,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2455,"amount":1,"unit":"oz"},{"ingredientId":185,"id":2456,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2457,"amount":1,"unit":"oz"},{"ingredientId":234,"id":2458,"amount":1,"unit":"oz"},{"ingredientId":105,"id":2459,"amount":1,"unit":"oz"},{"ingredientId":4,"id":2460,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2461,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2462,"amount":1,"unit":"oz"},{"ingredientId":20,"id":2463,"amount":1,"unit":"oz"},{"ingredientId":205,"id":2464,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2465,"amount":1,"unit":"oz"},{"ingredientId":185,"id":2466,"amount":1,"unit":"oz"},{"ingredientId":556,"id":2467,"amount":1,"unit":"oz"},{"ingredientId":238,"id":2468,"amount":1,"unit":"oz"},{"ingredientId":127,"id":2469,"amount":1,"unit":"oz"},{"ingredientId":113,"id":2470,"amount":1,"unit":"oz"},{"ingredientId":289,"id":2471,"amount":1,"unit":"oz"},{"ingredientId":172,"id":2472,"amount":1,"unit":"oz"},{"ingredientId":402,"id":2473,"amount":1,"unit":"oz"},{"ingredientId":7,"id":2474,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2475,"amount":1,"unit":"oz"},{"ingredientId":12,"id":2476,"amount":1,"unit":"oz"},{"ingredientId":92,"id":2477,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2478,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2479,"amount":1,"unit":"oz"},{"ingredientId":332,"id":2480,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2481,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2482,"amount":1,"unit":"oz"},{"ingredientId":92,"id":2483,"amount":1,"unit":"oz"},{"ingredientId":560,"id":2484,"amount":1,"unit":"oz"},{"ingredientId":389,"id":2485,"amount":1,"unit":"oz"},{"ingredientId":232,"id":2486,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2487,"amount":1,"unit":"oz"},{"ingredientId":20,"id":2488,"amount":1,"unit":"oz"},{"ingredientId":409,"id":2489,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2490,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2491,"amount":1,"unit":"oz"},{"ingredientId":482,"id":2492,"amount":1,"unit":"oz"},{"ingredientId":20,"id":2493,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2494,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2495,"amount":1,"unit":"oz"},{"ingredientId":474,"id":2496,"amount":1,"unit":"oz"},{"ingredientId":560,"id":2497,"amount":1,"unit":"oz"},{"ingredientId":372,"id":2498,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2499,"amount":1,"unit":"oz"},{"ingredientId":185,"id":2500,"amount":1,"unit":"oz"},{"ingredientId":440,"id":2501,"amount":1,"unit":"oz"},{"ingredientId":281,"id":2502,"amount":1,"unit":"oz"},{"ingredientId":232,"id":2503,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2504,"amount":1,"unit":"oz"},{"ingredientId":155,"id":2505,"amount":1,"unit":"oz"},{"ingredientId":75,"id":2506,"amount":1,"unit":"oz"},{"ingredientId":560,"id":2507,"amount":1,"unit":"oz"},{"ingredientId":459,"id":2508,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2509,"amount":1,"unit":"oz"},{"ingredientId":281,"id":2510,"amount":1,"unit":"oz"},{"ingredientId":560,"id":2511,"amount":1,"unit":"oz"},{"ingredientId":25,"id":2512,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2513,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2514,"amount":1,"unit":"oz"},{"ingredientId":557,"id":2515,"amount":1,"unit":"oz"},{"ingredientId":64,"id":2516,"amount":1,"unit":"oz"},{"ingredientId":616,"id":2517,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2518,"amount":1,"unit":"oz"},{"ingredientId":401,"id":2519,"amount":1,"unit":"oz"},{"ingredientId":559,"id":2520,"amount":1,"unit":"oz"},{"ingredientId":99,"id":2521,"amount":1,"unit":"oz"},{"ingredientId":4,"id":2522,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2523,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2524,"amount":1,"unit":"oz"},{"ingredientId":546,"id":2525,"amount":1,"unit":"oz"},{"ingredientId":581,"id":2526,"amount":1,"unit":"oz"},{"ingredientId":30,"id":2527,"amount":1,"unit":"oz"},{"ingredientId":429,"id":2528,"amount":1,"unit":"oz"},{"ingredientId":337,"id":2529,"amount":1,"unit":"oz"},{"ingredientId":255,"id":2530,"amount":1,"unit":"oz"},{"ingredientId":104,"id":2531,"amount":1,"unit":"oz"},{"ingredientId":616,"id":2532,"amount":1,"unit":"oz"},{"ingredientId":560,"id":2533,"amount":1,"unit":"oz"},{"ingredientId":576,"id":2534,"amount":1,"unit":"oz"},{"ingredientId":25,"id":2535,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2536,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2537,"amount":1,"unit":"oz"},{"ingredientId":199,"id":2538,"amount":1,"unit":"oz"},{"ingredientId":578,"id":2539,"amount":1,"unit":"oz"},{"ingredientId":185,"id":2540,"amount":1,"unit":"oz"},{"ingredientId":139,"id":2541,"amount":1,"unit":"oz"},{"ingredientId":512,"id":2542,"amount":1,"unit":"oz"},{"ingredientId":511,"id":2543,"amount":1,"unit":"oz"},{"ingredientId":31,"id":2544,"amount":1,"unit":"oz"},{"ingredientId":255,"id":2545,"amount":1,"unit":"oz"},{"ingredientId":261,"id":2546,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2547,"amount":1,"unit":"oz"},{"ingredientId":490,"id":2548,"amount":1,"unit":"oz"},{"ingredientId":31,"id":2549,"amount":1,"unit":"oz"},{"ingredientId":576,"id":2550,"amount":1,"unit":"oz"},{"ingredientId":261,"id":2551,"amount":1,"unit":"oz"},{"ingredientId":288,"id":2552,"amount":1,"unit":"oz"},{"ingredientId":341,"id":2553,"amount":1,"unit":"oz"},{"ingredientId":395,"id":2554,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2555,"amount":1,"unit":"oz"},{"ingredientId":598,"id":2556,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2557,"amount":1,"unit":"oz"},{"ingredientId":538,"id":2558,"amount":1,"unit":"oz"},{"ingredientId":255,"id":2559,"amount":1,"unit":"oz"},{"ingredientId":46,"id":2560,"amount":1,"unit":"oz"},{"ingredientId":435,"id":2561,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2562,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2563,"amount":1,"unit":"oz"},{"ingredientId":462,"id":2564,"amount":1,"unit":"oz"},{"ingredientId":343,"id":2565,"amount":1,"unit":"oz"},{"ingredientId":173,"id":2566,"amount":1,"unit":"oz"},{"ingredientId":171,"id":2567,"amount":1,"unit":"oz"},{"ingredientId":81,"id":2568,"amount":1,"unit":"oz"},{"ingredientId":429,"id":2569,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2570,"amount":1,"unit":"oz"},{"ingredientId":512,"id":2571,"amount":1,"unit":"oz"},{"ingredientId":406,"id":2572,"amount":1,"unit":"oz"},{"ingredientId":171,"id":2573,"amount":1,"unit":"oz"},{"ingredientId":173,"id":2574,"amount":1,"unit":"oz"},{"ingredientId":185,"id":2575,"amount":1,"unit":"oz"},{"ingredientId":414,"id":2576,"amount":1,"unit":"oz"},{"ingredientId":167,"id":2577,"amount":1,"unit":"oz"},{"ingredientId":512,"id":2578,"amount":1,"unit":"oz"},{"ingredientId":406,"id":2579,"amount":1,"unit":"oz"},{"ingredientId":98,"id":2580,"amount":1,"unit":"oz"},{"ingredientId":255,"id":2581,"amount":1,"unit":"oz"},{"ingredientId":414,"id":2582,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2583,"amount":1,"unit":"oz"},{"ingredientId":266,"id":2584,"amount":1,"unit":"oz"},{"ingredientId":17,"id":2585,"amount":1,"unit":"oz"},{"ingredientId":584,"id":2586,"amount":1,"unit":"oz"},{"ingredientId":216,"id":2587,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2588,"amount":1,"unit":"oz"},{"ingredientId":591,"id":2589,"amount":1,"unit":"oz"},{"ingredientId":86,"id":2590,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2591,"amount":1,"unit":"oz"},{"ingredientId":339,"id":2592,"amount":1,"unit":"oz"},{"ingredientId":406,"id":2593,"amount":1,"unit":"oz"},{"ingredientId":579,"id":2594,"amount":1,"unit":"oz"},{"ingredientId":437,"id":2595,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2596,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2597,"amount":1,"unit":"oz"},{"ingredientId":512,"id":2598,"amount":1,"unit":"oz"},{"ingredientId":139,"id":2599,"amount":1,"unit":"oz"},{"ingredientId":66,"id":2600,"amount":1,"unit":"oz"},{"ingredientId":205,"id":2601,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2602,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2603,"amount":1,"unit":"oz"},{"ingredientId":414,"id":2604,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2605,"amount":1,"unit":"oz"},{"ingredientId":2,"id":2606,"amount":1,"unit":"oz"},{"ingredientId":560,"id":2607,"amount":1,"unit":"oz"},{"ingredientId":233,"id":2608,"amount":1,"unit":"oz"},{"ingredientId":217,"id":2609,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2610,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2611,"amount":1,"unit":"oz"},{"ingredientId":429,"id":2612,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2613,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2614,"amount":1,"unit":"oz"},{"ingredientId":261,"id":2615,"amount":1,"unit":"oz"},{"ingredientId":429,"id":2616,"amount":1,"unit":"oz"},{"ingredientId":288,"id":2617,"amount":1,"unit":"oz"},{"ingredientId":376,"id":2618,"amount":1,"unit":"oz"},{"ingredientId":396,"id":2619,"amount":1,"unit":"oz"},{"ingredientId":227,"id":2620,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2621,"amount":1,"unit":"oz"},{"ingredientId":429,"id":2622,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2623,"amount":1,"unit":"oz"},{"ingredientId":140,"id":2624,"amount":1,"unit":"oz"},{"ingredientId":64,"id":2625,"amount":1,"unit":"oz"},{"ingredientId":185,"id":2626,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2627,"amount":1,"unit":"oz"},{"ingredientId":80,"id":2628,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2629,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2630,"amount":1,"unit":"oz"},{"ingredientId":490,"id":2631,"amount":1,"unit":"oz"},{"ingredientId":409,"id":2632,"amount":1,"unit":"oz"},{"ingredientId":12,"id":2633,"amount":1,"unit":"oz"},{"ingredientId":557,"id":2634,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2635,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2636,"amount":1,"unit":"oz"},{"ingredientId":414,"id":2637,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2638,"amount":1,"unit":"oz"},{"ingredientId":64,"id":2639,"amount":1,"unit":"oz"},{"ingredientId":139,"id":2640,"amount":1,"unit":"oz"},{"ingredientId":368,"id":2641,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2642,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2643,"amount":1,"unit":"oz"},{"ingredientId":490,"id":2644,"amount":1,"unit":"oz"},{"ingredientId":408,"id":2645,"amount":1,"unit":"oz"},{"ingredientId":8,"id":2646,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2647,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2648,"amount":1,"unit":"oz"},{"ingredientId":497,"id":2649,"amount":1,"unit":"oz"},{"ingredientId":560,"id":2650,"amount":1,"unit":"oz"},{"ingredientId":356,"id":2651,"amount":1,"unit":"oz"},{"ingredientId":244,"id":2652,"amount":1,"unit":"oz"},{"ingredientId":400,"id":2653,"amount":1,"unit":"oz"},{"ingredientId":429,"id":2654,"amount":1,"unit":"oz"},{"ingredientId":81,"id":2655,"amount":1,"unit":"oz"},{"ingredientId":237,"id":2656,"amount":1,"unit":"oz"},{"ingredientId":560,"id":2657,"amount":1,"unit":"oz"},{"ingredientId":244,"id":2658,"amount":1,"unit":"oz"},{"ingredientId":568,"id":2659,"amount":1,"unit":"oz"},{"ingredientId":302,"id":2660,"amount":1,"unit":"oz"},{"ingredientId":161,"id":2661,"amount":1,"unit":"oz"},{"ingredientId":104,"id":2662,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2663,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2664,"amount":1,"unit":"oz"},{"ingredientId":161,"id":2665,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2666,"amount":1,"unit":"oz"},{"ingredientId":105,"id":2667,"amount":1,"unit":"oz"},{"ingredientId":426,"id":2668,"amount":1,"unit":"oz"},{"ingredientId":162,"id":2669,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2670,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2671,"amount":1,"unit":"oz"},{"ingredientId":261,"id":2672,"amount":1,"unit":"oz"},{"ingredientId":39,"id":2673,"amount":1,"unit":"oz"},{"ingredientId":102,"id":2674,"amount":1,"unit":"oz"},{"ingredientId":272,"id":2675,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2676,"amount":1,"unit":"oz"},{"ingredientId":512,"id":2677,"amount":1,"unit":"oz"},{"ingredientId":578,"id":2678,"amount":1,"unit":"oz"},{"ingredientId":435,"id":2679,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2680,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2681,"amount":1,"unit":"oz"},{"ingredientId":144,"id":2682,"amount":1,"unit":"oz"},{"ingredientId":578,"id":2683,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2684,"amount":1,"unit":"oz"},{"ingredientId":167,"id":2685,"amount":1,"unit":"oz"},{"ingredientId":249,"id":2686,"amount":1,"unit":"oz"},{"ingredientId":402,"id":2687,"amount":1,"unit":"oz"},{"ingredientId":113,"id":2688,"amount":1,"unit":"oz"},{"ingredientId":6,"id":2689,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2690,"amount":1,"unit":"oz"},{"ingredientId":250,"id":2691,"amount":1,"unit":"oz"},{"ingredientId":578,"id":2692,"amount":1,"unit":"oz"},{"ingredientId":402,"id":2693,"amount":1,"unit":"oz"},{"ingredientId":430,"id":2694,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2695,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2696,"amount":1,"unit":"oz"},{"ingredientId":33,"id":2697,"amount":1,"unit":"oz"},{"ingredientId":581,"id":2698,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2699,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2700,"amount":1,"unit":"oz"},{"ingredientId":105,"id":2701,"amount":1,"unit":"oz"},{"ingredientId":577,"id":2702,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2703,"amount":1,"unit":"oz"},{"ingredientId":105,"id":2704,"amount":1,"unit":"oz"},{"ingredientId":581,"id":2705,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2706,"amount":1,"unit":"oz"},{"ingredientId":438,"id":2707,"amount":1,"unit":"oz"},{"ingredientId":105,"id":2708,"amount":1,"unit":"oz"},{"ingredientId":578,"id":2709,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2710,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2711,"amount":1,"unit":"oz"},{"ingredientId":224,"id":2712,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2713,"amount":1,"unit":"oz"},{"ingredientId":570,"id":2714,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2715,"amount":1,"unit":"oz"},{"ingredientId":446,"id":2716,"amount":1,"unit":"oz"},{"ingredientId":312,"id":2717,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2718,"amount":1,"unit":"oz"},{"ingredientId":6,"id":2719,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2720,"amount":1,"unit":"oz"},{"ingredientId":570,"id":2721,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2722,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2723,"amount":1,"unit":"oz"},{"ingredientId":512,"id":2724,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2725,"amount":1,"unit":"oz"},{"ingredientId":321,"id":2726,"amount":1,"unit":"oz"},{"ingredientId":259,"id":2727,"amount":1,"unit":"oz"},{"ingredientId":433,"id":2728,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2729,"amount":1,"unit":"oz"},{"ingredientId":250,"id":2730,"amount":1,"unit":"oz"},{"ingredientId":255,"id":2731,"amount":1,"unit":"oz"},{"ingredientId":430,"id":2732,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2733,"amount":1,"unit":"oz"},{"ingredientId":604,"id":2734,"amount":1,"unit":"oz"},{"ingredientId":470,"id":2735,"amount":1,"unit":"oz"},{"ingredientId":54,"id":2736,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2737,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2738,"amount":1,"unit":"oz"},{"ingredientId":561,"id":2739,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2740,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2741,"amount":1,"unit":"oz"},{"ingredientId":105,"id":2742,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2743,"amount":1,"unit":"oz"},{"ingredientId":435,"id":2744,"amount":1,"unit":"oz"},{"ingredientId":159,"id":2745,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2746,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2747,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2748,"amount":1,"unit":"oz"},{"ingredientId":608,"id":2749,"amount":1,"unit":"oz"},{"ingredientId":261,"id":2750,"amount":1,"unit":"oz"},{"ingredientId":112,"id":2751,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2752,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2753,"amount":1,"unit":"oz"},{"ingredientId":404,"id":2754,"amount":1,"unit":"oz"},{"ingredientId":433,"id":2755,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2756,"amount":1,"unit":"oz"},{"ingredientId":212,"id":2757,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2758,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2759,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2760,"amount":1,"unit":"oz"},{"ingredientId":402,"id":2761,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2762,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2763,"amount":1,"unit":"oz"},{"ingredientId":167,"id":2764,"amount":1,"unit":"oz"},{"ingredientId":137,"id":2765,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2766,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2767,"amount":1,"unit":"oz"},{"ingredientId":294,"id":2768,"amount":1,"unit":"oz"},{"ingredientId":6,"id":2769,"amount":1,"unit":"oz"},{"ingredientId":152,"id":2770,"amount":1,"unit":"oz"},{"ingredientId":435,"id":2771,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2772,"amount":1,"unit":"oz"},{"ingredientId":294,"id":2773,"amount":1,"unit":"oz"},{"ingredientId":444,"id":2774,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2775,"amount":1,"unit":"oz"},{"ingredientId":422,"id":2776,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2777,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2778,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2779,"amount":1,"unit":"oz"},{"ingredientId":565,"id":2780,"amount":1,"unit":"oz"},{"ingredientId":164,"id":2781,"amount":1,"unit":"oz"},{"ingredientId":253,"id":2782,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2783,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2784,"amount":1,"unit":"oz"},{"ingredientId":162,"id":2785,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2786,"amount":1,"unit":"oz"},{"ingredientId":253,"id":2787,"amount":1,"unit":"oz"},{"ingredientId":296,"id":2788,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2789,"amount":1,"unit":"oz"},{"ingredientId":288,"id":2790,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2791,"amount":1,"unit":"oz"},{"ingredientId":390,"id":2792,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2793,"amount":1,"unit":"oz"},{"ingredientId":271,"id":2794,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2795,"amount":1,"unit":"oz"},{"ingredientId":8,"id":2796,"amount":1,"unit":"oz"},{"ingredientId":291,"id":2797,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2798,"amount":1,"unit":"oz"},{"ingredientId":390,"id":2799,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2800,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2801,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2802,"amount":1,"unit":"oz"},{"ingredientId":276,"id":2803,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2804,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2805,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2806,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2807,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2808,"amount":1,"unit":"oz"},{"ingredientId":147,"id":2809,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2810,"amount":1,"unit":"oz"},{"ingredientId":570,"id":2811,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2812,"amount":1,"unit":"oz"},{"ingredientId":556,"id":2813,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2814,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2815,"amount":1,"unit":"oz"},{"ingredientId":278,"id":2816,"amount":1,"unit":"oz"},{"ingredientId":211,"id":2817,"amount":1,"unit":"oz"},{"ingredientId":570,"id":2818,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2819,"amount":1,"unit":"oz"},{"ingredientId":68,"id":2820,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2821,"amount":1,"unit":"oz"},{"ingredientId":278,"id":2822,"amount":1,"unit":"oz"},{"ingredientId":382,"id":2823,"amount":1,"unit":"oz"},{"ingredientId":570,"id":2824,"amount":1,"unit":"oz"},{"ingredientId":118,"id":2825,"amount":1,"unit":"oz"},{"ingredientId":227,"id":2826,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2827,"amount":1,"unit":"oz"},{"ingredientId":278,"id":2828,"amount":1,"unit":"oz"},{"ingredientId":459,"id":2829,"amount":1,"unit":"oz"},{"ingredientId":570,"id":2830,"amount":1,"unit":"oz"},{"ingredientId":547,"id":2831,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2832,"amount":1,"unit":"oz"},{"ingredientId":403,"id":2833,"amount":1,"unit":"oz"},{"ingredientId":68,"id":2834,"amount":1,"unit":"oz"},{"ingredientId":460,"id":2835,"amount":1,"unit":"oz"},{"ingredientId":278,"id":2836,"amount":1,"unit":"oz"},{"ingredientId":450,"id":2837,"amount":1,"unit":"oz"},{"ingredientId":570,"id":2838,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2839,"amount":1,"unit":"oz"},{"ingredientId":68,"id":2840,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2841,"amount":1,"unit":"oz"},{"ingredientId":25,"id":2842,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2843,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2844,"amount":1,"unit":"oz"},{"ingredientId":510,"id":2845,"amount":1,"unit":"oz"},{"ingredientId":100,"id":2846,"amount":1,"unit":"oz"},{"ingredientId":570,"id":2847,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2848,"amount":1,"unit":"oz"},{"ingredientId":133,"id":2849,"amount":1,"unit":"oz"},{"ingredientId":435,"id":2850,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2851,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2852,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2853,"amount":1,"unit":"oz"},{"ingredientId":611,"id":2854,"amount":1,"unit":"oz"},{"ingredientId":44,"id":2855,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2856,"amount":1,"unit":"oz"},{"ingredientId":571,"id":2857,"amount":1,"unit":"oz"},{"ingredientId":570,"id":2858,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2859,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2860,"amount":1,"unit":"oz"},{"ingredientId":167,"id":2861,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2862,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2863,"amount":1,"unit":"oz"},{"ingredientId":512,"id":2864,"amount":1,"unit":"oz"},{"ingredientId":515,"id":2865,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2866,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2867,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2868,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2869,"amount":1,"unit":"oz"},{"ingredientId":167,"id":2870,"amount":1,"unit":"oz"},{"ingredientId":486,"id":2871,"amount":1,"unit":"oz"},{"ingredientId":512,"id":2872,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2873,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2874,"amount":1,"unit":"oz"},{"ingredientId":486,"id":2875,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2876,"amount":1,"unit":"oz"},{"ingredientId":167,"id":2877,"amount":1,"unit":"oz"},{"ingredientId":512,"id":2878,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2879,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2880,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2881,"amount":1,"unit":"oz"},{"ingredientId":167,"id":2882,"amount":1,"unit":"oz"},{"ingredientId":515,"id":2883,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2884,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2885,"amount":1,"unit":"oz"},{"ingredientId":188,"id":2886,"amount":1,"unit":"oz"},{"ingredientId":486,"id":2887,"amount":1,"unit":"oz"},{"ingredientId":547,"id":2888,"amount":1,"unit":"oz"},{"ingredientId":402,"id":2889,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2890,"amount":1,"unit":"oz"},{"ingredientId":288,"id":2891,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2892,"amount":1,"unit":"oz"},{"ingredientId":167,"id":2893,"amount":1,"unit":"oz"},{"ingredientId":556,"id":2894,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2895,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2896,"amount":1,"unit":"oz"},{"ingredientId":328,"id":2897,"amount":1,"unit":"oz"},{"ingredientId":64,"id":2898,"amount":1,"unit":"oz"},{"ingredientId":68,"id":2899,"amount":1,"unit":"oz"},{"ingredientId":82,"id":2900,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2901,"amount":1,"unit":"oz"},{"ingredientId":64,"id":2902,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2903,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2904,"amount":1,"unit":"oz"},{"ingredientId":294,"id":2905,"amount":1,"unit":"oz"},{"ingredientId":554,"id":2906,"amount":1,"unit":"oz"},{"ingredientId":436,"id":2907,"amount":1,"unit":"oz"},{"ingredientId":440,"id":2908,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2909,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2910,"amount":1,"unit":"oz"},{"ingredientId":208,"id":2911,"amount":1,"unit":"oz"},{"ingredientId":349,"id":2912,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2913,"amount":1,"unit":"oz"},{"ingredientId":471,"id":2914,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2915,"amount":1,"unit":"oz"},{"ingredientId":247,"id":2916,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2917,"amount":1,"unit":"oz"},{"ingredientId":570,"id":2918,"amount":1,"unit":"oz"},{"ingredientId":67,"id":2919,"amount":1,"unit":"oz"},{"ingredientId":433,"id":2920,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2921,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2922,"amount":1,"unit":"oz"},{"ingredientId":570,"id":2923,"amount":1,"unit":"oz"},{"ingredientId":203,"id":2924,"amount":1,"unit":"oz"},{"ingredientId":433,"id":2925,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2926,"amount":1,"unit":"oz"},{"ingredientId":608,"id":2927,"amount":1,"unit":"oz"},{"ingredientId":303,"id":2928,"amount":1,"unit":"oz"},{"ingredientId":270,"id":2929,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2930,"amount":1,"unit":"oz"},{"ingredientId":418,"id":2931,"amount":1,"unit":"oz"},{"ingredientId":303,"id":2932,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2933,"amount":1,"unit":"oz"},{"ingredientId":457,"id":2934,"amount":1,"unit":"oz"},{"ingredientId":433,"id":2935,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2936,"amount":1,"unit":"oz"},{"ingredientId":230,"id":2937,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2938,"amount":1,"unit":"oz"},{"ingredientId":279,"id":2939,"amount":1,"unit":"oz"},{"ingredientId":457,"id":2940,"amount":1,"unit":"oz"},{"ingredientId":230,"id":2941,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2942,"amount":1,"unit":"oz"},{"ingredientId":387,"id":2943,"amount":1,"unit":"oz"},{"ingredientId":465,"id":2944,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2945,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2946,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2947,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2948,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2949,"amount":1,"unit":"oz"},{"ingredientId":167,"id":2950,"amount":1,"unit":"oz"},{"ingredientId":467,"id":2951,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2952,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2953,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2954,"amount":1,"unit":"oz"},{"ingredientId":79,"id":2955,"amount":1,"unit":"oz"},{"ingredientId":422,"id":2956,"amount":1,"unit":"oz"},{"ingredientId":459,"id":2957,"amount":1,"unit":"oz"},{"ingredientId":461,"id":2958,"amount":1,"unit":"oz"},{"ingredientId":467,"id":2959,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2960,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2961,"amount":1,"unit":"oz"},{"ingredientId":157,"id":2962,"amount":1,"unit":"oz"},{"ingredientId":147,"id":2963,"amount":1,"unit":"oz"},{"ingredientId":351,"id":2964,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2965,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2966,"amount":1,"unit":"oz"},{"ingredientId":280,"id":2967,"amount":1,"unit":"oz"},{"ingredientId":413,"id":2968,"amount":1,"unit":"oz"},{"ingredientId":267,"id":2969,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2970,"amount":1,"unit":"oz"},{"ingredientId":280,"id":2971,"amount":1,"unit":"oz"},{"ingredientId":234,"id":2972,"amount":1,"unit":"oz"},{"ingredientId":606,"id":2973,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2974,"amount":1,"unit":"oz"},{"ingredientId":280,"id":2975,"amount":1,"unit":"oz"},{"ingredientId":515,"id":2976,"amount":1,"unit":"oz"},{"ingredientId":98,"id":2977,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2978,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2979,"amount":1,"unit":"oz"},{"ingredientId":174,"id":2980,"amount":1,"unit":"oz"},{"ingredientId":518,"id":2981,"amount":1,"unit":"oz"},{"ingredientId":98,"id":2982,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2983,"amount":1,"unit":"oz"},{"ingredientId":391,"id":2984,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2985,"amount":1,"unit":"oz"},{"ingredientId":167,"id":2986,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2987,"amount":1,"unit":"oz"},{"ingredientId":260,"id":2988,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2989,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2990,"amount":1,"unit":"oz"},{"ingredientId":430,"id":2991,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2992,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2993,"amount":1,"unit":"oz"},{"ingredientId":433,"id":2994,"amount":1,"unit":"oz"},{"ingredientId":386,"id":2995,"amount":1,"unit":"oz"},{"ingredientId":432,"id":2996,"amount":1,"unit":"oz"},{"ingredientId":612,"id":2997,"amount":1,"unit":"oz"},{"ingredientId":531,"id":2998,"amount":1,"unit":"oz"},{"ingredientId":469,"id":2999,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3000,"amount":1,"unit":"oz"},{"ingredientId":105,"id":3001,"amount":1,"unit":"oz"},{"ingredientId":404,"id":3002,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3003,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3004,"amount":1,"unit":"oz"},{"ingredientId":413,"id":3005,"amount":1,"unit":"oz"},{"ingredientId":188,"id":3006,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3007,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3008,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3009,"amount":1,"unit":"oz"},{"ingredientId":413,"id":3010,"amount":1,"unit":"oz"},{"ingredientId":188,"id":3011,"amount":1,"unit":"oz"},{"ingredientId":491,"id":3012,"amount":1,"unit":"oz"},{"ingredientId":261,"id":3013,"amount":1,"unit":"oz"},{"ingredientId":616,"id":3014,"amount":1,"unit":"oz"},{"ingredientId":430,"id":3015,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3016,"amount":1,"unit":"oz"},{"ingredientId":614,"id":3017,"amount":1,"unit":"oz"},{"ingredientId":163,"id":3018,"amount":1,"unit":"oz"},{"ingredientId":224,"id":3019,"amount":1,"unit":"oz"},{"ingredientId":614,"id":3020,"amount":1,"unit":"oz"},{"ingredientId":294,"id":3021,"amount":1,"unit":"oz"},{"ingredientId":160,"id":3022,"amount":1,"unit":"oz"},{"ingredientId":105,"id":3023,"amount":1,"unit":"oz"},{"ingredientId":605,"id":3024,"amount":1,"unit":"oz"},{"ingredientId":135,"id":3025,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3026,"amount":1,"unit":"oz"},{"ingredientId":156,"id":3027,"amount":1,"unit":"oz"},{"ingredientId":600,"id":3028,"amount":1,"unit":"oz"},{"ingredientId":292,"id":3029,"amount":1,"unit":"oz"},{"ingredientId":188,"id":3030,"amount":1,"unit":"oz"},{"ingredientId":394,"id":3031,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3032,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3033,"amount":1,"unit":"oz"},{"ingredientId":431,"id":3034,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3035,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3036,"amount":1,"unit":"oz"},{"ingredientId":188,"id":3037,"amount":1,"unit":"oz"},{"ingredientId":394,"id":3038,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3039,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3040,"amount":1,"unit":"oz"},{"ingredientId":431,"id":3041,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3042,"amount":1,"unit":"oz"},{"ingredientId":213,"id":3043,"amount":1,"unit":"oz"},{"ingredientId":67,"id":3044,"amount":1,"unit":"oz"},{"ingredientId":616,"id":3045,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3046,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3047,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3048,"amount":1,"unit":"oz"},{"ingredientId":249,"id":3049,"amount":1,"unit":"oz"},{"ingredientId":292,"id":3050,"amount":1,"unit":"oz"},{"ingredientId":402,"id":3051,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3052,"amount":1,"unit":"oz"},{"ingredientId":413,"id":3053,"amount":1,"unit":"oz"},{"ingredientId":457,"id":3054,"amount":1,"unit":"oz"},{"ingredientId":433,"id":3055,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3056,"amount":1,"unit":"oz"},{"ingredientId":230,"id":3057,"amount":1,"unit":"oz"},{"ingredientId":565,"id":3058,"amount":1,"unit":"oz"},{"ingredientId":63,"id":3059,"amount":1,"unit":"oz"},{"ingredientId":450,"id":3060,"amount":1,"unit":"oz"},{"ingredientId":279,"id":3061,"amount":1,"unit":"oz"},{"ingredientId":413,"id":3062,"amount":1,"unit":"oz"},{"ingredientId":404,"id":3063,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3064,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3065,"amount":1,"unit":"oz"},{"ingredientId":188,"id":3066,"amount":1,"unit":"oz"},{"ingredientId":307,"id":3067,"amount":1,"unit":"oz"},{"ingredientId":61,"id":3068,"amount":1,"unit":"oz"},{"ingredientId":450,"id":3069,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3070,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3071,"amount":1,"unit":"oz"},{"ingredientId":373,"id":3072,"amount":1,"unit":"oz"},{"ingredientId":65,"id":3073,"amount":1,"unit":"oz"},{"ingredientId":611,"id":3074,"amount":1,"unit":"oz"},{"ingredientId":224,"id":3075,"amount":1,"unit":"oz"},{"ingredientId":307,"id":3076,"amount":1,"unit":"oz"},{"ingredientId":428,"id":3077,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3078,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3079,"amount":1,"unit":"oz"},{"ingredientId":482,"id":3080,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3081,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3082,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3083,"amount":1,"unit":"oz"},{"ingredientId":440,"id":3084,"amount":1,"unit":"oz"},{"ingredientId":483,"id":3085,"amount":1,"unit":"oz"},{"ingredientId":611,"id":3086,"amount":1,"unit":"oz"},{"ingredientId":162,"id":3087,"amount":1,"unit":"oz"},{"ingredientId":611,"id":3088,"amount":1,"unit":"oz"},{"ingredientId":569,"id":3089,"amount":1,"unit":"oz"},{"ingredientId":187,"id":3090,"amount":1,"unit":"oz"},{"ingredientId":183,"id":3091,"amount":1,"unit":"oz"},{"ingredientId":53,"id":3092,"amount":1,"unit":"oz"},{"ingredientId":595,"id":3093,"amount":1,"unit":"oz"},{"ingredientId":278,"id":3094,"amount":1,"unit":"oz"},{"ingredientId":489,"id":3095,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3096,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3097,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3098,"amount":1,"unit":"oz"},{"ingredientId":304,"id":3099,"amount":1,"unit":"oz"},{"ingredientId":284,"id":3100,"amount":1,"unit":"oz"},{"ingredientId":603,"id":3101,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3102,"amount":1,"unit":"oz"},{"ingredientId":224,"id":3103,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3104,"amount":1,"unit":"oz"},{"ingredientId":154,"id":3105,"amount":1,"unit":"oz"},{"ingredientId":445,"id":3106,"amount":1,"unit":"oz"},{"ingredientId":293,"id":3107,"amount":1,"unit":"oz"},{"ingredientId":284,"id":3108,"amount":1,"unit":"oz"},{"ingredientId":496,"id":3109,"amount":1,"unit":"oz"},{"ingredientId":441,"id":3110,"amount":1,"unit":"oz"},{"ingredientId":300,"id":3111,"amount":1,"unit":"oz"},{"ingredientId":429,"id":3112,"amount":1,"unit":"oz"},{"ingredientId":206,"id":3113,"amount":1,"unit":"oz"},{"ingredientId":280,"id":3114,"amount":1,"unit":"oz"},{"ingredientId":580,"id":3115,"amount":1,"unit":"oz"},{"ingredientId":436,"id":3116,"amount":1,"unit":"oz"},{"ingredientId":173,"id":3117,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3118,"amount":1,"unit":"oz"},{"ingredientId":413,"id":3119,"amount":1,"unit":"oz"},{"ingredientId":230,"id":3120,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3121,"amount":1,"unit":"oz"},{"ingredientId":491,"id":3122,"amount":1,"unit":"oz"},{"ingredientId":291,"id":3123,"amount":1,"unit":"oz"},{"ingredientId":104,"id":3124,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3125,"amount":1,"unit":"oz"},{"ingredientId":219,"id":3126,"amount":1,"unit":"oz"},{"ingredientId":54,"id":3127,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3128,"amount":1,"unit":"oz"},{"ingredientId":119,"id":3129,"amount":1,"unit":"oz"},{"ingredientId":219,"id":3130,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3131,"amount":1,"unit":"oz"},{"ingredientId":141,"id":3132,"amount":1,"unit":"oz"},{"ingredientId":522,"id":3133,"amount":1,"unit":"oz"},{"ingredientId":502,"id":3134,"amount":1,"unit":"oz"},{"ingredientId":83,"id":3135,"amount":1,"unit":"oz"},{"ingredientId":4,"id":3136,"amount":1,"unit":"oz"},{"ingredientId":611,"id":3137,"amount":1,"unit":"oz"},{"ingredientId":571,"id":3138,"amount":1,"unit":"oz"},{"ingredientId":361,"id":3139,"amount":1,"unit":"oz"},{"ingredientId":615,"id":3140,"amount":1,"unit":"oz"},{"ingredientId":73,"id":3141,"amount":1,"unit":"oz"},{"ingredientId":227,"id":3142,"amount":1,"unit":"oz"},{"ingredientId":499,"id":3143,"amount":1,"unit":"oz"},{"ingredientId":304,"id":3144,"amount":1,"unit":"oz"},{"ingredientId":278,"id":3145,"amount":1,"unit":"oz"},{"ingredientId":226,"id":3146,"amount":1,"unit":"oz"},{"ingredientId":127,"id":3147,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3148,"amount":1,"unit":"oz"},{"ingredientId":303,"id":3149,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3150,"amount":1,"unit":"oz"},{"ingredientId":54,"id":3151,"amount":1,"unit":"oz"},{"ingredientId":292,"id":3152,"amount":1,"unit":"oz"},{"ingredientId":261,"id":3153,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3154,"amount":1,"unit":"oz"},{"ingredientId":576,"id":3155,"amount":1,"unit":"oz"},{"ingredientId":105,"id":3156,"amount":1,"unit":"oz"},{"ingredientId":512,"id":3157,"amount":1,"unit":"oz"},{"ingredientId":255,"id":3158,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3159,"amount":1,"unit":"oz"},{"ingredientId":104,"id":3160,"amount":1,"unit":"oz"},{"ingredientId":160,"id":3161,"amount":1,"unit":"oz"},{"ingredientId":188,"id":3162,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3163,"amount":1,"unit":"oz"},{"ingredientId":556,"id":3164,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3165,"amount":1,"unit":"oz"},{"ingredientId":70,"id":3166,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3167,"amount":1,"unit":"oz"},{"ingredientId":64,"id":3168,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3169,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3170,"amount":1,"unit":"oz"},{"ingredientId":401,"id":3171,"amount":1,"unit":"oz"},{"ingredientId":63,"id":3172,"amount":1,"unit":"oz"},{"ingredientId":130,"id":3173,"amount":1,"unit":"oz"},{"ingredientId":69,"id":3174,"amount":1,"unit":"oz"},{"ingredientId":25,"id":3175,"amount":1,"unit":"oz"},{"ingredientId":401,"id":3176,"amount":1,"unit":"oz"},{"ingredientId":206,"id":3177,"amount":1,"unit":"oz"},{"ingredientId":73,"id":3178,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3179,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3180,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3181,"amount":1,"unit":"oz"},{"ingredientId":104,"id":3182,"amount":1,"unit":"oz"},{"ingredientId":230,"id":3183,"amount":1,"unit":"oz"},{"ingredientId":253,"id":3184,"amount":1,"unit":"oz"},{"ingredientId":101,"id":3185,"amount":1,"unit":"oz"},{"ingredientId":429,"id":3186,"amount":1,"unit":"oz"},{"ingredientId":250,"id":3187,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3188,"amount":1,"unit":"oz"},{"ingredientId":402,"id":3189,"amount":1,"unit":"oz"},{"ingredientId":226,"id":3190,"amount":1,"unit":"oz"},{"ingredientId":263,"id":3191,"amount":1,"unit":"oz"},{"ingredientId":556,"id":3192,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3193,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3194,"amount":1,"unit":"oz"},{"ingredientId":73,"id":3195,"amount":1,"unit":"oz"},{"ingredientId":440,"id":3196,"amount":1,"unit":"oz"},{"ingredientId":405,"id":3197,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3198,"amount":1,"unit":"oz"},{"ingredientId":157,"id":3199,"amount":1,"unit":"oz"},{"ingredientId":181,"id":3200,"amount":1,"unit":"oz"},{"ingredientId":59,"id":3201,"amount":1,"unit":"oz"},{"ingredientId":220,"id":3202,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3203,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3204,"amount":1,"unit":"oz"},{"ingredientId":303,"id":3205,"amount":1,"unit":"oz"},{"ingredientId":327,"id":3206,"amount":1,"unit":"oz"},{"ingredientId":523,"id":3207,"amount":1,"unit":"oz"},{"ingredientId":300,"id":3208,"amount":1,"unit":"oz"},{"ingredientId":314,"id":3209,"amount":1,"unit":"oz"},{"ingredientId":401,"id":3210,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3211,"amount":1,"unit":"oz"},{"ingredientId":253,"id":3212,"amount":1,"unit":"oz"},{"ingredientId":38,"id":3213,"amount":1,"unit":"oz"},{"ingredientId":256,"id":3214,"amount":1,"unit":"oz"},{"ingredientId":199,"id":3215,"amount":1,"unit":"oz"},{"ingredientId":509,"id":3216,"amount":1,"unit":"oz"},{"ingredientId":435,"id":3217,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3218,"amount":1,"unit":"oz"},{"ingredientId":336,"id":3219,"amount":1,"unit":"oz"},{"ingredientId":229,"id":3220,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3221,"amount":1,"unit":"oz"},{"ingredientId":401,"id":3222,"amount":1,"unit":"oz"},{"ingredientId":253,"id":3223,"amount":1,"unit":"oz"},{"ingredientId":578,"id":3224,"amount":1,"unit":"oz"},{"ingredientId":292,"id":3225,"amount":1,"unit":"oz"},{"ingredientId":429,"id":3226,"amount":1,"unit":"oz"},{"ingredientId":506,"id":3227,"amount":1,"unit":"oz"},{"ingredientId":42,"id":3228,"amount":1,"unit":"oz"},{"ingredientId":31,"id":3229,"amount":1,"unit":"oz"},{"ingredientId":250,"id":3230,"amount":1,"unit":"oz"},{"ingredientId":74,"id":3231,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3232,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3233,"amount":1,"unit":"oz"},{"ingredientId":9,"id":3234,"amount":1,"unit":"oz"},{"ingredientId":110,"id":3235,"amount":1,"unit":"oz"},{"ingredientId":180,"id":3236,"amount":1,"unit":"oz"},{"ingredientId":233,"id":3237,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3238,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3239,"amount":1,"unit":"oz"},{"ingredientId":199,"id":3240,"amount":1,"unit":"oz"},{"ingredientId":170,"id":3241,"amount":1,"unit":"oz"},{"ingredientId":193,"id":3242,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3243,"amount":1,"unit":"oz"},{"ingredientId":610,"id":3244,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3245,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3246,"amount":1,"unit":"oz"},{"ingredientId":526,"id":3247,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3248,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3249,"amount":1,"unit":"oz"},{"ingredientId":542,"id":3250,"amount":1,"unit":"oz"},{"ingredientId":576,"id":3251,"amount":1,"unit":"oz"},{"ingredientId":429,"id":3252,"amount":1,"unit":"oz"},{"ingredientId":360,"id":3253,"amount":1,"unit":"oz"},{"ingredientId":255,"id":3254,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3255,"amount":1,"unit":"oz"},{"ingredientId":420,"id":3256,"amount":1,"unit":"oz"},{"ingredientId":542,"id":3257,"amount":1,"unit":"oz"},{"ingredientId":56,"id":3258,"amount":1,"unit":"oz"},{"ingredientId":505,"id":3259,"amount":1,"unit":"oz"},{"ingredientId":515,"id":3260,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3261,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3262,"amount":1,"unit":"oz"},{"ingredientId":482,"id":3263,"amount":1,"unit":"oz"},{"ingredientId":129,"id":3264,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3265,"amount":1,"unit":"oz"},{"ingredientId":173,"id":3266,"amount":1,"unit":"oz"},{"ingredientId":576,"id":3267,"amount":1,"unit":"oz"},{"ingredientId":534,"id":3268,"amount":1,"unit":"oz"},{"ingredientId":580,"id":3269,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3270,"amount":1,"unit":"oz"},{"ingredientId":206,"id":3271,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3272,"amount":1,"unit":"oz"},{"ingredientId":402,"id":3273,"amount":1,"unit":"oz"},{"ingredientId":436,"id":3274,"amount":1,"unit":"oz"},{"ingredientId":329,"id":3275,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3276,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3277,"amount":1,"unit":"oz"},{"ingredientId":524,"id":3278,"amount":1,"unit":"oz"},{"ingredientId":210,"id":3279,"amount":1,"unit":"oz"},{"ingredientId":272,"id":3280,"amount":1,"unit":"oz"},{"ingredientId":512,"id":3281,"amount":1,"unit":"oz"},{"ingredientId":255,"id":3282,"amount":1,"unit":"oz"},{"ingredientId":402,"id":3283,"amount":1,"unit":"oz"},{"ingredientId":36,"id":3284,"amount":1,"unit":"oz"},{"ingredientId":250,"id":3285,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3286,"amount":1,"unit":"oz"},{"ingredientId":255,"id":3287,"amount":1,"unit":"oz"},{"ingredientId":576,"id":3288,"amount":1,"unit":"oz"},{"ingredientId":589,"id":3289,"amount":1,"unit":"oz"},{"ingredientId":54,"id":3290,"amount":1,"unit":"oz"},{"ingredientId":575,"id":3291,"amount":1,"unit":"oz"},{"ingredientId":147,"id":3292,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3293,"amount":1,"unit":"oz"},{"ingredientId":303,"id":3294,"amount":1,"unit":"oz"},{"ingredientId":464,"id":3295,"amount":1,"unit":"oz"},{"ingredientId":576,"id":3296,"amount":1,"unit":"oz"},{"ingredientId":73,"id":3297,"amount":1,"unit":"oz"},{"ingredientId":29,"id":3298,"amount":1,"unit":"oz"},{"ingredientId":319,"id":3299,"amount":1,"unit":"oz"},{"ingredientId":616,"id":3300,"amount":1,"unit":"oz"},{"ingredientId":31,"id":3301,"amount":1,"unit":"oz"},{"ingredientId":305,"id":3302,"amount":1,"unit":"oz"},{"ingredientId":498,"id":3303,"amount":1,"unit":"oz"},{"ingredientId":196,"id":3304,"amount":1,"unit":"oz"},{"ingredientId":15,"id":3305,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3306,"amount":1,"unit":"oz"},{"ingredientId":572,"id":3307,"amount":1,"unit":"oz"},{"ingredientId":250,"id":3308,"amount":1,"unit":"oz"},{"ingredientId":255,"id":3309,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3310,"amount":1,"unit":"oz"},{"ingredientId":429,"id":3311,"amount":1,"unit":"oz"},{"ingredientId":129,"id":3312,"amount":1,"unit":"oz"},{"ingredientId":363,"id":3313,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3314,"amount":1,"unit":"oz"},{"ingredientId":440,"id":3315,"amount":1,"unit":"oz"},{"ingredientId":206,"id":3316,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3317,"amount":1,"unit":"oz"},{"ingredientId":433,"id":3318,"amount":1,"unit":"oz"},{"ingredientId":440,"id":3319,"amount":1,"unit":"oz"},{"ingredientId":71,"id":3320,"amount":1,"unit":"oz"},{"ingredientId":429,"id":3321,"amount":1,"unit":"oz"},{"ingredientId":165,"id":3322,"amount":1,"unit":"oz"},{"ingredientId":573,"id":3323,"amount":1,"unit":"oz"},{"ingredientId":206,"id":3324,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3325,"amount":1,"unit":"oz"},{"ingredientId":292,"id":3326,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3327,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3328,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3329,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3330,"amount":1,"unit":"oz"},{"ingredientId":402,"id":3331,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3332,"amount":1,"unit":"oz"},{"ingredientId":168,"id":3333,"amount":1,"unit":"oz"},{"ingredientId":255,"id":3334,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3335,"amount":1,"unit":"oz"},{"ingredientId":4,"id":3336,"amount":1,"unit":"oz"},{"ingredientId":429,"id":3337,"amount":1,"unit":"oz"},{"ingredientId":191,"id":3338,"amount":1,"unit":"oz"},{"ingredientId":14,"id":3339,"amount":1,"unit":"oz"},{"ingredientId":616,"id":3340,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3341,"amount":1,"unit":"oz"},{"ingredientId":209,"id":3342,"amount":1,"unit":"oz"},{"ingredientId":334,"id":3343,"amount":1,"unit":"oz"},{"ingredientId":253,"id":3344,"amount":1,"unit":"oz"},{"ingredientId":616,"id":3345,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3346,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3347,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3348,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3349,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3350,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3351,"amount":1,"unit":"oz"},{"ingredientId":482,"id":3352,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3353,"amount":1,"unit":"oz"},{"ingredientId":556,"id":3354,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3355,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3356,"amount":1,"unit":"oz"},{"ingredientId":190,"id":3357,"amount":1,"unit":"oz"},{"ingredientId":558,"id":3358,"amount":1,"unit":"oz"},{"ingredientId":13,"id":3359,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3360,"amount":1,"unit":"oz"},{"ingredientId":25,"id":3361,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3362,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3363,"amount":1,"unit":"oz"},{"ingredientId":491,"id":3364,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3365,"amount":1,"unit":"oz"},{"ingredientId":441,"id":3366,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3367,"amount":1,"unit":"oz"},{"ingredientId":157,"id":3368,"amount":1,"unit":"oz"},{"ingredientId":415,"id":3369,"amount":1,"unit":"oz"},{"ingredientId":197,"id":3370,"amount":1,"unit":"oz"},{"ingredientId":109,"id":3371,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3372,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3373,"amount":1,"unit":"oz"},{"ingredientId":229,"id":3374,"amount":1,"unit":"oz"},{"ingredientId":115,"id":3375,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3376,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3377,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3378,"amount":1,"unit":"oz"},{"ingredientId":429,"id":3379,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3380,"amount":1,"unit":"oz"},{"ingredientId":186,"id":3381,"amount":1,"unit":"oz"},{"ingredientId":433,"id":3382,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3383,"amount":1,"unit":"oz"},{"ingredientId":212,"id":3384,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3385,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3386,"amount":1,"unit":"oz"},{"ingredientId":433,"id":3387,"amount":1,"unit":"oz"},{"ingredientId":54,"id":3388,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3389,"amount":1,"unit":"oz"},{"ingredientId":250,"id":3390,"amount":1,"unit":"oz"},{"ingredientId":217,"id":3391,"amount":1,"unit":"oz"},{"ingredientId":211,"id":3392,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3393,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3394,"amount":1,"unit":"oz"},{"ingredientId":467,"id":3395,"amount":1,"unit":"oz"},{"ingredientId":104,"id":3396,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3397,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3398,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3399,"amount":1,"unit":"oz"},{"ingredientId":558,"id":3400,"amount":1,"unit":"oz"},{"ingredientId":20,"id":3401,"amount":1,"unit":"oz"},{"ingredientId":173,"id":3402,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3403,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3404,"amount":1,"unit":"oz"},{"ingredientId":127,"id":3405,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3406,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3407,"amount":1,"unit":"oz"},{"ingredientId":515,"id":3408,"amount":1,"unit":"oz"},{"ingredientId":578,"id":3409,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3410,"amount":1,"unit":"oz"},{"ingredientId":3,"id":3411,"amount":1,"unit":"oz"},{"ingredientId":82,"id":3412,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3413,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3414,"amount":1,"unit":"oz"},{"ingredientId":448,"id":3415,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3416,"amount":1,"unit":"oz"},{"ingredientId":512,"id":3417,"amount":1,"unit":"oz"},{"ingredientId":59,"id":3418,"amount":1,"unit":"oz"},{"ingredientId":433,"id":3419,"amount":1,"unit":"oz"},{"ingredientId":82,"id":3420,"amount":1,"unit":"oz"},{"ingredientId":511,"id":3421,"amount":1,"unit":"oz"},{"ingredientId":217,"id":3422,"amount":1,"unit":"oz"},{"ingredientId":104,"id":3423,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3424,"amount":1,"unit":"oz"},{"ingredientId":512,"id":3425,"amount":1,"unit":"oz"},{"ingredientId":64,"id":3426,"amount":1,"unit":"oz"},{"ingredientId":616,"id":3427,"amount":1,"unit":"oz"},{"ingredientId":253,"id":3428,"amount":1,"unit":"oz"},{"ingredientId":31,"id":3429,"amount":1,"unit":"oz"},{"ingredientId":73,"id":3430,"amount":1,"unit":"oz"},{"ingredientId":589,"id":3431,"amount":1,"unit":"oz"},{"ingredientId":255,"id":3432,"amount":1,"unit":"oz"},{"ingredientId":278,"id":3433,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3434,"amount":1,"unit":"oz"},{"ingredientId":512,"id":3435,"amount":1,"unit":"oz"},{"ingredientId":59,"id":3436,"amount":1,"unit":"oz"},{"ingredientId":39,"id":3437,"amount":1,"unit":"oz"},{"ingredientId":261,"id":3438,"amount":1,"unit":"oz"},{"ingredientId":51,"id":3439,"amount":1,"unit":"oz"},{"ingredientId":454,"id":3440,"amount":1,"unit":"oz"},{"ingredientId":213,"id":3441,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3442,"amount":1,"unit":"oz"},{"ingredientId":197,"id":3443,"amount":1,"unit":"oz"},{"ingredientId":436,"id":3444,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3445,"amount":1,"unit":"oz"},{"ingredientId":558,"id":3446,"amount":1,"unit":"oz"},{"ingredientId":429,"id":3447,"amount":1,"unit":"oz"},{"ingredientId":115,"id":3448,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3449,"amount":1,"unit":"oz"},{"ingredientId":616,"id":3450,"amount":1,"unit":"oz"},{"ingredientId":435,"id":3451,"amount":1,"unit":"oz"},{"ingredientId":52,"id":3452,"amount":1,"unit":"oz"},{"ingredientId":104,"id":3453,"amount":1,"unit":"oz"},{"ingredientId":173,"id":3454,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3455,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3456,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3457,"amount":1,"unit":"oz"},{"ingredientId":581,"id":3458,"amount":1,"unit":"oz"},{"ingredientId":54,"id":3459,"amount":1,"unit":"oz"},{"ingredientId":493,"id":3460,"amount":1,"unit":"oz"},{"ingredientId":280,"id":3461,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3462,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3463,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3464,"amount":1,"unit":"oz"},{"ingredientId":4,"id":3465,"amount":1,"unit":"oz"},{"ingredientId":115,"id":3466,"amount":1,"unit":"oz"},{"ingredientId":280,"id":3467,"amount":1,"unit":"oz"},{"ingredientId":220,"id":3468,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3469,"amount":1,"unit":"oz"},{"ingredientId":405,"id":3470,"amount":1,"unit":"oz"},{"ingredientId":441,"id":3471,"amount":1,"unit":"oz"},{"ingredientId":25,"id":3472,"amount":1,"unit":"oz"},{"ingredientId":219,"id":3473,"amount":1,"unit":"oz"},{"ingredientId":126,"id":3474,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3475,"amount":1,"unit":"oz"},{"ingredientId":101,"id":3476,"amount":1,"unit":"oz"},{"ingredientId":261,"id":3477,"amount":1,"unit":"oz"},{"ingredientId":425,"id":3478,"amount":1,"unit":"oz"},{"ingredientId":113,"id":3479,"amount":1,"unit":"oz"},{"ingredientId":261,"id":3480,"amount":1,"unit":"oz"},{"ingredientId":157,"id":3481,"amount":1,"unit":"oz"},{"ingredientId":371,"id":3482,"amount":1,"unit":"oz"},{"ingredientId":195,"id":3483,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3484,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3485,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3486,"amount":1,"unit":"oz"},{"ingredientId":442,"id":3487,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3488,"amount":1,"unit":"oz"},{"ingredientId":503,"id":3489,"amount":1,"unit":"oz"},{"ingredientId":451,"id":3490,"amount":1,"unit":"oz"},{"ingredientId":436,"id":3491,"amount":1,"unit":"oz"},{"ingredientId":303,"id":3492,"amount":1,"unit":"oz"},{"ingredientId":82,"id":3493,"amount":1,"unit":"oz"},{"ingredientId":199,"id":3494,"amount":1,"unit":"oz"},{"ingredientId":256,"id":3495,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3496,"amount":1,"unit":"oz"},{"ingredientId":146,"id":3497,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3498,"amount":1,"unit":"oz"},{"ingredientId":28,"id":3499,"amount":1,"unit":"oz"},{"ingredientId":269,"id":3500,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3501,"amount":1,"unit":"oz"},{"ingredientId":234,"id":3502,"amount":1,"unit":"oz"},{"ingredientId":199,"id":3503,"amount":1,"unit":"oz"},{"ingredientId":447,"id":3504,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3505,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3506,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3507,"amount":1,"unit":"oz"},{"ingredientId":420,"id":3508,"amount":1,"unit":"oz"},{"ingredientId":113,"id":3509,"amount":1,"unit":"oz"},{"ingredientId":255,"id":3510,"amount":1,"unit":"oz"},{"ingredientId":267,"id":3511,"amount":1,"unit":"oz"},{"ingredientId":385,"id":3512,"amount":1,"unit":"oz"},{"ingredientId":468,"id":3513,"amount":1,"unit":"oz"},{"ingredientId":276,"id":3514,"amount":1,"unit":"oz"},{"ingredientId":225,"id":3515,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3516,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3517,"amount":1,"unit":"oz"},{"ingredientId":402,"id":3518,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3519,"amount":1,"unit":"oz"},{"ingredientId":549,"id":3520,"amount":1,"unit":"oz"},{"ingredientId":206,"id":3521,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3522,"amount":1,"unit":"oz"},{"ingredientId":253,"id":3523,"amount":1,"unit":"oz"},{"ingredientId":440,"id":3524,"amount":1,"unit":"oz"},{"ingredientId":265,"id":3525,"amount":1,"unit":"oz"},{"ingredientId":104,"id":3526,"amount":1,"unit":"oz"},{"ingredientId":59,"id":3527,"amount":1,"unit":"oz"},{"ingredientId":397,"id":3528,"amount":1,"unit":"oz"},{"ingredientId":178,"id":3529,"amount":1,"unit":"oz"},{"ingredientId":500,"id":3530,"amount":1,"unit":"oz"},{"ingredientId":494,"id":3531,"amount":1,"unit":"oz"},{"ingredientId":219,"id":3532,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3533,"amount":1,"unit":"oz"},{"ingredientId":315,"id":3534,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3535,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3536,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3537,"amount":1,"unit":"oz"},{"ingredientId":253,"id":3538,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3539,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3540,"amount":1,"unit":"oz"},{"ingredientId":206,"id":3541,"amount":1,"unit":"oz"},{"ingredientId":280,"id":3542,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3543,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3544,"amount":1,"unit":"oz"},{"ingredientId":267,"id":3545,"amount":1,"unit":"oz"},{"ingredientId":230,"id":3546,"amount":1,"unit":"oz"},{"ingredientId":413,"id":3547,"amount":1,"unit":"oz"},{"ingredientId":124,"id":3548,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3549,"amount":1,"unit":"oz"},{"ingredientId":473,"id":3550,"amount":1,"unit":"oz"},{"ingredientId":565,"id":3551,"amount":1,"unit":"oz"},{"ingredientId":97,"id":3552,"amount":1,"unit":"oz"},{"ingredientId":517,"id":3553,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3554,"amount":1,"unit":"oz"},{"ingredientId":128,"id":3555,"amount":1,"unit":"oz"},{"ingredientId":451,"id":3556,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3557,"amount":1,"unit":"oz"},{"ingredientId":30,"id":3558,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3559,"amount":1,"unit":"oz"},{"ingredientId":390,"id":3560,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3561,"amount":1,"unit":"oz"},{"ingredientId":188,"id":3562,"amount":1,"unit":"oz"},{"ingredientId":253,"id":3563,"amount":1,"unit":"oz"},{"ingredientId":593,"id":3564,"amount":1,"unit":"oz"},{"ingredientId":16,"id":3565,"amount":1,"unit":"oz"},{"ingredientId":23,"id":3566,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3567,"amount":1,"unit":"oz"},{"ingredientId":453,"id":3568,"amount":1,"unit":"oz"},{"ingredientId":25,"id":3569,"amount":1,"unit":"oz"},{"ingredientId":609,"id":3570,"amount":1,"unit":"oz"},{"ingredientId":480,"id":3571,"amount":1,"unit":"oz"},{"ingredientId":241,"id":3572,"amount":1,"unit":"oz"},{"ingredientId":378,"id":3573,"amount":1,"unit":"oz"},{"ingredientId":74,"id":3574,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3575,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3576,"amount":1,"unit":"oz"},{"ingredientId":230,"id":3577,"amount":1,"unit":"oz"},{"ingredientId":241,"id":3578,"amount":1,"unit":"oz"},{"ingredientId":141,"id":3579,"amount":1,"unit":"oz"},{"ingredientId":303,"id":3580,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3581,"amount":1,"unit":"oz"},{"ingredientId":475,"id":3582,"amount":1,"unit":"oz"},{"ingredientId":512,"id":3583,"amount":1,"unit":"oz"},{"ingredientId":64,"id":3584,"amount":1,"unit":"oz"},{"ingredientId":401,"id":3585,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3586,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3587,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3588,"amount":1,"unit":"oz"},{"ingredientId":542,"id":3589,"amount":1,"unit":"oz"},{"ingredientId":298,"id":3590,"amount":1,"unit":"oz"},{"ingredientId":126,"id":3591,"amount":1,"unit":"oz"},{"ingredientId":292,"id":3592,"amount":1,"unit":"oz"},{"ingredientId":285,"id":3593,"amount":1,"unit":"oz"},{"ingredientId":512,"id":3594,"amount":1,"unit":"oz"},{"ingredientId":581,"id":3595,"amount":1,"unit":"oz"},{"ingredientId":616,"id":3596,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3597,"amount":1,"unit":"oz"},{"ingredientId":250,"id":3598,"amount":1,"unit":"oz"},{"ingredientId":576,"id":3599,"amount":1,"unit":"oz"},{"ingredientId":39,"id":3600,"amount":1,"unit":"oz"},{"ingredientId":515,"id":3601,"amount":1,"unit":"oz"},{"ingredientId":54,"id":3602,"amount":1,"unit":"oz"},{"ingredientId":64,"id":3603,"amount":1,"unit":"oz"},{"ingredientId":292,"id":3604,"amount":1,"unit":"oz"},{"ingredientId":85,"id":3605,"amount":1,"unit":"oz"},{"ingredientId":64,"id":3606,"amount":1,"unit":"oz"},{"ingredientId":580,"id":3607,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3608,"amount":1,"unit":"oz"},{"ingredientId":173,"id":3609,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3610,"amount":1,"unit":"oz"},{"ingredientId":280,"id":3611,"amount":1,"unit":"oz"},{"ingredientId":424,"id":3612,"amount":1,"unit":"oz"},{"ingredientId":38,"id":3613,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3614,"amount":1,"unit":"oz"},{"ingredientId":568,"id":3615,"amount":1,"unit":"oz"},{"ingredientId":285,"id":3616,"amount":1,"unit":"oz"},{"ingredientId":127,"id":3617,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3618,"amount":1,"unit":"oz"},{"ingredientId":402,"id":3619,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3620,"amount":1,"unit":"oz"},{"ingredientId":276,"id":3621,"amount":1,"unit":"oz"},{"ingredientId":615,"id":3622,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3623,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3624,"amount":1,"unit":"oz"},{"ingredientId":92,"id":3625,"amount":1,"unit":"oz"},{"ingredientId":64,"id":3626,"amount":1,"unit":"oz"},{"ingredientId":436,"id":3627,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3628,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3629,"amount":1,"unit":"oz"},{"ingredientId":611,"id":3630,"amount":1,"unit":"oz"},{"ingredientId":563,"id":3631,"amount":1,"unit":"oz"},{"ingredientId":596,"id":3632,"amount":1,"unit":"oz"},{"ingredientId":361,"id":3633,"amount":1,"unit":"oz"},{"ingredientId":433,"id":3634,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3635,"amount":1,"unit":"oz"},{"ingredientId":507,"id":3636,"amount":1,"unit":"oz"},{"ingredientId":549,"id":3637,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3638,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3639,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3640,"amount":1,"unit":"oz"},{"ingredientId":73,"id":3641,"amount":1,"unit":"oz"},{"ingredientId":206,"id":3642,"amount":1,"unit":"oz"},{"ingredientId":225,"id":3643,"amount":1,"unit":"oz"},{"ingredientId":136,"id":3644,"amount":1,"unit":"oz"},{"ingredientId":589,"id":3645,"amount":1,"unit":"oz"},{"ingredientId":611,"id":3646,"amount":1,"unit":"oz"},{"ingredientId":303,"id":3647,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3648,"amount":1,"unit":"oz"},{"ingredientId":512,"id":3649,"amount":1,"unit":"oz"},{"ingredientId":402,"id":3650,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3651,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3652,"amount":1,"unit":"oz"},{"ingredientId":64,"id":3653,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3654,"amount":1,"unit":"oz"},{"ingredientId":294,"id":3655,"amount":1,"unit":"oz"},{"ingredientId":520,"id":3656,"amount":1,"unit":"oz"},{"ingredientId":276,"id":3657,"amount":1,"unit":"oz"},{"ingredientId":616,"id":3658,"amount":1,"unit":"oz"},{"ingredientId":278,"id":3659,"amount":1,"unit":"oz"},{"ingredientId":303,"id":3660,"amount":1,"unit":"oz"},{"ingredientId":206,"id":3661,"amount":1,"unit":"oz"},{"ingredientId":440,"id":3662,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3663,"amount":1,"unit":"oz"},{"ingredientId":200,"id":3664,"amount":1,"unit":"oz"},{"ingredientId":573,"id":3665,"amount":1,"unit":"oz"},{"ingredientId":292,"id":3666,"amount":1,"unit":"oz"},{"ingredientId":147,"id":3667,"amount":1,"unit":"oz"},{"ingredientId":70,"id":3668,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3669,"amount":1,"unit":"oz"},{"ingredientId":86,"id":3670,"amount":1,"unit":"oz"},{"ingredientId":464,"id":3671,"amount":1,"unit":"oz"},{"ingredientId":261,"id":3672,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3673,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3674,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3675,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3676,"amount":1,"unit":"oz"},{"ingredientId":512,"id":3677,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3678,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3679,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3680,"amount":1,"unit":"oz"},{"ingredientId":377,"id":3681,"amount":1,"unit":"oz"},{"ingredientId":529,"id":3682,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3683,"amount":1,"unit":"oz"},{"ingredientId":440,"id":3684,"amount":1,"unit":"oz"},{"ingredientId":255,"id":3685,"amount":1,"unit":"oz"},{"ingredientId":58,"id":3686,"amount":1,"unit":"oz"},{"ingredientId":301,"id":3687,"amount":1,"unit":"oz"},{"ingredientId":451,"id":3688,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3689,"amount":1,"unit":"oz"},{"ingredientId":467,"id":3690,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3691,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3692,"amount":1,"unit":"oz"},{"ingredientId":300,"id":3693,"amount":1,"unit":"oz"},{"ingredientId":250,"id":3694,"amount":1,"unit":"oz"},{"ingredientId":382,"id":3695,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3696,"amount":1,"unit":"oz"},{"ingredientId":523,"id":3697,"amount":1,"unit":"oz"},{"ingredientId":59,"id":3698,"amount":1,"unit":"oz"},{"ingredientId":38,"id":3699,"amount":1,"unit":"oz"},{"ingredientId":616,"id":3700,"amount":1,"unit":"oz"},{"ingredientId":512,"id":3701,"amount":1,"unit":"oz"},{"ingredientId":42,"id":3702,"amount":1,"unit":"oz"},{"ingredientId":31,"id":3703,"amount":1,"unit":"oz"},{"ingredientId":127,"id":3704,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3705,"amount":1,"unit":"oz"},{"ingredientId":177,"id":3706,"amount":1,"unit":"oz"},{"ingredientId":580,"id":3707,"amount":1,"unit":"oz"},{"ingredientId":294,"id":3708,"amount":1,"unit":"oz"},{"ingredientId":363,"id":3709,"amount":1,"unit":"oz"},{"ingredientId":540,"id":3710,"amount":1,"unit":"oz"},{"ingredientId":244,"id":3711,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3712,"amount":1,"unit":"oz"},{"ingredientId":420,"id":3713,"amount":1,"unit":"oz"},{"ingredientId":56,"id":3714,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3715,"amount":1,"unit":"oz"},{"ingredientId":616,"id":3716,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3717,"amount":1,"unit":"oz"},{"ingredientId":491,"id":3718,"amount":1,"unit":"oz"},{"ingredientId":397,"id":3719,"amount":1,"unit":"oz"},{"ingredientId":448,"id":3720,"amount":1,"unit":"oz"},{"ingredientId":253,"id":3721,"amount":1,"unit":"oz"},{"ingredientId":402,"id":3722,"amount":1,"unit":"oz"},{"ingredientId":292,"id":3723,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3724,"amount":1,"unit":"oz"},{"ingredientId":118,"id":3725,"amount":1,"unit":"oz"},{"ingredientId":253,"id":3726,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3727,"amount":1,"unit":"oz"},{"ingredientId":9,"id":3728,"amount":1,"unit":"oz"},{"ingredientId":292,"id":3729,"amount":1,"unit":"oz"},{"ingredientId":97,"id":3730,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3731,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3732,"amount":1,"unit":"oz"},{"ingredientId":73,"id":3733,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3734,"amount":1,"unit":"oz"},{"ingredientId":429,"id":3735,"amount":1,"unit":"oz"},{"ingredientId":141,"id":3736,"amount":1,"unit":"oz"},{"ingredientId":576,"id":3737,"amount":1,"unit":"oz"},{"ingredientId":105,"id":3738,"amount":1,"unit":"oz"},{"ingredientId":414,"id":3739,"amount":1,"unit":"oz"},{"ingredientId":468,"id":3740,"amount":1,"unit":"oz"},{"ingredientId":274,"id":3741,"amount":1,"unit":"oz"},{"ingredientId":402,"id":3742,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3743,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3744,"amount":1,"unit":"oz"},{"ingredientId":226,"id":3745,"amount":1,"unit":"oz"},{"ingredientId":158,"id":3746,"amount":1,"unit":"oz"},{"ingredientId":366,"id":3747,"amount":1,"unit":"oz"},{"ingredientId":261,"id":3748,"amount":1,"unit":"oz"},{"ingredientId":303,"id":3749,"amount":1,"unit":"oz"},{"ingredientId":512,"id":3750,"amount":1,"unit":"oz"},{"ingredientId":441,"id":3751,"amount":1,"unit":"oz"},{"ingredientId":616,"id":3752,"amount":1,"unit":"oz"},{"ingredientId":261,"id":3753,"amount":1,"unit":"oz"},{"ingredientId":515,"id":3754,"amount":1,"unit":"oz"},{"ingredientId":206,"id":3755,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3756,"amount":1,"unit":"oz"},{"ingredientId":227,"id":3757,"amount":1,"unit":"oz"},{"ingredientId":146,"id":3758,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3759,"amount":1,"unit":"oz"},{"ingredientId":401,"id":3760,"amount":1,"unit":"oz"},{"ingredientId":402,"id":3761,"amount":1,"unit":"oz"},{"ingredientId":370,"id":3762,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3763,"amount":1,"unit":"oz"},{"ingredientId":429,"id":3764,"amount":1,"unit":"oz"},{"ingredientId":374,"id":3765,"amount":1,"unit":"oz"},{"ingredientId":372,"id":3766,"amount":1,"unit":"oz"},{"ingredientId":237,"id":3767,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3768,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3769,"amount":1,"unit":"oz"},{"ingredientId":442,"id":3770,"amount":1,"unit":"oz"},{"ingredientId":440,"id":3771,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3772,"amount":1,"unit":"oz"},{"ingredientId":127,"id":3773,"amount":1,"unit":"oz"},{"ingredientId":16,"id":3774,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3775,"amount":1,"unit":"oz"},{"ingredientId":436,"id":3776,"amount":1,"unit":"oz"},{"ingredientId":440,"id":3777,"amount":1,"unit":"oz"},{"ingredientId":311,"id":3778,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3779,"amount":1,"unit":"oz"},{"ingredientId":472,"id":3780,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3781,"amount":1,"unit":"oz"},{"ingredientId":515,"id":3782,"amount":1,"unit":"oz"},{"ingredientId":580,"id":3783,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3784,"amount":1,"unit":"oz"},{"ingredientId":114,"id":3785,"amount":1,"unit":"oz"},{"ingredientId":433,"id":3786,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3787,"amount":1,"unit":"oz"},{"ingredientId":9,"id":3788,"amount":1,"unit":"oz"},{"ingredientId":131,"id":3789,"amount":1,"unit":"oz"},{"ingredientId":155,"id":3790,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3791,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3792,"amount":1,"unit":"oz"},{"ingredientId":424,"id":3793,"amount":1,"unit":"oz"},{"ingredientId":578,"id":3794,"amount":1,"unit":"oz"},{"ingredientId":402,"id":3795,"amount":1,"unit":"oz"},{"ingredientId":78,"id":3796,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3797,"amount":1,"unit":"oz"},{"ingredientId":255,"id":3798,"amount":1,"unit":"oz"},{"ingredientId":127,"id":3799,"amount":1,"unit":"oz"},{"ingredientId":459,"id":3800,"amount":1,"unit":"oz"},{"ingredientId":402,"id":3801,"amount":1,"unit":"oz"},{"ingredientId":294,"id":3802,"amount":1,"unit":"oz"},{"ingredientId":375,"id":3803,"amount":1,"unit":"oz"},{"ingredientId":28,"id":3804,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3805,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3806,"amount":1,"unit":"oz"},{"ingredientId":64,"id":3807,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3808,"amount":1,"unit":"oz"},{"ingredientId":401,"id":3809,"amount":1,"unit":"oz"},{"ingredientId":370,"id":3810,"amount":1,"unit":"oz"},{"ingredientId":282,"id":3811,"amount":1,"unit":"oz"},{"ingredientId":206,"id":3812,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3813,"amount":1,"unit":"oz"},{"ingredientId":292,"id":3814,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3815,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3816,"amount":1,"unit":"oz"},{"ingredientId":104,"id":3817,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3818,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3819,"amount":1,"unit":"oz"},{"ingredientId":500,"id":3820,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3821,"amount":1,"unit":"oz"},{"ingredientId":612,"id":3822,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3823,"amount":1,"unit":"oz"},{"ingredientId":104,"id":3824,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3825,"amount":1,"unit":"oz"},{"ingredientId":491,"id":3826,"amount":1,"unit":"oz"},{"ingredientId":106,"id":3827,"amount":1,"unit":"oz"},{"ingredientId":230,"id":3828,"amount":1,"unit":"oz"},{"ingredientId":405,"id":3829,"amount":1,"unit":"oz"},{"ingredientId":280,"id":3830,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3831,"amount":1,"unit":"oz"},{"ingredientId":442,"id":3832,"amount":1,"unit":"oz"},{"ingredientId":9,"id":3833,"amount":1,"unit":"oz"},{"ingredientId":230,"id":3834,"amount":1,"unit":"oz"},{"ingredientId":192,"id":3835,"amount":1,"unit":"oz"},{"ingredientId":319,"id":3836,"amount":1,"unit":"oz"},{"ingredientId":28,"id":3837,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3838,"amount":1,"unit":"oz"},{"ingredientId":412,"id":3839,"amount":1,"unit":"oz"},{"ingredientId":199,"id":3840,"amount":1,"unit":"oz"},{"ingredientId":235,"id":3841,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3842,"amount":1,"unit":"oz"},{"ingredientId":63,"id":3843,"amount":1,"unit":"oz"},{"ingredientId":524,"id":3844,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3845,"amount":1,"unit":"oz"},{"ingredientId":62,"id":3846,"amount":1,"unit":"oz"},{"ingredientId":413,"id":3847,"amount":1,"unit":"oz"},{"ingredientId":145,"id":3848,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3849,"amount":1,"unit":"oz"},{"ingredientId":413,"id":3850,"amount":1,"unit":"oz"},{"ingredientId":127,"id":3851,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3852,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3853,"amount":1,"unit":"oz"},{"ingredientId":413,"id":3854,"amount":1,"unit":"oz"},{"ingredientId":206,"id":3855,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3856,"amount":1,"unit":"oz"},{"ingredientId":39,"id":3857,"amount":1,"unit":"oz"},{"ingredientId":250,"id":3858,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3859,"amount":1,"unit":"oz"},{"ingredientId":473,"id":3860,"amount":1,"unit":"oz"},{"ingredientId":330,"id":3861,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3862,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3863,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3864,"amount":1,"unit":"oz"},{"ingredientId":610,"id":3865,"amount":1,"unit":"oz"},{"ingredientId":280,"id":3866,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3867,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3868,"amount":1,"unit":"oz"},{"ingredientId":170,"id":3869,"amount":1,"unit":"oz"},{"ingredientId":545,"id":3870,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3871,"amount":1,"unit":"oz"},{"ingredientId":453,"id":3872,"amount":1,"unit":"oz"},{"ingredientId":173,"id":3873,"amount":1,"unit":"oz"},{"ingredientId":228,"id":3874,"amount":1,"unit":"oz"},{"ingredientId":63,"id":3875,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3876,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3877,"amount":1,"unit":"oz"},{"ingredientId":234,"id":3878,"amount":1,"unit":"oz"},{"ingredientId":371,"id":3879,"amount":1,"unit":"oz"},{"ingredientId":237,"id":3880,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3881,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3882,"amount":1,"unit":"oz"},{"ingredientId":303,"id":3883,"amount":1,"unit":"oz"},{"ingredientId":250,"id":3884,"amount":1,"unit":"oz"},{"ingredientId":105,"id":3885,"amount":1,"unit":"oz"},{"ingredientId":580,"id":3886,"amount":1,"unit":"oz"},{"ingredientId":276,"id":3887,"amount":1,"unit":"oz"},{"ingredientId":170,"id":3888,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3889,"amount":1,"unit":"oz"},{"ingredientId":82,"id":3890,"amount":1,"unit":"oz"},{"ingredientId":64,"id":3891,"amount":1,"unit":"oz"},{"ingredientId":582,"id":3892,"amount":1,"unit":"oz"},{"ingredientId":39,"id":3893,"amount":1,"unit":"oz"},{"ingredientId":403,"id":3894,"amount":1,"unit":"oz"},{"ingredientId":142,"id":3895,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3896,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3897,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3898,"amount":1,"unit":"oz"},{"ingredientId":167,"id":3899,"amount":1,"unit":"oz"},{"ingredientId":141,"id":3900,"amount":1,"unit":"oz"},{"ingredientId":213,"id":3901,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3902,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3903,"amount":1,"unit":"oz"},{"ingredientId":521,"id":3904,"amount":1,"unit":"oz"},{"ingredientId":206,"id":3905,"amount":1,"unit":"oz"},{"ingredientId":597,"id":3906,"amount":1,"unit":"oz"},{"ingredientId":84,"id":3907,"amount":1,"unit":"oz"},{"ingredientId":250,"id":3908,"amount":1,"unit":"oz"},{"ingredientId":542,"id":3909,"amount":1,"unit":"oz"},{"ingredientId":421,"id":3910,"amount":1,"unit":"oz"},{"ingredientId":254,"id":3911,"amount":1,"unit":"oz"},{"ingredientId":70,"id":3912,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3913,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3914,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3915,"amount":1,"unit":"oz"},{"ingredientId":48,"id":3916,"amount":1,"unit":"oz"},{"ingredientId":54,"id":3917,"amount":1,"unit":"oz"},{"ingredientId":98,"id":3918,"amount":1,"unit":"oz"},{"ingredientId":82,"id":3919,"amount":1,"unit":"oz"},{"ingredientId":487,"id":3920,"amount":1,"unit":"oz"},{"ingredientId":64,"id":3921,"amount":1,"unit":"oz"},{"ingredientId":542,"id":3922,"amount":1,"unit":"oz"},{"ingredientId":401,"id":3923,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3924,"amount":1,"unit":"oz"},{"ingredientId":109,"id":3925,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3926,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3927,"amount":1,"unit":"oz"},{"ingredientId":565,"id":3928,"amount":1,"unit":"oz"},{"ingredientId":16,"id":3929,"amount":1,"unit":"oz"},{"ingredientId":64,"id":3930,"amount":1,"unit":"oz"},{"ingredientId":292,"id":3931,"amount":1,"unit":"oz"},{"ingredientId":572,"id":3932,"amount":1,"unit":"oz"},{"ingredientId":81,"id":3933,"amount":1,"unit":"oz"},{"ingredientId":75,"id":3934,"amount":1,"unit":"oz"},{"ingredientId":435,"id":3935,"amount":1,"unit":"oz"},{"ingredientId":35,"id":3936,"amount":1,"unit":"oz"},{"ingredientId":515,"id":3937,"amount":1,"unit":"oz"},{"ingredientId":572,"id":3938,"amount":1,"unit":"oz"},{"ingredientId":79,"id":3939,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3940,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3941,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3942,"amount":1,"unit":"oz"},{"ingredientId":260,"id":3943,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3944,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3945,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3946,"amount":1,"unit":"oz"},{"ingredientId":413,"id":3947,"amount":1,"unit":"oz"},{"ingredientId":230,"id":3948,"amount":1,"unit":"oz"},{"ingredientId":511,"id":3949,"amount":1,"unit":"oz"},{"ingredientId":255,"id":3950,"amount":1,"unit":"oz"},{"ingredientId":105,"id":3951,"amount":1,"unit":"oz"},{"ingredientId":469,"id":3952,"amount":1,"unit":"oz"},{"ingredientId":59,"id":3953,"amount":1,"unit":"oz"},{"ingredientId":396,"id":3954,"amount":1,"unit":"oz"},{"ingredientId":429,"id":3955,"amount":1,"unit":"oz"},{"ingredientId":127,"id":3956,"amount":1,"unit":"oz"},{"ingredientId":54,"id":3957,"amount":1,"unit":"oz"},{"ingredientId":288,"id":3958,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3959,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3960,"amount":1,"unit":"oz"},{"ingredientId":360,"id":3961,"amount":1,"unit":"oz"},{"ingredientId":255,"id":3962,"amount":1,"unit":"oz"},{"ingredientId":272,"id":3963,"amount":1,"unit":"oz"},{"ingredientId":429,"id":3964,"amount":1,"unit":"oz"},{"ingredientId":494,"id":3965,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3966,"amount":1,"unit":"oz"},{"ingredientId":186,"id":3967,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3968,"amount":1,"unit":"oz"},{"ingredientId":440,"id":3969,"amount":1,"unit":"oz"},{"ingredientId":413,"id":3970,"amount":1,"unit":"oz"},{"ingredientId":253,"id":3971,"amount":1,"unit":"oz"},{"ingredientId":286,"id":3972,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3973,"amount":1,"unit":"oz"},{"ingredientId":23,"id":3974,"amount":1,"unit":"oz"},{"ingredientId":54,"id":3975,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3976,"amount":1,"unit":"oz"},{"ingredientId":405,"id":3977,"amount":1,"unit":"oz"},{"ingredientId":616,"id":3978,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3979,"amount":1,"unit":"oz"},{"ingredientId":439,"id":3980,"amount":1,"unit":"oz"},{"ingredientId":444,"id":3981,"amount":1,"unit":"oz"},{"ingredientId":8,"id":3982,"amount":1,"unit":"oz"},{"ingredientId":451,"id":3983,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3984,"amount":1,"unit":"oz"},{"ingredientId":432,"id":3985,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3986,"amount":1,"unit":"oz"},{"ingredientId":118,"id":3987,"amount":1,"unit":"oz"},{"ingredientId":612,"id":3988,"amount":1,"unit":"oz"},{"ingredientId":294,"id":3989,"amount":1,"unit":"oz"},{"ingredientId":391,"id":3990,"amount":1,"unit":"oz"},{"ingredientId":611,"id":3991,"amount":1,"unit":"oz"},{"ingredientId":65,"id":3992,"amount":1,"unit":"oz"},{"ingredientId":578,"id":3993,"amount":1,"unit":"oz"},{"ingredientId":542,"id":3994,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3995,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3996,"amount":1,"unit":"oz"},{"ingredientId":457,"id":3997,"amount":1,"unit":"oz"},{"ingredientId":386,"id":3998,"amount":1,"unit":"oz"},{"ingredientId":531,"id":3999,"amount":1,"unit":"oz"},{"ingredientId":230,"id":4000,"amount":1,"unit":"oz"},{"ingredientId":469,"id":4001,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4002,"amount":1,"unit":"oz"},{"ingredientId":65,"id":4003,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4004,"amount":1,"unit":"oz"},{"ingredientId":294,"id":4005,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4006,"amount":1,"unit":"oz"},{"ingredientId":466,"id":4007,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4008,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4009,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4010,"amount":1,"unit":"oz"},{"ingredientId":546,"id":4011,"amount":1,"unit":"oz"},{"ingredientId":89,"id":4012,"amount":1,"unit":"oz"},{"ingredientId":414,"id":4013,"amount":1,"unit":"oz"},{"ingredientId":74,"id":4014,"amount":1,"unit":"oz"},{"ingredientId":433,"id":4015,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4016,"amount":1,"unit":"oz"},{"ingredientId":87,"id":4017,"amount":1,"unit":"oz"},{"ingredientId":268,"id":4018,"amount":1,"unit":"oz"},{"ingredientId":156,"id":4019,"amount":1,"unit":"oz"},{"ingredientId":131,"id":4020,"amount":1,"unit":"oz"},{"ingredientId":54,"id":4021,"amount":1,"unit":"oz"},{"ingredientId":244,"id":4022,"amount":1,"unit":"oz"},{"ingredientId":429,"id":4023,"amount":1,"unit":"oz"},{"ingredientId":206,"id":4024,"amount":1,"unit":"oz"},{"ingredientId":529,"id":4025,"amount":1,"unit":"oz"},{"ingredientId":435,"id":4026,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4027,"amount":1,"unit":"oz"},{"ingredientId":64,"id":4028,"amount":1,"unit":"oz"},{"ingredientId":512,"id":4029,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4030,"amount":1,"unit":"oz"},{"ingredientId":401,"id":4031,"amount":1,"unit":"oz"},{"ingredientId":478,"id":4032,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4033,"amount":1,"unit":"oz"},{"ingredientId":16,"id":4034,"amount":1,"unit":"oz"},{"ingredientId":588,"id":4035,"amount":1,"unit":"oz"},{"ingredientId":576,"id":4036,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4037,"amount":1,"unit":"oz"},{"ingredientId":429,"id":4038,"amount":1,"unit":"oz"},{"ingredientId":19,"id":4039,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4040,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4041,"amount":1,"unit":"oz"},{"ingredientId":413,"id":4042,"amount":1,"unit":"oz"},{"ingredientId":516,"id":4043,"amount":1,"unit":"oz"},{"ingredientId":92,"id":4044,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4045,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4046,"amount":1,"unit":"oz"},{"ingredientId":432,"id":4047,"amount":1,"unit":"oz"},{"ingredientId":250,"id":4048,"amount":1,"unit":"oz"},{"ingredientId":213,"id":4049,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4050,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4051,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4052,"amount":1,"unit":"oz"},{"ingredientId":431,"id":4053,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4054,"amount":1,"unit":"oz"},{"ingredientId":536,"id":4055,"amount":1,"unit":"oz"},{"ingredientId":453,"id":4056,"amount":1,"unit":"oz"},{"ingredientId":485,"id":4057,"amount":1,"unit":"oz"},{"ingredientId":240,"id":4058,"amount":1,"unit":"oz"},{"ingredientId":472,"id":4059,"amount":1,"unit":"oz"},{"ingredientId":611,"id":4060,"amount":1,"unit":"oz"},{"ingredientId":512,"id":4061,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4062,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4063,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4064,"amount":1,"unit":"oz"},{"ingredientId":276,"id":4065,"amount":1,"unit":"oz"},{"ingredientId":347,"id":4066,"amount":1,"unit":"oz"},{"ingredientId":246,"id":4067,"amount":1,"unit":"oz"},{"ingredientId":81,"id":4068,"amount":1,"unit":"oz"},{"ingredientId":516,"id":4069,"amount":1,"unit":"oz"},{"ingredientId":576,"id":4070,"amount":1,"unit":"oz"},{"ingredientId":173,"id":4071,"amount":1,"unit":"oz"},{"ingredientId":5,"id":4072,"amount":1,"unit":"oz"},{"ingredientId":15,"id":4073,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4074,"amount":1,"unit":"oz"},{"ingredientId":9,"id":4075,"amount":1,"unit":"oz"},{"ingredientId":616,"id":4076,"amount":1,"unit":"oz"},{"ingredientId":601,"id":4077,"amount":1,"unit":"oz"},{"ingredientId":16,"id":4078,"amount":1,"unit":"oz"},{"ingredientId":63,"id":4079,"amount":1,"unit":"oz"},{"ingredientId":25,"id":4080,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4081,"amount":1,"unit":"oz"},{"ingredientId":494,"id":4082,"amount":1,"unit":"oz"},{"ingredientId":616,"id":4083,"amount":1,"unit":"oz"},{"ingredientId":581,"id":4084,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4085,"amount":1,"unit":"oz"},{"ingredientId":9,"id":4086,"amount":1,"unit":"oz"},{"ingredientId":565,"id":4087,"amount":1,"unit":"oz"},{"ingredientId":141,"id":4088,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4089,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4090,"amount":1,"unit":"oz"},{"ingredientId":118,"id":4091,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4092,"amount":1,"unit":"oz"},{"ingredientId":435,"id":4093,"amount":1,"unit":"oz"},{"ingredientId":501,"id":4094,"amount":1,"unit":"oz"},{"ingredientId":294,"id":4095,"amount":1,"unit":"oz"},{"ingredientId":127,"id":4096,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4097,"amount":1,"unit":"oz"},{"ingredientId":227,"id":4098,"amount":1,"unit":"oz"},{"ingredientId":574,"id":4099,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4100,"amount":1,"unit":"oz"},{"ingredientId":432,"id":4101,"amount":1,"unit":"oz"},{"ingredientId":22,"id":4102,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4103,"amount":1,"unit":"oz"},{"ingredientId":440,"id":4104,"amount":1,"unit":"oz"},{"ingredientId":278,"id":4105,"amount":1,"unit":"oz"},{"ingredientId":253,"id":4106,"amount":1,"unit":"oz"},{"ingredientId":257,"id":4107,"amount":1,"unit":"oz"},{"ingredientId":456,"id":4108,"amount":1,"unit":"oz"},{"ingredientId":129,"id":4109,"amount":1,"unit":"oz"},{"ingredientId":578,"id":4110,"amount":1,"unit":"oz"},{"ingredientId":432,"id":4111,"amount":1,"unit":"oz"},{"ingredientId":546,"id":4112,"amount":1,"unit":"oz"},{"ingredientId":576,"id":4113,"amount":1,"unit":"oz"},{"ingredientId":105,"id":4114,"amount":1,"unit":"oz"},{"ingredientId":256,"id":4115,"amount":1,"unit":"oz"},{"ingredientId":170,"id":4116,"amount":1,"unit":"oz"},{"ingredientId":482,"id":4117,"amount":1,"unit":"oz"},{"ingredientId":491,"id":4118,"amount":1,"unit":"oz"},{"ingredientId":580,"id":4119,"amount":1,"unit":"oz"},{"ingredientId":255,"id":4120,"amount":1,"unit":"oz"},{"ingredientId":105,"id":4121,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4122,"amount":1,"unit":"oz"},{"ingredientId":19,"id":4123,"amount":1,"unit":"oz"},{"ingredientId":597,"id":4124,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4125,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4126,"amount":1,"unit":"oz"},{"ingredientId":440,"id":4127,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4128,"amount":1,"unit":"oz"},{"ingredientId":263,"id":4129,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4130,"amount":1,"unit":"oz"},{"ingredientId":433,"id":4131,"amount":1,"unit":"oz"},{"ingredientId":267,"id":4132,"amount":1,"unit":"oz"},{"ingredientId":129,"id":4133,"amount":1,"unit":"oz"},{"ingredientId":244,"id":4134,"amount":1,"unit":"oz"},{"ingredientId":512,"id":4135,"amount":1,"unit":"oz"},{"ingredientId":568,"id":4136,"amount":1,"unit":"oz"},{"ingredientId":441,"id":4137,"amount":1,"unit":"oz"},{"ingredientId":571,"id":4138,"amount":1,"unit":"oz"},{"ingredientId":429,"id":4139,"amount":1,"unit":"oz"},{"ingredientId":534,"id":4140,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4141,"amount":1,"unit":"oz"},{"ingredientId":280,"id":4142,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4143,"amount":1,"unit":"oz"},{"ingredientId":452,"id":4144,"amount":1,"unit":"oz"},{"ingredientId":599,"id":4145,"amount":1,"unit":"oz"},{"ingredientId":108,"id":4146,"amount":1,"unit":"oz"},{"ingredientId":512,"id":4147,"amount":1,"unit":"oz"},{"ingredientId":82,"id":4148,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4149,"amount":1,"unit":"oz"},{"ingredientId":572,"id":4150,"amount":1,"unit":"oz"},{"ingredientId":146,"id":4151,"amount":1,"unit":"oz"},{"ingredientId":433,"id":4152,"amount":1,"unit":"oz"},{"ingredientId":82,"id":4153,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4154,"amount":1,"unit":"oz"},{"ingredientId":490,"id":4155,"amount":1,"unit":"oz"},{"ingredientId":288,"id":4156,"amount":1,"unit":"oz"},{"ingredientId":82,"id":4157,"amount":1,"unit":"oz"},{"ingredientId":429,"id":4158,"amount":1,"unit":"oz"},{"ingredientId":254,"id":4159,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4160,"amount":1,"unit":"oz"},{"ingredientId":288,"id":4161,"amount":1,"unit":"oz"},{"ingredientId":574,"id":4162,"amount":1,"unit":"oz"},{"ingredientId":530,"id":4163,"amount":1,"unit":"oz"},{"ingredientId":96,"id":4164,"amount":1,"unit":"oz"},{"ingredientId":377,"id":4165,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4166,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4167,"amount":1,"unit":"oz"},{"ingredientId":4,"id":4168,"amount":1,"unit":"oz"},{"ingredientId":530,"id":4169,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4170,"amount":1,"unit":"oz"},{"ingredientId":200,"id":4171,"amount":1,"unit":"oz"},{"ingredientId":433,"id":4172,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4173,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4174,"amount":1,"unit":"oz"},{"ingredientId":114,"id":4175,"amount":1,"unit":"oz"},{"ingredientId":105,"id":4176,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4177,"amount":1,"unit":"oz"},{"ingredientId":288,"id":4178,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4179,"amount":1,"unit":"oz"},{"ingredientId":74,"id":4180,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4181,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4182,"amount":1,"unit":"oz"},{"ingredientId":82,"id":4183,"amount":1,"unit":"oz"},{"ingredientId":511,"id":4184,"amount":1,"unit":"oz"},{"ingredientId":388,"id":4185,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4186,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4187,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4188,"amount":1,"unit":"oz"},{"ingredientId":264,"id":4189,"amount":1,"unit":"oz"},{"ingredientId":373,"id":4190,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4191,"amount":1,"unit":"oz"},{"ingredientId":459,"id":4192,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4193,"amount":1,"unit":"oz"},{"ingredientId":488,"id":4194,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4195,"amount":1,"unit":"oz"},{"ingredientId":129,"id":4196,"amount":1,"unit":"oz"},{"ingredientId":509,"id":4197,"amount":1,"unit":"oz"},{"ingredientId":187,"id":4198,"amount":1,"unit":"oz"},{"ingredientId":167,"id":4199,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4200,"amount":1,"unit":"oz"},{"ingredientId":459,"id":4201,"amount":1,"unit":"oz"},{"ingredientId":469,"id":4202,"amount":1,"unit":"oz"},{"ingredientId":173,"id":4203,"amount":1,"unit":"oz"},{"ingredientId":294,"id":4204,"amount":1,"unit":"oz"},{"ingredientId":433,"id":4205,"amount":1,"unit":"oz"},{"ingredientId":98,"id":4206,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4207,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4208,"amount":1,"unit":"oz"},{"ingredientId":488,"id":4209,"amount":1,"unit":"oz"},{"ingredientId":532,"id":4210,"amount":1,"unit":"oz"},{"ingredientId":59,"id":4211,"amount":1,"unit":"oz"},{"ingredientId":435,"id":4212,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4213,"amount":1,"unit":"oz"},{"ingredientId":542,"id":4214,"amount":1,"unit":"oz"},{"ingredientId":469,"id":4215,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4216,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4217,"amount":1,"unit":"oz"},{"ingredientId":367,"id":4218,"amount":1,"unit":"oz"},{"ingredientId":576,"id":4219,"amount":1,"unit":"oz"},{"ingredientId":255,"id":4220,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4221,"amount":1,"unit":"oz"},{"ingredientId":429,"id":4222,"amount":1,"unit":"oz"},{"ingredientId":512,"id":4223,"amount":1,"unit":"oz"},{"ingredientId":64,"id":4224,"amount":1,"unit":"oz"},{"ingredientId":35,"id":4225,"amount":1,"unit":"oz"},{"ingredientId":59,"id":4226,"amount":1,"unit":"oz"},{"ingredientId":294,"id":4227,"amount":1,"unit":"oz"},{"ingredientId":469,"id":4228,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4229,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4230,"amount":1,"unit":"oz"},{"ingredientId":413,"id":4231,"amount":1,"unit":"oz"},{"ingredientId":250,"id":4232,"amount":1,"unit":"oz"},{"ingredientId":104,"id":4233,"amount":1,"unit":"oz"},{"ingredientId":54,"id":4234,"amount":1,"unit":"oz"},{"ingredientId":436,"id":4235,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4236,"amount":1,"unit":"oz"},{"ingredientId":524,"id":4237,"amount":1,"unit":"oz"},{"ingredientId":249,"id":4238,"amount":1,"unit":"oz"},{"ingredientId":267,"id":4239,"amount":1,"unit":"oz"},{"ingredientId":151,"id":4240,"amount":1,"unit":"oz"},{"ingredientId":82,"id":4241,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4242,"amount":1,"unit":"oz"},{"ingredientId":571,"id":4243,"amount":1,"unit":"oz"},{"ingredientId":249,"id":4244,"amount":1,"unit":"oz"},{"ingredientId":448,"id":4245,"amount":1,"unit":"oz"},{"ingredientId":292,"id":4246,"amount":1,"unit":"oz"},{"ingredientId":432,"id":4247,"amount":1,"unit":"oz"},{"ingredientId":468,"id":4248,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4249,"amount":1,"unit":"oz"},{"ingredientId":43,"id":4250,"amount":1,"unit":"oz"},{"ingredientId":303,"id":4251,"amount":1,"unit":"oz"},{"ingredientId":469,"id":4252,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4253,"amount":1,"unit":"oz"},{"ingredientId":288,"id":4254,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4255,"amount":1,"unit":"oz"},{"ingredientId":392,"id":4256,"amount":1,"unit":"oz"},{"ingredientId":432,"id":4257,"amount":1,"unit":"oz"},{"ingredientId":616,"id":4258,"amount":1,"unit":"oz"},{"ingredientId":82,"id":4259,"amount":1,"unit":"oz"},{"ingredientId":142,"id":4260,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4261,"amount":1,"unit":"oz"},{"ingredientId":292,"id":4262,"amount":1,"unit":"oz"},{"ingredientId":38,"id":4263,"amount":1,"unit":"oz"},{"ingredientId":566,"id":4264,"amount":1,"unit":"oz"},{"ingredientId":413,"id":4265,"amount":1,"unit":"oz"},{"ingredientId":191,"id":4266,"amount":1,"unit":"oz"},{"ingredientId":299,"id":4267,"amount":1,"unit":"oz"},{"ingredientId":272,"id":4268,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4269,"amount":1,"unit":"oz"},{"ingredientId":142,"id":4270,"amount":1,"unit":"oz"},{"ingredientId":176,"id":4271,"amount":1,"unit":"oz"},{"ingredientId":133,"id":4272,"amount":1,"unit":"oz"},{"ingredientId":360,"id":4273,"amount":1,"unit":"oz"},{"ingredientId":576,"id":4274,"amount":1,"unit":"oz"},{"ingredientId":21,"id":4275,"amount":1,"unit":"oz"},{"ingredientId":574,"id":4276,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4277,"amount":1,"unit":"oz"},{"ingredientId":424,"id":4278,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4279,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4280,"amount":1,"unit":"oz"},{"ingredientId":125,"id":4281,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4282,"amount":1,"unit":"oz"},{"ingredientId":9,"id":4283,"amount":1,"unit":"oz"},{"ingredientId":515,"id":4284,"amount":1,"unit":"oz"},{"ingredientId":170,"id":4285,"amount":1,"unit":"oz"},{"ingredientId":581,"id":4286,"amount":1,"unit":"oz"},{"ingredientId":31,"id":4287,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4288,"amount":1,"unit":"oz"},{"ingredientId":74,"id":4289,"amount":1,"unit":"oz"},{"ingredientId":397,"id":4290,"amount":1,"unit":"oz"},{"ingredientId":38,"id":4291,"amount":1,"unit":"oz"},{"ingredientId":446,"id":4292,"amount":1,"unit":"oz"},{"ingredientId":585,"id":4293,"amount":1,"unit":"oz"},{"ingredientId":115,"id":4294,"amount":1,"unit":"oz"},{"ingredientId":405,"id":4295,"amount":1,"unit":"oz"},{"ingredientId":98,"id":4296,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4297,"amount":1,"unit":"oz"},{"ingredientId":469,"id":4298,"amount":1,"unit":"oz"},{"ingredientId":255,"id":4299,"amount":1,"unit":"oz"},{"ingredientId":402,"id":4300,"amount":1,"unit":"oz"},{"ingredientId":429,"id":4301,"amount":1,"unit":"oz"},{"ingredientId":515,"id":4302,"amount":1,"unit":"oz"},{"ingredientId":397,"id":4303,"amount":1,"unit":"oz"},{"ingredientId":435,"id":4304,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4305,"amount":1,"unit":"oz"},{"ingredientId":128,"id":4306,"amount":1,"unit":"oz"},{"ingredientId":255,"id":4307,"amount":1,"unit":"oz"},{"ingredientId":272,"id":4308,"amount":1,"unit":"oz"},{"ingredientId":288,"id":4309,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4310,"amount":1,"unit":"oz"},{"ingredientId":288,"id":4311,"amount":1,"unit":"oz"},{"ingredientId":292,"id":4312,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4313,"amount":1,"unit":"oz"},{"ingredientId":413,"id":4314,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4315,"amount":1,"unit":"oz"},{"ingredientId":206,"id":4316,"amount":1,"unit":"oz"},{"ingredientId":54,"id":4317,"amount":1,"unit":"oz"},{"ingredientId":219,"id":4318,"amount":1,"unit":"oz"},{"ingredientId":469,"id":4319,"amount":1,"unit":"oz"},{"ingredientId":607,"id":4320,"amount":1,"unit":"oz"},{"ingredientId":54,"id":4321,"amount":1,"unit":"oz"},{"ingredientId":469,"id":4322,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4323,"amount":1,"unit":"oz"},{"ingredientId":261,"id":4324,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4325,"amount":1,"unit":"oz"},{"ingredientId":518,"id":4326,"amount":1,"unit":"oz"},{"ingredientId":206,"id":4327,"amount":1,"unit":"oz"},{"ingredientId":576,"id":4328,"amount":1,"unit":"oz"},{"ingredientId":98,"id":4329,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4330,"amount":1,"unit":"oz"},{"ingredientId":82,"id":4331,"amount":1,"unit":"oz"},{"ingredientId":512,"id":4332,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4333,"amount":1,"unit":"oz"},{"ingredientId":432,"id":4334,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4335,"amount":1,"unit":"oz"},{"ingredientId":473,"id":4336,"amount":1,"unit":"oz"},{"ingredientId":469,"id":4337,"amount":1,"unit":"oz"},{"ingredientId":226,"id":4338,"amount":1,"unit":"oz"},{"ingredientId":433,"id":4339,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4340,"amount":1,"unit":"oz"},{"ingredientId":362,"id":4341,"amount":1,"unit":"oz"},{"ingredientId":54,"id":4342,"amount":1,"unit":"oz"},{"ingredientId":433,"id":4343,"amount":1,"unit":"oz"},{"ingredientId":429,"id":4344,"amount":1,"unit":"oz"},{"ingredientId":381,"id":4345,"amount":1,"unit":"oz"},{"ingredientId":213,"id":4346,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4347,"amount":1,"unit":"oz"},{"ingredientId":442,"id":4348,"amount":1,"unit":"oz"},{"ingredientId":440,"id":4349,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4350,"amount":1,"unit":"oz"},{"ingredientId":512,"id":4351,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4352,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4353,"amount":1,"unit":"oz"},{"ingredientId":413,"id":4354,"amount":1,"unit":"oz"},{"ingredientId":469,"id":4355,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4356,"amount":1,"unit":"oz"},{"ingredientId":568,"id":4357,"amount":1,"unit":"oz"},{"ingredientId":73,"id":4358,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4359,"amount":1,"unit":"oz"},{"ingredientId":250,"id":4360,"amount":1,"unit":"oz"},{"ingredientId":433,"id":4361,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4362,"amount":1,"unit":"oz"},{"ingredientId":531,"id":4363,"amount":1,"unit":"oz"},{"ingredientId":260,"id":4364,"amount":1,"unit":"oz"},{"ingredientId":469,"id":4365,"amount":1,"unit":"oz"},{"ingredientId":54,"id":4366,"amount":1,"unit":"oz"},{"ingredientId":575,"id":4367,"amount":1,"unit":"oz"},{"ingredientId":64,"id":4368,"amount":1,"unit":"oz"},{"ingredientId":616,"id":4369,"amount":1,"unit":"oz"},{"ingredientId":98,"id":4370,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4371,"amount":1,"unit":"oz"},{"ingredientId":126,"id":4372,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4373,"amount":1,"unit":"oz"},{"ingredientId":568,"id":4374,"amount":1,"unit":"oz"},{"ingredientId":63,"id":4375,"amount":1,"unit":"oz"},{"ingredientId":128,"id":4376,"amount":1,"unit":"oz"},{"ingredientId":397,"id":4377,"amount":1,"unit":"oz"},{"ingredientId":98,"id":4378,"amount":1,"unit":"oz"},{"ingredientId":429,"id":4379,"amount":1,"unit":"oz"},{"ingredientId":64,"id":4380,"amount":1,"unit":"oz"},{"ingredientId":56,"id":4381,"amount":1,"unit":"oz"},{"ingredientId":481,"id":4382,"amount":1,"unit":"oz"},{"ingredientId":81,"id":4383,"amount":1,"unit":"oz"},{"ingredientId":371,"id":4384,"amount":1,"unit":"oz"},{"ingredientId":549,"id":4385,"amount":1,"unit":"oz"},{"ingredientId":386,"id":4386,"amount":1,"unit":"oz"},{"ingredientId":391,"id":4387,"amount":1,"unit":"oz"},{"ingredientId":267,"id":4388,"amount":1,"unit":"oz"},{"ingredientId":594,"id":4389,"amount":1,"unit":"oz"},{"ingredientId":294,"id":4390,"amount":1,"unit":"oz"},{"ingredientId":4,"id":4391,"amount":1,"unit":"oz"},{"ingredientId":79,"id":4392,"amount":1,"unit":"oz"}]};exports.default=loadSampleData;

},{"./actions.es6":"/Users/iangm/Code/imbible/src/client/actions.es6"}],"/Users/iangm/Code/imbible/src/client/main.es6":[function(require,module,exports){
"use strict";

require("babel-polyfill");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reducers = require("./reducers.es6");

var _reducers2 = _interopRequireDefault(_reducers);

var _loadSampleData = require("./loadSampleData.es6");

var _loadSampleData2 = _interopRequireDefault(_loadSampleData);

var _ImbibleRouterReact = require("./components/ImbibleRouter.react.es6");

var _ImbibleRouterReact2 = _interopRequireDefault(_ImbibleRouterReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = (0, _redux.createStore)(_reducers2.default);
(0, _loadSampleData2.default)(store);
_reactDom2.default.render(_react2.default.createElement(
  _reactRedux.Provider,
  { store: store },
  _ImbibleRouterReact2.default
), document.getElementById('react-content'));

},{"./components/ImbibleRouter.react.es6":"/Users/iangm/Code/imbible/src/client/components/ImbibleRouter.react.es6","./loadSampleData.es6":"/Users/iangm/Code/imbible/src/client/loadSampleData.es6","./reducers.es6":"/Users/iangm/Code/imbible/src/client/reducers.es6","babel-polyfill":"/Users/iangm/Code/imbible/node_modules/babel-polyfill/lib/index.js","react":"react","react-dom":"react-dom","react-redux":"react-redux","redux":"redux"}],"/Users/iangm/Code/imbible/src/client/reducers.es6":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _actions = require('./actions.es6');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function drinks() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? _immutable2.default.OrderedMap() : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.ADD_DRINK:
      return state.set(action.drink.id, action.drink);
    default:
      return state;
  }
}

function drinkIngredients() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? _immutable2.default.OrderedMap() : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.ADD_DRINK_INGREDIENT:
      return state.set(action.drinkIngredient.id, action.drinkIngredient);
    default:
      return state;
  }
}

function ingredients() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? _immutable2.default.OrderedMap() : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.ADD_INGREDIENT:
      return state.set(action.ingredient.id, action.ingredient);
    default:
      return state;
  }
}

function ingredientTypes() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? _immutable2.default.OrderedMap() : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.ADD_INGREDIENT_TYPE:
      return state.set(action.ingredientType.id, action.ingredientType);
    default:
      return state;
  }
}

function autoSuggest() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? _immutable2.default.Map({ value: '', suggestions: [], pickedSuggestions: [] }) : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.INPUT_CHANGE:
      return state.set('value', action.value);
    case _actions.SUGGESTION_ADDED:
      return state.set('pickedSuggestions', state.get('pickedSuggestions').concat(action.suggestion)).set('value', '');
    case _actions.SUGGESTION_REMOVED:
      return state.set('pickedSuggestions', state.get('pickedSuggestions').filter(function (ingr) {
        return ingr.id !== action.id;
      }));
    default:
      return state;
  }
}

var drinksApp = (0, _redux.combineReducers)({
  drinks: drinks,
  drinkIngredients: drinkIngredients,
  ingredients: ingredients,
  ingredientTypes: ingredientTypes,
  autoSuggest: autoSuggest
});

exports.default = drinksApp;

},{"./actions.es6":"/Users/iangm/Code/imbible/src/client/actions.es6","immutable":"immutable","redux":"redux"}]},{},["/Users/iangm/Code/imbible/src/client/main.es6"]);
