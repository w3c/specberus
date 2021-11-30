// base profile for all things TR
exports.name = 'TR';

const base = require('./base');

exports.rules = base.extendWithInserts({
    'headers.w3c-state': [
        require('../rules/headers/github-repo'),
        require('../rules/headers/copyright'),
    ],
    'sotd.supersedable': [
        require('../rules/sotd/stability'),
        require('../rules/sotd/publish'),
        require('../rules/sotd/draft-stability'),
        require('../rules/sotd/pp'),
        require('../rules/sotd/charter'),
        require('../rules/sotd/process-document'),
    ],
});
