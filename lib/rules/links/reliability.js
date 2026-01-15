/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'links.reliability',
    section: 'document-body',
};

export const { name } = self;

const unreliableServices = [
    { domain: 'w3.org', path: /^\/Bugs/ },
    { domain: 'www.w3.org', path: /^\/Bugs/ },
    { domain: 'w3c-test.org' },
    { domain: 'www.w3c-test.org' },
    { domain: 'dev.w3.org' },
    { domain: 'dvcs.w3.org' },
    { domain: 'tools.ietf.org' },
    // tracker hasn't become legacy service yet
    // { domain: 'w3.org', path: /track(er)?\/?$/ },
    // { domain: 'w3.org', path: /track(er)?\/(actions|issues|resolutions)/}
];

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    sr.$('a').each((_, el) => {
        const $el = sr.$(el);
        let url;
        try {
            url = new URL($el.attr('href'), sr.url || 'https://www.w3.org');
        } catch (e) {
            // when failed to parse URL, move on to next one.
            return;
        }

        const domain = url && url.hostname;
        const path = url && url.pathname;

        unreliableServices.some(unreliableService => {
            if (
                domain === unreliableService.domain &&
                (!unreliableService.path ||
                    (unreliableService.path &&
                        unreliableService.path.test(path)))
            ) {
                sr.warning(self, 'unreliable-link', {
                    link: $el.attr('href'),
                    text: sr.norm($el.text()),
                });
                // when finding this URL unreliable, quit
                return false;
            }
        });
    });
    done();
}
