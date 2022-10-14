import { rules as baseRules } from './SUBMBase.js';

export const rules = {
    ...baseRules,
    headers: {
        ...baseRules.headers,
        'memsub-copyright': [
            {
                data: 'noCopyright',
                errors: ['headers.memsub-copyright.not-found'],
            },
            {
                data: 'noCopyrightLink',
                errors: ['headers.memsub-copyright.not-found'],
            },
        ],
        dl: [
            {
                data: 'wrongThisVersionHead',
                errors: [
                    'headers.dl.this-version',
                    'headers.dl.this-latest-shortname',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'wrongLatestVersionHead',
                errors: ['headers.dl.latest-version'],
            },
            {
                data: 'wrongHistoryHead',
                errors: ['headers.dl.no-history'],
            },
            {
                data: 'rescinds',
                config: {
                    rescinds: true,
                },
                errors: ['headers.dl.rescinds'],
            },
            {
                data: 'wrongThisAndLatestOrder',
                errors: ['headers.dl.this-latest-order'],
            },
            {
                data: 'wrongLatestAndRescindsOrder',
                config: {
                    rescinds: true,
                },
                errors: ['headers.dl.latest-rescinds-order'],
            },
            {
                data: 'noThisLinkExist',
                errors: [
                    'headers.dl.not-found',
                    'headers.dl.this-latest-shortname',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'noDocDate',
                warnings: ['headers.dl.no-date'],
            },
            {
                data: 'wrongThisSyntax',
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.this-latest-shortname',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'noLatestLinkExist',
                errors: ['headers.dl.not-found'],
            },
            {
                data: 'linkDiff',
                errors: ['headers.dl.link-diff'],
            },
            {
                data: 'wrongLatestSyntax',
                errors: ['headers.dl.latest-syntax'],
            },
            {
                data: 'noHistoryLinkExist',
                errors: ['headers.dl.not-found'],
            },
            {
                data: 'wrongHistorySyntax',
                errors: ['headers.dl.history-syntax'],
            },
            {
                data: 'noRescindLinkExist',
                config: {
                    rescinds: true,
                },
                errors: ['headers.dl.not-found'],
            },
            {
                data: 'diffThisAndRescindShortname',
                config: {
                    rescinds: true,
                },
                errors: ['headers.dl.this-rescinds-shortname'],
            },
            {
                data: 'wrongRescindSyntax',
                config: {
                    rescinds: true,
                },
                errors: ['headers.dl.rescinds-syntax'],
            },
            {
                data: 'noEditorDraftLinkExist',
                errors: ['headers.dl.not-found'],
            },
            {
                data: 'noSecureEditorDraftLink',
                errors: ['headers.dl.editors-draft-should-be-https'],
            },
            {
                data: 'noEditor',
                errors: ['headers.dl.editor-not-found'],
            },
            {
                data: 'missingEditorId',
                errors: ['headers.dl.editor-missing-id'],
            },
        ],
    },
    sotd: {
        ...baseRules.sotd,
        submission: [
            {
                data: 'noSubmissionText',
                errors: ['sotd.submission.no-submission-text'],
            },
            {
                data: 'noProcess',
                errors: ['sotd.submission.link-text'],
            },
            {
                data: 'noMembership',
                errors: ['sotd.submission.link-text'],
            },
            {
                data: 'noPP',
                errors: ['sotd.submission.link-text'],
            },
            {
                data: 'noSubmission',
                errors: ['sotd.submission.link-text'],
            },
            {
                data: 'noSubmissionMembers',
                errors: ['sotd.submission.no-sm-link'],
            },
            {
                data: 'noComment',
                errors: ['sotd.submission.no-tc-link'],
            },
        ],
    },
};
