// Base profile for all Submissions

exports.name = 'Submission';

const profileUtil = require('./profileUtil');

exports.rules = profileUtil.insertAfter(
    require('./base').rules,
    'headers.logo',
    require('../rules/headers/subm-logo')
);
