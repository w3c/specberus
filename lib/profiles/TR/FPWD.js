exports.name = 'FPWD';
exports.config = {
    status: 'WD',
    longStatus: 'First Public Working Draft',
    styleSheet: 'W3C-WD',
    stabilityWarning: true,
    sotdStatus: true,
    track: 'REC',
};
exports.rules = require('../TR').rules;
