import * as TRBase from '../TRBase.js';

const { rules, ...rest } = TRBase;

export default {
    ...rest,
    rules: {
        ...rules,
        sotd: {
            ...rules.sotd,
            pp: [
                ...rules.sotd.pp.filter(v => v.data !== 'jointPublication'),
                {
                    data: 'jointPublication',
                    config: {
                        patentPolicy: 'pp2020',
                    },
                    warnings: ['sotd.pp.joint-publication'],
                },
            ],
            usage: [
                {
                    data: 'noUsage',
                    errors: ['sotd.usage.not-found'],
                },
            ],
        },
    },
};
