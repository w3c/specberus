import { config } from '../../../lib/profiles/SUBM/MEM-SUBM.js';
import { buildCommonViewData, data } from '../specBase.js';

// Used in http://localhost:8001/doc-views/TR/Recommendation/MEM-SUBM?type=good
const good = {
    ...data,
    sotd: {
        ...data.sotd,
        submission: {
            ...data.sotd.submission,
            show: true,
        },
    },
    dl: {
        ...data.dl,
        topLevel: 'Submission',
        latestVersion: {
            ...data.dl.latestVersion,
            docType: 'Submission',
            textDocType: 'Submission',
        },
    },
    config: {
        ...config,
        ...data.config,
        profile: 'Member Submission',
        status: 'SUBM',
    },
};

export default {
    good,
    ...buildCommonViewData(good),
    'memsub-copyright': {
        noCopyright: {
            ...good,
            copyright: {
                show: false,
            },
        },
        noCopyrightLink: {
            ...good,
            copyright: {
                ...good.copyright,
                licenseHTML:
                    'W3C <a href="https://fake-url#Legal_Disclaimer">liability</a>, <a href="https://fake-url#W3C_Trademarks">trademark</a> and <a rel="license" href="https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document">permissive document license</a> rules apply.',
            },
        },
    },
    submission: {
        noSubmissionText: {
            ...good,
            sotd: {
                ...good.sotd,
                submission: {
                    show: false,
                },
            },
        },
        noProcess: {
            ...good,
            sotd: {
                ...good.sotd,
                submission: {
                    ...good.sotd.submission,
                    processLink: 'https://fake-url/Consortium/Process',
                },
            },
        },
        noMembership: {
            ...good,
            sotd: {
                ...good.sotd,
                submission: {
                    ...good.sotd.submission,
                    membershipLink:
                        'https://fake-url/Consortium/Prospectus/Joining',
                },
            },
        },
        noPP: {
            ...good,
            sotd: {
                ...good.sotd,
                submission: {
                    ...good.sotd.submission,
                    ppLink: 'https://fake-url/Consortium/Patent-Policy/#sec-submissions',
                },
            },
        },
        noSubmission: {
            ...good,
            sotd: {
                ...good.sotd,
                submission: {
                    ...good.sotd.submission,
                    submissionLink: 'https://fake-url/Submission',
                },
            },
        },
        noSubmissionMembers: {
            ...good,
            sotd: {
                ...good.sotd,
                submission: {
                    ...good.sotd.submission,
                    submissionMemberLink:
                        'https://fake-url/Submission/2020/02/',
                },
            },
        },
        noComment: {
            ...good,
            sotd: {
                ...good.sotd,
                submission: {
                    ...good.sotd.submission,
                    submissionComment:
                        'https://fake-url/Submission/2020/02/Comment/',
                },
            },
        },
    },
};
