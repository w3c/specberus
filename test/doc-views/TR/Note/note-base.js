const { data } = require('../TR');

exports.data = {
    ...data,
    config: {
        ...data.config,
        underPP: false,
        isNoteTrack: true,
    },
    sotd: {
        ...data.sotd,
        deliverer: 'data-deliverer="32113"',
    },
};
