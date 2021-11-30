// base profile for all things TR
exports.name = 'TR';

const base = require('./base');

let rules = profileUtil.insertAfter(base, 'headers.w3c-state', [
    require('../rules/headers/github-repo'),
    require('../rules/headers/copyright'),
]);

rules = profileUtil.insertAfter(rules, 'sotd.supersedable', [
    require('../rules/sotd/stability'),
    require('../rules/sotd/publish'),
    require('../rules/sotd/pp'),
    require('../rules/sotd/charter'),
    require('../rules/sotd/process-document'),
]);

exports.rules = rules;
