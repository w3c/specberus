const self = {
    name: 'sotd.deliverer-note',
    section: 'metadata',
    rule: 'delivererID',
};

export const name = self.name;

export function check(sr, done) {
    const deliverers = sr.getDataDelivererIDs();

    if (deliverers.length === 0) sr.error(self, 'not-found');
    done();
}
