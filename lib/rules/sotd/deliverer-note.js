const self = {
    name: 'sotd.deliverer-note'
};

exports.check = function (sr, done) {
    const deliverers = sr.getDelivererIDsNote();

    if (0 === deliverers.length)
        sr.error(self, "not-found");
    done();
};
