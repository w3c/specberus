import * as draftStability from '../../../rules/sotd/draft-stability.js';
import { insertAfter } from '../../profileUtil.js';
import { config as baseConfig, rules as baseRules } from './note-base.js';

export const name = 'DNOTE';
export const config = {
    ...baseConfig,
    status: 'DNOTE',
    longStatus: 'Group Draft Note',
    styleSheet: 'W3C-DNOTE',
};

export const rules = insertAfter(baseRules, 'sotd.pp', [draftStability]);
