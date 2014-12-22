'use strict';

exports.name = "validation.wcag";
exports.check = function (sr, done) {
    sr.info(exports.name, "tools");
    return done();
};
