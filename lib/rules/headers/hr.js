
// XXX this should probably check that there is only one of the two options
exports.name = "headers.hr";
exports.check = function (sr, done) {
    sr.checkSelector("body > div.head:first-child > hr:last-child, body > div.head:first-child + hr"
                ,    this.name
                ,    done);
};
