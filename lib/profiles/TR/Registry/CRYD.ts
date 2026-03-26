import * as draftStability from '../../../rules/sotd/draft-stability.js';
import type { SpecberusConfig } from '../../../types.js';
import { insertAfter } from '../../profileUtil.js';
import { config as baseConfig, rules as baseRules } from './registry-base.js';

export const name = 'CRYD';
export const config: SpecberusConfig = {
    ...baseConfig,
    status: 'CRYD',
    longStatus: 'Candidate Registry',
    cryType: 'Draft',
    styleSheet: 'W3C-CRYD',
};

export const rules = insertAfter(baseRules, 'sotd.supersedable', [
    draftStability,
]);
