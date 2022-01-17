const sua = require('superagent');

const delay = 1000;
let lastCall = Date.now() - delay * 2;

/**
 * @param req
 */
function fixEnd(req) {
    const oldEnd = req.end;
    req.end = function (cb) {
        let next = 0;
        const now = Date.now();
        if (now - lastCall < delay) next = delay - (now - lastCall);
        lastCall = now;
        setTimeout(() => oldEnd.call(req, cb), next);
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

exports.get = process.env.NO_THROTTLE
    ? sua.get
    : function () {
          // eslint-disable-next-line prefer-spread, prefer-rest-params
          const req = sua.get.apply(sua, arguments);
          return fixEnd(req);
      };

exports.post = process.env.NO_THROTTLE
    ? sua.post
    : function () {
          // eslint-disable-next-line prefer-spread, prefer-rest-params
          const req = sua.post.apply(sua, arguments);
          return fixEnd(req);
      };
