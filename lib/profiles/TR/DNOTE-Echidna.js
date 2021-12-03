// TODO: merge all Echidna files.
exports.name = 'DNOTE-Echidna';
exports.config = require('./DNOTE').config;

const base = require('../base');
exports.rules = base.insertAfter(
    require('./DNOTE').rules,
    'sotd.process-document',
    [require('../../rules/echidna/todays-date')]
);
