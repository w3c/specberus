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
                    show: true,
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
                    show: true,
                    showCustomYear: true,
                    customYear: 2021,
                    MITLink: 'https://fake.csail.mit.org/',
                },
            },
            noLatestCopyright: {
                ...base,
                header: {
                    ...base.header,
                    showDefaultDate: true,
                    defaultDate: '04 November 2023',
                },
                copyright: {
                    ...base.copyright,
                    show: false,
                },
            },
            noMatchedLatestCopyright: {
                ...base,
                header: {
                    ...base.header,
                    showDefaultDate: true,
                    defaultDate: '04 November 2023',
                },
                copyright: {
                    ...base.copyright,
                    startText: 'Fake Copyright',
                    show: false,
                    showLatest: true,
                },
            },
            wrongLatestCopyrightLink: {
                ...base,
                header: {
                    ...base.header,
                    showDefaultDate: true,
                    defaultDate: '04 November 2023',
                },
                copyright: {
                    ...base.copyright,
                    show: false,
                    showLatest: true,
                    showCustomYear: true,
                    customYear: 2023,
                    W3CLink: 'https://fake.w3c.org/',
                },
            },
            noCopyrightDuringTransition: {
                ...base,
                header: {
                    ...base.header,
                    showDefaultDate: true,
                    defaultDate: '08 January 2023',
                },
                copyright: {
                    ...base.copyright,
                    show: false,
                },
            },
            noMatchedCopyrightDuringTransition: {
                ...base,
                header: {
                    ...base.header,
                    showDefaultDate: true,
                    defaultDate: '08 January 2023',
                },
                copyright: {
                    ...base.copyright,
                    startText: 'Fake Copyright',
                    show: false,
                    showLatest: true,
                },
            },
            matchLegacyCopyrightDuringTransition: {
                ...base,
                header: {
                    ...base.header,
                    showDefaultDate: true,
                    defaultDate: '08 January 2022',
                },
                copyright: {
                    ...base.copyright,
                    showCustomYear: true,
                    customYear: 2022,
                },
            },
            wrongLatestCopyrightLinkDuringTransition: {
                ...base,
                header: {
                    ...base.header,
                    showDefaultDate: true,
                    defaultDate: '08 January 2023',
                },
                copyright: {
                    ...base.copyright,
                    show: false,
                    showLatest: true,
                    showCustomYear: true,
                    customYear: 2023,
                    W3CLink: 'https://fake.w3c.org/',
                },
            },
            wrongLegacyCopyrightLinkDuringTransition: {
                ...base,
                header: {
                    ...base.header,
                    showDefaultDate: true,
                    defaultDate: '08 January 2022',
                },
                copyright: {
                    ...base.copyright,
                    showCustomYear: true,
                    customYear: 2022,
                    MITLink: 'https://fake.csail.mit.org/',
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
                        'https://www.w3.org/wrong/link/2021/Process-20211102/',
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
                        'https://www.w3.org/2021/Process-20211102/#wrong-url',
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
            noPP2017: {
                ...base,
                header: {
                    ...base.header,
                    defaultDate: '04 November 2019',
                },
                sotd: {
                    ...base.sotd,
                    ppHTML: '1 August 2017 <abbr title="World Wide Web Consortium">W3C</abbr> Patent Policy</a>',
                    ppLink: 'https://www.w3.org/Consortium/Patent-Policy/fake',
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
                defaultCRDate: '04 October 2022. 05 October 2022.',
            },
        },
        invalidDate: {
            ...base,
            sotd: {
                ...base.sotd,
                defaultCRDate: '02 December 2023',
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
