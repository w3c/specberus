import superagent from 'superagent';

import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'structure.name',
    section: 'compound',
    rule: 'compoundOverview',
};

export const { name } = self;

export const check: RuleCheckFunction = async context => {
    // Pseudo-constants:
    const EXPECTED_NAME = /\/Overview\.html$/;
    const OVERVIEW = 'Overview.html';
    const ALTERNATIVE_ENDING = /\/$/;
    const FILE_NAME = /[^/]+$/;

    let fileName;

    if (!context || !context.url || EXPECTED_NAME.test(context.url)) {
        return;
    }

    if (!ALTERNATIVE_ENDING.test(context.url)) {
        fileName = context.url.match(FILE_NAME);
        if (fileName && fileName.length === 1) {
            fileName = fileName[0];
            context.warning(self, 'wrong', {
                note: ` (instead of <code>${fileName}</code>)`,
            });
        } else {
            context.warning(self, 'wrong', { note: '' });
        }
        return;
    }

    try {
        const result1 = await superagent.get(context.url);
        const result2 = await superagent.get(context.url + OVERVIEW);
        if (!result1.ok || !result2.ok || result1.text !== result2.text)
            context.warning(self, 'wrong', { note: '' });
    } catch (error) {
        context.warning(self, 'wrong', { note: '' });
    }
};
