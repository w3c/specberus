'use strict';

var records = require('./exceptions.json');

function compareValue(data, ref) {
    return (ref === undefined) || (data === ref);
}

// from all of the arrays in the set of rules, find the ones applicable
// according to a shortname
function getApplicableSet(shortname) {
    var set = [];
    for (var key in records) {
      if (shortname.startsWith(key)) {
        set = set.concat(records[key]);
      }
    }
    return set;
}

var Exceptions = function () {
};

// returns true if one of the rules matches the shortname, rule, and extra.type
Exceptions.prototype.has = function (shortname, rule, key, extra) {
    var set = getApplicableSet(shortname);
    var find = set.find(function (exception) {
        return (rule === exception.rule
                && (extra === undefined
                    || compareValue(extra.type, exception.type)));
    });
    return (find !== undefined);
};

exports.Exceptions = Exceptions;
