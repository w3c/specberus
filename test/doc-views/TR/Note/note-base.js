const { data } = require('../TR');

// data.config.titleSuffix = 'Pubrules-note-base';
// data.config.profile = 'Pubrules';

const customData = {
    config: {
        profile: 'NOTE',
        status: 'NOTE',
    },
};
exports.data = {
    ...data,
    ...customData,
};
