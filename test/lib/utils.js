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
