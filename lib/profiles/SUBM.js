// Base profile for all Submissions
import * as submLogo from '../rules/headers/subm-logo.js';
import { rules as baseRules } from './base.js';
import { insertAfter } from './profileUtil.js';

export const name = 'Submission';

export const rules = insertAfter(baseRules, 'headers.logo', submLogo);
