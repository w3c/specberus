import * as TRBase from '../TRBase.js';

const { rules: baseRules, ...rest } = TRBase;

export default {
    ...rest,
    securityPrivacyRules: [
        {
            data: 'noSecurityPrivacy',
            warnings: ['structure.security-privacy.no-security-privacy'],
        },
        {
            data: 'noSecurity',
            warnings: ['structure.security-privacy.no-security'],
        },
        {
            data: 'noPrivacy',
            warnings: ['structure.security-privacy.no-privacy'],
        },
    ],
    recStabilityRules: [
        {
            data: 'noRECReview',
            errors: ['sotd.stability.no-rec-review'],
        },
        {
            data: 'noLicensingLink',
            errors: ['sotd.stability.no-licensing-link'],
        },
    ],
    rules: {
        ...baseRules,
        sotd: {
            ...baseRules.sotd,
            pp: [
                ...baseRules.sotd.pp,
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
            ],
        },
    },
};
