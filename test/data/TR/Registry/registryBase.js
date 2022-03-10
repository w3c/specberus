import * as TRBase from '../TRBase';

const { rules, ...rest } = TRBase;

export default {
    ...rest,
    rules: {
        ...rules,
        sotd: {
            ...rules.sotd,
            pp: [
                ...rules.sotd.pp.filter(
                    v =>
                        !['noPP2017', 'jointPublication'].find(
                            x => x === v.data
                        )
                ),
                {
                    data: 'noPP2017',
                    config: {
                        patentPolicy: 'pp2004',
                    },
                    errors: ['sotd.pp.no-pp2017'],
                },
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
