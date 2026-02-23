// @ts-ignore (no typings)
import w3cApi from 'node-w3capi';
import type { RuleCheckFunction } from '../../types.js';

const self = {
    name: 'echidna.deliverer-change',
    section: 'metadata',
    rule: 'delivererID',
};

export const { name } = self;

async function getPreviousDelivererIDs(
    shortname: string,
    previousUrl: string
): Promise<number[]> {
    const date = previousUrl.match(/-(\d{8})\/$/);
    if (!date) return Promise.resolve([]);

    // e.g. https://api.w3.org/specifications/WGSL/versions/20230221/deliverers
    const data: { id: number }[] = await w3cApi
        .specification(shortname)
        .version(date[1])
        .deliverers()
        .fetch({ embed: true })
        .catch(() => []);
    return data.map(({ id }) => id);
}

/**
 * @param sr
 * @param done
 */
export const check: RuleCheckFunction = async (sr, done) => {
    const previousVersion = await sr.getPreviousVersion();
    const shortname = await sr.getShortname();

    if (!previousVersion || !shortname) {
        return done();
    }

    const previousDelivererIDs = await getPreviousDelivererIDs(
        shortname,
        previousVersion
    );
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
};
