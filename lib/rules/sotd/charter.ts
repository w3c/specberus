/**
 * @file This rule checks if the Group have a current charter. For IG, also check if SOTD has certain text: $charterText.
 */
import type { RuleCheckFunction } from '../../types.js';
import { AB, TAG } from '../../util.js';

const self = {
    name: 'sotd.charter',
};

export const { name } = self;

const charterText =
    /The disclosure obligations of the Participants of this group are described in the charter\./;

export const check: RuleCheckFunction = async context => {
    const $sotd = context.getSotDSection();
    if ($sotd) {
        const deliverIds = await context.getDelivererIDs();

        if (!deliverIds.length) {
            context.error(self, 'no-group');
            return;
        }

        // Skip check if the document is only published by TAG and/or AB
        const TagID = TAG.id;
        const AbID = AB.id;
        // groupIds: a list of ids without TAG or AB
        const groupIds = deliverIds.filter(
            deliverer => !([TagID, AbID] as number[]).includes(deliverer)
        );
        if (!groupIds.length) return;

        const charters = await context.getCharters();
        if (!charters.length) {
            context.error(self, 'no-charter');
            return;
        }

        if (context.config!.longStatus === 'Interest Group Note') {
            const expectedHref = charters && `${charters[0]}#patentpolicy`;
            // check text exists
            const txt = context.norm($sotd && $sotd.text());
            if (!charterText.test(txt)) {
                context.error(self, 'text-not-found');
                return;
            }

            // check "charter" link is found and correct
            let charterLinkFound = false;
            let charterHrefInDocument;
            $sotd.find('a[href]').each((_, a) => {
                const $a = context.$(a);
                const charterHref = $a.attr('href');
                const text = context.norm($a.text());
                const pText = context.norm($a.parent().text());
                // Find the right paragraph and right link.
                if (charterText.test(pText) && text === 'charter') {
                    charterLinkFound = true;
                    charterHrefInDocument = charterHref;
                }
            });
            if (!charterLinkFound) {
                context.error(self, 'link-not-found');
            } else if (expectedHref !== charterHrefInDocument) {
                context.error(self, 'wrong-link', {
                    expectedHref,
                });
            }
        }
    }
};
