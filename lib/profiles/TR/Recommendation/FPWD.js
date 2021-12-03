exports.name = 'FPWD';
const base = require('./recommendation-base');

// customize config
const config = {
    status: 'WD',
    longStatus: 'First Public Working Draft',
    styleSheet: 'W3C-WD',
    sotdStatus: true,
};
exports.config = { ...base.config, ...config };

exports.rules = base.rules;
