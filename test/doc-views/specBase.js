export const data = {
    bodyClassNames: 'h-entry',
    scripts: ['https://www.w3.org/scripts/TR/2021/fixup.js'],
    head: {
        meta: {
            show: true,
            width: 'width=device-width,',
        },
        title: {
            show: true,
            suffix: 'test document - Specberus',
        },
        styleSheet: {
            show: true,
            showAnother: false,
        },
        showCanonical: true,
    },
    header: {
        headClassName: 'head',
        hr: {
            show: true,
        },
        logo: {
            show: true,
            src: 'https://www.w3.org/StyleSheets/TR/2021/logos/W3C',
            href: 'https://www.w3.org/',
        },
        title: {
            show: true,
        },
        details: {
            show: true,
            open: 'open',
        },
        summary: {
            show: true,
            text: 'More details about this document',
        },
        defaultDate: '04 November 2023',
        showDefaultDate: false,
    },
    secno: 'secno',
    hr: {
        show: false,
    },
    dl: {
        show: true,
        topLevel: 'TR',
        thisVersion: {
            show: true,
            showHref: true,
            text: 'This Version',
        },
        latestVersion: {
            show: true,
            showHref: true,
            docType: 'TR',
            textDocType: 'TR',
            text: 'Latest published version: (@@note that version is not required in the latest version)',
            showAhead: false,
            showBehind: false,
        },
        latestEditor: {
            show: true,
            showHref: true,
            linkProtocol: 'https',
        },
        editor: {
            show: true,
            id: '56102',
        },
        history: {
            show: true,
            showHref: true,
            shortName: 'hr-time',
        },
        rescind: {
            showHref: true,
        },
        obsolete: {
            showHref: true,
        },
        feedback: {
            show: true,
        },
        historyText: 'History',
        shortName: 'hr-time',
        seriesShortName: 'hr-time',
        feedbackPrefix: 'https://github.com/w3c/',
        editorText: 'Editor',
        errataLink: 'https://github.com/w3c/display_errata/',
        rescindText: 'Rescinds this Recommendation',
        rescindLink: 'https://www.w3.org/TR/2017/REC-hr-time-20170101/', // TODO: This shortname hr-time-new should not be constrained
    },
    copyright: {
        show: true,
        startText: 'Copyright',
        W3CLink: 'https://www.w3.org/',
        licenseHTML:
            '<abbr title="World Wide Web Consortium">W3C</abbr><sup>®</sup> <a href="https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer">liability</a>, <a href="https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks">trademark</a> and <a rel="license" href="https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document">permissive document license</a> rules apply.',
    },
    abstract: {
        abstractText: 'Abstract',
    },
    backToTop: {
        show: true,
    },
    showWrongDateFormat: false,
    sotd: {
        id: 'sotd',
        title: 'Status of This Document',
        emHTML: '<em>This section describes the status of this document at the time of its publication. A list of current <abbr title="World Wide Web Consortium">W3C</abbr> publications and the latest revision of this technical report can be found in the <a href="https://www.w3.org/TR/"><abbr title="World Wide Web Consortium">W3C</abbr> technical reports index</a> at https://www.w3.org/TR/.</em>',

        submission: {
            show: false,
            processText: 'W3C Process',
            processLink: 'https://www.w3.org/Consortium/Process',
            membershipLink: 'https://www.w3.org/Consortium/Prospectus/Joining',
            ppLink: 'https://www.w3.org/Consortium/Patent-Policy/#sec-submissions',
            submissionLink: 'https://www.w3.org/Submission',
            submissionMemberLink: 'https://www.w3.org/Submission/2020/02/',
            submissionComment: 'https://www.w3.org/Submission/2020/02/Comment/',
        },

        rescindText1: 'chosen to rescind',
        rescindText2: 'about replacement or alternative technologies',
        rescindLink: 'https://www.w3.org/2016/11/obsoleting-rescinding/',

        group: 'Internationalization Working Group',

        WGLink: 'https://www.w3.org/groups/wg/i18n-core',
        trackLink: 'https://www.w3.org/2021/Process-20211102/#recs-and-notes',
        extra1: '',
        noEndorsementHTML:
            'does not imply endorsement by <abbr title="World Wide Web Consortium">W3C</abbr> and its Members',
        noteNotEndorsedText: 'are not endorsed by W3C nor its Members',

        draftText:
            'This is a draft document and may be updated, replaced or obsoleted by other documents at any time. It is inappropriate to cite this document as other than work in progress.',
        crdIntegrateChangesText:
            'integrates changes from the previous Candidate Recommendation',
        discText: 'intended to advance or to be maintained',
        wideReviewText: 'wide review',
        wideReviewLink:
            'https://www.w3.org/2021/Process-20211102/#dfn-wide-review',
        recConsensusText: 'after extensive consensus-building',

        licensingText: 'royalty-free licensing',
        licensingLink:
            'https://www.w3.org/Consortium/Patent-Policy/#sec-Requirements',

        acReviewLink: 'https://www.w3.org/2002/09/wbs/myQuestionnaires',

        ppLink: 'https://www.w3.org/Consortium/Patent-Policy/',
        ppHTML: '<abbr title="World Wide Web Consortium">W3C</abbr> Patent Policy</a>',
        noPPText: 'licensing requirements or commitments',
        ppLink1: 'https://www.w3.org/Consortium/Patent-Policy-20200915/',
        ppDate: '15 September 2020',

        iprLink: 'https://www.w3.org/groups/wg/i18n-core/ipr',
        iprText: 'public list of any patent disclosures',
        iprRel: 'disclosure',
        showDifferentPP: false,

        pageIncludeText: 'the group; that page also includes',
        individualText: 'An individual who has',

        essentialLink:
            'https://www.w3.org/Consortium/Patent-Policy/#def-essential',
        essentialText: 'Essential Claim(s)',

        disclosureLink:
            'https://www.w3.org/Consortium/Patent-Policy/#sec-Disclosure',
        disclosureHTML:
            'section 6 of the <abbr title="World Wide Web Consortium">W3C</abbr> Patent Policy',

        duplicateProcess: false,
        processTextPrefix: 'is governed by the',
        processLink: 'https://www.w3.org/2021/Process-20211102/',
        processHTML:
            '2 November 2021 <abbr title="World Wide Web Consortium">W3C</abbr> Process Document',
        newFeatures: {
            show: false,
            text: 'Future updates to this Recommendation may incorporate new features.',
        },
        defaultCRDate: '04 October 2024',
        rec: {
            showProposedAdd: false,
            showAddition: false,
            addition: 'Proposed additions are marked in the document.',
        },
    },
    tocs: [
        {
            titles: ['Table of Contents'],
            class: 'toc',
            tag: 'nav',
        },
    ],
    // bold() {
    //     return function (text, render) {
    //         return `<b>-----${render(text)}-----</b>`;
    //     };
    // },
    helpers: {
        now() {
            const now = new Date();
            return `${now.getDate()} ${now.toLocaleDateString('en-US', {
                month: 'long',
            })} ${now.getFullYear()}`;
        },
        nowDigit8() {
            const now = new Date();
            const month = `0${now.getMonth() + 1}`.slice(-2);
            const day = `0${now.getDate()}`.slice(-2);
            return `${now.getFullYear()}${month}${day}`;
        },
        nowYear() {
            const now = new Date();
            return `${now.getFullYear()}`;
        },
        sixMonthLater() {
            const later = new Date(
                new Date() - 0 + 6 * 30 * 24 * 60 * 60 * 1000
            );
            return `${later.getDate()} ${later.toLocaleDateString('en-US', {
                month: 'long',
            })} ${later.getFullYear()}`;
        },
    },
};

