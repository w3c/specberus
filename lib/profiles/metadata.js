/**
 * Pseudo-profile for metadata extraction.
 */

exports.name = 'Metadata';

exports.rules = [
    require('../rules/metadata/profile')
,   require('../rules/metadata/docDate')
,   require('../rules/metadata/deliverers')
,   require('../rules/metadata/editor-ids')
,   require('../rules/metadata/rectrack')
,   require('../rules/metadata/process')
];
