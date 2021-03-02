// Base profile for all Submissions

exports.name = 'Submission';

const base = require('./base');

exports.rules = base.extendWithInserts({
    'headers.logo': require('../rules/headers/subm-logo'),
});
