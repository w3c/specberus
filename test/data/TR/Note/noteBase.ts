import * as TRBase from '../TRBase.js';

const { rules: baseRules, ...rest } = TRBase;

export default {
    ...rest,
    rules: {
        ...baseRules,
        sotd: {
            ...baseRules.sotd,
            pp: [
                ...baseRules.sotd.pp.filter(v => v.data !== 'jointPublication'),
                {
                    data: 'jointPublication',
                    config: {
                        patentPolicy: 'pp2020',
                    },
                    warnings: ['sotd.pp.joint-publication'],
                },
            ],
            'deliverer-note': [
                {
                    data: 'noDelivererNote',
                    errors: ['sotd.deliverer-note.not-found'],
                },
            ],
        },
    },
};
