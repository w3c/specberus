exports.data = {
    body: {
        classes: 'h-entry toc-sidebar',
    },
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
        defaultDate: '04 November 2021',
    },
    secno: 'secno',
    hr: {
        show: false,
    },
    dl: {
        show: true,
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
        supersede: {
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
        rescindLink: 'https://www.w3.org/TR/2017/REC-hr-time-20170101/',
        obsoleteText: 'Obsoletes this Recommendation',
        obsoleteLink: 'https://www.w3.org/TR/2017/REC-hr-time-20170101/',
        supersedeText: 'Supersedes this Recommendation',
        supersedeLink: 'https://www.w3.org/TR/2017/REC-hr-time-20170101/',
    },
    copyright: {
        show: true,
        startText: 'Copyright',
        MIT: 'MIT',
        MITLink: 'https://www.csail.mit.edu/',
        beihangHTML: '<a href="https://ev.buaa.edu.cn/">Beihang</a>',
        licenseHTML:
            'W3C <a href="https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer">liability</a>, <a href="https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks">trademark</a> and <a rel="license" href="https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document">permissive document license</a> rules apply.',
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

        iprLink: 'https://www.w3.org/groups/wg/i18n-core/ipr',
        iprText: 'public list of any patent disclosures',

        pageIncludeText: 'the group; that page also includes',
        individualText: 'An individual who has',
        iprRel: 'disclosure',

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
