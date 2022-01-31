/* eslint-disable import/no-dynamic-require */
const { buildCommonViewData, data } = require('./registryBase');

const profile = 'CRY';
const { config } = require(`../../../../lib/profiles/TR/Registry/${profile}`);
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

module.exports = {
    good,
    ...common,
    'candidate-review-end': {
        noDateFound: {
            ...good,
            header: {
                ...good.header,
                defaultDate: '04 November 2024',
            },
        },
        multipleDateFound: {
            ...good,
            sotd: {
                ...good.sotd,
                processHTML:
                    '04 October 2022. 05 October 2022.<abbr title="World Wide Web Consortium">W3C</abbr> Process Document',
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
