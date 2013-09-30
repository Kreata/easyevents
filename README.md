# easyevents

Adds event capabilities to any constructor

### Volo

Install with [volo](http://volojs.org/):

    volo add Kreata/easyevents/v0.1.0

### AMD

Require [easyevents.js](easyevents.js) as `easyevents`

### Global context

Include file [easyevents.js](easyevents.js) on the page.

```html
<script src="easyevents.js"></script>
```

This exposes global variable `easyevents`

## Usage

Run `easyevents.apply(this)` in the constructor function and `easyevents.extend(ConstructorName)` outside of it.

```javascript
function MyConstructor(){
    easyevents.apply(this);
}
easyevents.extend(MyConstructor);
```

The constructor inherits the following methods

  * **emit** *(eventName[, param1, param2, ..., paramN])* - emits selected event
  * **on** (alias for **addListener**) *(eventName, handler)* - Sets up a handler for an event
  * **removeListener** *(eventName, handler)* - Removes a handler

### Example

The following script defines an emitter that emits an incrementing number every second.

```javascript
function MyConstructor(){
    easyevents.apply(this);
}
easyevents.extend(MyConstructor);

var instance = new MyConstructor(),
    i = 0,
    handler = function(val){
        console.log("Received nr %s", val);  
    };

instance.on("counter", handler);

var interval = setInterval(function(){
    console.log("Emit nr %s", ++i);
    instance.emit("counter", i);
    if(i >= 4){
        instance.removeListener("counter", handler);
    }
    if(i >= 6){
        clearInterval(interval);
    }
}, 1000);
```

The result of such a script should be:

```bash
"Emit nr 1"
"Received nr 1"
"Emit nr 2"
"Received nr 2"
"Emit nr 3"
"Received nr 3"
"Emit nr 4"
"Received nr 4" <- Event handler is cleared after 4
"Emit nr 5"
"Emit nr 6" <- Interval is cleared after 6
```

## License

**MIT**