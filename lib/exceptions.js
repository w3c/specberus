const records = require('./exceptions.json');

/**
 * @param data
 * @param ref
 * @returns {boolean} true if the data and ref are the same, or if the ref is undefined
 */
function compareValue(data, ref) {
    return ref === undefined || data === ref;
}

/**
 * @param shortname
 */
function findSet(shortname) {
    let count = 0;
    /**
     * @param name
     */
    function recursiveFindSet(name) {
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
        count += 1;
        if (typeof set === 'string') return recursiveFindSet(set);
        return set;
    }
    return recursiveFindSet(shortname);
}

const Exceptions = function () {};

Exceptions.prototype.has = function (shortname, rule, key, extra) {
    const set = findSet(shortname);
    if (set === undefined) return false;
    for (let i = set.length - 1; i >= 0; i -= 1) {
        for (let y = set[i].length - 1; y >= 0; y -= 1) {
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
