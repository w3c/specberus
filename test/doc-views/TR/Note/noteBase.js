import * as TRBase from '../TRBase.js';

const { buildCommonViewData: _buildCommonViewData, data, ...rest } = TRBase;

const buildCommonViewData = base => {
    const common = _buildCommonViewData(base);
    return {
        ...common,
        'deliverer-note': {
            noDelivererNote: {
                ...base,
                sotd: {
                    ...base.sotd,
                    deliverer: '',
                },
            },
        },
        stability: {
            ...common.stability,
            noStability: {
                ...base,
                sotd: {
                    ...base.sotd,
                    noteNotEndorsedText:
                        'Group Notes are not endorsed by FAKE nor its Members',
                },
            },
            supportAnotherSW: {
                ...base,
                sotd: {
                    ...base.sotd,
                    noteNotEndorsedText:
                        'This Group Note is endorsed by the XXX Group, but is not endorsed by W3C itself nor its Members',
                },
            },
        },
        charter: {
            ...common.charter,
            noGroup: {
                ...base,
                sotd: {
                    ...base.sotd,
                    deliverer: '',
                },
            },
            noCharter: {
                ...base,
                config: {
                    ...base.config,
                    isEchidna: false,
                },
                header: {
                    ...base.header,
                    defaultDate: '04 November 1900',
                },
            },
        },
        pp: {
            ...common.pp,
            noPPFromCharter: {
                ...base,
                sotd: {
                    ...base.sotd,
                    deliverer: '',
                    ppLink1: 'https://www.w3.org/Consortium/fake-pp',
                },
            },
            noPP2020: {
                ...base,
                sotd: {
                    ...base.sotd,
                    ppLink1: 'https://www.w3.org/Consortium/fake-one',
                },
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
            ...data.config,
            underPP: false,
            isNoteTrack: true,
        },
        sotd: {
            ...data.sotd,
            deliverer: 'data-deliverer="32113"',
        },
    },
};
