const { rules, echidnaRules } = require('./noteBase');

exports.rules = {
    ...rules,
    echidna: echidnaRules,
};
