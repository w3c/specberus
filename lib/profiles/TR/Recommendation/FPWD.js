exports.name = 'FPWD';
exports.config = {
    status: 'WD',
    longStatus: 'First Public Working Draft',
    styleSheet: 'W3C-WD',
    sotdStatus: true,
    track: 'Recommendation',
};
exports.rules = require('../../TR').rules;
