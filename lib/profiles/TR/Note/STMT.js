import * as translation from '../../../rules/headers/translation.js';
import { config as baseConfig, rules as baseRules } from './note-base.js';
import { insertAfter } from '../../profileUtil.js';

export const name = 'STMT';
export const config = {
    ...baseConfig,
    status: 'STMT',
    longStatus: 'Statement',
    styleSheet: 'W3C-STMT',
};

const rulesWithTranslation = insertAfter(baseRules, 'headers.dl', [
    translation,
]);

export const rules = rulesWithTranslation;
