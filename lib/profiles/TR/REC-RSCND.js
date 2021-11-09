exports.name = 'REC-RSCND';
exports.config = {
    status: 'REC',
    longStatus: 'Rescinded Recommendation',
    rescinds: true,
    styleSheet: 'W3C-RSCND',
};

const base = require('../base');

let rules = base.extendWithInserts({
    'headers.w3c-state': [
        require('../../rules/headers/github-repo'),
        require('../../rules/headers/copyright'),
    ],
    'sotd.supersedable': [
        require('../../rules/sotd/obsl-rescind'),
        require('../../rules/sotd/process-document'),
    ],
});
// TODO: extend from base, is it right?
rules = base.removeRules(rules, ['sotd.draft-stability']);

exports.rules = rules;
