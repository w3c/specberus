exports.name = 'REC-AMENDED';
exports.config = {
    status: 'REC',
    longStatus: 'Recommendation',
    styleSheet: 'W3C-REC',
    track: 'Recommendation',
    amended: true,
};

exports.rules = require('./REC').rules;
