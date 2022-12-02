import { Specberus } from '../../validator.js';

const self = {
    name: 'echidna.deliverer-change',
    section: 'metadata',
    rule: 'delivererID',
};

export const { name } = self;

async function getPreviousIDs(url) {
    return new Promise(resolve => {
        const specberus = new Specberus(process.env.W3C_API_KEY);

        specberus.loadURL(url, async (err, jsDocument) => {
            if (err) return specberus.throw(err);
            specberus.jsDocument = jsDocument;

            const ids = specberus.getDelivererIDs();
            resolve(ids);
        });
    });
}

/**
 * @param sr
 * @param done
 */
export async function check(sr, done) {
    const previousVersion = await sr.getPreviousVersion();

    if (!previousVersion) {
        return done();
    }

    const previousDelivererIDs = await getPreviousIDs(previousVersion);
    const delivererIDs = await sr.getDelivererIDs();

    const delivererChanged =
        delivererIDs.sort().toString() !==
        previousDelivererIDs.sort().toString();

    if (delivererChanged) {
        sr.error(self, 'deliverer-changed', {
            this: delivererIDs.sort().toString(),
            previous: previousDelivererIDs.sort().toString(),
        });
    }

    done();
}
