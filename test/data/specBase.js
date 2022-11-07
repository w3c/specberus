export const rules = {
    headers: {
        'div-head': [
            {
                data: 'noHead',
                errors: ['headers.div-head.not-found'],
            },
        ],
        hr: [
            {
                data: 'noHr',
                errors: ['headers.hr.not-found'],
            },
            {
                data: 'duplicatedHr',
                errors: ['headers.hr.duplicate'],
            },
        ],
        logo: [
            {
                data: 'noLogo',
                errors: ['headers.logo.not-found'],
            },
            {
                data: 'invalidSrc',
                errors: ['headers.logo.not-found'],
            },
            {
                data: 'invalidHref',
                errors: ['headers.logo.not-found'],
            },
        ],
        'h1-title': [
            {
                data: 'noHeadTitle',
                errors: ['headers.h1-title.not-found'],
            },
            {
                data: 'noH1Title',
                errors: ['headers.h1-title.not-found'],
            },
            {
                data: 'noH1AndHeadTitle',
                errors: ['headers.h1-title.not-found'],
            },
            {
                data: 'titlesNotMatch',
                errors: ['headers.h1-title.not-match'],
            },
        ],
        'details-summary': [
            {
                data: 'noDetails',
                errors: ['headers.details-summary.no-details'],
            },
            {
                data: 'noDetailsOpen',
                errors: ['headers.details-summary.no-details-open'],
            },
            {
                data: 'noDetailsDl',
                errors: ['headers.details-summary.no-details-dl'],
            },
            {
                data: 'noDetailsSummary',
                errors: ['headers.details-summary.no-details-summary'],
            },
            {
                data: 'wrongDetailsSummary',
                errors: ['headers.details-summary.wrong-summary-text'],
            },
        ],
        shortname: [
            {
                data: 'diffThisAndLatestShortname',
                errors: ['headers.shortname.this-latest-shortname'],
            },
            {
                data: 'wrongHistorySyntax',
                errors: ['headers.shortname.history-syntax'],
            },
            {
                data: 'diffThisAndRescindShortname',
                config: {
                    rescinds: true,
                },
                errors: ['headers.shortname.this-rescinds-shortname'],
            },
        ],
        dl: [
            {
                data: 'wrongRescindSyntax',
                config: {
                    rescinds: true,
                },
                errors: ['headers.dl.rescinds-syntax'],
            },
            {
                data: 'wrongLatestSyntax',
                errors: ['headers.dl.latest-syntax'],
            },
            {
                data: 'noRescindLinkExist',
                config: {
                    rescinds: true,
                },
                errors: ['headers.dl.not-found'],
            },
            {
                data: 'noHistoryLinkExist',
                errors: ['headers.dl.not-found'],
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
                data: 'wrongThisVersionHead',
                errors: ['headers.dl.this-version'],
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
                data: 'noRescindsNeeded',
                warnings: ['headers.dl.rescinds-not-needed'],
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
                errors: ['headers.dl.not-found'],
            },
            {
                data: 'wrongThisDate',
                errors: ['headers.dl.this-date'],
            },
            {
                data: 'noDocDate',
                warnings: ['headers.dl.no-date'],
            },
            {
                data: 'wrongThisSyntax',
                errors: ['headers.dl.this-syntax'],
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
        secno: [
            {
                data: 'noSecno',
                warnings: ['headers.secno.not-found'],
            },
        ],
        'ol-toc': [
            {
                data: 'noToc',
                warnings: ['headers.ol-toc.not-found'],
            },
        ],
        'h2-toc': [
            { data: 'mixedTocs', errors: ['headers.h2-toc.mixed'] },
            { data: 'noTocs', errors: ['headers.h2-toc.not-found'] },
            { data: 'duplicatedTitle', errors: ['headers.h2-toc.too-many'] },
            { data: 'noTitles', errors: ['headers.h2-toc.not-found'] },
            { data: 'notHtml5', warnings: ['headers.h2-toc.not-html5'] },
        ],
    },
    style: {
        sheet: [
            {
                data: 'noSheet',
                errors: ['style.sheet.not-found'],
            },
            {
                data: 'notLast',
                errors: ['style.sheet.last'],
            },
        ],
        meta: [
            {
                data: 'noMeta',
                errors: ['style.meta.not-found'],
            },
            {
                data: 'noWidth',
                errors: ['style.meta.not-found'],
            },
        ],
        'body-toc-sidebar': [
            {
                data: 'classFound',
                errors: ['style.body-toc-sidebar.class-found'],
            },
        ],
        script: [
            {
                data: 'noScript',
                errors: ['style.script.not-found'],
            },
        ],
        'back-to-top': [
            {
                data: 'noBackToTop',
                warnings: ['style.back-to-top.not-found'],
            },
        ],
    },
    heuristic: {
        'date-format': [
            {
                data: 'wrongDateFormat',
                errors: ['heuristic.date-format.wrong'],
            },
        ],
    },
    links: {
        reliability: [
            {
                data: 'hasUnreliableLinks',
                warnings: ['links.reliability.unreliable-link'],
            },
        ],
    },
    structure: {
        'section-ids': [
            {
                data: 'noSectionId',
                errors: ['structure.section-ids.no-id'],
            },
        ],
        h2: [
            {
                data: 'wrongAbstractH2',
                errors: ['structure.h2.abstract'],
            },
            {
                data: 'wrongSotdH2',
                errors: ['structure.h2.sotd'],
            },
            {
                data: 'wrongTocH2',
                errors: ['structure.h2.toc'],
            },
        ],
        canonical: [
            {
                data: 'noCanonical',
                errors: ['structure.canonical.not-found'],
            },
        ],
        neutral: [
            {
                data: 'hasNeutral',
                warnings: ['structure.neutral.neutral'],
            },
        ],
    },
    validation: {
        html: [
            {
                data: 'skipValidation',
                config: {
                    skipValidation: true,
                },
                warnings: ['validation.html.skipped'],
            },
        ],
    },
};
