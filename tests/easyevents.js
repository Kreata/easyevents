

asyncTest("Add Events to constructor", function(){
    expect(2);

    var MyConstructor = function(){
        easyevents.apply(this);
    }
    easyevents.extend(MyConstructor);

    var instance = new MyConstructor();

    instance.on("test", function(param1, param2){
        deepEqual(param1, {a:1, b: [2, 3]});
        deepEqual(param2, {a:4, b: [1, 3]});
        start();
    });

    setTimeout(function(){
        instance.emit("test", {a:1, b: [2, 3]}, {a:4, b: [1, 3]});
    }, 400);
});
