export const nockData = {
    versions: {
        page: 1,
        pages: 1,
        _embedded: {
            'version-history': [
                {
                    uri: 'https://www.w3.org/TR/2022/WD-hr-time-3-20220117/',
                },
                {
                    uri: 'https://www.w3.org/TR/2021/WD-hr-time-3-20211201/',
                },
                {
                    uri: 'https://www.w3.org/TR/2021/WD-hr-time-3-20211012/',
                },
            ],
        },
    },
    groupNames: {
        'i18n-core': 32113,
        forms: 32219,
        apa: 83907,
        ag: 35422,
    },
    chartersData: {
        32113: [
            {
                end: '2021-09-30',
                'doc-licenses': [
                    {
                        uri: 'https://www.w3.org/Consortium/Legal/copyright-software',
                        name: 'W3C Software and Document License',
                    },
                ],
                start: '2019-06-28',
                'patent-policy':
                    'https://www.w3.org/Consortium/Patent-Policy-20170801/',
            },
            {
                end: '2090-09-30',
                'doc-licenses': [
                    {
                        uri: 'https://www.w3.org/Consortium/Legal/copyright-software',
                        name: 'W3C Software and Document License',
                    },
                ],
                start: '2021-09-30',
                'patent-policy':
                    'https://www.w3.org/Consortium/Patent-Policy-20200915/',
            },
        ],
        32219: {
            end: '2012-03-31',
            'doc-licenses': [],
            start: '2010-05-17',
        },
        83907: {
            end: '2090-07-31',
            'doc-licenses': [
                {
                    uri: 'https://www.w3.org/Consortium/Legal/copyright-documents',
                    name: 'W3C Document License',
                },
                {
                    uri: 'https://www.w3.org/Consortium/Legal/copyright-software',
                    name: 'W3C Software and Document License',
                },
            ],
            start: '2021-08-11',
            'patent-policy':
                'https://www.w3.org/Consortium/Patent-Policy-20200915/',
        },
        35422: {
            end: '2090-10-31',
            'doc-licenses': [
                {
                    uri: 'https://www.w3.org/Consortium/Legal/copyright-documents',
                    name: 'W3C Document License',
                },
                {
                    uri: 'https://www.w3.org/Consortium/Legal/copyright-software',
                    name: 'W3C Software and Document License',
                },
            ],
            start: '2019-12-20',
            'patent-policy':
                'https://www.w3.org/Consortium/Patent-Policy-20170801/',
        },
    },
};
