exports.config = {
    track: 'Note',
};

const profileUtil = require('../../profileUtil');

const rules = profileUtil.insertAfter(require('../../TR').rules, 'sotd.pp', [
    require('../../../rules/sotd/deliverer-note'),
]);

exports.rules = rules;
