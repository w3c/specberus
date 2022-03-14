import { rules as baseRules } from '../specBase.js';

export const rules = {
    headers: {
        ...baseRules.headers,
    },
    style: {
        ...baseRules.style,
    },
    heuristic: {
        ...baseRules.heuristic,
    },
    links: {
        ...baseRules.links,
    },
    structure: {
        ...baseRules.structure,
    },
    sotd: {},
    validation: {
        ...baseRules.validation,
    },
};
