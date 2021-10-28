const self = {
    name: 'sotd.deliverer-note',
    section: 'metadata',
    rule: 'delivererID',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const deliverers = sr.getDataDelivererIDs();

    if (deliverers.length === 0) sr.error(self, 'not-found');
    done();
};
