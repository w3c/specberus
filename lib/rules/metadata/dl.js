/**
 * Pseudo-rule for metadata extraction: dl.
 */

const latestRule = {
    name: 'metadata.dl',
    section: 'front-matter',
    rule: 'docIDLatestVersion',
};

exports.name = 'metadata.dl';

exports.check = async function (sr, done) {
    const dts = sr.extractHeaders();
    const result = {};
    let shortname;
    let previousShortname;
    let latestShortname;

    const linkThis = dts.This ? dts.This.dd.querySelector('a') : null;
    if (linkThis) {
        result.thisVersion = linkThis.getAttribute('href').trim();
        shortname = await sr.getShortname();
    }

    const linkLate = dts.Latest ? dts.Latest.dd.querySelector('a') : null;
    if (linkLate) {
        // linkLate could be the series version, in which case, the metadata should list the shortlink instead. e.g. https://www.w3.org/TR/2021/WD-IndexedDB-3-20211006/
        result.latestVersion = linkLate.getAttribute('href').trim();
        const latestRegex = linkLate
            .getAttribute('href')
            .trim()
            .match(/.*\/([^/]+)\/$/);
        if (latestRegex && latestRegex.length > 0) {
            [, latestShortname] = latestRegex;
            if (latestShortname !== shortname) {
                result.latestVersion = `https://www.w3.org/TR/${shortname}/`;
            }
        } else sr.error(latestRule, 'latest-not-found');
    }

    const linkHistory = dts.History ? dts.History.dd.querySelector('a') : null;

    if (linkHistory) {
        result.history = linkHistory.getAttribute('href').trim();
        result.previousVersion = await sr.getPreviousVersion();
        previousShortname = linkHistory.getAttribute('data-previous-shortname');
    }

    const linkEd = dts.EditorDraft
        ? dts.EditorDraft.dd.querySelector('a')
        : null;
    if (linkEd) result.editorsDraft = linkEd.getAttribute('href').trim();

    if (previousShortname && shortname && previousShortname !== shortname) {
        result.sameWorkAs = `https://www.w3.org/TR/${previousShortname}/`;
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
        sr.throw('[EXCEPTION] The document date could not be parsed.');
    }
};
