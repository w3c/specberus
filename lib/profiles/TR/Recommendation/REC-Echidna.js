import * as todaysDate from '../../../rules/echidna/todays-date.js';
import { insertAfter } from '../../profileUtil.js';
import { rules as baseRules } from './REC.js';

export { config } from './REC.js';
export const name = 'REC-Echidna';

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    todaysDate,
]);
