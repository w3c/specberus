
// XXX this should probably check that there is only one of the two options
exports.check = function (sr, cb) {
    sr.checkSelector("body > div.head:first-child > hr:last-child, body > div.head:first-child + hr"
                ,    "headers.hr"
                ,    cb);
};
