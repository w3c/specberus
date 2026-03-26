import * as copyright from '../rules/headers/copyright.js';
import * as githubRepo from '../rules/headers/github-repo.js';
import * as charter from '../rules/sotd/charter.js';
import * as pp from '../rules/sotd/pp.js';
import * as processDocument from '../rules/sotd/process-document.js';
import * as publish from '../rules/sotd/publish.js';
import * as stability from '../rules/sotd/stability.js';
import { rules as base } from './base.js';
import { insertAfter } from './profileUtil.js';

// base profile for all things TR
export const name = 'TR';

const rulesWithAdditionalHeaderRule = insertAfter(base, 'headers.w3c-state', [
    githubRepo,
    copyright,
]);

export const rules = insertAfter(
    rulesWithAdditionalHeaderRule,
    'sotd.supersedable',
    [stability, publish, pp, charter, processDocument]
);
