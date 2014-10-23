
var sua = require("superagent")
,   delay = 1000
,   lastCall = Date.now() - (delay * 2)
;

function fixEnd (req) {
    var oldEnd = req.end;
    req.end = function (cb) {
        var next = 0
        ,   now = Date.now()
        ;
        if (now - lastCall < delay) next = delay - (now - lastCall);
        lastCall = now;
        setTimeout(function () { return oldEnd.call(req, cb); }, next);
        return req;
    };
    return req;
}

// this explicitly does not support the superagent call variant in which a callback
// is provided directly
// exports = function () {
//     var req = sua.apply(sua, arguments);
//     return fixEnd(req);
// };

exports.get = process.env.NO_THROTTLE ? sua.get : function () {
    console.log("###THROTTLE");
    var req = sua.get.apply(sua, arguments);
    return fixEnd(req);
};

exports.post = process.env.NO_THROTTLE ? sua.post : function () {
    console.log("###THROTTLE");
    var req = sua.post.apply(sua, arguments);
    return fixEnd(req);
};

