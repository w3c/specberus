const self = {
    name: 'style.body-toc-sidebar'
};

exports.name = self.name;

exports.check = function (sr, done) {
    try {
        if (sr.$('body').hasClass('toc-sidebar')) sr.error(self, "class-found");
    }
    catch (e) {
        sr.error(self, "selector-fail");
    }
    done();
};
