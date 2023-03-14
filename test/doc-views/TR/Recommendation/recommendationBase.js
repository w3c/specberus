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

const buildCopyrightException = base => ({
    goodCopyright: {
        ...base,
        dl: {
            ...base.dl,
            seriesShortName: 'epub-ssv-11',
        },
        copyright: {
            ...base.copyright,
            startString:
                '<a href="https://www.idpf.org">International Digital Publishing Forum</a> and <a href="https://www.w3.org/">World Wide Web Consortium</a>',
        },
    },
    wrongExpLink: {
        ...base,
        copyright: {
            ...base.copyright,
            licensingLink:
                'https://www.w3.org/Consortium/Patent-Policy/#sec-Requirements-fake',
        },
    },
});

export default {
    ...rest,
    buildSecurityPrivacy,
    buildRecStability,
    buildCopyrightException,
    data: {
        ...data,
        config: {
            underPP: true,
            isRecTrack: true,
        },
    },
};
