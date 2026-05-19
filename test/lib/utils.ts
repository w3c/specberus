import { lstat, readdir } from 'fs/promises';
import { join } from 'path';

import merge from 'lodash.merge';
import nock from 'nock';

import { nockData, type NockData } from './nockData.js';
import type { SpecberusConfig } from '../../lib/types.js';

export interface RuleTest {
    config?: Partial<SpecberusConfig>;
    data: string;
    errors?: string[];
    warnings?: string[];
}

interface RuleTestModule {
    rules: Record<string, Record<string, RuleTest[]>>;
}

async function listDirectories(dir: string) {
    const directories: string[] = [];
    for (const entry of await readdir(dir))
        if ((await lstat(join(dir, entry))).isDirectory())
            directories.push(entry);
    return directories;
}

async function listModules(dir: string) {
    const list = (await readdir(dir))
        .filter(
            filename =>
                filename.endsWith('.ts') &&
                !filename.endsWith('.d.ts') &&
                !filename.endsWith('Base.ts')
        )
        // Map to resolvable module identifiers
        .map(filename => filename.replace(/\.ts$/, '.js'));
    return list;
}

const buildProfileTestCases = async (path: string) => {
    const { rules } = (await import(path)) as RuleTestModule;
    return rules;
};

const buildTrackTestCases = async (path: string) => {
    const profiles: Record<string, RuleTestModule['rules']> = {};
    for (const profile of await listModules(path)) {
        profiles[profile] = await buildProfileTestCases(`${path}/${profile}`);
    }
    return profiles;
};

const buildDocTypeTestCases = async (path: string) => {
    const tracks: Record<
        string,
        RuleTestModule['rules'] | Record<string, RuleTestModule['rules']>
    > = {};

    for (const module of await listModules(path)) {
        tracks[module] = await buildProfileTestCases(`${path}/${module}`);
    }
    for (const track of await listDirectories(path)) {
        tracks[track] = await buildTrackTestCases(`${path}/${track}`);
    }
    return tracks;
};

export const buildBadTestCases = async () => {
    const base = join(process.cwd(), 'test', 'data');
    const docTypes: Record<
        string,
        Awaited<ReturnType<typeof buildDocTypeTestCases>>
    > = {};
    for (const docType of await listDirectories(base)) {
        docTypes[docType] = await buildDocTypeTestCases(`${base}/${docType}`);
    }
    return docTypes;
};

/**
 * @param {Request} req
 */
function warnOnNonLocalRequest(req: Request) {
    if (!req.url.includes('//localhost')) {
        console.warn('Unmocked non-local request:', req.url, req.body);
    }
}

/** Mocks external calls to speed up tests and make them consistently runnable locally */
export function setupMocks(overrides?: Partial<NockData>) {
    // Report non-local URLs that were not mocked during test runs
    nock.emitter.on('no match', warnOnNonLocalRequest);
    nock.enableNetConnect('localhost'); // Only allow localhost requests to proceed unmocked

    const mockData: typeof nockData = overrides
        ? merge({}, nockData, overrides)
        : nockData;

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
        .persist()
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

    for (const [username, value] of Object.entries(mockData.githubUsers)) {
        const interceptor = nock('https://api.github.com/')
            .persist()
            .get(`/users/${username}`);
        if (typeof value === 'object') interceptor.reply(value.status, {});
        else {
            // Mock distinct GitHub ID to verify that W3C ID lookup occurs
            const githubId = value * 2;
            interceptor.reply(200, { id: githubId });
            nock('https://api.w3.org/')
                .persist()
                .get(`/users/connected/github/${githubId}`)
                .reply(200, { id: value });
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
            .reply(200, charters.length ? { _embedded: { charters } } : {});
        if (userIds) {
            nock('https://api.w3.org')
                .persist()
                .get(`/groups/${group.id}/users?embed=true`)
                .reply(
                    200,
                    userIds.length
                        ? { _embedded: { users: userIds.map(id => ({ id })) } }
                        : {}
                );
        }
    }

    // Mock Nu HTML Checker requests to return no messages
    // (without mocks, the validate API tests result in an error from the service anyway)
    nock('https://validator.w3.org')
        .persist()
        .post('/nu/?out=json')
        .reply(200, { messages: [] });
}

/** Cleans up mocks and event handler from setupMocks. */
export function cleanupMocks() {
    nock.emitter.off('no match', warnOnNonLocalRequest);
    nock.enableNetConnect();
    nock.cleanAll();
}
