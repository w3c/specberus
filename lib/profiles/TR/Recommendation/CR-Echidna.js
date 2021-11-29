exports.name = 'CR-Echidna';
const base = require('./CR');

exports.config = base.config;

const profileUtil = require('../../profileUtil');
exports.rules = profileUtil.insertAfter(base.rules, 'sotd.process-document', [
    require('../../../rules/echidna/todays-date'),
]);
