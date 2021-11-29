exports.name = 'REC-RSCND';
exports.config = {
    status: 'REC',
    longStatus: 'Rescinded Recommendation',
    rescinds: true,
    styleSheet: 'W3C-RSCND',
};

const profileUtil = require('../../profileUtil');

let rules = profileUtil.insertAfter(
    require('./REC').rules,
    'sotd.process-document',
    [require('../../../rules/echidna/todays-date')]
);

// // TODO: check carefully: previously extend from base.
// profileUtil.extendWithInserts({
//     'headers.w3c-state': [
//         require('../../../rules/headers/github-repo'),
//         require('../../../rules/headers/copyright'),
//     ],
//     'sotd.supersedable': [
//         require('../../../rules/sotd/obsl-rescind'),
//         require('../../../rules/sotd/process-document'),
//     ],
// });

rules = profileUtil.removeRules(rules, ['sotd.draft-stability']);

exports.rules = rules;
