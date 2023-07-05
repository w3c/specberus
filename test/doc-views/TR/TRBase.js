import {
    buildCommonViewData as _buildCommonViewData,
    data,
} from '../specBase.js';

export { data };

export function buildCommonViewData(base) {
    const common = _buildCommonViewData(base);
    return {
        ...common,
        'github-repo': {
            noFeedback: {
                ...base,
                dl: {
                    ...base.dl,
                    feedback: {
                        show: false,
                    },
                },
            },
            noRepo: {
                ...base,
                dl: {
                    ...base.dl,
                    feedbackPrefix: 'https://wrongrepo.com/w3c/',
                },
            },
        },
        copyright: {
            noCopyright: {
                ...base,
                header: {
                    ...base.header,
                    showDefaultDate: true,
                },
                copyright: {
                    ...base.copyright,
                    show: false,
                },
            },
            noMatchedCopyright: {
                ...base,
                header: {
                    ...base.header,
                    showDefaultDate: true,
                },
                copyright: {
                    ...base.copyright,
                    startText: 'Fake Copyright',
                },
            },
            wrongCopyrightLink: {
                ...base,
                header: {
                    ...base.header,
                    showDefaultDate: true,
                },
                copyright: {
                    ...base.copyright,
                    W3CLink: 'https://www.w.org/',
                },
            },
            copyrightExceptionFound: {
                ...base,
                header: {
                    ...base.header,
                    showDefaultDate: true,
                },
                dl: {
                    ...base.dl,
                    shortName: 'epub-33',
                    seriesShortName: 'epub-33',
                },
                copyright: {
                    ...base.copyright,
                    showDefault: false,
                    exceptionHtml:
                        '<a href="https://www.w3.org/Consortium/Legal/ipr-notice#Copyright">Copyright</a> © 1999-2023 <a href="https://www.idpf.org">International Digital Publishing Forum</a> and <a href="https://www.w3.org/">World Wide Web Consortium</a>. <abbr title="World Wide Web Consortium">W3C</abbr><sup>®</sup> <a href="https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer">liability</a>, <a href="https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks">trademark</a> and <a rel="license" href="https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document" title="W3C Software and Document Notice and License">permissive document license</a> rules apply.',
                },
            },
            copyrightExceptionNotFound: {
                ...base,
                header: {
                    ...base.header,
                    showDefaultDate: true,
                },
                dl: {
                    ...base.dl,
                    shortName: 'epub-33',
                    seriesShortName: 'epub-33',
                },
                copyright: {
                    ...base.copyright,
                    showDefault: false,
                    exceptionHtml:
                        '<a href="https://www.w3.org/Consortium/Legal/ipr-notice#Copyright">Copyright Exception Not Found</a> © 1999-2023 <a href="https://www.idpf.org">International Digital Publishing Forum</a> and <a href="https://www.w3.org/">World Wide Web Consortium</a>. <abbr title="World Wide Web Consortium">W3C</abbr><sup>®</sup> <a href="https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer">liability</a>, <a href="https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks">trademark</a> and <a rel="license" href="https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document" title="W3C Software and Document Notice and License">permissive document license</a> rules apply.',
                },
            },
        },
        'process-document': {
            noProcess: {
                ...base,
                sotd: {
                    ...base.sotd,
                    processTextPrefix: 'wrong prefix',
                },
            },
            wrongLink: {
                ...base,
                sotd: {
                    ...base.sotd,
                    processLink:
                        'https://www.w3.org/wrong/link/2023/Process-20230612/',
                },
            },
            duplicatedProcess: {
                ...base,
                sotd: {
                    ...base.sotd,
                    duplicateProcess: true,
                },
            },
        },
        charter: {
            noGroup: {
                ...base,
                sotd: {
                    ...base.sotd,
                    iprLink: '',
                },
            },
            noCharter: {
                ...base,
                sotd: {
                    ...base.sotd,
                    iprLink: 'https://www.w3.org/groups/wg/forms/ipr',
                },
            },
        },
        publish: {
            noParagraph: {
                ...base,
                config: {
                    ...base.config,
                    longStatus: 'First Public WD',
                },
            },
            noMatchUrl: {
                ...base,
                sotd: {
                    ...base.sotd,
                    trackLink:
                        'https://www.w3.org/2023/Process-20230612/#wrong-url',
                },
            },
            noHomepageLink: {
                ...base,
                sotd: {
                    ...base.sotd,
                    WGLink: 'https://www.w3.org/groups/wg/i18n-core-wraong-url',
                },
            },
        },
        stability: {
            noStability: {
                ...base,
                config: {
                    ...base.config,
                    longStatus: 'Fake Status',
                },
            },
        },
        pp: {
            wrongPPFromCharter: {
                ...base,
            },
            jointDifferentPP: {
                ...base,
                config: {
                    ...base.config,
                    underPP: true,
                },
                sotd: {
                    ...base.sotd,
                    showDifferentPP: true,
                },
            },
            noPPFromCharter: {
                ...base,
                sotd: {
                    ...base.sotd,
                    iprLink: 'https://www.w3.org/groups/wg/fake/ipr',
                    WGLink: 'https://www.w3.org/groups/wg/fake',
                },
            },
            noPP: {
                ...base,
                sotd: {
                    ...base.sotd,
                    extra1: 'extra text',
                },
            },
            noPP2020: {
                ...base,
                sotd: {
                    ...base.sotd,
                    ppLink: 'https://www.w3.org/Consortium/Patent-Policy/fake',
                },
            },
            noDisclosures: {
                ...base,
                sotd: {
                    ...base.sotd,
                    iprRel: 'fake',
                },
            },
            noClaims: {
                ...base,
                sotd: {
                    ...base.sotd,
                    essentialLink:
                        'https://www.w3.org/Consortium/Patent-Policy/#def-essential-fake',
                },
            },
            noSection6: {
                ...base,
                sotd: {
                    ...base.sotd,
                    disclosureLink:
                        'https://www.w3.org/Consortium/Patent-Policy/#sec-Disclosure-fake',
                },
            },
            jointPublication: {
                ...base,
                sotd: {
                    ...base.sotd,
                    group: 'Internationalization Working Group and the Fake Working Group',
                },
            },
        },
    };
}

