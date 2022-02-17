import todaysDate from '../../../rules/echidna/todays-date';
import { insertAfter } from '../../profileUtil';
import { rules as baseRules } from './CR';

export const name = 'CR-Echidna';
export { config } from './CR';

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    todaysDate,
]);
