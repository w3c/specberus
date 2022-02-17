// base profile for all things TR
import copyright from '../rules/headers/copyright';
import githubRepo from '../rules/headers/github-repo';
import charter from '../rules/sotd/charter';
import pp from '../rules/sotd/pp';
import processDocument from '../rules/sotd/process-document';
import publish from '../rules/sotd/publish';
import stability from '../rules/sotd/stability';
import { rules as base } from './base';
import { insertAfter } from './profileUtil';

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
