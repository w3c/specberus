/**
 * Pseudo-profile for metadata extraction.
 */

exports.name = 'Metadata';

exports.rules = [
    require('../rules/metadata/profile')
,   require('../rules/metadata/title')
,   require('../rules/metadata/docDate')
,   require('../rules/metadata/dl')
,   require('../rules/metadata/deliverers')
,   require('../rules/metadata/editor-ids')
,   require('../rules/metadata/rectrack')
,   require('../rules/metadata/informative')
,   require('../rules/metadata/process')
];
