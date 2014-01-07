
// XXX
//  this doesn't work in the browser as written
//  may have to use browserify, or some other strategy
//  same for the rules

exports.name = "Dummy";
exports.rules = [
    require("../rules/dummy/h1")
,   require("../rules/dummy/h2-foo")
,   require("../rules/dummy/dahut")
];
