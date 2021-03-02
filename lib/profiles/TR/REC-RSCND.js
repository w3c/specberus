exports.name = 'REC-RSCND';
exports.config = {
    status: 'REC',
    longStatus: 'Rescinded Recommendation',
    previousVersion: false,
    rescinds: true,
    styleSheet: 'W3C-RSCND',
    stabilityWarning: false,
};

const base = require('../base');

exports.rules = base.extendWithInserts({
    'headers.h2-status': [
        require('../../rules/headers/mailing-list'),
        require('../../rules/headers/copyright'),
    ],
    'sotd.supersedable': [
        require('../../rules/sotd/group-homepage'),
        require('../../rules/sotd/stability'),
        require('../../rules/sotd/obsl-rescind'),
        require('../../rules/sotd/status'),
        require('../../rules/sotd/process-document'),
    ],
});
