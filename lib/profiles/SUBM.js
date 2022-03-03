// Base profile for all Submissions
import * as submLogo from '../rules/headers/subm-logo';
import { rules as baseRules } from './base';
import { insertAfter } from './profileUtil';

export const name = 'Submission';

export const rules = insertAfter(baseRules, 'headers.logo', submLogo);
