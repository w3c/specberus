
exports.name = "headers.hr";
exports.check = function (sr, done) {
    var hasHrLastChild = (sr.$("body div.head > hr:last-child").length === 1) ? true : false
    ,   hasHrNextSibling = (sr.$("body div.head + hr").length === 1) ? true : false
    ;
    if ((hasHrLastChild && !hasHrNextSibling) ||
        (!hasHrLastChild && hasHrNextSibling)) {
        done();
    }
    else if (hasHrLastChild && hasHrNextSibling) {
        sr.error(exports.name, "duplicate");
    }
    else {
        sr.error(exports.name, "not-found");
    }
};
