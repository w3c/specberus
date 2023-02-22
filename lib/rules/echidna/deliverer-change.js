import w3cApi from 'node-w3capi';

w3cApi.apiKey = process.env.W3C_API_KEY;

const self = {
    name: 'echidna.deliverer-change',
    section: 'metadata',
    rule: 'delivererID',
};

export const { name } = self;

async function getPreviousIDs(shortname, previousUrl) {
    const date = previousUrl.match(/\d{8}/);
    return new Promise(resolve => {
        // e.g. https://api.w3.org/specifications/WGSL/versions/20230221/deliverers
        w3cApi
            .specification(shortname)
            .version(date)
            .deliverers()
            .fetch({ embed: true }, (err, data) => {
                console.log('getPreviousIDs data:', data && data.map(obj => obj.id))
                resolve(data && data.map(obj => obj.id));
            });
    });
}

/**
 * @param sr
 * @param done
 */
export async function check(sr, done) {
    const previousVersion = await sr.getPreviousVersion(sr);
    console.log('previousVersion: ', previousVersion);
    const shortname = await sr.getShortname(sr);

    if (!previousVersion) {
        return done();
    }

    const previousDelivererIDs = await getPreviousIDs(
        shortname,
        previousVersion
    );
    console.log('previousDelivererIDs: ', previousDelivererIDs);
    const delivererIDs = await sr.getDelivererIDs();
    console.log('delivererIDs: ', delivererIDs);

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
