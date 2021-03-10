const self = {
    name: 'style.body-toc-sidebar',
};

exports.name = self.name;

exports.check = function (sr, done) {
    try {
        const body = sr.jsDocument.querySelector('body');
        if (body && body.classList.contains('toc-sidebar'))
            sr.error(self, 'class-found');
    } catch (e) {
        sr.error(self, 'selector-fail');
    }
    done();
};
