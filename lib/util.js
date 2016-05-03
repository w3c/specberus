/**
 * Miscellaneous utilities.
 */

const profiles = {};

// @TODO: retrieve this list of filenames from the filesystem, instead of hard-coding them here.
("FPWD FPLC FPCR WD LC CR PR PER REC RSCND " +
"CG-NOTE FPIG-NOTE IG-NOTE FPWG-NOTE WG-NOTE " +
"WD-Echidna WG-NOTE-Echidna " +
"MEM-SUBM TEAM-SUBM").split(" ")
    .forEach(function (p) {
        profiles[p] = require('./profiles/' + p);
    })
;

exports.profiles = profiles;
