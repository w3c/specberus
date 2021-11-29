// Working Draft profile

exports.name = 'WD-Echidna';
exports.config = require('./WD').config;

const profileUtil = require('../../profileUtil');
exports.rules = profileUtil.insertAfter(
    require('./WD').rules,
    'sotd.process-document',
    [require('../../../rules/echidna/todays-date')]
);
