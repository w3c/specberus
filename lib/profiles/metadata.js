/**
 * Pseudo-profile for metadata extraction.
 */

exports.name = 'Metadata';

exports.rules = [
    require('../rules/metadata/profile')
,   require('../rules/metadata/docDate')
,   require('../rules/metadata/deliverers')
,   require('../rules/metadata/rectrack')
];
