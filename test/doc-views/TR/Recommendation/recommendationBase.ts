import type { BaseCommonViewData } from '../../specBase.js';
import * as TRBase from '../TRBase.js';

const { data, ...rest } = TRBase;

const buildSecurityPrivacy = (base: BaseCommonViewData) => ({
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

const buildRecStability = (base: BaseCommonViewData) => ({
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
                'https://www.w3.org/policies/patent-policy/#sec-Requirements-fake',
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
