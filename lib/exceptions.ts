import { exceptions, type Exception } from './exceptions-map.js';

function findSet(shortname: string) {
    const set: Exception[][] = [];
    for (const [regexp, applicableExceptions] of exceptions) {
        if (regexp.test(shortname)) set.push(applicableExceptions);
    }
    return set;
}

export function hasExceptions(
    shortname: string,
    rule: string,
    extra?: Record<string, string>
) {
    const set = findSet(shortname);
    if (!set) return false;
    for (let i = set.length - 1; i >= 0; i--) {
        for (let y = set[i].length - 1; y >= 0; y--) {
            const exception = set[i][y];
            if (
                rule === exception.rule &&
                (!extra ||
                    (!exception.message &&
                        (exception.type === undefined ||
                            extra.type === exception.type)) ||
                    (exception.message &&
                        exception.message.test(extra.message)))
            ) {
                return true;
            }
        }
    }
    return false;
}
