// Base profile for all W3C published documents
import * as detailsSummary from '../rules/headers/details-summary';
import * as divHead from '../rules/headers/div-head';
import * as dl from '../rules/headers/dl';
import * as h1Title from '../rules/headers/h1-title';
import * as h2Toc from '../rules/headers/h2-toc';
import * as hr from '../rules/headers/hr';
import * as logo from '../rules/headers/logo';
import * as olToc from '../rules/headers/ol-toc';
import * as secno from '../rules/headers/secno';
import * as w3cState from '../rules/headers/w3c-state';
import * as dateFormat from '../rules/heuristic/date-format';
import * as compound from '../rules/links/compound';
/* import * as  internal from '../rules/links/internal'; */
import * as linkchecker from '../rules/links/linkchecker';
import * as reliability from '../rules/links/reliability';
import * as supersedable from '../rules/sotd/supersedable';
import * as canonical from '../rules/structure/canonical';
import * as displayOnly from '../rules/structure/display-only';
import * as h2 from '../rules/structure/h2';
import * as structureName from '../rules/structure/name';
import * as neutral from '../rules/structure/neutral';
import * as sectionIds from '../rules/structure/section-ids';
import * as backToTop from '../rules/style/back-to-top';
import * as bodyTocSidebar from '../rules/style/body-toc-sidebar';
import * as meta from '../rules/style/meta';
import * as script from '../rules/style/script';
import * as sheet from '../rules/style/sheet';
import * as html from '../rules/validation/html';
import * as wcag from '../rules/validation/wcag';

export const name = 'Base';
export const rules = [
    divHead,
    hr,
    logo,
    h1Title,
    detailsSummary,
    dl,
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
