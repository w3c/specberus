import { config } from '../../../../lib/profiles/TR/Registry/CRY.js';
import registryBase from './registryBase.js';

const { buildCommonViewData, data } = registryBase;
const currentYear = new Date().getFullYear();

const profile = 'CRY';
const customData = {
    config: {
        ...config,
        ...data.config,
        profile,
        notEndorsed: true,
        isCRY: true,
        maybeUpdated: true,
        underPP: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Registry/CRY?type=good
const good = { ...data, ...customData };
const common = buildCommonViewData(good);

export default {
    good,
    ...common,
    'candidate-review-end': {
        noDateFound: {
            ...good,
            header: {
                ...good.header,
                defaultDate: `04 November ${currentYear}`,
            },
        },
        multipleDateFound: {
            ...good,
            sotd: {
                ...good.sotd,
                processHTML: `04 October ${currentYear}. 05 October ${currentYear}.<abbr title="World Wide Web Consortium">W3C</abbr> Process Document`,
            },
        },
        invalidDate: {
            ...good,
            header: {
                ...good.header,
                defaultDate: '04 November 2010',
            },
        },
    },
};
