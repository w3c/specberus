export interface RulesSection {
    name: string;
    rules: Record<string, boolean | string | string[]>;
}

export interface RulesProfile {
    name: string;
    order: number;
    sections: {
        [index: string]: RulesSection;
    };
}

interface RulesEntry {
    name: string;
    order: number;
    profiles: Record<string, RulesProfile>;
}

export default {
    SUBM: {
        name: 'Submissions',
        order: 4,
        profiles: {
            'MEM-SUBM': {
                order: 2,
                name: 'Member Submission',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['Member-SUBM'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            submlogo:
                                'In addition to the W3C logo, use this logo:<div class="boilerplate"> <a href="https://www.w3.org/submissions/"> <img alt="W3C Member Submission" src="https://www.w3.org/Icons/member_subm" height="48" width="211"> </a> </div> <div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;a href="https://www.w3.org/submissions/"&gt;&lt;img height="48" width="211" alt="W3C Member Submission" src="https://www.w3.org/Icons/member_subm"/&gt;&lt;/a&gt;</code></div>',
                            title: true,
                            versionNumber: [''],
                            dateState: ['Member Submission', ''],
                            docIDFormat: true,
                            docIDOrder: true,
                            docIDThisVersion:
                                'The syntax of a “This Version” URI <span class="rfc2119">must</span> be <code>https://www.w3.org/submissions/YYYY/SUBM-shortname-YYYYMMDD/</code>.',
                            docIDLatestVersion:
                                'The syntax of a “Latest Version” URI <span class="rfc2119">must</span> be <code>https://www.w3.org/submissions/shortname/</code>.',
                            docIDDate: true,
                            editorSection: true,
                            altRepresentations: ['SUBM'],
                            copyright:
                                '<b>Copyright</b>: The document <span class="rfc2119">must</span> include a link to the W3C document notice (https://www.w3.org/copyright/document-license/). The copyright may be held by the Submitters.',
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc:
                                'It <span class="rfc2119">must</span> begin with the following boilerplate text: <blockquote class="boilerplate"> <p> <em>This section describes the status of this document at the time of its publication. A list of current W3C publications can be found in the <a href="https://www.w3.org/TR/">W3C standards and drafts index</a>.</em> </p> </blockquote> <div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;&lt;em&gt;This section describes the status of this document at the time of its publication. A list of current W3C publications can be found in the &lt;a href="https://www.w3.org/TR/"&gt;W3C standards and drafts index&lt;/a&gt;.&lt;/em&gt;&lt;/p&gt;</code></div>',
                            boilerplateSUBM:
                                'It <span class="rfc2119">must</span> include this boilerplate text (with links to the published Submission and Team Comment): <blockquote class="boilerplate"> By publishing this document, W3C acknowledges that the <a href="https://www.w3.org/submissions/@@@submissiondoc@@@">Submitting Members</a> have made a formal Submission request to W3C for discussion. Publication of this document by W3C indicates no endorsement of its content by W3C, nor that W3C has, is, or will be allocating any resources to the issues addressed by it. This document is not the product of a chartered W3C group, but is published as potential input to the <a href="https://www.w3.org/policies/process/">W3C Process</a>. A <a href="https://www.w3.org/submissions/@@@teamcomment@@@">W3C Team Comment</a> has been published in conjunction with this Member Submission. Publication of acknowledged Member Submissions at the W3C site is one of the benefits of <a href="https://www.w3.org/Consortium/Prospectus/Joining">W3C Membership</a>. Please consult the requirements associated with Member Submissions of <a href="https://www.w3.org/policies/patent-policy/#sec-submissions">section 3.3 of the W3C Patent Policy</a>. Please consult the complete <a href="https://www.w3.org/submissions/">list of acknowledged W3C Member Submissions</a>.</blockquote> <div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;By publishing this document, W3C acknowledges that the &lt;a href="https://www.w3.org/submissions/@@@submissiondoc@@@"&gt;Submitting Members&lt;/a&gt; have made a formal Submission request to W3C for discussion. Publication of this document by W3C indicates no endorsement of its content by W3C, nor that W3C has, is, or will be allocating any resources to the issues addressed by it. This document is not the product of a chartered W3C group, but is published as potential input to the &lt;a href="https://www.w3.org/policies/process/"&gt;W3C Process&lt;/a&gt;. A &lt;a href="https://www.w3.org/submissions/@@@teamcomment@@@"&gt;W3C Team Comment&lt;/a&gt; has been published in conjunction with this Member Submission. Publication of acknowledged Member Submissions at the W3C site is one of the benefits of &lt;a href="https://www.w3.org/Consortium/Prospectus/Joining"&gt;W3C Membership&lt;/a&gt;. Please consult the requirements associated with Member Submissions of &lt;a href="https://www.w3.org/policies/patent-policy/#sec-submissions"&gt;section 3.3 of the W3C Patent Policy&lt;/a&gt;. Please consult the complete &lt;a href="https://www.w3.org/submissions/"&gt;list of acknowledged W3C Member Submissions&lt;/a&gt;.&lt;/p&gt;</code></div>',
                            customParagraph: true,
                            knownDisclosureNumber: true,
                            datesFormat: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['SUBM'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
        },
    },
    REGISTRY: {
        name: 'Registry Track',
        order: 3,
        profiles: {
            DRY: {
                order: 1,
                name: 'Registry Draft',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['DRY'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                            delivererID: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [''],
                            dateState: ['Registry Draft', ''],
                            docIDFormat: true,
                            docIDOrder: true,
                            docIDThisVersion: ['DRY'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['DRY'],
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            datesFormat: true,
                            publish: [
                                'Registry Draft',
                                '<a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Registry track</a>',
                                '&lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Registry track&lt;/a&gt;',
                            ],
                            customParagraph: true,
                            stability:
                                'It <span class="rfc2119">must</span> set expectations about the (in)stability of the document. The <span class="rfc2119">recommended</span> text is: <blockquote class="boilerplate"><p>Publication as a Registry Draft does not imply endorsement by W3C and its Members</p></blockquote>',
                            draftStability: true,
                            patPolReq: true,
                            knownDisclosureNumber: true,
                            whichProcess: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['DRY'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
            CRY: {
                order: 2,
                name: 'Candidate Registry',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['CRY'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                            delivererID: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [''],
                            dateState: ['Candidate Registry Snapshot', ''],
                            docIDFormat: true,
                            docIDOrder: true,
                            docIDThisVersion: ['CRY'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['CRY'],
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            datesFormat: true,
                            publish: [
                                'Candidate Registry Snapshot',
                                '<a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Registry track</a>',
                                '&lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Registry track&lt;/a&gt;',
                            ],
                            customParagraph: true,
                            stability:
                                'It <span class="rfc2119">must</span> set expectations about the (in)stability of the document. The <span class="rfc2119">recommended</span> text is: <blockquote class="boilerplate"><p>Publication as a Registry Draft does not imply endorsement by W3C and its Members. A Candidate Registry Snapshot has received <a href="https://www.w3.org/policies/process/20250818/#dfn-wide-review">wide review</a>.</p></blockquote><div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;Publication as a Registry Draft does not imply endorsement by W3C and its Members. A Candidate Registry Snapshot has received &lt;a href="https://www.w3.org/policies/process/20250818/#dfn-wide-review"&gt;wide review&lt;/a&gt;.&lt;/p&gt;</code></div>',
                            reviewEndDate:
                                'It <span class="rfc2119">must</span> include a minimal duration (before which the group will not request the next transition). The duration <span class="rfc2119">must</span> be expressed as an estimated date.',
                            knownDisclosureNumber: true,
                            patPolReq: true,
                            whichProcess: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['CRY'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
            CRYD: {
                order: 3,
                name: 'Candidate Registry Draft',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['CRYD'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                            delivererID: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [''],
                            dateState: ['Candidate Registry Draft', ''],
                            docIDFormat: true,
                            docIDOrder: true,
                            docIDThisVersion: ['CRYD'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['CRYD'],
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            datesFormat: true,
                            publish: [
                                'Candidate Registry Draft',
                                '<a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Registry track</a>',
                                '&lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Registry track&lt;/a&gt;',
                            ],
                            customParagraph: true,
                            stability:
                                'It <span class="rfc2119">must</span> set expectations about the (in)stability of the document. The <span class="rfc2119">recommended</span> text is: <blockquote class="boilerplate"><p>Publication as a Candidate Registry Draft does not imply endorsement by W3C and its Members. A Candidate Registry Draft integrates changes from the previous Candidate Registry that the Working Group intends to include in a subsequent Candidate Registry Snapshot.</p></blockquote>',
                            draftStability:
                                'The document <span class="rfc2119">must</span> include one of the following two paragraphs in the "Status Of This Document": <blockquote class="boilerplate">This is a draft document and may be updated, replaced, or obsoleted by other documents at any time. It is inappropriate to cite this document as other than a work in progress.</blockquote><blockquote class="boilerplate">This document is maintained and updated at any time. Some parts of this document are work in progress.</blockquote>',
                            knownDisclosureNumber: true,
                            patPolReq: true,
                            whichProcess: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['CRYD'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
            RY: {
                order: 4,
                name: 'Registry',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['RY'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                            delivererID: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [''],
                            dateState: ['Registry', ''],
                            docIDFormat: true,
                            docIDOrder: true,
                            docIDThisVersion: ['RY'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['RY'],
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            datesFormat: true,
                            publish: [
                                'Registry',
                                '<a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Registry track</a>',
                                '&lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Registry track&lt;/a&gt;',
                            ],
                            customParagraph: true,
                            usage: 'It <span class="rfc2119">must</span> include the expectations in terms of usage of this registry. The SOTD should include the paragraph: <blockquote>W3C recommends the wide usage of this registry.</blockquote>',
                            stability:
                                'It <span class="rfc2119">must</span> set expectations about the (in)stability of the document. The <span class="rfc2119">recommended</span> text is: <blockquote class="boilerplate"><p>A W3C Registry is a specification that, after extensive consensus-building, is endorsed by W3C and its Members.</p>',
                            knownDisclosureNumber: true,
                            patPolReq: true,
                            whichProcess: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['RY'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
        },
    },
    NOTE: {
        name: 'Note Track',
        order: 2,
        profiles: {
            DNOTE: {
                order: 1,
                name: 'Group Note Draft',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['DNOTE'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                            delivererID: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [''],
                            dateState: ['Group Note Draft', ''],
                            docIDFormat: true,
                            docIDOrder: true,
                            docIDThisVersion: ['DNOTE'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['DNOTE'],
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            publish: [
                                'Group Note Draft',
                                '<a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Note track</a>',
                                '&lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Note track&lt;/a&gt;',
                            ],
                            customParagraph: true,
                            stability:
                                'It <span class="rfc2119">must</span> set expectations about the (in)stability of the document. The <span class="rfc2119">recommended</span> text is: <blockquote class="boilerplate"> <p>Group Note Drafts are not endorsed by W3C nor its Members.</p> </blockquote> or <blockquote class="boilerplate"> <p>This Group Note Draft is endorsed by the @@@ Working/Interest Group (and the @@@ Working/Interest Group), but is not endorsed by W3C itself nor its Members.</p> </blockquote>',
                            draftStability: true,
                            knownDisclosureNumber: true,
                            patPolReq: true,
                            whichProcess: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['DNOTE'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
            NOTE: {
                order: 2,
                name: 'Group Note',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['NOTE'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                            delivererID: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [''],
                            dateState: ['Group Note', ''],
                            docIDFormat: true,
                            docIDOrder: true,
                            docIDThisVersion: ['NOTE'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['NOTE'],
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            datesFormat: true,
                            publish: [
                                'Group Note',
                                '<a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Note track</a>',
                                '&lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Note track&lt;/a&gt;',
                            ],
                            customParagraph: true,
                            stability:
                                'It <span class="rfc2119">must</span> set expectations about the (in)stability of the document. The <span class="rfc2119">recommended</span> text is: <blockquote class="boilerplate"> <p>Group Notes are not endorsed by W3C nor its Members.</p> </blockquote> or <blockquote class="boilerplate"> <p>This Group Note is endorsed by the @@@ Working/Interest Group (and the @@@ Working/Interest Group), but is not endorsed by W3C itself nor its Members.</p> </blockquote>',
                            knownDisclosureNumber: true,
                            patPolReq: true,
                            whichProcess: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['NOTE'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
            STMT: {
                order: 3,
                name: 'Statement',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['STMT'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                            delivererID: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [''],
                            dateState: ['Statement', ''],
                            docIDFormat: true,
                            docIDOrder: true,
                            docIDThisVersion: ['STMT'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['STMT'],
                            translation: true,
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            datesFormat: true,
                            publish: [
                                'Statement',
                                '<a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Note track</a>',
                                '&lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Note track&lt;/a&gt;',
                            ],
                            customParagraph: true,
                            stability:
                                'It <span class="rfc2119">must</span> set expectations about the (in)stability of the document. The <span class="rfc2119">recommended</span> text is: <blockquote class="boilerplate"> <p>A W3C Statement is a specification that, after extensive consensus-building, is endorsed by W3C and its Members.</p></blockquote><div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;A W3C Statement is a specification that, after extensive consensus-building, is endorsed by W3C and its Members.&lt;/p&gt;</code></div>',
                            knownDisclosureNumber: true,
                            patPolReq: true,
                            whichProcess: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['STMT'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
        },
    },
    REC: {
        name: 'Recommendation Track',
        order: 1,
        profiles: {
            FPWD: {
                order: 1,
                name: 'First Public Working Draft',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['WD'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [''],
                            dateState: ['First Public Working Draft', ''],
                            docIDFormat: true,
                            docIDOrder: true,
                            docIDThisVersion: ['WD'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['WD'],
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            datesFormat: true,
                            publish: [
                                'First Public Working Draft',
                                '<a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Recommendation track</a>',
                                '&lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Recommendation track&lt;/a&gt;',
                            ],
                            customParagraph: true,
                            stability: ['a First Public Working Draft', ''],
                            draftStability: true,
                            patPolReq: true,
                            knownDisclosureNumber: true,
                            whichProcess: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['WD'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
            WD: {
                order: 2,
                name: 'Working Draft',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['WD'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [''],
                            dateState: ['Working Draft', ''],
                            docIDFormat: true,
                            docIDOrder: true,
                            docIDThisVersion: ['WD'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['WD'],
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            datesFormat: true,
                            publish: [
                                'Working Draft',
                                '<a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Recommendation track</a>',
                                '&lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Recommendation track&lt;/a&gt;',
                            ],
                            customParagraph: true,
                            changesList: ['should', ''],
                            stability: ['a Working Draft', ''],
                            draftStability: true,
                            patPolReq: true,
                            knownDisclosureNumber: true,
                            whichProcess: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                            securityAndPrivacy: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['WD'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
            CR: {
                order: 4,
                name: 'Candidate Recommendation Snapshot',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['CR'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [''],
                            dateState: [
                                'Candidate Recommendation Snapshot',
                                '',
                            ],
                            docIDFormat: true,
                            docIDOrder: true,
                            docIDThisVersion: ['CR'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['CR'],
                            implReport:
                                'It <span class="rfc2119">must</span> include a link to a preliminary interoperability or implementation report, or a statement that no such report exists.',
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            datesFormat: true,
                            publish: [
                                'Candidate Recommendation Snapshot',
                                '<a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Recommendation track</a>',
                                '&lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Recommendation track&lt;/a&gt;',
                            ],
                            reviewEndDate:
                                'It <span class="rfc2119">must</span> include a minimal duration (before which the group will not request the next transition). The duration <span class="rfc2119">must</span> be expressed as an estimated date.',
                            implEstimation:
                                'It <span class="rfc2119">should</span> include an estimated date by which time the Working Group expects to have sufficient implementation experience.',
                            featAtRisk:
                                'It <span class="rfc2119">must</span> identify any "features at risk" declared by the Working Group (as defined in section <a href="https://www.w3.org/policies/process/#candidate-rec">6.4 of the W3C Process Document</a>).',
                            customParagraph: true,
                            changesList: ['must', ''],
                            stability:
                                'It <span class="rfc2119">must</span> set expectations about the (in)stability of the document. The <span class="rfc2119">recommended</span> text is: <blockquote class="boilerplate"> <p>Publication as a Candidate Recommendation does not imply endorsement by W3C and its Members. A Candidate Recommendation Snapshot has received <a href="https://www.w3.org/policies/process/20250818/#dfn-wide-review">wide review</a>, is intended to gather implementation experience, and has commitments from Working Group members to <a href="https://www.w3.org/policies/patent-policy/#sec-Requirements">royalty-free licensing</a> for implementations.</p> </blockquote> <div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;Publication as a Candidate Recommendation does not imply endorsement by W3C and its Members. A Candidate Recommendation Snapshot has received &lt;a href="https://www.w3.org/policies/process/20250818/#dfn-wide-review"&gt;wide review&lt;/a&gt;, is intended to gather implementation experience,  and has commitments from Working Group members to &lt;a href="https://www.w3.org/policies/patent-policy/#sec-Requirements"&gt;royalty-free licensing&lt;/a&gt; for implementations.&lt;/p&gt;</code></div>',
                            patPolReq: true,
                            newFeatures:
                                'If it is the intention to incorporate new features in future updates of the specification, please make sure to identify the document as intending to allow new features. Recommended text is: <blockquote class="boilerplate">Future updates to this upcoming Recommendation may incorporate new features.</blockquote>Include one of this source code:</span><br> <code>&lt;p&gt;Future updates to this upcoming Recommendation may incorporate &lt;a href="https://www.w3.org/policies/process/20250818/#allow-new-features"&gt;new features&lt;/a&gt;.&lt;/p&gt;</code>',
                            knownDisclosureNumber: true,
                            whichProcess: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                            securityAndPrivacy: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['CR'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
            CRD: {
                order: 4,
                name: 'Candidate Recommendation Draft',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['CRD'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [''],
                            dateState: ['Candidate Recommendation Draft', ''],
                            docIDFormat: true,
                            docIDOrder: true,
                            docIDThisVersion: ['CRD'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['CRD'],
                            implReport:
                                'It <span class="rfc2119">must</span> include a link to a preliminary interoperability or implementation report, or a statement that no such report exists.',
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            datesFormat: true,
                            publish: [
                                'Candidate Recommendation Draft',
                                '<a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Recommendation track</a>',
                                '&lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Recommendation track&lt;/a&gt;',
                            ],
                            reviewEndDate:
                                'It <span class="rfc2119">must</span> include a minimal duration (before which the group will not request the next transition). The duration <span class="rfc2119">must</span> be expressed as an estimated date.',
                            implEstimation:
                                'It <span class="rfc2119">should</span> include an estimated date by which time the Working Group expects to have sufficient implementation experience.',
                            featAtRisk:
                                'It <span class="rfc2119">must</span> identify any "features at risk" declared by the Working Group (as defined in section <a href="https://www.w3.org/policies/process/#candidate-rec">6.4 of the W3C Process Document</a>).',
                            customParagraph: true,
                            changesList: ['must', ''],
                            stability:
                                'It <span class="rfc2119">must</span> set expectations about the (in)stability of the document. The <span class="rfc2119">recommended</span> text is: <blockquote class="boilerplate"> <p>Publication as a Candidate Recommendation does not imply endorsement by W3C and its Members. A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group intends to include in a subsequent Candidate Recommendation Snapshot.</p> </blockquote> <div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;Publication as a Candidate Recommendation does not imply endorsement by W3C and its Members. A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group intends to include in a subsequent Candidate Recommendation Snapshot.&lt;/p&gt;</code></div>',
                            draftStability:
                                'W3C Candidate Recommendation Draft <span class="rfc2119">must</span> include one of the following two paragraphs in the "Status Of This Document": <blockquote class="boilerplate">This is a draft document and may be updated, replaced, or obsoleted by other documents at any time. It is inappropriate to cite this document as other than a work in progress.</blockquote><blockquote class="boilerplate">This document is maintained and updated at any time. Some parts of this document are work in progress.</blockquote>',
                            patPolReq: true,
                            newFeatures:
                                'If it is the intention to incorporate new features in future updates of the specification, please make sure to identify the document as intending to allow new features. Recommended text is: <blockquote class="boilerplate">Future updates to this upcoming Recommendation may incorporate new features.</blockquote>Include one of this source code:</span><br> <code>&lt;p&gt;Future updates to this upcoming Recommendation may incorporate &lt;a href="https://www.w3.org/policies/process/20250818/#allow-new-features"&gt;new features&lt;/a&gt;.&lt;/p&gt;</code>',
                            knownDisclosureNumber: true,
                            whichProcess: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                            securityAndPrivacy: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['CRD'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
            REC: {
                order: 6,
                name: 'Recommendation',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['REC'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [
                                '<li class="rec-in-place">If a Recommendation modified in place, see the Comm Team\'s policy regarding <a href="https://www.w3.org/2003/01/republishing/">in-place modification of W3C Technical Reports</a>, otherwise</li> ',
                            ],
                            dateState: [
                                'Recommendation',
                                ' <p>If this is a modified Recommendation that was modified in place or is a new edition, the document <span class="rfc2119">must</span> include both the original publication date and the modification date. For example:</p> <pre xml:space="preserve">&lt;p id="w3c-state"&gt;<a href="https://www.w3.org/standards/types/#REC">W3C Recommendation</a> 7 April 2004, edited in place 19 August2004&lt;/p&gt;</pre>',
                            ],
                            docIDFormat: true,
                            docIDOrder:
                                'Document identifier information <span class="rfc2119">must</span> be present in this order: <ul><li>\'This version\' - URI to that version</li><li>\'Latest version\' - URI to the latest version. See also the (non-normative) <cite> <a href="https://www.w3.org/2005/05/tr-versions">Version Management in W3C Technical Reports</a> </cite> for information about "latest version" URI and version management.</li><li class="historyuri">\'History\' - URI to the history of the specification</li><li>Editor(s)</li><li>Feedback - GitHub repository issue links are required in the &lt;dl&gt;after &lt;dt&gt;Feedback:&lt;/dt&gt; in the headers (&lt;div class="head"&gt;) of the document. Links are expected to be of the form <code>https://github.com/&lt;USER_OR_ORG&gt;/&lt;REPO_NAME&gt;/[issues|labels][/&hellip;]</code>.)</li><li>Errata - URI to an errata document for any errors or issues reported since publication. See also suggestions on <a href="https://www.w3.org/2001/06/manual/#Errata">errata page structure</a> in the Manual of Style. <strong>Note:</strong><ul><li> Do not put the errata document in TR space as the expectation is that we will not modify document in TR space after publication; see the policy for <a href="https://www.w3.org/2003/01/republishing/">in-place modification of W3C Technical Reports</a>.</li><li>Recommendations with candidate/proposed changes are treated as inline errata, and these documents don\'t require an errata link.</li></ul></li></ul>',
                            docIDThisVersion: ['REC'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['REC'],
                            implReport:
                                'It <span class="rfc2119">must</span> include a link to a preliminary interoperability or implementation report.',
                            translation: true,
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            datesFormat: true,
                            deployment: true,
                            publish:
                                'W3C Recommendation <span class="rfc2119">must</span> include one of the following paragraphs in the "Status of This Document" depending on the type of Recommendations:<ol><li><strong>Recommendation without modifications:</strong><br><blockquote class="boilerplate">This document was published by the @@ Working Group as a Recommendation using the <a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Recommendation track</a>.</blockquote><span style="font-style: italic">Include this source code:</span><br><code>&lt;p&gt;This document was published by the @@ Working Group as a Recommendation using the &lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Recommendation track&lt;/a&gt;.&lt;/p&gt;</code></li><li><strong>Recommendation with candidate corrections:</strong><br><blockquote class="boilerplate">This document was published by the @@ Working Group as a Recommendation using the <a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Recommendation track</a>. It includes <a href="https://www.w3.org/policies/process/20250818/#candidate-correction">candidate corrections.</a></blockquote><span style="font-style: italic">Include this source code:</span><br><code>&lt;p&gt;This document was published by the @@ Working Group as a Recommendation using the &lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Recommendation track&lt;/a&gt;. It includes &lt;a href="https://www.w3.org/policies/process/20250818/#candidate-correction"&gt;candidate corrections.&lt;/a&gt;.&lt;/p&gt;</code></li><li><strong>Recommendation with candidate additions:</strong><br><blockquote class="boilerplate">This document was published by the @@ Working Group as a Recommendation using the <a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Recommendation track</a>. It includes <a href="https://www.w3.org/policies/process/20250818/#candidate-addition">candidate additions</a>, introducing new features since the Previous Recommendation.</blockquote><span style="font-style: italic">Include this source code:</span><br><code>&lt;p&gt;This document was published by the @@ Working Group as a Recommendation using the &lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Recommendation track&lt;/a&gt;. It includes &lt;a href="https://www.w3.org/policies/process/20250818/#candidate-addition"&gt;candidate additions&lt;/a&gt;, introducing new features since the Previous Recommendation.&lt;/p&gt;</code></li><li><strong>Recommendation with candidate amendments:</strong><br><blockquote class="boilerplate">This document was published by the @@ Working Group as a Recommendation using the <a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Recommendation track</a>. It includes <a href="https://www.w3.org/policies/process/20250818/#candidate-amendments">candidate amendments</a>, introducing substantive changes and new features since the Previous Recommendation.</blockquote><span style="font-style: italic">Include this source code:</span><br><code>&lt;p&gt;This document was published by the @@ Working Group as a Recommendation using the &lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Recommendation track&lt;/a&gt;. It includes &lt;a href="https://www.w3.org/policies/process/20250818/#candidate-amendments"&gt;candidate amendments&lt;/a&gt;, introducing substantive changes and new features since the Previous Recommendation.&lt;/p&gt;</code></li><li><strong>Recommendation with proposed corrections:</strong><br><blockquote class="boilerplate">This document was published by the @@ Working Group as a Recommendation using the <a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Recommendation track</a>. It includes <a href="https://www.w3.org/policies/process/20250818/#proposed-corrections">proposed corrections.</a></blockquote><span style="font-style: italic">Include this source code:</span><br><code>&lt;p&gt;This document was published by the @@ Working Group as a Recommendation using the &lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Recommendation track&lt;/a&gt;. It includes &lt;a href="https://www.w3.org/policies/process/20250818/#proposed-corrections"&gt;proposed corrections.&lt;/a&gt;.&lt;/p&gt;</code></li><li><strong>Recommendation with proposed additions:</strong><br><blockquote class="boilerplate">This document was published by the @@ Working Group as a Recommendation using the <a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Recommendation track</a>. It includes <a href="https://www.w3.org/policies/process/20250818/#proposed-addition">proposed additions</a>, introducing new features since the Previous Recommendation.</blockquote><span style="font-style: italic">Include this source code:</span><br><code>&lt;p&gt;This document was published by the @@ Working Group as a Recommendation using the &lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Recommendation track&lt;/a&gt;. It includes &lt;a href="https://www.w3.org/policies/process/20250818/#proposed-addition"&gt;proposed additions&lt;/a&gt;, introducing new features since the Previous Recommendation.&lt;/p&gt;</code></li><li><strong>Recommendation with proposed amendments:</strong><br><blockquote class="boilerplate">This document was published by the @@ Working Group as a Recommendation using the <a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Recommendation track</a>. It includes <a href="https://www.w3.org/policies/process/20250818/#proposed-amendments">proposed amendments</a>, introducing substantive changes and new features since the Previous Recommendation.</blockquote><span style="font-style: italic">Include this source code:</span><br><code>&lt;p&gt;This document was published by the @@ Working Group as a Recommendation using the &lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Recommendation track&lt;/a&gt;. It includes &lt;a href="https://www.w3.org/policies/process/20250818/#proposed-amendments"&gt;proposed amendments&lt;/a&gt;, introducing substantive changes and new features since the Previous Recommendation.&lt;/p&gt;</li></ol></code>',
                            recRelation:
                                'It <span class="rfc2119">must</span> indicate its relationship to previous related Recommendations (e.g., an indication that a Recommendation supersedes, obsoletes, or subsumes another, or that a Recommendation is an editorial revision) and <span class="rfc2119">must</span> link to the most recent Recommendation (if any) having the same major revision number. The document thus links to two important resources: the previous edition of the Recommendation via the status section, and the previous draft (the Proposed Recommendation) via the "Previous version" link.',
                            customParagraph: true,
                            changesList: ['must', ''],
                            stability:
                                'It <span class="rfc2119">must</span> set expectations about the stability of the document. The <span class="rfc2119">recommended</span> text is: <blockquote class="boilerplate"> <p>A W3C Recommendation is a specification that, after extensive consensus-building, is endorsed by <abbr title="World Wide Web Consortium">W3C</abbr> and its Members, and has commitments from Working Group members to <a href="https://www.w3.org/policies/patent-policy/#sec-Requirements">royalty-free licensing</a> for implementations.</p> </blockquote> <div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;A W3C Recommendation is a specification that, after extensive consensus-building, is endorsed by &lt;abbr title="World Wide Web Consortium"&gt;W3C&lt;/abbr&gt; and its Members, and has commitments from Working Group members to &lt;a href="https://www.w3.org/policies/patent-policy/#sec-Requirements"&gt;royalty-free licensing&lt;/a&gt; for implementations.&lt;/p&gt;</code></div>',
                            patPolReq: true,
                            knownDisclosureNumber: true,
                            newFeatures:
                                'If it is the intention to incorporate new features in future updates of the Recommendation, please make sure to identify the document as intending to allow new features. Recommended text is: <blockquote class="boilerplate">Future updates to this Recommendation may incorporate new features.</blockquote>Include one of this source code:</span><br> <code>&lt;p&gt;Future updates to this Recommendation may incorporate &lt;a href="https://www.w3.org/policies/process/20250818/#allow-new-features"&gt;new features&lt;/a&gt;.&lt;/p&gt;</code>',
                            whichProcess: true,
                            recAddition:
                                'Modifications in W3C Recommendation are divided into "new features" and "changes". Recommendations with modifications <span class="rfc2119">must</span> include the following paragraphs depending on the changes.<br><ol><li><strong>proposed corrections, aka "substantive changes":</strong><br><p>there should be a paragraph with <code>class="correction proposed"</code></p><blockquote class="boilerplate">Proposed corrections are marked in the document.</blockquote><span style="font-style: italic">Include this source code:</span><br><code>&lt;p class="correction proposed"&gt;Proposed corrections are marked in the document.&lt;/p&gt;</code></li><li><strong>proposed additions, aka "new features":</strong><br><p>there should be a paragraph with <code>class="addition proposed"</code></p><blockquote class="boilerplate">Proposed additions are marked in the document.</blockquote><span style="font-style: italic">Include this source code:</span><br><code>&lt;p class="addition proposed"&gt;Proposed additions are marked in the document.&lt;/p&gt;</code></li><li><strong>candidate corrections, aka "substantive changes":</strong><br><p>there should be a paragraph with <code>class="correction"</code></p><blockquote class="boilerplate">Candidate corrections are marked in the document.</blockquote><span style="font-style: italic">Include this source code:</span><br><code>&lt;p class="correction"&gt;Candidate corrections are marked in the document.&lt;/p&gt;</code></li><li><strong>candidate additions, aka "new features":</strong><br><p>there should be a paragraph with <code>class="addition"</code></p><blockquote class="boilerplate">Candidate additions are marked in the document.</blockquote><span style="font-style: italic">Include this source code:</span><br><code>&lt;p class="correction"&gt;Candidate additions are marked in the document.&lt;/p&gt;</code></li></ol>',
                            commentEnd:
                                'W3C Recommendation with proposed amendments (substantive changes or new features) <span class="rfc2119">must</span> have a comment review date of at least 60 days after the publication date.',
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['REC'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
            'REC-RSCND': {
                order: 7,
                name: 'Rescinded Recommendation',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['RSCND'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [
                                '<li class="rec-in-place">If a Recommendation modified in place, see the Comm Team\'s policy regarding <a href="https://www.w3.org/2003/01/republishing/">in-place modification of W3C Technical Reports</a>, otherwise</li> ',
                            ],
                            dateState: ['Rescinded Recommendation', ''],
                            docIDFormat: true,
                            docIDOrder:
                                'Document identifier information <span class="rfc2119">must</span> be present in this order: <ul> <li>This version URI.</li> <li>Latest version URI(s). See also the (non-normative) <cite> <a href="https://www.w3.org/2005/05/tr-versions">Version Management in W3C Technical Reports</a> </cite> for information about "latest version" URI and version management.</li> <li class="prevrecuri">"Rescinds this Recommendation" URI</li> </ul>',
                            docIDThisVersion: ['RSCND'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['RSCND'],
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            datesFormat: true,
                            publish: [
                                'Recommendation',
                                '<a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Recommendation track</a>',
                                '&lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Recommendation track&lt;/a&gt;',
                            ],
                            recRelation: true,
                            rescindsRationale:
                                'It <span class="rfc2119">must</span> include rationale for the decision to rescind the Recommendation.<p><span style="font-style: italic">Include this source code:</span><br/><code>&lt;p&gt;W3C has chosen to rescind the &lt;a href="@@PREVIOUS REC URI@@"&gt;@@TITLE@@ Recommendation&lt;/a&gt; for the following reasons: [...list of reasons...]. For additional information about replacement or alternative technologies, please refer to the &lt;a href="https://www.w3.org/2016/11/obsoleting-rescinding/"&gt;explanation of Obsoleting, Rescinding or Superseding W3C Specifications&lt;/a&gt;.&lt;/p&gt;</code></p>',
                            altTechno: true,
                            customParagraph: true,
                            knownDisclosureNumber: true,
                            whichProcess: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['RSCND'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
            DISC: {
                order: 9,
                name: 'Discontinued Draft',
                sections: {
                    format: {
                        name: '1. Normative Document Representation',
                        rules: {
                            normativeVersion: true,
                            validHTML: true,
                            visualStyle: true,
                        },
                    },
                    metadata: {
                        name: '2. Document Metadata',
                        rules: {
                            goodStylesheet: ['DISC'],
                            lastStylesheet: true,
                            viewport: true,
                            canonical: true,
                        },
                    },
                    'front-matter': {
                        name: '3. Front Matter',
                        rules: {
                            divClassHead: true,
                            logo: true,
                            title: true,
                            versionNumber: [''],
                            dateState: ['Discontinued Draft', ''],
                            docIDFormat: true,
                            docIDOrder: true,
                            docIDThisVersion: ['DISC'],
                            docIDDate: true,
                            docIDLatestVersion: true,
                            docIDHistory: true,
                            editorSection: true,
                            altRepresentations: ['DISC'],
                            copyright: true,
                            hrAfterCopyright: true,
                        },
                    },
                    navigation: {
                        name: '6. Table of Contents',
                        rules: {
                            toc: true,
                            tocNav: true,
                        },
                    },
                    'document-status': {
                        name: '5. Document Status Section',
                        rules: {
                            sotd: true,
                            boilerplateTRDoc: true,
                            datesFormat: true,
                            publish: [
                                'Discontinued Draft',
                                '<a href="https://www.w3.org/policies/process/20250818/#recs-and-notes">Recommendation track</a>',
                                '&lt;a href="https://www.w3.org/policies/process/20250818/#recs-and-notes"&gt;Recommendation track&lt;/a&gt;',
                            ],
                            stability:
                                'It <span class="rfc2119">must</span> set expectations about the (in)stability of the document. The <span class="rfc2119">recommended</span> text is: <blockquote class="boilerplate"> <p>Publication as a Discontinued Draft implies that this document is no longer intended to advance or to be maintained. It is inappropriate to cite this document as other than abandoned work.</p> </blockquote> <div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;Publication as a Discontinued Draft implies that this document is no longer intended to advance or to be maintained. It is inappropriate to cite this document as other than abandoned work.&lt;/p&gt;</code></div>',
                            patPolReq: true,
                            knownDisclosureNumber: true,
                            whichProcess: true,
                        },
                    },
                    'document-body': {
                        name: '7. Document Body',
                        rules: {
                            headingWithoutID: true,
                            brokenLink: true,
                            cssValid: true,
                            namespaces: true,
                            wcag: true,
                            fixupJs: true,
                        },
                    },
                    compound: {
                        name: '8. Compound Documents',
                        rules: {
                            compoundFilesLocation: ['DISC'],
                            compoundOverview: true,
                            compound: true,
                        },
                    },
                },
            },
        },
    },
} satisfies Record<string, RulesEntry>;
