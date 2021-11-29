exports.config = {
    track: 'Note',
};

// customize rules
const base = require('../../TR');
const profileUtil = require('../../profileUtil');

const rules = profileUtil.insertAfter(base.rules, 'sotd.pp', [
    require('../../../rules/sotd/deliverer-note'),
]);

exports.rules = rules;
