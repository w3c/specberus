import * as todaysDate from '../../../rules/echidna/todays-date.js';
import * as delivererChange from '../../../rules/echidna/deliverer-change.js';
import { insertAfter } from '../../profileUtil.js';
import { rules as baseRules } from './NOTE.js';

export const name = 'NOTE-Echidna';
export { config } from './NOTE.js';

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    todaysDate,
    delivererChange,
]);
