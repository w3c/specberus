import * as TRBase from '../TRBase.js';

const { data, ...rest } = TRBase;

const buildSecurityPrivacy = base => ({
    noSecurityPrivacy: {
        ...base,
    },
    noSecurity: {
        ...base,
        sotd: {
            ...base.sotd,
            title: `${base.sotd.title} privacy`,
        },
    },
    noPrivacy: {
        ...base,
        sotd: {
            ...base.sotd,
            title: `${base.sotd.title} security`,
        },
    },
});

const buildRecStability = base => ({
    noRECReview: {
        ...base,
        config: {
            ...base.config,
            isREC: false,
        },
    },
    noLicensingLink: {
        ...base,
        sotd: {
            ...base.sotd,
            licensingLink:
                'https://www.w3.org/Consortium/Patent-Policy/#sec-Requirements-fake',
        },
    },
});

export default {
    ...rest,
    buildSecurityPrivacy,
    buildRecStability,
    data: {
        ...data,
        config: {
            underPP: true,
            isRecTrack: true,
        },
    },
};
