exports.name = 'DNOTE';
const base = require('./note-base');

// customize config
const config = {
    status: 'DNOTE',
    longStatus: 'Group Draft Note',
    styleSheet: 'W3C-DNOTE',
};
exports.config = { ...base.config, ...config };

// customize rules
const profileUtil = require('../../profileUtil');
const rules = profileUtil.insertAfter(base.rules, 'sotd.pp', [
    require('../../../rules/sotd/draft-stability'),
]);

exports.rules = rules;
