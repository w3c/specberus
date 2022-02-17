// customize rules
import draftStability from '../../../rules/sotd/draft-stability';
import { insertAfter } from '../../profileUtil';
import { config as baseConfig, rules as baseRules } from './note-base';

export const name = 'DNOTE';
export const config = {
    ...baseConfig,
    status: 'DNOTE',
    longStatus: 'Group Draft Note',
    styleSheet: 'W3C-DNOTE',
};

export const rules = insertAfter(baseRules, 'sotd.pp', [draftStability]);
