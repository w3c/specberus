export const nockData = {
    delivererMap: {
        'css-color-3': 32061,
        'hr-time': 45211,
        'hr-time-2': 45211,
        'hr-time-3': 45211,
    },
    //  for mocked specifications/*/versions/* URLs; content doesn't seem important to tests
    versionUris: [
        'https://www.w3.org/TR/2022/WD-hr-time-3-20220117/',
        'https://www.w3.org/TR/2021/WD-hr-time-3-20211201/',
        'https://www.w3.org/TR/2021/WD-hr-time-3-20211012/',
    ],
    // groupData collates data for multiple related requests for each defined group
    groupData: {
        32061: {
            group: {
                id: 32061,
                name: 'Cascading Style Sheets (CSS) Working Group',
                is_closed: false,
                description:
                    'The mission of the group is to develop and maintain CSS.',
                shortname: 'css',
                discr: 'w3cgroup',
                type: 'working group',
                'start-date': '1997-02-28',
                'end-date': '2027-03-17',
            },
            charters: [
                {
                    end: '1999-02-28',
                    'doc-licenses': [],
                    start: '1997-02-28',
                },
                {
                    end: '2000-07-01',
                    'doc-licenses': [],
                    start: '1999-03-22',
                },
                {
                    end: '2002-07-31',
                    'doc-licenses': [],
                    start: '2001-07-31',
                },
                {
                    end: '2005-03-31',
                    'doc-licenses': [],
                    start: '2002-10-15',
                },
                {
                    end: '2008-12-31',
                    'doc-licenses': [],
                    start: '2006-06-28',
                },
                {
                    end: '2011-08-30',
                    'doc-licenses': [],
                    start: '2008-12-03',
                },
                {
                    end: '2013-09-30',
                    'doc-licenses': [],
                    start: '2011-12-14',
                },
                {
                    end: '2016-09-30',
                    'doc-licenses': [],
                    start: '2014-07-01',
                },
                {
                    end: '2019-09-30',
                    'doc-licenses': [],
                    start: '2016-09-16',
                },
                {
                    end: '2020-12-14',
                    'doc-licenses': [],
                    start: '2019-10-03',
                },
                {
                    end: '2022-12-31',
                    'doc-licenses': [
                        {
                            uri: 'https://www.w3.org/copyright/software-license/',
                            name: 'W3C Software and Document License',
                        },
                    ],
                    start: '2020-12-15',
                },
                {
                    end: '2025-03-12',
                    'doc-licenses': [
                        {
                            uri: 'https://www.w3.org/copyright/software-license/',
                            name: 'W3C Software and Document License',
                        },
                    ],
                    start: '2023-01-12',
                },
                {
                    end: '2027-03-17',
                    'doc-licenses': [
                        {
                            uri: 'https://www.w3.org/copyright/software-license/',
                            name: 'W3C Software and Document License',
                        },
                    ],
                    start: '2025-03-17',
                },
            ],
        },
        32113: {
            group: {
                id: 32113,
                name: 'Internationalization Working Group',
                is_closed: false,
                description:
                    'The mission of the Internationalization Working Group is to enable universal access to the World Wide Web by proposing and coordinating the adoption by the W3C of techniques, conventions, technologies, and designs that enable and enhance the use of W3C technology and the Web worldwide, with and between various different languages, scripts, regions, and cultures.',
                shortname: 'i18n-core',
                discr: 'w3cgroup',
                type: 'working group',
                'start-date': '1998-02-12',
                'end-date': '2027-10-16',
            },
            charters: [
                {
                    end: '2021-09-30',
                    'doc-licenses': [
                        {
                            uri: 'https://www.w3.org/copyright/software-license/',
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
                            uri: 'https://www.w3.org/copyright/software-license/',
                            name: 'W3C Software and Document License',
                        },
                    ],
                    start: '2021-09-30',
                    'patent-policy':
                        'https://www.w3.org/policies/patent-policy/20200915/',
                },
            ],
            userIds: [
                144371, 44237, 135303, 3343, 37503, 34209, 2629, 113700, 35400,
                3439, 45369, 109416, 60314, 37983, 40266, 44368, 160574, 41643,
                171631, 123957, 40614, 33573, 43241, 170171, 169575, 37415,
                171165, 110639, 114708, 170499, 12482, 63283, 38001, 168549,
                150008, 95475, 3634, 96832,
            ],
        },
        32219: {
            group: {
                id: 32219,
                name: 'Forms Working Group',
                is_closed: true,
                description:
                    'The mission of the Forms Working Group is to develop specifications to cover forms on the Web, producing a system that scales from low-end devices through to the enterprise level.',
                shortname: 'forms',
                closed_date: '2015-04-08',
                discr: 'w3cgroup',
                type: 'working group',
                'start-date': '2000-06-23',
                'end-date': '2012-03-31',
            },
            charters: [
                {
                    end: '2012-03-31',
                    'doc-licenses': [],
                    start: '2010-05-17',
                },
            ],
            userIds: [],
        },
        34314: {
            group: {
                id: 34314,
                name: 'Timed Text Working Group',
                is_closed: false,
                description:
                    'The mission of the Timed Text Working Group is to develop W3C Recommendations for media online captioning by developing and maintaining new versions of the Timed Text Markup Language (TTML) and WebVTT (Web Video Text Tracks) based on implementation experience and interoperability feedback, and the creation of semantic mappings between those languages.',
                shortname: 'timed-text',
                discr: 'w3cgroup',
                type: 'working group',
                'start-date': '2008-08-15',
                'end-date': '2027-06-03',
            },
            charters: [
                {
                    end: '2011-03-31',
                    'doc-licenses': [],
                    start: '2008-08-15',
                    'initial-end': '2010-06-30',
                    uri: 'http://www.w3.org/2008/01/timed-text-wg',
                    'cfp-uri':
                        'https://lists.w3.org/Archives/Member/w3c-ac-members/2008JulSep/0031.html',
                    extensions: [
                        {
                            end: '2011-03-31',
                            announcement_uri:
                                'https://lists.w3.org/Archives/Member/w3c-ac-members/2011JanMar/0026.html',
                        },
                    ],
                    'required-new-commitments': true,
                    'patent-policy':
                        'https://www.w3.org/Consortium/Patent-Policy-20040205/',
                },
                {
                    end: '2014-01-31',
                    'doc-licenses': [],
                    start: '2012-07-25',
                    'initial-end': '2014-01-31',
                    uri: 'http://www.w3.org/2012/07/ttml-charter.html',
                    'cfp-uri':
                        'https://lists.w3.org/Archives/Member/w3c-ac-members/2012JulSep/0012.html',
                    extensions: [],
                    'required-new-commitments': true,
                    'patent-policy':
                        'https://www.w3.org/Consortium/Patent-Policy-20040205/',
                },
                {
                    end: '2016-05-31',
                    'doc-licenses': [],
                    start: '2014-03-27',
                    'initial-end': '2016-03-30',
                    uri: 'http://www.w3.org/2014/03/timed-text-charter.html',
                    'cfp-uri':
                        'https://lists.w3.org/Archives/Member/w3c-ac-members/2014JanMar/0069.html',
                    extensions: [
                        {
                            end: '2016-05-31',
                            announcement_uri:
                                'https://lists.w3.org/Archives/Member/w3c-ac-members/2016AprJun/0008.html',
                        },
                    ],
                    'required-new-commitments': true,
                    'patent-policy':
                        'https://www.w3.org/Consortium/Patent-Policy-20040205/',
                },
                {
                    end: '2018-05-31',
                    'doc-licenses': [],
                    start: '2016-05-19',
                    'initial-end': '2018-03-31',
                    uri: 'https://www.w3.org/2016/05/timed-text-charter.html',
                    'cfp-uri':
                        'https://lists.w3.org/Archives/Member/w3c-ac-members/2016AprJun/0036.html',
                    extensions: [
                        {
                            end: '2018-05-31',
                            announcement_uri:
                                'https://lists.w3.org/Archives/Member/w3c-ac-members/2018AprJun/0004.html',
                        },
                    ],
                    'required-new-commitments': false,
                    'patent-policy':
                        'https://www.w3.org/Consortium/Patent-Policy-20040205/',
                },
                {
                    end: '2020-05-31',
                    'doc-licenses': [],
                    start: '2018-05-30',
                    'initial-end': '2020-05-31',
                    uri: 'https://www.w3.org/2018/05/timed-text-charter.html',
                    'cfp-uri':
                        'https://lists.w3.org/Archives/Member/w3c-ac-members/2018AprJun/0042.html',
                    extensions: [],
                    'required-new-commitments': false,
                    'patent-policy':
                        'https://www.w3.org/Consortium/Patent-Policy-20170801/',
                },
                {
                    end: '2020-12-14',
                    'doc-licenses': [],
                    start: '2019-11-28',
                    'initial-end': '2020-12-14',
                    uri: 'https://www.w3.org/2019/11/timed-text-wg-charter.html',
                    'cfp-uri':
                        'https://lists.w3.org/Archives/Member/w3c-ac-members/2019OctDec/0046.html',
                    extensions: [],
                    'required-new-commitments': true,
                    'patent-policy':
                        'https://www.w3.org/Consortium/Patent-Policy-20170801/',
                },
                {
                    end: '2023-04-08',
                    'doc-licenses': [
                        {
                            uri: 'https://www.w3.org/copyright/document-license/',
                            name: 'W3C Document License',
                        },
                        {
                            uri: 'https://www.w3.org/copyright/software-license/',
                            name: 'W3C Software and Document License',
                        },
                    ],
                    start: '2020-12-15',
                    'initial-end': '2021-12-31',
                    uri: 'https://www.w3.org/2020/12/timed-text-wg-charter.html',
                    'cfp-uri':
                        'https://lists.w3.org/Archives/Member/w3c-ac-members/2020OctDec/0039.html',
                    extensions: [
                        {
                            end: '2023-04-08',
                            announcement_uri:
                                'https://lists.w3.org/Archives/Member/w3c-ac-members/2023JanMar/0051.html',
                        },
                        {
                            end: '2023-03-31',
                            announcement_uri:
                                'https://lists.w3.org/Archives/Member/w3c-ac-members/2023JanMar/0020.html',
                        },
                        {
                            end: '2022-12-31',
                            announcement_uri:
                                'https://lists.w3.org/Archives/Member/w3c-ac-members/2022JulSep/0025.html',
                        },
                        {
                            end: '2022-06-30',
                            announcement_uri:
                                'https://lists.w3.org/Archives/Member/w3c-ac-members/2022AprJun/0022.html',
                        },
                        {
                            end: '2022-03-31',
                            announcement_uri:
                                'https://lists.w3.org/Archives/Member/w3c-ac-members/2021OctDec/0051.html',
                        },
                    ],
                    'required-new-commitments': true,
                    'patent-policy':
                        'https://www.w3.org/policies/patent-policy/20200915/',
                },
                {
                    end: '2025-06-02',
                    'doc-licenses': [
                        {
                            uri: 'https://www.w3.org/copyright/document-license/',
                            name: 'W3C Document License',
                        },
                        {
                            uri: 'https://www.w3.org/copyright/software-license/',
                            name: 'W3C Software and Document License',
                        },
                    ],
                    start: '2023-04-08',
                    'initial-end': '2025-04-07',
                    uri: 'https://www.w3.org/2023/04/timed-text-wg-charter.html',
                    'cfp-uri':
                        'https://lists.w3.org/Archives/Member/w3c-ac-members/2023AprJun/0007.html',
                    extensions: [
                        {
                            end: '2025-06-02',
                            announcement_uri:
                                'https://lists.w3.org/Archives/Member/w3c-ac-members/2025AprJun/0018.html',
                        },
                    ],
                    'required-new-commitments': false,
                    'patent-policy':
                        'https://www.w3.org/policies/patent-policy/20200915/',
                },
                {
                    end: '2027-06-03',
                    'doc-licenses': [
                        {
                            uri: 'https://www.w3.org/copyright/document-license/',
                            name: 'W3C Document License',
                        },
                        {
                            uri: 'https://www.w3.org/copyright/software-license/',
                            name: 'W3C Software and Document License',
                        },
                    ],
                    start: '2025-06-03',
                    'initial-end': '2027-06-03',
                    uri: 'https://www.w3.org/2025/06/timed-text-wg-charter.html',
                    'cfp-uri':
                        'https://lists.w3.org/Archives/Member/w3c-ac-members/2025AprJun/0050.html',
                    extensions: [],
                    'required-new-commitments': false,
                    'patent-policy':
                        'https://www.w3.org/policies/patent-policy/20200915/',
                },
            ],
            userIds: [
                34651, 34030, 36576, 39125, 41073, 36324, 42459, 34379, 158479,
                79221, 50097, 102836, 57073, 106787, 64750, 67414, 40614, 32040,
                116769, 69907, 110639, 106788, 85438, 49932, 96832,
            ],
        },
        45211: {
            group: {
                id: 45211,
                name: 'Web Performance Working Group',
                is_closed: false,
                description:
                    'The mission of the Web Performance Working Group is to provide methods to measure aspects of application performance of user agent features and APIs.',
                shortname: 'webperf',
                discr: 'w3cgroup',
                type: 'working group',
                'start-date': '2010-08-18',
                'end-date': '2026-06-01',
            },
            charters: [
                {
                    end: '2011-06-30',
                    'doc-licenses': [],
                    start: '2010-08-18',
                },
                {
                    end: '2012-10-31',
                    'doc-licenses': [],
                    start: '2011-04-25',
                },
                {
                    end: '2015-05-31',
                    'doc-licenses': [],
                    start: '2013-06-06',
                },
                {
                    end: '2016-07-31',
                    'doc-licenses': [],
                    start: '2015-06-25',
                },
                {
                    end: '2018-09-14',
                    'doc-licenses': [],
                    start: '2016-07-22',
                },
                {
                    end: '2021-02-10',
                    'doc-licenses': [],
                    start: '2018-09-20',
                },
                {
                    end: '2023-11-09',
                    'doc-licenses': [
                        {
                            uri: 'https://www.w3.org/copyright/software-license/',
                            name: 'W3C Software and Document License',
                        },
                    ],
                    start: '2021-02-11',
                },
                {
                    end: '2026-06-01',
                    'doc-licenses': [
                        {
                            uri: 'https://www.w3.org/copyright/software-license/',
                            name: 'W3C Software and Document License',
                        },
                    ],
                    start: '2023-11-10',
                },
            ],
        },
    },
};
