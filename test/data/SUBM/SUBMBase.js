const { rules } = require('../specBase');

exports.rules = {
    headers: {
        ...rules.headers,
    },
    style: {
        ...rules.style,
    },
    heuristic: {
        ...rules.heuristic,
    },
    links: {
        ...rules.links,
    },
    structure: {
        ...rules.structure,
    },
    sotd: {},
    validation: {
        ...rules.validation,
    },
};
