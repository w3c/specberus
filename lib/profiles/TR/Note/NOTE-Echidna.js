import * as todaysDate from '../../../rules/echidna/todays-date.js';
import { insertAfter } from '../../profileUtil.js';
import { config as baseConfig, rules as baseRules } from './NOTE.js';

export const name = 'NOTE-Echidna';
export const config = baseConfig;

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    todaysDate,
]);
