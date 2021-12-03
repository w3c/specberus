// Working Draft profile

exports.name = 'WD-Echidna';
const base = require('./WD');

exports.config = base.config;

const profileUtil = require('../../profileUtil');
exports.rules = profileUtil.insertAfter(base.rules, 'sotd.process-document', [
    require('../../../rules/echidna/todays-date'),
]);