export function buildCandidateReviewEnd(base) {
    return {
        noDateFound: {
            ...base,
            sotd: {
                ...base.sotd,
                defaultCRDate: '',
            },
        },
        multipleDateFound: {
            ...base,
            sotd: {
                ...base.sotd,
                defaultCRDate: '04 October 2024. 05 October 2024.',
            },
        },
        invalidDate: {
            ...base,
            sotd: {
                ...base.sotd,
                defaultCRDate: '02 December 2024',
            },
        },
    };
}

export function buildTodaysDate(base) {
    return {
        noDateDetected: {
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
        wrongDate: {
            ...base,
            config: {
                ...base.config,
                isEchidna: false,
            },
            header: {
                ...base.header,
                defaultDate: '04 November 2019',
            },
        },
    };
}

export function buildDelivererChange(base) {
    return {
        delivererChanged: {
            ...base,
            config: {
                ...base.config,
                isEchidna: true,
            },
            header: {
                ...base.header,
                defaultDate: '',
            },
        },
    };
}

export function buildDraftStability(base) {
    return {
        noDraftEither: {
            ...base,
            sotd: {
                ...base.sotd,
                draftText:
                    'This is a other document and may be updated, replaced or obsoleted by other documents at any time. It is inappropriate to cite this document as other than work in progress.',
            },
        },
        noDraft: {
            ...base,
            sotd: {
                ...base.sotd,
                draftText:
                    'This is a other document and may be updated, replaced or obsoleted by other documents at any time. It is inappropriate to cite this document as other than work in progress.',
            },
        },
    };
}

export function buildNewFeatures(base) {
    return {
        noWarning: {
            ...base,
        },
        noLink: {
            ...base,
            sotd: {
                ...base.sotd,
                newFeatures: {
                    show: true,
                    text: `Future updates to this ${
                        base.config.status === 'PR'
                            ? 'specification'
                            : 'Recommendation'
                    } may incorporate new features.`,
                },
            },
        },
    };
}
