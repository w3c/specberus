import * as todaysDate from '../../../rules/echidna/todays-date';
import { insertAfter } from '../../profileUtil';
import { rules as baseRules } from './WD';

export const name = 'WD-Echidna';
export { config } from './WD';

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    todaysDate,
]);
