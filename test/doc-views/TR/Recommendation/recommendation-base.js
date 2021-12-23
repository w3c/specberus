const { data } = require('../TR');

const customData = {
    config: {
        underPP: true,
    },
};
exports.data = {
    ...data,
    ...customData,
};
