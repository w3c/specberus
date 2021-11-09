exports.name = 'PR-AMENDED';
exports.config = {
    status: 'PR',
    longStatus: 'Proposed Recommendation',
    styleSheet: 'W3C-PR',
    track: 'Recommendation',
    amended: true,
};

exports.rules = require('./PR').rules;
