import * as copyright from '../rules/headers/copyright';
import * as githubRepo from '../rules/headers/github-repo';
import * as charter from '../rules/sotd/charter';
import * as pp from '../rules/sotd/pp';
import * as processDocument from '../rules/sotd/process-document';
import * as publish from '../rules/sotd/publish';
import * as stability from '../rules/sotd/stability';
import { rules as base } from './base';
import { insertAfter } from './profileUtil';

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
