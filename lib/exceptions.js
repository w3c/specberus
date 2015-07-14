/*jshint es5:true */

var records = require('./exceptions.json');

function compareValue(data, ref) {
    return (ref === undefined) || (data === ref);
}

function compareText(dataMsg, refMsg) {
    return (refMsg === undefined)
       || ((dataMsg !== undefined)
           && ((dataMsg.substring(refMsg) !== -1)
               || (dataMsg.search(refMsg) !== -1)));
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

Exceptions.prototype.has = function (shortname, data) {
    var set = findSet(shortname);
    if (set === undefined) return false;
    for (var i = set.length - 1; i >= 0; i--) {
        var exception = set[i];
        var matches   = (compareValue(data.key, exception.key)
                         && compareValue(data.name, exception.name)
                         && compareText(data.message, exception.message));
        if (matches && exception.extra !== undefined) {
            matches = compareValue(data.extra.line, exception.extra.line)
              && compareValue(data.extra.column, exception.extra.column)
              && compareText(data.extra.context, exception.extra.context)
              && compareText(data.extra.type, exception.extra.type)
              && compareText(data.extra.message, exception.extra.message);
        }
        if(matches) return true;
    }
    return false;
};

exports.Exceptions = Exceptions;