export function buildCommonViewData(base) {
    return {
        'div-head': {
            noHead: {
                ...base,
                header: {
                    ...base.header,
                    headClassName: 'foo',
                },
            },
        },
        hr: {
            noHr: {
                ...base,
                header: {
                    ...base.header,
                    hr: {
                        show: false,
                    },
                },
            },
            duplicatedHr: {
                ...base,
                hr: {
                    ...base.header.hr,
                    show: true,
                },
            },
        },
        logo: {
            noLogo: {
                ...base,
                header: {
                    ...base.header,
                    logo: {
                        show: false,
                    },
                },
            },
            invalidSrc: {
                ...base,
                header: {
                    ...base.header,
                    logo: {
                        ...base.logo,
                        src: 'http://invalid/source',
                    },
                },
            },
            invalidHref: {
                ...base,
                header: {
                    ...base.header,
                    logo: {
                        ...base.logo,
                        href: 'http://invalid/href',
                    },
                },
            },
        },
        'h1-title': {
            noHeadTitle: {
                ...base,
                head: {
                    ...base.head,
                    title: {
                        show: false,
                    },
                },
            },
            noH1Title: {
                ...base,
                header: {
                    ...base.header,
                    title: {
                        show: false,
                    },
                },
            },
            noH1AndHeadTitle: {
                ...base,
                head: {
                    ...base.head,
                    title: {
                        show: false,
                    },
                },
                header: {
                    ...base.header,
                    title: {
                        show: false,
                    },
                },
            },
            titlesNotMatch: {
                ...base,
                head: {
                    ...base.head,
                    title: {
                        ...base.head.title,
                        suffix: 'not match to h1',
                    },
                },
            },
        },
        'details-summary': {
            noDetails: {
                ...base,
                header: {
                    ...base.header,
                    details: {
                        show: false,
                    },
                },
            },
            noDetailsOpen: {
                ...base,
                header: {
                    ...base.header,
                    details: {
                        ...base.header.details,
                        open: '',
                    },
                },
            },
            noDetailsDl: {
                ...base,
                dl: {
                    show: false,
                },
            },
            noDetailsSummary: {
                ...base,
                header: {
                    ...base.header,
                    summary: {
                        show: false,
                    },
                },
            },
            wrongDetailsSummary: {
                ...base,
                header: {
                    ...base.header,
                    summary: {
                        ...base.header.summary,
                        text: 'wrong text',
                    },
                },
            },
        },
        dl: {
            wrongThisVersionHead: {
                ...base,
                dl: {
                    ...base.dl,
                    thisVersion: {
                        ...base.dl.thisVersion,
                        text: 'wrong this version head',
                    },
                },
            },
            wrongLatestVersionHead: {
                ...base,
                dl: {
                    ...base.dl,
                    latestVersion: {
                        ...base.latestVersion,
                        text: 'wrong latest version key',
                    },
                },
            },
            wrongHistoryHead: {
                ...base,
                dl: {
                    ...base.dl,
                    historyText: 'wrong one',
                },
            },
            rescinds: {
                ...base,
                config: {
                    ...base.config,
                    isRescinded: false,
                },
            },
            noRescindsNeeded: {
                ...base,
                config: {
                    ...base.config,
                    isRescinded: true,
                },
            },
            wrongThisAndLatestOrder: {
                ...base,
                dl: {
                    ...base.dl,
                    latestVersion: {
                        ...base.dl.latestVersion,
                        show: false,
                        showAhead: true,
                    },
                },
            },
            wrongLatestAndRescindsOrder: {
                ...base,
                dl: {
                    ...base.dl,
                    latestVersion: {
                        ...base.dl.latestVersion,
                        show: false,
                        showBehind: true,
                    },
                },
                config: {
                    ...base.config,
                    isRescinded: true,
                },
            },
            noThisLinkExist: {
                ...base,
                dl: {
                    ...base.dl,
                    thisVersion: {
                        ...base.dl.thisVersion,
                        showHref: false,
                    },
                },
            },
            wrongThisDate: {
                ...base,
                header: {
                    ...base.header,
                    defaultDate: '04 October 2023',
                },
            },
            noDocDate: {
                ...base,
                config: {
                    ...base.config,
                    isEchidna: false,
                },
                header: {
                    ...base.header,
                    defaultDate: '',
                },
            },
            wrongThisSyntax: {
                ...base,
                config: {
                    ...base.config,
                    status: 'FWD',
                },
            },
            shortnameLowercase: {
                ...base,
                dl: {
                    ...base.dl,
                    shortName: 'FileAPI',
                    seriesShortName: 'FileAPI',
                    history: {
                        ...base.dl.history,
                        shortName: 'FileAPI',
                    },
                },
            },
            noEditorDraftLinkExist: {
                ...base,
                dl: {
                    ...base.dl,
                    latestEditor: {
                        ...base.dl.latestEditor,
                        showHref: false,
                    },
                },
            },
            noSecureEditorDraftLink: {
                ...base,
                dl: {
                    ...base.dl,
                    latestEditor: {
                        ...base.dl.latestEditor,
                        linkProtocol: 'http',
                    },
                },
            },
            noEditor: {
                ...base,
                dl: {
                    ...base.dl,
                    editor: {
                        ...base.dl.editor,
                        show: false,
                    },
                },
            },
            missingEditorId: {
                ...base,
                dl: {
                    ...base.dl,
                    editor: {
                        ...base.dl.editor,
                        id: '',
                    },
                },
            },
            noHistoryLinkExist: {
                ...base,
                dl: {
                    ...base.dl,
                    history: {
                        ...base.dl.history,
                        showHref: false,
                    },
                },
            },
            noRescindLinkExist: {
                ...base,
                config: {
                    ...base.config,
                    isRescinded: true,
                },
                dl: {
                    ...base.dl,
                    rescind: {
                        ...base.dl.rescind,
                        showHref: false,
                    },
                },
            },
            noLatestLinkExist: {
                ...base,
                dl: {
                    ...base.dl,
                    latestVersion: {
                        ...base.dl.latestVersion,
                        showHref: false,
                    },
                },
            },
            linkDiff: {
                ...base,
                dl: {
                    ...base.dl,
                    latestVersion: {
                        ...base.dl.latestVersion,
                        textDocType: 'FAKE',
                    },
                },
            },
            wrongRescindSyntax: {
                ...base,
                config: {
                    ...base.config,
                    isRescinded: true,
                },
                dl: {
                    ...base.dl,
                    rescindLink:
                        'https://www.w3.org/FAKE/2017/REC-fake-name-20170101/',
                },
            },
            wrongLatestSyntax: {
                ...base,
                dl: {
                    ...base.dl,
                    latestVersion: {
                        ...base.dl.latestVersion,
                        docType: 'FAKE',
                        textDocType: 'FAKE',
                    },
                },
            },
        },
        shortname: {
            shortnameLowercaseFP: {
                ...base,
                dl: {
                    ...base.dl,
                    shortName: 'UPPERcase-name',
                    seriesShortName: 'UPPERcase-name',
                    history: {
                        ...base.dl.history,
                        shortName: 'UPPERcase-name',
                    },
                },
            },
            diffThisAndLatestShortname: {
                ...base,
                dl: {
                    ...base.dl,
                    seriesShortName: 'fake-hr-time',
                },
            },
            wrongHistorySyntax: {
                ...base,
                dl: {
                    ...base.dl,
                    history: {
                        ...base.dl.history,
                        shortName: 'fake-name',
                    },
                },
            },
            diffThisAndRescindShortname: {
                ...base,
                config: {
                    ...base.config,
                    isRescinded: true,
                },
                dl: {
                    ...base.dl,
                    rescindLink:
                        'https://www.w3.org/TR/2017/REC-fake-name-20170101/',
                },
            },
        },
        secno: {
            noSecno: {
                ...base,
                secno: '',
            },
        },
        'ol-toc': {
            noToc: {
                ...base,
                tocs: [],
            },
        },
        'h2-toc': {
            mixedTocs: {
                ...base,
                tocs: [
                    base.tocs[0],
                    {
                        ...base.tocs[0],
                        tag: 'div',
                    },
                ],
            },
            notHtml5: {
                ...base,
                tocs: [
                    {
                        ...base.tocs[0],
                        tag: 'div',
                    },
                ],
            },
            noTocs: {
                ...base,
                tocs: [],
            },
            noTitles: {
                ...base,
                tocs: [
                    {
                        ...base.tocs[0],
                        titles: [],
                    },
                ],
            },
            duplicatedTitle: {
                ...base,
                tocs: [
                    {
                        ...base.tocs[0],
                        titles: ['Table of Contents', 'Table of Contents'],
                    },
                ],
            },
        },
        sheet: {
            noSheet: {
                ...base,
                head: {
                    ...base.head,
                    styleSheet: {
                        show: false,
                    },
                },
            },
            notLast: {
                ...base,
                head: {
                    ...base.head,
                    styleSheet: {
                        ...base.head.styleSheet,
                        showAnother: true,
                    },
                },
            },
        },
        meta: {
            noMeta: {
                ...base,
                head: {
                    ...base.head,
                    meta: {
                        show: false,
                    },
                },
            },
            noWidth: {
                ...base,
                head: {
                    ...base.head,
                    meta: {
                        ...base.head.meta,
                        width: '',
                    },
                },
            },
        },
        'body-toc-sidebar': {
            classFound: {
                ...base,
                bodyClassNames: 'toc-sidebar',
            },
        },
        script: {
            noScript: {
                ...base,
                scripts: [],
            },
        },
        'back-to-top': {
            noBackToTop: {
                ...base,
                backToTop: {
                    show: false,
                },
            },
        },
        'date-format': {
            wrongDateFormat: {
                ...base,
                showWrongDateFormat: true,
            },
        },
        wcag: {},
        reliability: {
            hasUnreliableLinks: {
                ...base,
                header: {
                    ...base.header,
                    logo: {
                        ...base.header.logo,
                        href: 'http://www.w3c-test.org/foo/bar.jpg',
                    },
                },
            },
        },
        'section-ids': {
            noSectionId: {
                ...base,
                sotd: {
                    ...base.sotd,
                    id: '',
                },
            },
        },
        h2: {
            wrongAbstractH2: {
                ...base,
                abstract: {
                    ...base.abstract,
                    abstractText: 'foo',
                },
            },
            wrongSotdH2: {
                ...base,
                sotd: {
                    ...base.sotd,
                    title: 'wrong sotd title',
                },
            },
            wrongTocH2: {
                ...base,
                tocs: [
                    {
                        ...base.tocs[0],
                        titles: ['wrong toc title'],
                    },
                ],
            },
        },
        canonical: {
            noCanonical: {
                ...base,
                head: {
                    ...base.head,
                    showCanonical: false,
                },
            },
        },
        supersedable: {
            noIntro: {
                ...base,
                sotd: {
                    ...base.sotd,
                    emHTML: '<em>This section not the status of this document at the time of its publication. A list of current <abbr title="World Wide Web Consortium">W3C</abbr> publications and the latest revision of this technical report can be found in the <a href="https://www.w3.org/TR/"><abbr title="World Wide Web Consortium">W3C</abbr> technical reports index</a> at https://www.w3.org/TR/.</em>',
                },
            },
            noTr: {
                ...base,
                sotd: {
                    ...base.sotd,
                    emHTML: "<em>This section describes the status of this document at the time of its publication. A list of current <abbr >W3C</abbr> publications and the latest revision of this technical report can be found in the <a ><abbr title='World Wide Web Consortium'>W3C</abbr> technical reports index</a> at https://www.w3.org/TR/.</em>",
                },
            },
        },
        html: {
            skipValidation: {
                ...base,
            },
        },
        neutral: {
            hasNeutral: {
                ...base,
                header: {
                    ...base.header,
                    summary: {
                        ...base.header.summary,
                        text: 'More details about this document master',
                    },
                },
            },
        },
    };
}
