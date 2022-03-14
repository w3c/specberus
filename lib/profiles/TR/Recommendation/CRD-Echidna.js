import * as todaysDate from '../../../rules/echidna/todays-date.js';
import { insertAfter } from '../../profileUtil.js';
import { rules as baseRules } from './CRD.js';

export { config } from './CRD.js';
export const name = 'CRD-Echidna';

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    todaysDate,
]);
