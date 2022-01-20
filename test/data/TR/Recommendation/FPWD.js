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
                data: 'obsoletes',
                config: {
                    obsoletes: true,
                },
                errors: ['headers.dl.obsoletes'],
            },
            {
                data: 'noObsoletesNeeded',
                warnings: ['headers.dl.obsoletes-not-needed'],
            },
            {
                data: 'supersedes',
                config: {
                    supersedes: true,
                },
                errors: ['headers.dl.supersedes'],
            },
            {
                data: 'noSupersedesNeeded',
                warnings: ['headers.dl.supersedes-not-needed'],
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
                data: 'wrongLatestAndObsoletesOrder',
                config: {
                    obsoletes: true,
                },
                errors: ['headers.dl.latest-obsoletes-order'],
            },
            {
                data: 'wrongLatestAndSupersedesOrder',
                config: {
                    supersedes: true,
                },
                errors: ['headers.dl.latest-supersedes-order'],
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
                data: 'wrongThisDate',
                errors: ['headers.dl.this-date'],
            },
            {
                data: 'wrongThisDate',
                errors: ['headers.dl.this-date'],
            },
            // TODO: will not end all successfully
            // {
            //     data: 'noDocDate',
            //     warnings: ['headers.dl.no-date'],
            // },
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
                data: 'diffThisAndLatestShortname',
                errors: ['headers.dl.this-latest-shortname'],
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
                data: 'noObsoletesLinkExist',
                config: {
                    obsoletes: true,
                },
                errors: ['headers.dl.not-found'],
            },
            {
                data: 'diffThisAndObsoletesShortname',
                config: {
                    obsoletes: true,
                },
                errors: ['headers.dl.this-obsoletes-shortname'],
            },
            {
                data: 'wrongObsoletesSyntax',
                config: {
                    obsoletes: true,
                },
                errors: ['headers.dl.obsoletes-syntax'],
            },
            {
                data: 'noSupersedesLinkExist',
                config: {
                    supersedes: true,
                },
                errors: ['headers.dl.not-found'],
            },
            {
                data: 'diffThisAndSupersedesShortname',
                config: {
                    supersedes: true,
                },
                errors: ['headers.dl.this-supersedes-shortname'],
            },
            {
                data: 'wrongSupersedesSyntax',
                config: {
                    supersedes: true,
                },
                errors: ['headers.dl.supersedes-syntax'],
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
        neutral: [
            {
                data: 'hasNeutral',
                warnings: ['structure.neutral.neutral'],
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
        charter: [
            {
                data: 'noGroup',
                errors: ['sotd.charter.no-group'],
            },
            {
                data: 'noCharter',
                errors: ['sotd.charter.no-charter'],
            },
        ],
        'draft-stability': [
            {
                data: 'noDraft',
                errors: ['sotd.draft-stability.not-found'],
            },
        ],
        publish: [
            {
                data: 'noParagraph',
                errors: ['sotd.publish.not-found'],
            },
            {
                data: 'noMatchUrl',
                errors: ['sotd.publish.url-not-match'],
            },
            {
                data: 'noHomepageLink',
                errors: ['sotd.publish.no-homepage-link'],
            },
        ],
        stability: [
            {
                data: 'noStability',
                errors: ['sotd.stability.no-stability'],
            },
        ],
        pp: [
            {
                data: 'good',
                config: {
                    patentPolicy: 'pp2020',
                },
            },
            {
                data: 'wrongPPFromCharter',
                errors: ['sotd.pp.wrong-pp-from-charter'],
            },
            {
                data: 'noPPFromCharter',
                errors: ['sotd.pp.no-pp-from-charter'],
            },
            {
                data: 'noPP2017',
                config: {
                    patentPolicy: 'pp2004',
                },
                errors: [
                    'sotd.pp.no-pp2017',
                    'sotd.pp.no-claims',
                    'sotd.pp.no-section6',
                ],
            },
            {
                data: 'noPP2020',
                config: {
                    patentPolicy: 'pp2020',
                },
                errors: ['sotd.pp.no-pp2020'],
            },
            // TODO: find a patent neither pp2020 pp2017
            // {
            //     data: 'noPPLink',
            //     config: {
            //         patentPolicy: 'pp2021',
            //     },
            //     errors: ['sotd.pp.no-pp-link'],
            // },
            {
                data: 'noDisclosures',
                config: {
                    patentPolicy: 'pp2020',
                },
                errors: ['sotd.pp.no-disclosures'],
            },
            {
                data: 'noClaims',
                config: {
                    patentPolicy: 'pp2020',
                },
                errors: ['sotd.pp.no-claims'],
            },
            {
                data: 'noSection6',
                config: {
                    patentPolicy: 'pp2020',
                },
                errors: ['sotd.pp.no-section6'],
            },
            {
                data: 'jointPublication',
                config: {
                    patentPolicy: 'pp2020',
                },
                errors: ['sotd.pp.no-pp'],
                warnings: ['sotd.pp.joint-publication'],
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
