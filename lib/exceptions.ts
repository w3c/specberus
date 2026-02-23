import exceptions from './exceptions.json' with { type: 'json' };

interface Exception {
    rule: string;
    message?: string;
    type?: string;
}

function findSet(shortname: string) {
    let count = 0;
    function recursiveFindSet(name: string) {
        if (count > 10) return undefined;
        const set: Exception[][] = [];
        for (const k in exceptions) {
            const regex = new RegExp(k);
            if (Object.hasOwn(exceptions, k) && regex.test(name)) {
                set.push(exceptions[k as keyof typeof exceptions]);
            }
        }
        count += 1;
        if (typeof set === 'string') return recursiveFindSet(set);
        return set;
    }
    return recursiveFindSet(shortname);
}

export function hasExceptions(
    shortname: string,
    rule: string,
    extra?: Record<string, string>
) {
    const set = findSet(shortname);
    if (set === undefined) return false;
    for (let i = set.length - 1; i >= 0; i -= 1) {
        for (let y = set[i].length - 1; y >= 0; y -= 1) {
            const exception = set[i][y];
            if (
                rule === exception.rule &&
                (extra === undefined ||
                    (!exception.message &&
                        (exception.type === undefined ||
                            extra.type === exception.type)) ||
                    (exception.message &&
                        new RegExp(exception.message).test(extra.message)))
            ) {
                return true;
            }
        }
    }
    return false;
}
