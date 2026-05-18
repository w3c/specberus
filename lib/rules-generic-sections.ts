export interface GenericRulesSection {
    name: string;
    rules: Record<string, string>;
}

export default {
    format: {
        name: '1. Normative Document Representation',
        rules: {
            normativeVersion:
                'At least one normative representation <span class="rfc2119">must</span> be available for requests that use the "This Version" URI. More than one normative representation <span class="rfc2119">may</span> be delivered in response to such requests. A "This Version" URI <span class="rfc2119">must not</span> be used to identify a non-normative representation.',
            validHTML:
                '<span class="subset">recursive</span> All normative representations <span class="rfc2119">must</span> validate as HTML5 with the following limitations: <ul> <li>Inline markup for MathML is permitted but should use a (fallback) alternative.</li> <li>If the HTML5 validator issues content warnings, the publication request must include rationale why the warning is not problematic.</li> </ul>',
            visualStyle:
                'Visual styles <span class="rfc2119">should not</span> vary significantly among normative alternatives.',
        },
    },
    metadata: {
        name: '2. Document Metadata',
        rules: {
            goodStylesheet:
                '<span class="subset">recursive</span> Each document <span class="rfc2119">must</span> include the following absolute URI to identify a style sheet for this maturity level: <code> <span class="boilerplate-nocode">https://www.w3.org/StyleSheets/TR/2021/W3C-@{param1}</span> </code> <p> <span style="font-style: italic">Include this source code:</span> <br> <code>&lt;link rel="stylesheet" type="text/css" href="https://www.w3.org/StyleSheets/TR/2021/W3C-@{param1}"/&gt;</code> </p>',
            lastStylesheet:
                '<span class="subset">recursive</span> Any internal style sheets <span class="rfc2119">must</span> be cascaded before this link; i.e., the internal style sheets <span class="rfc2119">must not</span> override the W3C tech report styles.',
            viewport:
                '<span class="subset">recursive</span> The viewport meta tag is required.<p><span style="font-style: italic">Include this source code:</span><br/><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"&gt;</code></p>',
            canonical:
                '<span class="subset">recursive</span> The canonical link is required.<p><span style="font-style: italic">Include this source code:</span><br/><code>&lt;link rel="canonical" href="@@URL@@"&gt;</code></p>',
            delivererID:
                'The Working Group(s) id(s) <span class="rfc2119">must</span> be listed in a <code>data-deliverer</code> attribute in the section "Status of This Document".<p><span style="font-style: italic">Include this source code:</span><br/><code>&lt;p data-deliverer="@@ID1@@ @@ID2@@,..."&gt;</code></p>',
        },
    },
    'front-matter': {
        name: '3. Front Matter',
        rules: {
            divClassHead:
                'The front matter <span class="rfc2119">must</span> appear at the beginning of the body of the document, within &lt;div class="head"&gt;. There is one exception to that requirement: the <code>hr</code> element after the copyright <span class="rfc2119">may</span> appear inside or after the <code>div</code> element. Editors <span class="rfc2119">should not</span> include other information in this section.',
            logo: 'The document <span class="rfc2119">must</span> include a link to the W3C logo identified below. The URI used to identify the logo <span class="rfc2119">must</span> be absolute. <div class="boilerplate"> <a href="https://www.w3.org/"> <img alt="W3C" src="https://www.w3.org/StyleSheets/TR/2021/logos/W3C" height="48" width="72"> </a> </div> <div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;a href="https://www.w3.org/"&gt;&lt;img height="48" width="72" alt="W3C" src="https://www.w3.org/StyleSheets/TR/2021/logos/W3C"/&gt;&lt;/a&gt;</code></div>',
            title: "The document's title <span class=\"rfc2119\">must</span> be in the <code>title</code> element and in an <code>h1</code> element. When calculating text equation, special transformations made to <code>h1</code> are: <ol><li>Replace ':&lt;br&gt;' with ': '</li><li>Replace '&lt;br&gt;' with ' - '</li><li>Extract text from h1, and ignore HTML tags.</li></ol>",
            versionNumber:
                'Technical report version information, i.e., version and edition numbers. <ol> @{param1}<li>See the (non-normative) <cite> <a href="https://www.w3.org/2005/05/tr-versions">Version Management in W3C Technical Reports</a> </cite> for more information.</li> </ol>',
            dateState:
                'The document\'s status and date <span class="rfc2119">must</span> be in a <code>&lt;p id="w3c-state"&gt;</code> element as follows (see also <a href="#datesFormat">date syntax</a>): <pre xml:space="preserve">&lt;p id="w3c-state"&gt;<a href="https://www.w3.org/standards/types/#@@Profile">W3C @{param1}</a> DD Month YYYY&lt;/p&gt;</pre>@{param2}',
            docIDFormat:
                'Document identifier information <span class="rfc2119">must</span> be presented in a <code>dl</code> list, where each <code>dt</code> element marks up an identifier role ("This Version", "Latest Version", "History", etc.) and each <code>dd</code> element includes a link whose link text is the identifier. That <code>dl</code> <span class="rfc2119">must</span> itself be placed in a <code>details</code> element. <p><span style="font-style: italic">Include this source code:</span><br/><code>&lt;details open&gt;&lt;summary&gt;More details about this document&lt;/summary&gt;&lt;dl&gt;...&lt;/dl&gt;&lt;/details&gt;</code></p>',
            docIDOrder:
                'Document identifier information <span class="rfc2119">must</span> be present in this order: <ul><li>\'This version\' - URI to that version</li><li>\'Latest version\' - URI to the latest version. See also the (non-normative) <cite> <a href="https://www.w3.org/2005/05/tr-versions">Version Management in W3C Technical Reports</a> </cite> for information about "latest version" URI and version management.</li><li class="historyuri">\'History\' - URI to the history of the specification</li><li>Editor(s)</li><li>Feedback - GitHub repository issue links are required in the &lt;dl&gt;after &lt;dt&gt;Feedback:&lt;/dt&gt; in the headers (&lt;div class="head"&gt;) of the document. Links are expected to be of the form <code>https://github.com/&lt;USER_OR_ORG&gt;/&lt;REPO_NAME&gt;/[issues|labels][/&hellip;]</code>.)</li></ul>',
            docIDThisVersion:
                'The syntax of a “this version” URI <span class="rfc2119">must</span> be <code>https://www.w3.org/TR/YYYY/@{param1}-shortname-YYYYMMDD/</code>. If the document introduces a new shortname, it <span class="rfc2119">must</span> use lowercase letters.',
            docIDDate:
                'The title page date and the date at the end of the "This Version" URI <span class="rfc2119">must</span> match.',
            docIDLatestVersion:
                'The syntax of a “latest version” URI <span class="rfc2119">must</span> be <code>https://www.w3.org/TR/shortname/</code>.',
            docIDHistory:
                "The syntax of a “history” URI <span class=\"rfc2119\">must</span> be <code>https://www.w3.org/standards/history/shortname/</code>, and consistent with the shortname mentioned in 'Latest Version'. <em>Note</em>: If there's a shortname change it <span class=\"rfc2119\">must</span> be specified using the following data attribute <code>data-previous-shortname='previous-shortname'</code> on the <code>&lt;a&gt;</code> element.",
            editorSection:
                'The editors\'/authors\' names <span class="rfc2119">must</span> be listed, including one of the following attributes (listed in descending order of precedence): <ul> <li><code>data-editor-id="@@"</code> (referencing W3C ID)</li> <li><code>data-editor-github="@@"</code> (referencing GitHub username)</li> </ul> Affiliations and email addresses are <span class="rfc2119">optional</span>; email addresses are <span class="rfc2119">not recommended</span>. The affiliation of Invited Experts <span class="rfc2119">must</span> always be "W3C Invited Expert" whether they are affiliated with another organization or not. If an editor/author is acknowledged in an earlier version of this document and the individual\'s affiliation has since changed, list the individual using the notation "&lt;name&gt;, &lt;affiliation&gt; (until DD Month YYYY)". If the list of authors is very long (e.g., the entire Working Group), identify the authors in the acknowledgments section, linked from the head of the document. Distinguish any contributors from authors in the acknowledgments section.<br>Note: Editors <span class="rfc2119">must</span> be participating in the group producing the document at the time of its publication. If an editor left the group before publication, they can still be listed but the rationale <span class="rfc2119">must</span> be provided in a <code>&lt;span class="former"&gt;</code> element next to the name of the editor.',
            altRepresentations:
                'Authors <span class="rfc2119">may</span> provide links to alternative (non-normative) representations or packages for the document. For instance: <p> <code> <small>&lt;p&gt;This document is also available in these non-normative formats: &lt;a href="@{param1}-shortname-20180101.html"&gt;single HTML file&lt;/a&gt;, &lt;a href="@{param1}-shortname-20180101.tgz"&gt;gzipped tar file of HTML&lt;/a&gt;.&lt;/p&gt; </small> </code> </p>',
            implReport:
                'It <span class="rfc2119">must</span> include either: <ul> <li>a link to an interoperability or implementation report if the Director used such a report as part of the decision to advance the specification, or</li> <li>a statement that the Director\'s decision did not involve such a report.</li> </ul>',
            translation:
                'There <span class="rfc2119">must</span> be a link to a translations page. The <span class="rfc2119">recommended</span> markup is: <p> <code> <small>&lt;p&gt;See also &lt;a href="https://www.w3.org/Translations/?technology=shortname"&gt;&lt;strong&gt;translations&lt;/strong&gt;&lt;/a&gt;.&lt;/p&gt;</small> </code> </p> <p>See <a href="https://www.w3.org/guide/manual-of-style/#Translations">suggestions on translations</a> in the manual of style.</p>',
            copyright:
                'Starting from 01 February 2023, the copyright <span class="rfc2119">must</span> follow the following markup (fill in with the appropriate year, years, or year range). The type of license the document is using can be found in the group\'s charter. <ol> <li>For documents using W3C Document License: <blockquote class="copyright"><a href="https://www.w3.org/policies/#copyright">Copyright</a> © @{year} <a href="https://www.w3.org/">World Wide Web Consortium</a>. <abbr title="World Wide Web Consortium">W3C</abbr><sup>®</sup> <a href="https://www.w3.org/policies/#Legal_Disclaimer">liability</a>, <a href="https://www.w3.org/policies/#W3C_Trademarks">trademark</a> and <a href="https://www.w3.org/copyright/document-license/">document use</a> rules apply.</blockquote><div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p class=&quot;copyright&quot;&gt;&lt;a href=&quot;https://www.w3.org/policies/#copyright&quot;&gt;Copyright&lt;/a&gt; © @{year} &lt;a href=&quot;https://www.w3.org/&quot;&gt;World Wide Web Consortium&lt;/a&gt;. &lt;abbr title=&quot;World Wide Web Consortium&quot;&gt;W3C&lt;/abbr&gt;&lt;sup&gt;®&lt;/sup&gt; &lt;a href=&quot;https://www.w3.org/policies/#Legal_Disclaimer&quot;&gt;liability&lt;/a&gt;, &lt;a href=&quot;https://www.w3.org/policies/#W3C_Trademarks&quot;&gt;trademark&lt;/a&gt; and &lt;a href="https://www.w3.org/copyright/document-license/"&gt;document use&lt;/a&gt; rules apply.&lt;/p&gt;</code> </div></li><li>For documents using W3C Software and Document License: <blockquote class="copyright"><a href="https://www.w3.org/policies/#copyright">Copyright</a> © @{year} <a href="https://www.w3.org/">World Wide Web Consortium</a>. <abbr title="World Wide Web Consortium">W3C</abbr><sup>®</sup> <a href="https://www.w3.org/policies/#Legal_Disclaimer">liability</a>, <a href="https://www.w3.org/policies/#W3C_Trademarks">trademark</a> and <a href="https://www.w3.org/copyright/software-license/">permissive document license</a> rules apply.</blockquote><div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p class=&quot;copyright&quot;&gt;&lt;a href=&quot;https://www.w3.org/policies/#copyright&quot;&gt;Copyright&lt;/a&gt; © @{year} &lt;a href=&quot;https://www.w3.org/&quot;&gt;World Wide Web Consortium&lt;/a&gt;. &lt;abbr title=&quot;World Wide Web Consortium&quot;&gt;W3C&lt;/abbr&gt;&lt;sup&gt;®&lt;/sup&gt; &lt;a href=&quot;https://www.w3.org/policies/#Legal_Disclaimer&quot;&gt;liability&lt;/a&gt;, &lt;a href=&quot;https://www.w3.org/policies/#W3C_Trademarks&quot;&gt;trademark&lt;/a&gt; and &lt;a href=&quot;https://www.w3.org/copyright/software-license/&quot;&gt;permissive document license&lt;/a&gt; rules apply.&lt;/p&gt;</code> </div></li></ol><p>Note: Exceptions are listed in the <a href="https://github.com/w3c/specberus/blob/main/lib/copyright-exceptions.ts">copyright-exceptions module</a>.',
            hrAfterCopyright:
                'A horizontal rule (<code>hr</code>) <span class="rfc2119">must</span> follow the copyright.',
        },
    },
    navigation: {
        name: '6. Table of Contents',
        rules: {
            toc: 'There <span class="rfc2119">should</span> be a table of contents after the status section, labeled with an <code>h2</code> element with content "Table of Contents".',
            tocNav: 'The table of content <span class="rfc2119">must</span> be inside a navigation element (nav).<p><span style="font-style: italic">Include this source code:</span><br/><code>&lt;nav id="toc"&gt;&lt;h2&gt;Table of Contents&lt;/h2&gt;</code></p>',
        },
    },
    'document-status': {
        name: '5. Document Status Section',
        rules: {
            sotd: 'There <span class="rfc2119">must</span> be a status section that follows the abstract, labeled with an <code>h2</code> element with content "Status of This Document". The Team maintains the status section of a document.',
            boilerplateTRDoc:
                'It <span class="rfc2119">must</span> begin with the following boilerplate text: <blockquote class="boilerplate"> <p> <em>This section describes the status of this document at the time of its publication. A list of current W3C publications and the latest revision of this technical report can be found in the <a href="https://www.w3.org/TR/">W3C standards and drafts index</a>.</em> </p> </blockquote> <div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;&lt;em&gt;This section describes the status of this document at the time of its publication. A list of current W3C publications and the latest revision of this technical report can be found in the &lt;a href="https://www.w3.org/TR/"&gt;W3C standards and drafts index&lt;/a&gt;.&lt;/em&gt;&lt;/p&gt;</code></div>',
            datesFormat:
                'All dates <span class="rfc2119">must</span> have one of the following forms:<ol><li>DD Month YYYY : 09 January 2020</li><li>DD-Month-YYYY : 09-January-2020</li><li>DD Mon YYYY : 09 Jan 2020</li><li>DD-Mon-YYYY : 09-Jan-2020</li></ol>A leading zero in the day is <span class="rfc2119">optional</span>.',
            publish:
                'It <span class="rfc2119">must</span> include the name of the W3C group that produced the document, the type of document and its track. The name <span class="rfc2119">must</span> be a link to a public page for the group.<blockquote><p>This document was published by the <a href="https://www.w3.org/groups/(wg|ig)/@@/">@@@ Working/Interest Group</a> as a @{param1} using the @{param2}.</p> </blockquote><div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;This document was published by the &lt;a href="https://www.w3.org/groups/(wg|ig)/@@/"&gt;@@@ Working/Interest Group&lt;/a&gt; as a @{param1} using the @{param3}.&lt;/p&gt;</code></div>',
            customParagraph:
                'It <span class="rfc2119">must</span> include at least one customized paragraph. This section <span class="rfc2119">should</span> include the title page date (i.e., the one next to the maturity level at the top of the document). These paragraphs <span class="rfc2119">should</span> explain the publication context, including rationale and relationships to other work. See <a href="https://www.w3.org/2001/06/manual/#Status">examples and more discussion in the Manual of Style</a>.',
            changesList:
                'It <span class="rfc2119">@{param1}</span> include a link to changes since the previous draft (e.g., a list of changes or a diff document or both; see the <a href="https://www.w3.org/2007/10/htmldiff">online HTML diff tool</a>).@{param2}',
            deployment:
                'It <span class="rfc2119">must</span> include the expectations in terms of deployment. The recommended text is: <blockquote>W3C recommends the wide deployment of this specification as a standard for the Web.</blockquote>',
            stability:
                'It <span class="rfc2119">must</span> set expectations about the (in)stability of the document. The <span class="rfc2119">recommended</span> text @{param2} is: <blockquote class="boilerplate"> <p>Publication as @{param1} does not imply endorsement by W3C and its Members.</p> </blockquote> <div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;Publication as @{param1} does not imply endorsement by W3C and its Members.&lt;/p&gt;</code></div>',
            draftStability:
                'It <span class="rfc2119">must</span> include the following sentences in the "Status Of This Document": <blockquote class="boilerplate">This is a draft document and may be updated, replaced, or obsoleted by other documents at any time. It is inappropriate to cite this document as other than a work in progress.</blockquote>',
            patPolReq:
                'It <span class="rfc2119">must</span> include a text related to the patent policy:<ul><li>if the document is under REC track, the text is:<blockquote class="boilerplate"><p>This document was produced by a group operating under the <a href="https://www.w3.org/policies/patent-policy/">W3C Patent Policy</a>. W3C maintains a <a rel="disclosure" href="@@URI to IPP status or other page@@">public list of any patent disclosures</a> made in connection with the deliverables of the group; that page also includes instructions for disclosing a patent. An individual who has actual knowledge of a patent that the individual believes contains <a href="https://www.w3.org/policies/patent-policy/#def-essential">Essential Claim(s)</a> must disclose the information in accordance with <a href="https://www.w3.org/policies/patent-policy/#sec-Disclosure">section 6 of the W3C Patent Policy</a>.</p></blockquote><div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;This document was produced by a group operating under the &lt;a href="https://www.w3.org/policies/patent-policy/"&gt;W3C Patent Policy&lt;/a&gt;. W3C maintains a &lt;a rel="disclosure" href="@@URI to IPP status or other page@@"&gt;public list of any patent disclosures&lt;/a&gt; made in connection with the deliverables of the group; that page also includes instructions for disclosing a patent. An individual who has actual knowledge of a patent that the individual believes contains &lt;a href="https://www.w3.org/policies/patent-policy/#def-essential"&gt;Essential Claim(s)&lt;/a&gt; must disclose the information in accordance with &lt;a href="https://www.w3.org/policies/patent-policy/#sec-Disclosure"&gt;section 6 of the W3C Patent Policy&lt;/a&gt;.&lt;/p&gt;</code></div></li><li>if the document is under Note track or Registry track, it <span class="rfc2119">must</span> set the licensing requirements related to the Patent Policy. The text is: <blockquote class="boilerplate"><p>The <a href="https://www.w3.org/policies/patent-policy/">W3C Patent Policy</a> does not carry any licensing requirements or commitments on this document.</p></blockquote><div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;The &lt;a href="https://www.w3.org/policies/patent-policy/"&gt;W3C Patent Policy&lt;/a&gt; does not carry any licensing requirements or commitments on this document.&lt;/p&gt;</code></p></li></ul>',
            knownDisclosureNumber:
                'It <span class="rfc2119">must not</span> indicate the number of known disclosures at the time of publication.',
            whichProcess:
                'The document <span class="rfc2119">must</span> include the following boilerplate text in the status section to identify the governing process: <blockquote class="boilerplate"> <p>This document is governed by the <a id="w3c_process_revision" href="https://www.w3.org/policies/process/20250818/">18 August 2023 W3C Process Document</a>. </p> </blockquote> <div class="source"> <span style="font-style: italic">Include this source code</span>:<br><code>&lt;p&gt;This document is governed by the &lt;a id="w3c_process_revision" href="https://www.w3.org/policies/process/20250818/"&gt;18 August 2023 W3C Process Document&lt;/a&gt;. &lt;/p&gt;</code></div>',
            discontinue:
                'If the document was published due to a W3C decision to stop work on this material, the status section <span class="rfc2119">should</span> include that rationale.',
            expectations:
                'It <span class="rfc2119">should</span> indicate the level of endorsement within the group for the material, set expectations that the group has completed work on the topics covered by the document, and set expectations about the group\'s commitment to respond to comments about the document.',
            ACRepFeedbackEmail:
                'It also <span class="rfc2119">must</span> provide information to Advisory Committee Representatives about how to send their review comments (e.g., the <a href="https://www.w3.org/2002/09/wbs/33280/">link to all AC reviews</a>, or a link to a specific questionnaire)',
            reviewEndDatePR:
                'It <span class="rfc2119">must</span> include the end date of the review period.',
            recRelation:
                'It <span class="rfc2119">must</span> indicate that it rescinds a Recommendation and <span class="rfc2119">must</span> link to the most recent Recommendation (if any) having the same major revision number.',
            altTechno:
                'It <span class="rfc2119">should</span> direct readers to alternative technologies.',
        },
    },
    'document-body': {
        name: '7. Document Body',
        rules: {
            headingWithoutID:
                '<span class="subset">recursive</span> Every marked-up section and subsection of the document <span class="rfc2119">must</span> have a target anchor. A section is identified by a heading element (<code>h1</code>-<code>h6</code>). The anchor may be specified using an <code>id</code> (or <code>name</code> if an <code>a</code> element is used) attribute on any of the following: the heading element itself, the parent <code>div</code> or <code>section</code> element of the heading element (where the heading element is the first child of the <code>div</code> or <code>section</code>), a descendant of the heading element, or an <code>a</code> immediately preceding the heading element.',
            brokenLink:
                'The document <span class="rfc2119">must not</span> have any broken internal links or broken links to other resources at w3.org. The document <span class="rfc2119">should not</span> have any other broken links.',
            cssValid:
                '<span class="subset">recursive</span> The document <span class="rfc2119">must not</span> have any style sheet errors.',
            namespaces:
                '<span class="subset">recursive</span> All proposed <a href="https://www.w3.org/TR/xml-names11/">XML namespaces</a> created by the publication of the document <span class="rfc2119">must</span> follow <cite> <a href="https://www.w3.org/2005/07/13-nsuri">URIs for W3C Namespaces</a> </cite>.',
            wcag: 'The document(s) <span class="rfc2119">must</span> conform to the <a href="https://www.w3.org/TR/WCAG22/">Web Content Accessibility Guidelines 2.2</a>, Level AA. <strong>Note:</strong> You may wish to consult the <a href="https://www.w3.org/WAI/WCAG22/quickref/">customizable quick reference to Web Content Accessibility Guidelines 2.2</a>.',
            securityAndPrivacy:
                'The document <span class="rfc2119">should</span> have a <a href="https://www.w3.org/TR/security-privacy-questionnaire/">security and privacy considerations</a> section.',
            fixupJs:
                'The document <span class="rfc2119">must</span> include the script <code><a href="https://www.w3.org/scripts/TR/2021/fixup.js">fixup.js</a></code>.<p><span style="font-style: italic">Include this source code:</span><br/><code>&lt;script src="//www.w3.org/scripts/TR/2021/fixup.js" type="application/javascript"&gt;&lt;/script&gt;</code></p>',
        },
    },
    compound: {
        name: '8. Compound Documents',
        rules: {
            compoundFilesLocation:
                'If the document is compound (i.e., if it consists of more than one file), all the files <span class="rfc2119">must</span> be under a directory /TR/YYYY/@{param1}-shortname-YYYYMMDD/. Exceptions are resources under these paths:<ol><li>https://www.w3.org/StyleSheets/</li><li>https://www.w3.org/scripts/</li></ol>',
            compoundOverview:
                'The main page <span class="rfc2119">should</span> be called Overview.html.',
            compound:
                'All other files <span class="rfc2119">must</span> be reachable by links from the document.',
        },
    },
    'rec-edit-install': {
        name: '1. Install the document.',
        rules: {
            install:
                '(if new dated version) Copy the original REC in /TR into a new dated <code>&lt;new date&gt;</code> directory in /TR',
        },
    },
    'rec-edit-stylesheet': {
        name: '2. Use the corresponding stylesheet',
        rules: {
            stylesheet:
                "For the W3C stylesheet, use the @{param1} version of the W3C stylesheet in use in the REC (old, or 2021). So, it's one of:<ol><li>https://www.w3.org/StyleSheets/TR/W3C-@{param1}.css</li><li>https://www.w3.org/StyleSheets/TR/2021/W3C-@{param1}.css</li><li>or reuse the (some?) content from https://www.w3.org/TR/html50/superseded.css as needed</li></ol>",
        },
    },
    'rec-edit-w3c-state': {
        name: '3. Change the title of the document',
        rules: {
            'w3c-state':
                'In the <code>&lt;p id="w3c-state"&gt;</code> element containing the state and date ("W3C Recommendation DD Month YYYY"), add:<ol><li id=\'testtest\'>a <code>&lt;br&gt;</code> element after the original date</li><li>and "@{param1} <code>&lt;new date&gt;</code>" when the @{param1} document gets published by the webmaster</li></ol>',
        },
    },
    'rec-edit-version': {
        name: '4. Set the "This version" link',
        rules: {
            version:
                '(if new dated version) This version link gets the form https://www.w3.org/TR/YYYY/@{param1}-&lt;shortname-with-version&gt;-&lt;newdate&gt;/',
        },
    },
    'rec-edit-previous': {
        name: '5. Set the "Previous version" link',
        rules: {
            previous:
                '(if new dated version) Previous version becomes the dated link of the REC being @{param1}',
        },
    },
    'rec-edit-sotd': {
        name: '6. Change the "status of this document" section',
        rules: {
            sotd: 'The SOTD gets updated as follows:<ul><li>6.1. add the following markup (update link to proper Process version if needed):<pre><code>&lt;p&gt;This specification is a &lt;a href="https://www.w3.org/policies/process/20250818/#rec-rescind"&gt;@{param1} Recommendation&lt;/a&gt;. A newer specification exists that is recommended for new adoption in place of this specification. &lt;/p&gt;</code></pre></li><li>6.2. Make sure to update or remove the sentence indicating that the document "is a Recommendation" if one appears.</li><li>6.3. Remove the following paragraph:<pre><code>&lt;p&gt;This document has been reviewed by W3C Members, by software developers, and by other W3C groups and interested parties, and is endorsed by the Director as a W3C Recommendation. It is a stable document and may be used as reference material or cited from another document. W3C\'s role in making the Recommendation is to draw attention to the specification and to promote its widespread deployment. This enhances the functionality and interoperability of the Web.&lt;/p&gt;</code></pre></li><li>6.4. ... and replace it with (update the @@ as needed):<br><pre><code>&lt;p&gt;For purposes of the W3C Patent Policy, this @{param1} Recommendation  has the same status as an active Recommendation; it retains licensing  commitments and remains available as a reference for old -- and  possibly still deployed -- implementations, but is not recommended for future implementation. New implementations should follow the <code>&lt;a href=\'@@\'&gt;</code>latest version<code>&lt;/a&gt;</code> of the @@ specification.&lt;/p&gt;</code></pre></li><li>6.5. <strong>DO NOT TOUCH THE PATENT POLICY PARAGRAPH.</strong> The document is still governed by IP commitments even if it is @{param2} (as described in the paragraph you added in the previous step).</li><li>6.6. Look at the resulting SOTD, make sure it makes sense and "modify as needed". In other words, if you need to add more explanations about why the document was @{param2}, feel free to do so by adding to the first paragraph introduced by 6.1. The Director may ask to add or modify specific wordings as well. Just remember to keep the time spent as minimal since our goal is to minimize the time spent @{param3} documents, so don\'t overdo it.@{param4}</li></li></ul>',
        },
    },
} satisfies Record<string, GenericRulesSection>;
