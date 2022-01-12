const { data } = require('../TR');

const customData = {
    config: {
        underPP: false,
        isRyTrack: true,
    },
};
exports.data = {
    ...data,
    ...customData,
};
