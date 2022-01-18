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

// const customData = {
//     config: {
//         underPP: false,
//         isNoteTrack: true,
//     },
//     sotd: {
//         deliverer: 'data-deliverer="32113"',
//     },
// };
// exports.data = {
//     ...data,
//     config: {
//         ...data.config,
//         underPP: false,
//         isNoteTrack: true,
//     },
//     sotd: {
//         ...data.sotd,
//         deliverer: 'data-deliverer="32113"',
//     },
// };
