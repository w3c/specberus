import * as todaysDate from '../../../rules/echidna/todays-date.js';
import { insertAfter } from '../../profileUtil.js';
import { rules as baseRules } from './WD.js';

export const name = 'WD-Echidna';
export { config } from './WD.js';

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    todaysDate,
]);
