import * as todaysDate from '../../../rules/echidna/todays-date.js';
import { insertAfter } from '../../profileUtil.js';
import { rules as baseRules } from './CR.js';

export const name = 'CR-Echidna';
export { config } from './CR.js';

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    todaysDate,
]);
