exports.name = 'CRD-Echidna';
const base = require('./CRD');

exports.config = base.config;

// customize rules
const profileUtil = require('../../profileUtil');
exports.rules = profileUtil.insertAfter(base.rules, 'sotd.process-document', [
    require('../../../rules/echidna/todays-date'),
]);
