// CR profile for echidna

exports.name = 'CRD-Echidna';
exports.config = require('./CRD').config;

const base = require('../base');
exports.rules = base.insertAfter(
    require('./CRD').rules,
    'sotd.process-document',
    [require('../../rules/echidna/todays-date')]
);
