import todaysDate from '../../../rules/echidna/todays-date';
import { insertAfter } from '../../profileUtil';
import { rules as baseRules } from './CRD';

export { config } from './CRD';
export const name = 'CRD-Echidna';

export const rules = insertAfter(baseRules, 'sotd.process-document', [
    todaysDate,
]);
