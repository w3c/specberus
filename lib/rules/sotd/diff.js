'use strict';

exports.name = "sotd.diff";
exports.check = function (sr, done) {
    sr.info(exports.name, "note");
    return done();
};
