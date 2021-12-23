/* eslint-disable import/no-dynamic-require */
const { data } = require('./note-base');

const profile = 'DNOTE';
const { config } = require(`../../../../lib/profiles/TR/Note/${profile}`);
const customData = {
    config: {
        ...config,
        profile,
        isDNOTE: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Note/DNOTE?type=good
const good = { ...data, ...customData };
exports.good = good;

// Used in http://localhost:8001/doc-views/TR/Note/DNOTE?rule=dl&type=badDl
const badDl = JSON.parse(JSON.stringify(good));
badDl.dl.seriesShortName = 'hr-dl-bad-shortname';
// const badDl = {
//     ...good,
//     ...{
//         dl: {
//             ...good.dl,
//             seriesShortName: 'hr-dl-bad-shortname',
//         },
//     },
// };
exports.dl = {
    badDl,
};

exports.badCopyright = {
    ...good,
    ...{
        copyright: {
            ...good.copyright,
            licenseHTML: 'Non license applies.',
        },
    },
};
