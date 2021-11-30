exports.name = 'NOTE-Echidna';
exports.config = require('./NOTE').config;

const base = require('../base');
exports.rules = base.insertAfter(
    require('./NOTE').rules,
    'sotd.process-document',
    [require('../../rules/echidna/todays-date')]
);
