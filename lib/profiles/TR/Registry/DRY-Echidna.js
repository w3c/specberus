// TODO: merge all Echidna files.

import * as todaysDate from '../../../rules/echidna/todays-date.js';
import * as delivererChange from '../../../rules/echidna/deliverer-change.js';
import { insertAfter } from '../../profileUtil.js';
import { config as baseConfig, rules as baseRules } from './DRY.js';

export const name = 'DRY-Echidna';
export const config = baseConfig;

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    todaysDate,
    delivererChange,
]);
