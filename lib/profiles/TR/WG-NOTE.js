exports.name = 'WG-NOTE';
exports.config = {
    status: 'NOTE',
    longStatus: 'Working Group Note',
    previousVersion: true,
    styleSheet: 'W3C-WG-NOTE',
    stabilityWarning: true,
    noteStatus: true,
};

const base = require('../base');

exports.rules = base.extendWithInserts({
    'headers.h2-status': [
        require('../../rules/headers/github-repo'),
        require('../../rules/headers/copyright'),
    ],
    'sotd.supersedable': [
        require('../../rules/sotd/diff'),
        require('../../rules/sotd/deliverer-note'),
        require('../../rules/sotd/group-homepage'),
        require('../../rules/sotd/stability'),
        require('../../rules/sotd/status'),
        require('../../rules/sotd/pp'),
        require('../../rules/sotd/process-document'),
    ],
});
