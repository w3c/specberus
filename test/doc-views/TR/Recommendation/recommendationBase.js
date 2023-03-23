import * as TRBase from '../TRBase.js';

const { data, ...rest } = TRBase;

const buildSecurityPrivacy = base => ({
    noSecurityPrivacy: {
        ...base,
    },
    noSecurity: {
        ...base,
        sotd: {
            ...base.sotd,
            title: `${base.sotd.title} privacy`,
        },
    },
    noPrivacy: {
        ...base,
        sotd: {
            ...base.sotd,
            title: `${base.sotd.title} security`,
        },
    },
});

const buildRecStability = base => ({
    noRECReview: {
        ...base,
        config: {
            ...base.config,
            isREC: false,
        },
    },
    noLicensingLink: {
        ...base,
        sotd: {
            ...base.sotd,
            licensingLink:
                'https://www.w3.org/Consortium/Patent-Policy/#sec-Requirements-fake',
        },
    },
});

const buildCopyrightException = base => ({
    goodCopyright: {
        ...base,
        dl: {
            ...base.dl,
            seriesShortName: 'epub-ssv-11',
        },
        copyright: {
            ...base.copyright,
            startString:
                '<a href="https://www.idpf.org">International Digital Publishing Forum</a> and <a href="https://www.w3.org/">World Wide Web Consortium</a>',
        },
    },
    wrongExpLink: {
        ...base,
        copyright: {
            ...base.copyright,
            licensingLink:
                'https://www.w3.org/Consortium/Patent-Policy/#sec-Requirements-fake',
        },
    },
    noMatchedSpecialCopyright: {
        ...base,
        header: {
            ...base.header,
            showDefaultDate: true,
        },
        copyright: {
            show: false,
        },
        dl: {
            ...base.dl,
            shortName: 'epub-ssv-11',
        },
        copyrightHtmlContent: {
            show: true,
            html: `<p class="copyright handlebars-data"><a href='https://www.w3.org/Consortium/Legal/ipr-notice#Copyright'>Copyright</a> © 1999-&YEAR <a href='https://www.idpf.org'>International Digital Publishing Forum</a> and <a href='https://www.w3.org/'>World Wide Web Consortium</a>. <abbr title='World Wide Web Consortium'>W3C</abbr><sup>®</sup> <a href='https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer'>liability</a>, <a href='https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks'>trademark</a> and <a rel='license' href='https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document' title='W3C Software and Document Notice and License'>permissive document license</a> rules apply.</p>`,
        },
    },
    wrongSpecialCopyrightLink: {
        ...base,
        dl: {
            ...base.dl,
            shortName: 'epub-ssv-11',
        },
        header: {
            ...base.header,
            showDefaultDate: true,
        },
        copyright: {
            show: false,
        },
        copyrightHtmlContent: {
            show: true,
            html: `<p class="copyright handlebars-data"><a href='https://www.w3.org/Consortium/Legal/ipr-notice#Copyright'>Copyright</a> © 1999-&YEAR <a href='https://www.idpf.org'>Some other fake Publishing Forum</a> and <a href='https://www.w3.org/'>World Wide Web Consortium</a>. <abbr title='World Wide Web Consortium'>W3C</abbr><sup>®</sup> <a href='https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer'>liability</a>, <a href='https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks'>trademark</a> and <a rel='license' href='https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document' title='W3C Software and Document Notice and License'>permissive document license</a> rules apply.</p>`,
        },
    },
});

export default {
    ...rest,
    buildSecurityPrivacy,
    buildRecStability,
    buildCopyrightException,
    data: {
        ...data,
        config: {
            underPP: true,
            isRecTrack: true,
        },
    },
};
