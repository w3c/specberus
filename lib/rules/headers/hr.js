
exports.name = "headers.hr";
exports.check = function (sr, done) {
    var hasHrLastChild = (sr.$("body div.head > hr:last-child").length === 1)
    ,   hasHrNextSibling = (sr.$("body div.head + hr").length === 1);
    if (hasHrLastChild && hasHrNextSibling) {
        sr.error(exports.name, "duplicate");
    }
    else if (!hasHrLastChild && !hasHrNextSibling) {
        sr.error(exports.name, "not-found");
    }
    done();
};
