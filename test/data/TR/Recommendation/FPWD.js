exports.rules = {
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
        ],
        'github-repo': [
            {
                data: 'noFeedback',
                errors: ['headers.github-repo.no-feedback'],
            },
            {
                data: 'noRepo',
                errors: ['headers.github-repo.no-repo'],
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
        copyright: [
            {
                data: 'noCopyright',
                errors: ['headers.copyright.not-found'],
            },
        ],
    },
    style: {
        sheet: [
            {
                data: 'noSheet',
                errors: ['style.sheet.not-found'],
                config: {
                    styleSheet: 'W3C-WD',
                },
            },
            {
                data: 'notLast',
                errors: ['style.sheet.last'],
                config: {
                    styleSheet: 'W3C-WD',
                },
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
            // TODO: conflict with fixup.js
            // {
            //     data: 'noSidebar',
            //     errors: ['style.body-toc-sidebar.class-found'],
            // },
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
    },
    sotd: {
        supersedable: [
            { data: 'noIntro', errors: ['sotd.supersedable.no-sotd-intro'] },
            { data: 'noTr', errors: ['sotd.supersedable.no-sotd-tr'] },
        ],
        'process-document': [
            {
                data: 'noProcess',
                errors: ['sotd.process-document.not-found'],
            },
            {
                data: 'wrongLink',
                errors: [
                    'sotd.process-document.wrong-link',
                    'sotd.process-document.not-found',
                ],
            },
            {
                data: 'duplicatedProcess',
                errors: ['sotd.process-document.multiple-times'],
            },
        ],
    },
};
