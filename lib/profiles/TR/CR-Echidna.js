// CR profile for echidna

exports.name = 'CR-Echidna';
exports.config = require('./CR').config;

const base = require('../base');
exports.rules = base.insertAfter(
    require('./CR').rules,
    'sotd.process-document',
    [require('../../rules/echidna/todays-date')]
);
