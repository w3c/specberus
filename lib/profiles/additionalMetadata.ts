/**
 * Pseudo-profile for additional metadata extraction.
 */

import { rules as baseRules } from './metadata.js';
import { insertAfter } from './profileUtil.js';

import * as abstract from '../rules/metadata/abstract.js';
import * as sotd from '../rules/metadata/sotd.js';

export const name = 'AdditionalMetadata';

export const rules = insertAfter(baseRules, 'metadata.errata', [
    abstract,
    sotd,
]);
