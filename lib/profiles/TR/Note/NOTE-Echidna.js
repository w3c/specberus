exports.name = 'NOTE-Echidna';
const base = require('./NOTE');

exports.config = base.config;

const profileUtil = require('../../profileUtil');
exports.rules = profileUtil.insertAfter(base.rules, 'sotd.process-document', [
    require('../../../rules/echidna/todays-date'),
]);
