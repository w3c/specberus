const goodData = {
    config: {
        profile: 'First Public Working Draft',
        status: 'WD',
    },
    dl: {
        shortName: 'hr-foo-time-2',
        seriesShortName: 'hr-foo-time',
    },
};



const badData = goodData;
badData.config.titleSuffix = 'Pubrules';
// data.config.profile = 'Pubrules';

// exports.data = Object.assign({}, data, {
//     config: {
//         profile2: ""
//     }
// })

exports.data = { goodData, badData };
