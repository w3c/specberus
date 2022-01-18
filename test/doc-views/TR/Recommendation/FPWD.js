/* eslint-disable import/no-dynamic-require */
const { data } = require('./recommendation-base');

const profile = 'FPWD';
const {
    config,
} = require(`../../../../lib/profiles/TR/Recommendation/${profile}`);
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        notEndorsed: true,
        maybeUpdated: true,
        isFPWD: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/FPWD?type=good
const good = { ...data, ...customData };

module.exports = {
    // good data that used to generate 100% right documents.
    good,

    // data to generate document that trigger certain error(s).
    'div-head': {
        noHead: {
            ...good,
            header: {
                ...good.header,
                headClassName: 'foo',
            },
        },
    },
    hr: {
        noHr: {
            ...good,
            header: {
                ...good.header,
                hr: {
                    show: false,
                },
            },
        },
        duplicatedHr: {
            ...good,
            hr: {
                ...good.header.hr,
                show: true,
            },
        },
    },
    logo: {
        noLogo: {
            ...good,
            header: {
                ...good.header,
                logo: {
                    show: false,
                },
            },
        },
        invalidSrc: {
            ...good,
            header: {
                ...good.header,
                logo: {
                    ...good.logo,
                    src: 'http://invalid/source',
                },
            },
        },
        invalidHref: {
            ...good,
            header: {
                ...good.header,
                logo: {
                    ...good.logo,
                    href: 'http://invalid/href',
                },
            },
        },
    },
    'h1-title': {
        noHeadTitle: {
            ...good,
            head: {
                ...good.head,
                title: {
                    show: false,
                },
            },
        },
        noH1Title: {
            ...good,
            header: {
                ...good.header,
                title: {
                    show: false,
                },
            },
        },
        noH1AndHeadTitle: {
            ...good,
            head: {
                ...good.head,
                title: {
                    show: false,
                },
            },
            header: {
                ...good.header,
                title: {
                    show: false,
                },
            },
        },
        titlesNotMatch: {
            ...good,
            head: {
                ...good.head,
                title: {
                    ...good.head.title,
                    suffix: 'not match to h1',
                },
            },
        },
    },
    'details-summary': {
        noDetails: {
            ...good,
            header: {
                ...good.header,
                details: {
                    show: false,
                },
            },
        },
        noDetailsOpen: {
            ...good,
            header: {
                ...good.header,
                details: {
                    ...good.header.details,
                    open: '',
                },
            },
        },
        noDetailsDl: {
            ...good,
            dl: {
                show: false,
            },
        },
        noDetailsSummary: {
            ...good,
            header: {
                ...good.header,
                details: {
                    ...good.header.details,
                    summary: {
                        show: false,
                    },
                },
            },
        },
        wrongDetailsSummary: {
            ...good,
            header: {
                ...good.header,
                details: {
                    ...good.header.details,
                    summary: {
                        ...good.header.details.summary,
                        text: 'wrong text',
                    },
                },
            },
        },
    },
    dl: {
        wrongThisVersionHead: {
            ...good,
            dl: {
                ...good.dl,
                thisVersion: {
                    ...good.thisVersion,
                    text: 'wrong this version head',
                },
            },
        },
        wrongLatestVersionHead: {
            ...good,
            dl: {
                ...good.dl,
                latestVersion: {
                    ...good.latestVersion,
                    text: 'wrong latest version key',
                },
            },
        },
        wrongHistoryHead: {
            ...good,
            dl: {
                ...good.dl,
                historyText: 'wrong one',
            },
        },
    },
    'github-repo': {
        noFeedback: {
            ...good,
            dl: {
                ...good.dl,
                feedback: {
                    show: false,
                },
            },
        },
        noRepo: {
            ...good,
            dl: {
                ...good.dl,
                feedbackPrefix: 'https://wrongrepo.com/w3c/',
            },
        },
    },
    secno: {
        noSecno: {
            ...good,
            secno: '',
        },
    },
    'ol-toc': {
        noToc: {
            ...good,
            tocs: [],
        },
    },
    'h2-toc': {
        mixedTocs: {
            ...good,
            tocs: [
                good.tocs[0],
                {
                    ...good.tocs[0],
                    tag: 'div',
                },
            ],
        },
        notHtml5: {
            ...good,
            tocs: [
                {
                    ...good.tocs[0],
                    tag: 'div',
                },
            ],
        },
        noTocs: {
            ...good,
            tocs: [],
        },
        noTitles: {
            ...good,
            tocs: [
                {
                    ...good.tocs[0],
                    titles: [],
                },
            ],
        },
        duplicatedTitle: {
            ...good,
            tocs: [
                {
                    ...good.tocs[0],
                    titles: ['Table of Contents', 'Table of Contents'],
                },
            ],
        },
    },
    sheet: {
        noSheet: {
            ...good,
            head: {
                ...good.head,
                styleSheet: {
                    show: false,
                },
            },
        },
        notLast: {
            ...good,
            head: {
                ...good.head,
                styleSheet: {
                    ...good.head.styleSheet,
                    showAnother: true,
                },
            },
        },
    },
    meta: {
        noMeta: {
            ...good,
            head: {
                ...good.head,
                meta: {
                    show: false,
                },
            },
        },
        noWidth: {
            ...good,
            head: {
                ...good.head,
                meta: {
                    ...good.head.meta,
                    width: '',
                },
            },
        },
    },
    'body-toc-sidebar': {
        noSidebar: {
            ...good,
            body: {
                classes: '',
            },
        },
    },
    script: {
        noScript: {
            ...good,
            scripts: [],
        },
    },
    'back-to-top': {
        noBackToTop: {
            ...good,
            backToTop: {
                show: false,
            },
        },
    },
    'date-format': {
        wrongDateFormat: {
            ...good,
            showWrongDateFormat: true,
        },
    },
    wcag: {},
    reliability: {
        hasUnreliableLinks: {
            ...good,
            header: {
                ...good.header,
                logo: {
                    ...good.header.logo,
                    href: 'http://www.w3c-test.org/foo/bar.jpg',
                },
            },
        },
    },
    'section-ids': {
        noSectionId: {
            ...good,
            sotd: {
                ...good.sotd,
                id: '',
            },
        },
    },
    h2: {
        wrongAbstractH2: {
            ...good,
            abstract: {
                ...good.abstract,
                abstractText: 'foo',
            },
        },
        wrongSotdH2: {
            ...good,
            sotd: {
                ...good.sotd,
                title: 'wrong sotd title',
            },
        },
        wrongTocH2: {
            ...good,
            tocs: [
                {
                    ...good.tocs[0],
                    titles: ['wrong toc title'],
                },
            ],
        },
    },
    supersedable: {
        noIntro: {
            ...good,
            sotd: {
                ...good.sotd,
                emHTML: '<em>This section not the status of this document at the time of its publication. A list of current <abbr title="World Wide Web Consortium">W3C</abbr> publications and the latest revision of this technical report can be found in the <a href="https://www.w3.org/TR/"><abbr title="World Wide Web Consortium">W3C</abbr> technical reports index</a> at https://www.w3.org/TR/.</em>',
            },
        },
        noTr: {
            ...good,
            sotd: {
                ...good.sotd,
                emHTML: "<em>This section describes the status of this document at the time of its publication. A list of current <abbr >W3C</abbr> publications and the latest revision of this technical report can be found in the <a ><abbr title='World Wide Web Consortium'>W3C</abbr> technical reports index</a> at https://www.w3.org/TR/.</em>",
            },
        },
    },
    copyright: {
        noCopyright: {
            ...good,
            copyright: {
                show: false,
            },
        },
    },
    'process-document': {
        noProcess: {
            ...good,
            sotd: {
                ...good.sotd,
                processTextPrefix: 'wrong prefix',
            },
        },
        wrongLink: {
            ...good,
            sotd: {
                ...good.sotd,
                processLink:
                    'https://www.w3.org/wrong/link/2021/Process-20211102/',
            },
        },
        duplicatedProcess: {
            ...good,
            sotd: {
                ...good.sotd,
                duplicateProcess: true,
            },
        },
    },
    charter: {
        noGroup: {
            ...good,
            sotd: {
                ...good.sotd,
                iprLink: '',
            },
        },
        noCharter: {
            ...good,
            sotd: {
                ...good.sotd,
                iprLink: 'https://www.w3.org/groups/wg/forms/ipr',
            },
        },
    },
    'draft-stability': {
        noDraft: {
            ...good,
            sotd: {
                ...good.sotd,
                draftText:
                    'This is a other document and may be updated, replaced or obsoleted by other documents at any time. It is inappropriate to cite this document as other than work in progress.',
            },
        },
        noDraftEither: {
            ...good,
            sotd: {
                ...good.sotd,
                draftText:
                    'This is a other document and may be updated, replaced or obsoleted by other documents at any time. It is inappropriate to cite this document as other than work in progress.',
            },
        },
    },
    publish: {
        noParagraph: {
            ...good,
        },
        noMatchUrl: {
            ...good,
            sotd: {
                ...good.sotd,
                trackLink:
                    'https://www.w3.org/2021/Process-20211102/#wrong-url',
            },
        },
        noHomepageLink: {
            ...good,
            sotd: {
                ...good.sotd,
                WGLink: 'https://www.w3.org/groups/wg/i18n-core-wraong-url',
            },
        },
    },
};
