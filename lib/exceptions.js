var records = require('./exceptions.json');

function compareValue(data, ref) {
    return (ref === undefined) || (data === ref);
}

function findSet(shortname) {
    var count = 0;
    function _findSet(name) {
        if (count > 10)
           return undefined;
        var set = records[name];
        count++;
        if (typeof set === "String")
            return _findSet(set);
        return set;
    }
    return _findSet(shortname);
}

var Exceptions = function () {
};

Exceptions.prototype.has = function (shortname, rule, key, extra) {
    var set = findSet(shortname);
    if (set === undefined) return false;
    for (var i = set.length - 1; i >= 0; i--) {
        var exception = set[i];

        return (rule === exception.rule
                && compareValue(extra.type, exception.type));
    }
    return false;
};

exports.Exceptions = Exceptions;
