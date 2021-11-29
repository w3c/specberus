exports.name = 'NOTE';
const base = require('./note-base');

// customize config
const config = {
    status: 'NOTE',
    longStatus: 'Group Note',
    styleSheet: 'W3C-NOTE',
};
exports.config = { ...base.config, ...config };

// customize rules
const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.pp', [
    require('../../../rules/sotd/deliverer-note'),
]);

exports.rules = rules;
