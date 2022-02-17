// TODO: merge all Echidna files.

import todaysDate from '../../../rules/echidna/todays-date';
import { insertAfter } from '../../profileUtil';
import { config as baseConfig, rules as baseRules } from './DNOTE';

export const name = 'DNOTE-Echidna';
export const config = baseConfig;

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    todaysDate,
]);
