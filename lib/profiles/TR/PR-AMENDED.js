exports.name = 'PR-AMENDED';
exports.config = {
    status: 'PR',
    longStatus: 'Proposed Recommendation',
    previousVersion: true,
    styleSheet: 'W3C-PR',
    stabilityWarning: true,
    recTrackStatus: true,
    amended: true,
};

exports.rules = require('./PR').rules;
