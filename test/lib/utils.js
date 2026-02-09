import { lstatSync, readdirSync } from 'fs';
import merge from 'lodash.merge';
import nock from 'nock';

import { nockData } from './nockData.js';

function listFilesOf(dir) {
    const files = readdirSync(dir);

    // ignore .DS_Store from Mac
    const blocklist = ['.DS_Store', 'Base.js'];

    return files.filter(v => !blocklist.find(b => v.includes(b)));
}

const flat = objs => objs.reduce((acc, cur) => ({ ...acc, ...cur }), {});

const buildProfileTestCases = async path => {
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
 * Compare two arrays of values and check that they're equal.
 *
 * @param {Array} a1 - One array.
 * @param {Array} a2 - The other array.
 * @returns {Boolean} whether the two arrays contain exactly the same values.
 */

export const equivalentArray = function (a1, a2) {
    if (!a1 || !a2 || a1.length !== a2.length) return false;
    return JSON.stringify(a1) === JSON.stringify(a2);
};

/**
 * @param {Request} req
 */
function warnOnNonLocalRequest(req) {
    if (!req.url.includes('//localhost')) {
        console.warn('Unmocked non-local request:', req.url, req.body);
    }
}

/** Mocks external calls to speed up tests and make them consistently runnable locally */
export function setupMocks(overrides) {
    // Report non-local URLs that were not mocked during test runs
    nock.emitter.on('no match', warnOnNonLocalRequest);

    /** @type {typeof nockData} */
    const mockData = overrides ? merge({}, nockData, overrides) : nockData;

    const notFoundNames = [
        'hr-foo-time',
        'hr-foo-time-2',
        'hr-time-new',
        'new-name-3',
        'UPPERcase-name',
    ];

    // Requests for nonexistent shortnames, which should 404

    nock('https://www.w3.org')
        .persist()
        .head(uri =>
            notFoundNames.some(shortname =>
                uri.includes(`/standards/history/${shortname}`)
            )
        )
        .reply(404, 'Page Not Found');
    nock('https://api.w3.org')
        .persist()
        .get(uri =>
            notFoundNames.some(shortname =>
                // Intentionally match both list and individual version endpoints
                uri.includes(`/specifications/${shortname}/versions`)
            )
        )
        .reply(404, '{ status: 404 }');

    // Requests which only depend on a 200 response

    nock('https://www.w3.org')
        .head('/standards/history/hr-time')
        .reply(200, 'HR Time history page');
    nock('https://api.w3.org')
        .persist()
        .get(/\/specifications\/[\w-]+\/versions\/\w+$/)
        .reply(200, '{}');

    // .../versions needs to return an array of URIs, but specifics aren't important
    nock('https://api.w3.org')
        .persist()
        .get(/\/specifications\/[\w-]+\/versions\?embed=true/)
        .reply(200, {
            _embedded: {
                'version-history': mockData.versionUris.map(uri => ({ uri })),
            },
        });

    // Requests with specifically-mocked responses

    for (const [shortname, id] of Object.entries(mockData.delivererMap)) {
        if (mockData.groupData[id]) {
            nock('https://api.w3.org')
                .persist()
                .get(
                    uri =>
                        uri.includes(
                            `/specifications/${shortname}/versions/`
                        ) && uri.endsWith('deliverers?embed=true')
                )
                .reply(200, {
                    _embedded: { deliverers: [mockData.groupData[id].group] },
                });
        } else {
            console.error(
                `nockData.delivererMap references group ${id}, which is not defined in groupData`
            );
        }
    }

    for (const { charters, group, userIds } of Object.values(
        mockData.groupData
    )) {
        nock('https://api.w3.org')
            .persist()
            .get(`/groups/wg/${group.shortname}`)
            .reply(200, group);
        nock('https://api.w3.org')
            .persist()
            .get(`/groups/${group.id}`)
            .reply(200, group);
        nock('https://api.w3.org')
            .persist()
            .get(`/groups/${group.id}/charters?embed=true`)
            .reply(200, { _embedded: { charters } });
        if (userIds) {
            nock('https://api.w3.org')
                .get(`/groups/${group.id}/users?embed=true`)
                .reply(200, {
                    _embedded: { users: userIds.map(id => ({ id })) },
                });
        }
    }
}

/** Cleans up mocks and event handler from setupMocks. */
export function cleanupMocks() {
    nock.emitter.off('no match', warnOnNonLocalRequest);
    nock.cleanAll();
}
