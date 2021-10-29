/**
 * Pseudo-profile for metadata extraction.
 */

exports.name = 'Metadata';

exports.rules = [
    require('../rules/metadata/profile'),
    require('../rules/metadata/title'),
    require('../rules/metadata/docDate'),
    require('../rules/metadata/dl'),
    require('../rules/metadata/deliverers'),
    require('../rules/metadata/patent-policy'),
    require('../rules/metadata/charters'),
    require('../rules/metadata/editor-ids'),
    require('../rules/metadata/editor-names'),
    require('../rules/metadata/informative'),
    require('../rules/metadata/process'),
    require('../rules/metadata/errata'),
];
