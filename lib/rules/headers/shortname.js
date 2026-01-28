//  This rule is to check shortnames mentioned in dts
//  this version is https://www.w3.org/TR/2013/WD-shortname-2013MMDD/
//  latest version is https://www.w3.org/TR/shortname/

/** @import { Specberus } from "../../validator.js" */

import superagent from 'superagent';
import doAsync from 'doasync';

const self = {
    name: 'headers.shortname',
    section: 'front-matter',
    rule: 'docIDFormat',
};
const thisError = {
    name: 'headers.shortname',
    section: 'front-matter',
    rule: 'docIDThisVersion',
};
const historyError = {
    name: 'headers.shortname',
    section: 'front-matter',
    rule: 'docIDHistory',
};
export const name = self.name;

/**
 *
 * @param {Specberus} sr
 * @param done
 */
export async function check(sr, done) {
    const subType = sr.config.submissionType;
    let topLevel = 'TR';
    let thisURI = '';

    if (subType === 'member') topLevel = 'submissions';

    const dts = sr.extractHeaders();

    let shortname;
    let seriesShortname;
    let matches;

    if (dts.This) {
        const $linkThis = dts.This.$dd.find('a').first();

        if ($linkThis.attr('href')) {
            const vThisRex = `^https:\\/\\/www\\.w3\\.org\\/${topLevel}\\/(\\d{4})\\/${
                sr.config.status || '[A-Z]+'
            }-(.+)-(\\d{4})(\\d\\d)(\\d\\d)\\/?$`;
            matches = ($linkThis.attr('href') || '')
                .trim()
                .match(new RegExp(vThisRex));
            if (matches) {
                [thisURI] = matches;
                [, , shortname] = matches;
                const pattern = /-?\d[\d.]*$/;
                const dashPattern = /\d[\d.]*-/;
                seriesShortname = shortname
                    .replace(pattern, '')
                    .replace(dashPattern, '-');

                // Require new /TR shortnames to use lowercase.
                const shortnameChange =
                    dts.History &&
                    dts.History.$dd
                        .find('a')
                        .first()
                        .attr('data-previous-shortname');
                const needLowercase = shortnameChange || (await sr.isFP());
                if (needLowercase && shortname.toLowerCase() !== shortname)
                    sr.error(thisError, 'shortname-lowercase', { shortname });
            }
        }
    }

    let sn;

    if (dts.Latest) {
        const $linkLate = dts.Latest.$dd.find('a').first();

        if ($linkLate.attr('href')) {
            const lateRex = `^https:\\/\\/www\\.w3\\.org\\/${topLevel}\\/(.+?)\\/?$`;
            matches = ($linkLate.attr('href') || '')
                .trim()
                .match(new RegExp(lateRex));
            if (matches) {
                sn = matches[1];
                // latest version link mention either shortlink or the series shortlink
                if (sn !== shortname && sn !== seriesShortname)
                    sr.error(self, 'this-latest-shortname', {
                        thisShortname: shortname,
                        latestShortname: sn,
                    });
            }
        }
    }

    if (dts.History) {
        const $linkHistory = dts.History.$dd.find('a').first();

        if ($linkHistory.attr('href')) {
            // e.g. https://www.w3.org/standards/history/hr-time-10086/
            const historyReg =
                /^https:\/\/www\.w3\.org\/standards\/history\/(.+?)\/?$/;
            matches = ($linkHistory.attr('href') || '')
                .trim()
                .match(historyReg);
            if (matches) {
                const [, historyShortname] = matches;
                if (historyShortname !== shortname) {
                    sr.error(historyError, 'history-syntax', { shortname });
                } else {
                    const historyHref = $linkHistory.attr('href');
                    // Check if the history link exist
                    let historyStatusCode;
                    try {
                        const res = await doAsync(superagent).head(historyHref);
                        historyStatusCode = res.statusCode;
                    } catch (err) {
                        historyStatusCode = err.status;
                    }
                    var hasPreviousVersion = !(await sr.isFP());
                    if (hasPreviousVersion && historyStatusCode === 404) {
                        // it's a none FP spec, but the history page doesn't exist. There should be a 'valid' previous-shortname.
                        const previousShortname = $linkHistory.attr(
                            'data-previous-shortname'
                        );
                        if (previousShortname) {
                            // prettier-ignore
                            sr.warning(historyError, 'this-previous-shortname',
                                {
                                    previousShortname,
                                    thisShortname: shortname,
                                }
                            );

                            // check previous shortname is valid.
                            const previousHistoryHref = `https://www.w3.org/standards/history/${previousShortname}/`;
                            let previousHistoryStatusCode;
                            try {
                                const res =
                                    await doAsync(superagent).head(
                                        previousHistoryHref
                                    );
                                previousHistoryStatusCode = res.statusCode;
                            } catch (err) {
                                previousHistoryStatusCode = err.status;
                            }

                            if (previousHistoryStatusCode === 404) {
                                sr.error(historyError, 'history-bad-previous', {
                                    previousShortname,
                                    url: previousHistoryHref,
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    if (dts.Rescinds) {
        const $linkRescinds = dts.Rescinds.$dd.find('a').first();

        if ($linkRescinds.attr('href')) {
            matches = ($linkRescinds.attr('href') || '')
                .trim()
                .match(
                    /^https:\/\/www\.w3\.org\/TR\/\d{4}\/REC-(.+)-\d{8}\/?$/
                );
            if (matches) {
                sn = matches[1];
                if (sn !== shortname)
                    sr.error(self, 'this-rescinds-shortname', {
                        rescindsShortname: sn,
                        thisShortname: shortname,
                    });
            }
        }
    }

    // check shortname is valid.
    const isFP = await sr.isFP();
    // FP documents cannot use existing shortname
    if (
        sr.config.longStatus === 'First Public Working Draft' &&
        !isFP &&
        shortname
    ) {
        sr.error(self, 'shortname-existed');
    }

    // non-initial state documents should use existing shortname
    // TODO: Registry and Note track?
    if (
        sr.config.track === 'Recommendation' &&
        sr.config.longStatus !== 'First Public Working Draft' &&
        isFP &&
        shortname
    ) {
        sr.error(self, 'shortname-not-existed', {
            status: sr.config.longStatus,
        });
    }

    done();
}
