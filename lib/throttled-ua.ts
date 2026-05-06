import sua from 'superagent';

const delay = 1000;
let lastCall = Date.now() - delay * 2;

function fixEnd(req: sua.Request) {
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

export const get = process.env.NO_THROTTLE
    ? sua.get
    : function () {
          //@ts-ignore (arguments type mismatch)
          const req = sua.get.apply(sua, arguments);
          return fixEnd(req);
      };

export const post = process.env.NO_THROTTLE
    ? sua.post
    : function () {
          //@ts-ignore (arguments type mismatch)
          const req = sua.post.apply(sua, arguments);
          return fixEnd(req);
      };
