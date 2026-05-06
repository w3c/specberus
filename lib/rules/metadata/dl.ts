/**
 * Pseudo-rule for metadata extraction: dl.
 */

import { get } from '../../throttled-ua.js';
import type { RuleCheckFunction } from '../../types.js';

const latestRule = {
    name: 'metadata.dl',
    section: 'front-matter',
    rule: 'docIDLatestVersion',
};

export const name = 'metadata.dl';

interface DlMetadata {
    editorsDraft?: string | undefined;
    history?: string;
    latestVersion?: string;
    previousVersion?: string | undefined;
    sameWorkAs?: string;
    thisVersion?: string;
    updated?: boolean;
}

export const check: RuleCheckFunction<DlMetadata> = async (sr, done) => {
    const dts = sr.extractHeaders();
    const result: DlMetadata = {};
    let shortname;
    let previousShortname;
    let latestShortname;

    const $linkThis = dts.This ? dts.This.$dd.find('a').first() : null;
    const thisHref = $linkThis?.attr('href')?.trim();
    if (thisHref) {
        result.thisVersion = thisHref;
        shortname = await sr.getShortname();
    }

    const $linkLate = dts.Latest ? dts.Latest.$dd.find('a').first() : null;
    const latestHref = $linkLate?.attr('href')?.trim();
    if (latestHref) {
        // linkLate could be the series version, in which case, the metadata should list the shortlink instead. e.g. https://www.w3.org/TR/2021/WD-IndexedDB-3-20211006/
        result.latestVersion = latestHref;
        const latestRegex = latestHref.match(/.*\/([^/]+)\/$/);
        if (latestRegex && latestRegex.length > 0) {
            [, latestShortname] = latestRegex;
            if (latestShortname !== shortname) {
                result.latestVersion = `https://www.w3.org/TR/${shortname}/`;
            }
        } else sr.error(latestRule, 'latest-not-found');
    }

    const $linkHistory = dts.History ? dts.History.$dd.find('a').first() : null;
    const historyHref = $linkHistory?.attr('href')?.trim();

    if ($linkHistory && historyHref) {
        result.history = historyHref;
        result.previousVersion = await sr.getPreviousVersion();
        previousShortname = $linkHistory.attr('data-previous-shortname');
    }

    const $linkEd = dts.EditorDraft
        ? dts.EditorDraft.$dd.find('a').first()
        : null;
    if ($linkEd) result.editorsDraft = $linkEd.attr('href')?.trim();

    if (previousShortname && shortname && previousShortname !== shortname) {
        result.sameWorkAs = `https://www.w3.org/TR/${previousShortname}/`;
    }

    // check same day publications
    const ua = `W3C-Pubrules/${sr.version}`;
    const docDate = sr.getDocumentDate();
    if (docDate) {
        const year = docDate.getFullYear();
        const month = (docDate.getMonth() + 1).toString();
        const day = docDate.getDate().toString();
        const formattedDate =
            year +
            (month[1] ? month : `0${month[0]}`) +
            (day[1] ? day : `0${day[0]}`);
        const endpoint = `https://api.w3.org/specifications/${latestShortname}/versions/${formattedDate}`;

        const req = get(endpoint).set('User-Agent', ua);
        req.end((err, res) => {
            result.updated = !(err || !res.ok);
            return done(result);
        });
    } else {
        sr.throw('[EXCEPTION] The document date could not be parsed.');
    }
};
