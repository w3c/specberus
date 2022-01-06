// Base profile for all W3C published documents
exports.name = 'Base';

exports.rules = [
    require('../rules/headers/div-head'),
    require('../rules/headers/hr'),
    require('../rules/headers/logo'),
    require('../rules/headers/h1-title'),
    require('../rules/headers/details-summary'),
    require('../rules/headers/dl'),
    require('../rules/headers/w3c-state'),
    require('../rules/headers/h2-toc'),
    require('../rules/headers/ol-toc'),
    require('../rules/headers/secno'),

    require('../rules/style/sheet'),
    require('../rules/style/meta'),
    require('../rules/style/body-toc-sidebar'),
    require('../rules/style/script'),
    require('../rules/style/back-to-top'),

    require('../rules/sotd/supersedable'),

    require('../rules/structure/name'),
    require('../rules/structure/h2'),
    require('../rules/structure/canonical'),
    require('../rules/structure/section-ids'),
    require('../rules/structure/display-only'),
    require('../rules/structure/neutral'),

    // ,   require("../rules/links/internal")
    require('../rules/links/linkchecker'),
    require('../rules/links/compound'),
    require('../rules/links/reliability'),

    require('../rules/validation/html'),
    require('../rules/validation/wcag'),
    require('../rules/heuristic/date-format'),
];
