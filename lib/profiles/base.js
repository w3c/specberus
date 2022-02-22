// Base profile for all W3C published documents
import detailsSummary from '../rules/headers/details-summary';
import divHead from '../rules/headers/div-head';
import dl from '../rules/headers/dl';
import h1Title from '../rules/headers/h1-title';
import h2Toc from '../rules/headers/h2-toc';
import hr from '../rules/headers/hr';
import logo from '../rules/headers/logo';
import olToc from '../rules/headers/ol-toc';
import secno from '../rules/headers/secno';
import w3cState from '../rules/headers/w3c-state';
import dateFormat from '../rules/heuristic/date-format';
import compound from '../rules/links/compound';
/* import internal from '../rules/links/internal'; */
import linkchecker from '../rules/links/linkchecker';
import reliability from '../rules/links/reliability';
import supersedable from '../rules/sotd/supersedable';
import canonical from '../rules/structure/canonical';
import displayOnly from '../rules/structure/display-only';
import h2 from '../rules/structure/h2';
import structureName from '../rules/structure/name';
import neutral from '../rules/structure/neutral';
import sectionIds from '../rules/structure/section-ids';
import backToTop from '../rules/style/back-to-top';
import bodyTocSidebar from '../rules/style/body-toc-sidebar';
import meta from '../rules/style/meta';
import script from '../rules/style/script';
import sheet from '../rules/style/sheet';
import html from '../rules/validation/html';
import wcag from '../rules/validation/wcag';

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
