exports.name = "style.body-toc-sidebar";
exports.check = function (sr, done) {
    try {
        if (sr.$('body').hasClass('toc-sidebar')) sr.error(this.name, "class-found");
    }
    catch (e) {
        sr.error(this.name, "selector-fail");
    }
    done();
};
