import { lstatSync, readdirSync } from 'fs';

function listFilesOf(dir) {
    const files = readdirSync(dir);

    // ignore .DS_Store from Mac
    const blocklist = ['.DS_Store', 'Base.js'];

    return files.filter(v => !blocklist.find(b => v.includes(b)));
}

const flat = objs => objs.reduce((acc, cur) => ({ ...acc, ...cur }), {});

const buildProfileTestCases = async path => {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { rules } = await import(path);
    return rules;
};

const buildTrackTestCases = async path => {
    if (lstatSync(path).isFile()) {
        const profile = await buildProfileTestCases(path);
        return profile;
    }

    const profiles = await Promise.all(
        listFilesOf(path).map(async profile => ({
            [profile]: await buildProfileTestCases(`${path}/${profile}`),
        }))
    );

    return flat(profiles);
};

const buildDocTypeTestCases = async path => {
    const tracks = await Promise.all(
        listFilesOf(path).map(async track => ({
            [track]: await buildTrackTestCases(`${path}/${track}`),
        }))
    );

    return flat(tracks);
};

export const buildBadTestCases = async () => {
    const base = `${process.cwd()}/test/data`;
    const docTypes = await Promise.all(
        listFilesOf(base)
            .filter(v => lstatSync(`${base}/${v}`).isDirectory())
            .map(async docType => ({
                [docType]: await buildDocTypeTestCases(`${base}/${docType}`),
            }))
    );

    return flat(docTypes);
};

/**
 * Compare two arrays of "deliverer IDs" and check that they're equivalent.
 *
 * @param {Array} a1 - One array.
 * @param {Array} a2 - The other array.
 * @returns {Boolean} whether the two arrays contain exactly the same integers.
 */

export const equivalentArray = function (a1, a2) {
    if (a1 && a2 && a1.length === a2.length) {
        let found = 0;
        for (let i = 0; i < a1.length; i += 1) {
            for (let j = 0; j < a2.length && found === i; j += 1) {
                if (a1[i] === a2[j]) {
                    found += 1;
                }
            }
        }
        return found === a1.length;
    }

    return false;
};
