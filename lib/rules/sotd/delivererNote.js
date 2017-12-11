const self = {
    name: 'sotd.delivererNote'
};

exports.check = function (sr, done) {
    const deliverers = sr.getDelivererIDsNote();

    if (0 === deliverers.length)
        sr.error(self, "not-found");
    done();
};
