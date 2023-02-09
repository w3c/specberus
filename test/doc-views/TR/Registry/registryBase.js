import * as TRBase from '../TRBase.js';

const { buildCommonViewData: _buildCommonViewData, data, ...rest } = TRBase;
const buildCommonViewData = base => {
    const common = _buildCommonViewData(base);
    return {
        ...common,
        charter: {
            ...common.charter,
            noCharter: {
                ...base,
                config: {
                    ...base.config,
                    underPP: true,
                },
                header: {
                    ...base.header,
                    defaultDate: '04 November 1900',
                },
            },
        },
        pp: {
            ...common.pp,
            noPP2020: {
                ...base,
                sotd: {
                    ...base.sotd,
                    ppLink1: 'https://www.w3.org/Consortium/fake-one',
                },
            },
        },
        usage: {
            noUsage: {
                ...base,
            },
        },
    };
};

export default {
    ...rest,
    buildCommonViewData,
    data: {
        ...data,
        config: {
            underPP: false,
            isRyTrack: true,
        },
    },
};
