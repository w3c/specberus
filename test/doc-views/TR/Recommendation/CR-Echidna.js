exports.name = 'CR-Echidna';
const base = require('./CR');

exports.config = base.config;

// customize rules
const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.process-document', [
    require('../../../rules/echidna/todays-date'),
]);

exports.rules = rules;
