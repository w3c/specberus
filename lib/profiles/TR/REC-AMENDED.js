exports.name = 'REC-AMENDED';
exports.config = {
    status: 'REC',
    longStatus: 'Recommendation',
    previousVersion: true,
    styleSheet: 'W3C-REC',
    stabilityWarning: 'REC',
    recTrackStatus: true,
    amended: true,
};

exports.rules = require('./REC').rules;
