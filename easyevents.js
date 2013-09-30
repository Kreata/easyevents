// Copyright (c) 2013 Andris Reinman
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// AMD shim
(function(root, factory) {

    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.easyevents = factory();
    }
}(this, function() {

    "use strict";

    /**
     * Adds event capabilities to a constructor.
     *
     * Adds the following methods to the target constructor:
     *
     * instance.emit(eventStr, dataObj)
     * instance.on(eventStr, handlerFunc)
     * instance.removeListener(eventStr, handlerFunc)
     *
     * Usage:
     *  function MyConstructor(){
     *    easyevents.apply(this);
     *  }
     *  easyevents.extend(MyConstructor);
     *
     * @constructor
     */
    function easyevents(){
        this._eventsPaused = false;
        this._eventEmitter = document.createElement("link");
    };

    easyevents.prototype.write = function(data){};

    easyevents.prototype.end = function(data){};

    easyevents.prototype.pause = function(){
        this._eventsPaused = true;
    };

    easyevents.prototype.resume = function(){
        this._eventsPaused = false;
        this.emit("drain");
    };

    easyevents.prototype.emit = function(event, data){
        var args = Array.prototype.slice.call(arguments),
            event = args.shift(),
            trigger = new CustomEvent(event, {detail: {args: args}});

        this._eventEmitter.dispatchEvent(trigger);
        return this;
    };

    easyevents.prototype.on = easyevents.prototype.addListener = function(event, handler){
        if(!handler._actualHandler){
            handler._actualHandler = function(e){
                if(e.detail && Array.isArray(e.detail.args)){
                    handler.apply(null, e.detail.args);
                }
            }
        }
        this._eventEmitter.addEventListener(event, handler._actualHandler, false);
        return this;
    };

    easyevents.prototype.removeListener = function(event, handler){
        this._eventEmitter.removeEventListener(event, handler._actualHandler, false);
        delete handler._actualHandler;
        return this;
    };

    easyevents.extend = function(target){
        var keys = Object.keys(easyevents.prototype),
            i, len;

        for(i = 0, len = keys.length; i < len; i++){
            if(typeof !target.prototype[keys[i]] != typeof easyevents.prototype[keys[i]]){
                target.prototype[keys[i]] = easyevents.prototype[keys[i]];
            }
        }

        easyevents.call(target);
    };

    return easyevents;
}));