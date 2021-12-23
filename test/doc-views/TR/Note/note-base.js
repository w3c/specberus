const { data } = require('../TR');

const customData = {
    config: {
        underPP: false,
    },
};
exports.data = {
    ...data,
    ...customData,
};
