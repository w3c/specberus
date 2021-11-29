exports.name = 'DISC';
exports.config = {
    status: 'DISC',
    longStatus: 'Discontinued Draft',
    styleSheet: 'W3C-DISC',
    track: 'Recommendation',
};

const profileUtil = require('../../profileUtil');
const rules = profileUtil.removeRules(
    require('../../TR').rules,
    'sotd.draft-stability'
);

exports.rules = rules;
