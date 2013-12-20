
exports.check = function (sr, cb) {
    sr.checkSelector("body > div.head:first-child", "headers.div-head", cb);
};
