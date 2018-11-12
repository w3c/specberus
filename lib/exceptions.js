var records = require('./exceptions.json');

function compareValue(data, ref) {
    return (ref === undefined) || (data === ref);
}

function findSet(shortname) {
    var count = 0;
    function _findSet(name) {
        if (count > 10)
           return undefined;
        var set = [];
        for (var k in records) {
          var regex = new RegExp(k);
          if (records.hasOwnProperty(k) && regex.test(name)) {
            set.push(records[k]);
          }
        }
        count++;
        if ('string' === typeof set)
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
        for (var y = set[i].length - 1; y >= 0; y--) {
            var exception = set[i][y];
            if (rule === exception.rule &&
                (extra === undefined ||
                  (!exception.message && compareValue(extra.type, exception.type)) ||
                  (exception.message && compareValue(extra.message, exception.message)))) {
                return true;
            }
        }
    }
    return false;
};

exports.Exceptions = Exceptions;
