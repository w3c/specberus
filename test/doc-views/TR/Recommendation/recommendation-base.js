const { data } = require('../TR');

const customData = {
    config: {
        underPP: true,
        isRecTrack: true,
    },
};
exports.data = {
    ...data,
    ...customData,
};
