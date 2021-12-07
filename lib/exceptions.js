const records = require('./exceptions.json');

function compareValue(data, ref) {
    return ref === undefined || data === ref;
}

function findSet(shortname) {
    let count = 0;
    // eslint-disable-next-line no-underscore-dangle
    function _findSet(name) {
        if (count > 10) return undefined;
        const set = [];
        for (const k in records) {
            const regex = new RegExp(k);
            if (
                Object.prototype.hasOwnProperty.call(records, k) &&
                regex.test(name)
            ) {
                set.push(records[k]);
            }
        }
        count++;
        if (typeof set === 'string') return _findSet(set);
        return set;
    }
    return _findSet(shortname);
}

const Exceptions = function () {};

Exceptions.prototype.has = function (shortname, rule, key, extra) {
    const set = findSet(shortname);
    if (set === undefined) return false;
    for (let i = set.length - 1; i >= 0; i--) {
        for (let y = set[i].length - 1; y >= 0; y--) {
            const exception = set[i][y];
            if (
                rule === exception.rule &&
                (extra === undefined ||
                    (!exception.message &&
                        compareValue(extra.type, exception.type)) ||
                    (exception.message &&
                        compareValue(extra.message, exception.message)))
            ) {
                return true;
            }
        }
    }
    return false;
};

exports.Exceptions = Exceptions;
