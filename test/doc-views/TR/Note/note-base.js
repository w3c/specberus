const { data } = require('../TR');

const customData = {
    config: {
        underPP: false,
        isNoteTrack: true,
    },
};
exports.data = {
    ...data,
    ...customData,
};
