const { rules } = require('./SUBMBase');

exports.rules = {
    ...rules,
    headers: {
        ...rules.headers,
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
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'wrongLatestVersionHead',
                errors: [
                    'headers.dl.latest-version',
                    'headers.dl.this-syntax',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'wrongHistoryHead',
                errors: [
                    'headers.dl.no-history',
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                ],
            },
            {
                data: 'rescinds',
                config: {
                    rescinds: true,
                },
                errors: [
                    'headers.dl.rescinds',
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'obsoletes',
                config: {
                    obsoletes: true,
                },
                errors: [
                    'headers.dl.obsoletes',
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'supersedes',
                config: {
                    supersedes: true,
                },
                errors: [
                    'headers.dl.supersedes',
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'wrongThisAndLatestOrder',
                errors: [
                    'headers.dl.this-latest-order',
                    'headers.dl.this-syntax',
                    'headers.dl.this-latest-shortname',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'wrongLatestAndRescindsOrder',
                config: {
                    rescinds: true,
                },
                errors: [
                    'headers.dl.latest-rescinds-order',
                    'headers.dl.this-syntax',
                    'headers.dl.this-latest-shortname',
                    'headers.dl.history-syntax',
                    'headers.dl.this-rescinds-shortname',
                ],
            },
            {
                data: 'wrongLatestAndObsoletesOrder',
                config: {
                    obsoletes: true,
                },
                errors: [
                    'headers.dl.latest-obsoletes-order',
                    'headers.dl.this-syntax',
                    'headers.dl.this-latest-shortname',
                    'headers.dl.history-syntax',
                    'headers.dl.this-obsoletes-shortname',
                ],
            },
            {
                data: 'wrongLatestAndSupersedesOrder',
                config: {
                    supersedes: true,
                },
                errors: [
                    'headers.dl.latest-supersedes-order',
                    'headers.dl.this-syntax',
                    'headers.dl.this-latest-shortname',
                    'headers.dl.history-syntax',
                    'headers.dl.this-supersedes-shortname',
                ],
            },
            {
                data: 'noThisLinkExist',
                errors: [
                    'headers.dl.not-found',
                    'headers.dl.latest-syntax',
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
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'noLatestLinkExist',
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.not-found',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'linkDiff',
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.link-diff',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'wrongLatestSyntax',
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'noHistoryLinkExist',
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.not-found',
                ],
            },
            {
                data: 'wrongHistorySyntax',
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                ],
            },
            {
                data: 'noRescindLinkExist',
                config: {
                    rescinds: true,
                },
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                    'headers.dl.not-found',
                ],
            },
            {
                data: 'diffThisAndRescindShortname',
                config: {
                    rescinds: true,
                },
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                    'headers.dl.this-rescinds-shortname',
                ],
            },
            {
                data: 'wrongRescindSyntax',
                config: {
                    rescinds: true,
                },
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                    'headers.dl.rescinds-syntax',
                ],
            },
            {
                data: 'noObsoletesLinkExist',
                config: {
                    obsoletes: true,
                },
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                    'headers.dl.not-found',
                ],
            },
            {
                data: 'diffThisAndObsoletesShortname',
                config: {
                    obsoletes: true,
                },
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                    'headers.dl.this-obsoletes-shortname',
                ],
            },
            {
                data: 'wrongObsoletesSyntax',
                config: {
                    obsoletes: true,
                },
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                    'headers.dl.obsoletes-syntax',
                ],
            },
            {
                data: 'noSupersedesLinkExist',
                config: {
                    supersedes: true,
                },
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                    'headers.dl.not-found',
                ],
            },
            {
                data: 'diffThisAndSupersedesShortname',
                config: {
                    supersedes: true,
                },
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                    'headers.dl.this-supersedes-shortname',
                ],
            },
            {
                data: 'wrongSupersedesSyntax',
                config: {
                    supersedes: true,
                },
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                    'headers.dl.supersedes-syntax',
                ],
            },
            {
                data: 'noEditorDraftLinkExist',
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                    'headers.dl.not-found',
                ],
            },
            {
                data: 'noSecureEditorDraftLink',
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                    'headers.dl.editors-draft-should-be-https',
                ],
            },
            {
                data: 'noEditor',
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                    'headers.dl.editor-not-found',
                ],
            },
            {
                data: 'missingEditorId',
                errors: [
                    'headers.dl.this-syntax',
                    'headers.dl.latest-syntax',
                    'headers.dl.history-syntax',
                    'headers.dl.editor-missing-id',
                ],
            },
        ],
    },
    sotd: {
        ...rules.sotd,
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
