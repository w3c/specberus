/**
 * Pseudo-profile for metadata extraction.
 */
import * as charters from '../rules/metadata/charters.js';
import * as deliverers from '../rules/metadata/deliverers.js';
import * as dl from '../rules/metadata/dl.js';
import * as docDate from '../rules/metadata/docDate.js';
import * as editorIds from '../rules/metadata/editor-ids.js';
import * as editorNames from '../rules/metadata/editor-names.js';
import * as errata from '../rules/metadata/errata.js';
import * as informative from '../rules/metadata/informative.js';
import * as patentPolicy from '../rules/metadata/patent-policy.js';
import * as process from '../rules/metadata/process.js';
import * as profile from '../rules/metadata/profile.js';
import * as title from '../rules/metadata/title.js';

export const name = 'Metadata';

export const rules = [
    profile,
    title,
    docDate,
    dl,
    deliverers,
    patentPolicy,
    charters,
    editorIds,
    editorNames,
    informative,
    process,
    errata,
];
