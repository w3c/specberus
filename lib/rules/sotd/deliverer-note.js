const self = {
    name: 'sotd.deliverer-note'
,   section: 'metadata'
,   rule: 'delivererID'
};

exports.name = self.name;

exports.check = function (sr, done) {
    const deliverers = sr.getDelivererIDsNote();

    if (0 === deliverers.length)
        sr.error(self, "not-found");
    done();
};
