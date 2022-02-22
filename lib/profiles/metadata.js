/**
 * Pseudo-profile for metadata extraction.
 */
import * as charters from '../rules/metadata/charters';
import * as deliverers from '../rules/metadata/deliverers';
import * as dl from '../rules/metadata/dl';
import * as docDate from '../rules/metadata/docDate';
import * as editorIds from '../rules/metadata/editor-ids';
import * as editorNames from '../rules/metadata/editor-names';
import * as errata from '../rules/metadata/errata';
import * as informative from '../rules/metadata/informative';
import * as patentPolicy from '../rules/metadata/patent-policy';
import * as process from '../rules/metadata/process';
import * as profile from '../rules/metadata/profile';
import * as title from '../rules/metadata/title';

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
