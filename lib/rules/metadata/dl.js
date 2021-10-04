/**
 * Pseudo-rule for metadata extraction: dl.
 */

const latestRule = {
    name: 'metadata.dl',
    section: 'front-matter',
    rule: 'docIDLatestVersion',
};

const previousRule = {
    name: 'metadata.dl',
    section: 'front-matter',
    rule: 'docIDFormat',
};

exports.name = 'metadata.dl';

exports.check = function (sr, done) {
    const dl = sr.jsDocument.querySelector('body div.head dl');
    const dts = sr.extractHeaders(dl);
    const result = {};
    let shortname;
    let previousShortname;
    let latestShortname;

    const linkThis = dts.This ? dts.This.dd.querySelector('a') : null;
    if (linkThis) {
        result.thisVersion = linkThis.getAttribute('href').trim();
        const thisVersionMatches = linkThis
            .getAttribute('href')
            .trim()
            .match(new RegExp(/.*\/[^/-]+-(.*)-\d{8}\/$/));
        if (thisVersionMatches && thisVersionMatches.length > 0)
            shortname = thisVersionMatches[1];
    }

    const linkLate = dts.Latest ? dts.Latest.dd.querySelector('a') : null;
    if (linkLate) {
        // linkLate could be the series version, in which case, the metadata should list the shortlink instead
        result.latestVersion = linkLate.getAttribute('href').trim();
        const latestRegex = linkLate
            .getAttribute('href')
            .trim()
            .match(new RegExp(/.*\/([^/]+)\/$/));
        if (latestRegex && latestRegex.length > 0) {
            latestShortname = latestRegex[1];
            if (latestShortname !== shortname) {
                result.latestVersion = `https://www.w3.org/TR/${shortname}/`;
            }
        } else sr.error(latestRule, 'latest-not-found');
    }

    const linkPrev = dts.Previous ? dts.Previous.dd.querySelector('a') : null;
    if (linkPrev) {
        result.previousVersion = linkPrev.getAttribute('href').trim();
        const previousRegex = linkPrev
            .getAttribute('href')
            .trim()
            .match(new RegExp(/.*\/[^/-]+-(.*)-\d{8}\/$/));
        if (previousRegex && previousRegex.length > 0)
            previousShortname = previousRegex[1];
        else sr.error(previousRule, 'previous-not-found');
    }

    const linkEd = dts.EditorDraft
        ? dts.EditorDraft.dd.querySelector('a')
        : null;
    if (linkEd) result.editorsDraft = linkEd.getAttribute('href').trim();

    if (previousShortname && shortname && previousShortname !== shortname) {
        result.sameWorkAs = `https://www.w3.org/TR/${previousShortname}/`; // TODO use api to get the previous shortlink
    }

    // check same day publications
    const ua = `W3C-Pubrules/${sr.version}`;
    const apikey = sr.apiKey;
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
        const sua = require('../../throttled-ua');

        const req = sua.get(endpoint).set('User-Agent', ua);
        req.query({ apikey });
        req.end((err, res) => {
            result.updated = !(err || !res.ok);
            return done(result);
        });
    } else {
        throw new Error('[EXCEPTION] The document date could not be parsed.');
    }
};
