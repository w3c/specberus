exports.config = {
    track: 'Note',
};

// customize rules
const base = require('../../TR');
const profileUtil = require('../../profileUtil');

const rules = profileUtil.insertAfter(base.rules, 'sotd.supersedable', [
    require('../../../rules/sotd/deliverer-note'),
    require('../../../rules/sotd/pp-not-apply'),
]);

exports.rules = rules;
