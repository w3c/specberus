// Base profile for all W3C published documents
import * as detailsSummary from '../rules/headers/details-summary.js';
import * as divHead from '../rules/headers/div-head.js';
import * as dl from '../rules/headers/dl.js';
import * as shortname from '../rules/headers/shortname.js';
import * as h1Title from '../rules/headers/h1-title.js';
import * as h2Toc from '../rules/headers/h2-toc.js';
import * as hr from '../rules/headers/hr.js';
import * as logo from '../rules/headers/logo.js';
import * as olToc from '../rules/headers/ol-toc.js';
import * as secno from '../rules/headers/secno.js';
import * as w3cState from '../rules/headers/w3c-state.js';
import * as dateFormat from '../rules/heuristic/date-format.js';
import * as compound from '../rules/links/compound.js';
/* import * as  internal from '../rules/links/internal.js'; */
import * as linkchecker from '../rules/links/linkchecker.js';
import * as reliability from '../rules/links/reliability.js';
import * as supersedable from '../rules/sotd/supersedable.js';
import * as canonical from '../rules/structure/canonical.js';
import * as displayOnly from '../rules/structure/display-only.js';
import * as h2 from '../rules/structure/h2.js';
import * as structureName from '../rules/structure/name.js';
import * as neutral from '../rules/structure/neutral.js';
import * as sectionIds from '../rules/structure/section-ids.js';
import * as backToTop from '../rules/style/back-to-top.js';
import * as bodyTocSidebar from '../rules/style/body-toc-sidebar.js';
import * as meta from '../rules/style/meta.js';
import * as script from '../rules/style/script.js';
import * as sheet from '../rules/style/sheet.js';
import * as html from '../rules/validation/html.js';
import * as wcag from '../rules/validation/wcag.js';

export const name = 'Base';
export const rules = [
    divHead,
    hr,
    logo,
    h1Title,
    detailsSummary,
    dl,
    shortname,
    w3cState,
    h2Toc,
    olToc,
    secno,
    sheet,
    meta,
    bodyTocSidebar,
    script,
    backToTop,
    supersedable,
    structureName,
    h2,
    canonical,
    sectionIds,
    displayOnly,
    neutral,
    linkchecker,
    compound,
    reliability,
    html,
    wcag,
    dateFormat,
];
