// TODO: merge all Echidna files.
exports.name = 'DNOTE-Echidna';
const base = require('./DNOTE');

exports.config = base.config;

// customize rules
const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.process-document', [
    require('../../../rules/echidna/todays-date'),
]);

exports.rules = rules;
