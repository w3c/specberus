/* eslint-disable import/no-dynamic-require */
const { data } = require('./note-base');

const profile = 'DNOTE';

const { config } = require(`../../../../lib/profiles/TR/Note/${profile}`);

const customData = {
    config: {
        ...config,
        profile,
    },
};


data.config.titleSuffix = 'Pubrules-note-base';
data.config.profile = 'Pubrules';

export.dl.good = {}
export.dl.badText = {}

export.pp.good = {}
export.pp.badLink = {}

// const good = { ...data, ...customData };

// console.log(data);
exports.good = good;

exports.badDl = {
    ...good,
    ...{
        dl: {
            ...good.dl,
            seriesShortName: 'hr-dl-bad-shortname',
        },
    },
};

exports.badCopyright = {
    ...good,
    ...{
        copyright: {
            ...good.copyright,
            licenseHTML: 'Non license applies.',
        },
    },
}


