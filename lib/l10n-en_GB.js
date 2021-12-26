/* eslint-disable no-template-curly-in-string  */
exports.messages = {
    // Generic
    'generic.sotd.not-found':
        'No <em>&ldquo;status of this document&rdquo;</em> section found. Some errors related to this one will be omitted from the output, but most likely this will cause further problems along the line.',
    // headers/logo
    'headers.logo.not-found':
        'Failed to include logo in link with absolute URLs.',
    // headers/subm-logo
    'headers.subm-logo.not-found':
        'Failed to include logo in link with absolute URLs for ${type} Submission.',
    // headers/hr
    'headers.hr.not-found':
        'No <code>&lt;hr&gt;</code> at the end of, or right after, <code>div.head</code>.',
    'headers.hr.duplicate':
        'Duplicate <code>&lt;hr&gt;</code> at the end of, and right after, <code>div.head</code>.',
    // headers/w3c-state
    'headers.w3c-state.no-w3c-state':
        'Cannot find the <code>&lt;p id="w3c-state"&gt;</code> element for profile and date.<br><br>Please make sure the <code>&lt;p id="w3c-state"&gt;<a href="https://www.w3.org/standards/types#@@Profile">W3C @@Profile</a>, DD Month Year&lt;/p&gt;</code> element can be selected by <code>document.getElementById("w3c-state")</code>; <br>If you are using bikeshed, please update to the latest version.',
    'headers.w3c-state.bad-w3c-state':
        'Incorrect w3c status element, <code>&lt;p id="w3c-state"&gt;</code>. <code>&lt;p id="w3c-state"&gt;<a href="https://www.w3.org/standards/types#@@Profile">W3C @@Profile</a>, DD Month Year&lt;/p&gt;</code>.',
    'headers.w3c-state.no-w3c-state-link':
        'Cannot find the link of the W3C profile in id="w3c-state" element pointing to "https://www.w3.org/standards/types#xx".',
    'headers.w3c-state.wrong-w3c-state-link':
        'The link for text "${text}" should pointing to W3C profile "${expectedLink}", but the link found in the document is "${linkFound}".',
    // headers/h2-toc
    'headers.h2-toc.not-found':
        'There is no table of contents inside a navigation element (<code>&lt;nav id="toc"&gt; &hellip; &lt;h2&gt;Table of Contents&lt;/h2&gt; &hellip; &lt;/nav&gt;</code>).',
    'headers.h2-toc.too-many':
        'Found more than one navigation elements; possibly containing the table of contents. There should be just one <code>&lt;nav id="toc"&gt;</code>.',
    'headers.h2-toc.not-html5':
        'Support for old HTML doctypes is deprecated and will be abandoned soon; please upgrade to HTML5. The expected navigation element is: <code>&lt;nav id="toc"&gt;</code>.',
    'headers.h2-toc.mixed':
        'The expected navigation element is: <code>&lt;nav id="toc"&gt;</code>; remove older versions like <code>&lt;div id="toc"&gt;</code>.',
    // headers/ol-toc
    'headers.ol-toc.not-found':
        'The TOC should be an <code>&lt;ol class="toc"&gt;</code> inside the main navigation element (<code>&lt;nav id="toc"&gt;</code>).',
    // headers/details-summary
    'headers.details-summary.no-details':
        'Cannot find the &lt;details&gt; element in the header of the document.',
    'headers.details-summary.no-details-open':
        'The &lt;details&gt; element in the header should have attribute "open".',
    'headers.details-summary.no-details-dl':
        'Cannot find the &lt;dl&gt; in headers &lt;details&gt; element of the document.',
    'headers.details-summary.no-details-summary':
        'Cannot find the &lt;summary&gt; in headers &lt;details&gt; element of the document.',
    'headers.details-summary.wrong-summary-text':
        'Wrong text in the &lt;summary&gt; element in headers.',
    // headers/secno
    'headers.secno.not-found':
        'Please consider wrapping section numbers (in the TOC and in headings) with <code>&lt;span class="secno"&gt;</code> or <code>&lt;bdi class="secno"&gt;</code>.',
    // headers/h1-title
    'headers.h1-title.not-found': 'Cannot find title or h1 of the document.',
    'headers.h1-title.not-match':
        "Content of title and h1 do not match. Text of title is '${titleText}' while h1 is (transformed into) '${h1Text}'.",
    // headers/dl
    'headers.dl.this-version': 'This Version is missing.',
    'headers.dl.latest-version': 'Latest Version is missing.',
    'headers.dl.no-history': 'History link is missing.',
    'headers.dl.this-latest-order':
        'This Version must be before Latest Version.',
    'headers.dl.not-found':
        'Cannot find the &lt;a&gt; tag or link for ${linkName}.',
    'headers.dl.link-diff':
        '${linkName}: Link href and text differ. Link href is `${href}` while text is `${text}`.',
    'headers.dl.this-date':
        'Mismatch between document date and This Version link.',
    'headers.dl.no-date': 'Cannot find document date.',
    'headers.dl.this-syntax': 'Wrong syntax for This Version link.',
    'headers.dl.this-latest-shortname':
        '<em>Shortnames</em> differ between This version (${thisShortname}) and Latest Versions (${latestShortname}).',
    'headers.dl.latest-syntax': 'Wrong syntax for Latest Version link.',
    'headers.dl.this-previous-shortname':
        '<em>Shortnames</em> differ between This version (${thisShortname}) and Previous Versions (${previousShortname}).',
    'headers.dl.history-syntax':
        'Wrong syntax for History link, please use the link "https://www.w3.org/standards/history/${shortname}".',
    'headers.dl.history-bad-previous':
        'This document contains a shortname change with previous shortname "${previousShortname}", but the it seems be not correct because "${url}" doesn\'t exist.',
    'headers.dl.rescinds': 'Rescinds this Recommendation is missing.',
    'headers.dl.rescinds-not-needed':
        'Rescinds this Recommendation is included but does not seem necessary.',
    'headers.dl.latest-rescinds-order':
        'Latest Version must be before Rescinds this Recommendation.',
    'headers.dl.this-rescinds-shortname':
        '<em>Shortnames</em> differ between This Version (${thisShortname}) and Rescinds this Recommendation (${rescindsShortname}).',
    'headers.dl.rescinds-syntax':
        'Wrong syntax for Rescinds this Recommendation link.',
    'headers.dl.obsoletes': 'Obsoletes this Recommendation is missing.',
    'headers.dl.obsoletes-not-needed':
        'Obsoletes this Recommendation is included but does not seem necessary.',
    'headers.dl.latest-obsoletes-order':
        'Latest Version must be before Obsoletes this Recommendation.',
    'headers.dl.this-obsoletes-shortname':
        '<em>Shortnames</em> differ between This Version and Obsoletes this Recommendation.',
    'headers.dl.obsoletes-syntax':
        'Wrong syntax for Obsoletes this Recommendation link.',
    'headers.dl.supersedes': 'Supersedes this Recommendation is missing.',
    'headers.dl.supersedes-not-needed':
        'Supersedes this Recommendation is included but does not seem necessary.',
    'headers.dl.latest-supersedes-order':
        'Latest Version must be before Supersedes this Recommendation.',
    'headers.dl.this-supersedes-shortname':
        '<em>Shortnames</em> differ between This Version (${thisShortname}) and Supersedes this Recommendation (${obsoletesShortname}).',
    'headers.dl.supersedes-syntax':
        'Wrong syntax for Supersedes this Recommendation link.',
    'headers.dl.implelink-should-be-https':
        'Implementation report link should start with <em>https://</em>, current link in <code>&lt;dl&gt;</code> is: `${link}`.',
    'headers.dl.implelink-confirm-no':
        "Pubrules found 'There is no preliminary implementation report.' sentence in the 'Status of this Document' section, please confirm the implementation link is not needed.",
    'headers.dl.editors-draft-should-be-https':
        "Editor's draft link should start with <em>https://</em>, current link is: `${link}`.",
    'headers.dl.editor-not-found': 'Cannot find any editors for this document.',
    'headers.dl.editor-missing-id':
        'Missing `data-editor-id` attribute for editor(s): ${names}.',
    // headers/errata
    'headers.errata.no-errata':
        '"Errata:" not found in the headers (&lt;div class="head"&gt;) of the document.',
    // headers/div-head
    'headers.div-head.not-found': 'No div.head found.',
    // headers/copyright
    'headers.copyright.no-match':
        'Copyright string does not match requirements. The string should match <blockquote class="boilerplate">${rex}</blockquote>',
    'headers.copyright.no-link': "Missing link with text '${text}'.",
    'headers.copyright.href-not-match':
        "The link for text '${text}' is expected to be '${expected}', but found '${hrefInDoc}' in document.",
    'headers.copyright.not-found': 'Missing copyright paragraph.',
    'headers.copyright.no-data-from-API':
        'Could not get the document license from the API. Please make sure this group has a current charter associated with at least one document license.',
    'headers.copyright.no-license-found-joint':
        "This document is published by multiple groups, but these groups don't use the same document license. Please ask the team contact for help.",
    'headers.copyright.no-license-found':
        'Pubrules fails to find the document license in the group charter. Please ask the team contact for help.',
    'headers.memsub-copyright.not-found':
        'Missing link to the W3C document notice (https://www.w3.org/Consortium/Legal/copyright-documents).',
    // headers/github-repo
    'headers.github-repo.no-feedback':
        'Cannot find the "Feedback" &lt;dt&gt; in the headers of the document.',
    'headers.github-repo.no-repo':
        'No GitHub repository issue link. The link is expected to be of the form <code>https://github.com/&lt;USER_OR_ORG&gt;/&lt;REPO_NAME&gt;/issues[/&hellip;]</code>.',
    // links/internal
    'links.internal.anchor': "Link to missing anchor: '${id}'.",
    // links/linkchecker
    'links.linkchecker.display':
        'Please verify using <a href="https://validator.w3.org/checklink?uri=${link}&recursive=on">Link Checker</a>.',
    'links.linkchecker.not-same-folder':
        'This resource or link found in document (${url}) is not in the same folder as the document (${base}). Please install them in the same folder.',
    'links.linkchecker.response-error':
        'This resource or link found in document (${url}) is not responding ok (${status} ${text}). Please install it correctly.',
    'links.linkchecker.response-error-with-redirect':
        'This resource or link found in document (${originUrl}), redirecting to ${url}, is not responding ok (${status} ${text}). Please install it correctly.',
    // links/compound
    'links.compound.skipped':
        'HTML and CSS validations for compound documents were skipped. ',
    'links.compound.no-validation':
        'Validation of <a href="${link}">${file}</a> <a href="https://validator.w3.org/nu/doc=${link}">HTML</a>.',
    'links.compound.link':
        'Validation of <a href="${link}">${file}</a> <a href="https://validator.w3.org/nu/doc=${link}">HTML ${markup}</a>.',
    'links.compound.error':
        'Validation of <a href="${link}">${file}</a> <a href="https://validator.w3.org/nu/doc=${link}">HTML</a>: ${errMsg}.',
    'links.compound.html-timeout': 'The HTML validator timed out.',
    'links.reliability.unreliable-link':
        'Link for <em>"${text}"</em> is pointing to unreliable domain or legacy service <em>"${link}"</em>.',
    // sotd/supersedable
    'sotd.supersedable.no-sotd-intro':
        'No <em>&ldquo;status of this document&rdquo;</em> introduction (eg absent, not using HTTPS, wrong copy).',
    'sotd.supersedable.no-sotd-tr':
        'No <em>&ldquo;status of this document&rdquo;</em> introduction link to TR (or perhaps not using HTTPS).',
    // sotd/deployment
    'sotd.deployment.not-found':
        'Cannot find the paragraph regarding deployment in the Status of This Document.',
    // sotd/usage
    'sotd.usage.not-found':
        'Cannot find the paragraph regarding usage in the Status of This Document.',
    // sotd/submission
    'sotd.submission.no-submission-text': 'No member submission paragraph.',
    'sotd.submission.link-text': "Missing link '${href}' with text '${text}'.",
    'sotd.submission.no-sm-link':
        "Missing link 'https://www.w3.org/Submission/...' with text 'Submitting Members'.",
    'sotd.submission.no-tc-link':
        "Missing link 'https://www.w3.org/Submission/...' with text 'W3C Team Comment'.",
    // sotd/stability
    'sotd.stability.no-stability':
        'No stability warning paragraph. Expected text: <blockquote>${expected}</blockquote>',
    'sotd.stability.no-rec-review':
        'No indication that the Recommendation is endorsed by W3C and its Members.',
    'sotd.stability.no-cr-review':
        'No wide review link for Candidate Recommendation',
    'sotd.stability.wrong-cr-review-link':
        "Wrong wide review link for Candidate Recommendation, link should be 'https://www.w3.org/2021/Process-20211102/#dfn-wide-review'",
    'sotd.stability.no-licensing-link':
        "Wrong royalty-free licensing link for CR and REC, link should be ${licensingLink} with text '${licensingText}'",
    // sotd/review-end
    'sotd.review-end.not-found': 'No review end date found.',
    'sotd.review-end.found': 'Review end date found: ${date}',
    // sotd/candidate-review-end
    'sotd.candidate-review-end.not-found':
        'No minimal review end for candidate document date found.',
    'sotd.candidate-review-end.multiple-found':
        'Multiple feedback due dates for candidate document found. Choosing the closest date.',
    'sotd.candidate-review-end.found-not-valid':
        'Feedback due date detected: ${date}, but not valid: minimum review period is 28 days after publication.',
    'sotd.candidate-review-end.date-found':
        'Feedback due date detected: ${date}',
    'sotd.candidate-review-end.editorial':
        'Skip review end date check for CR updates with editorial changes.',
    // sotd/draft-stability
    'sotd.draft-stability.not-found':
        'No stability paragraph found. Expected the following sentence: <blockquote>${expected}</blockquote>',
    'sotd.draft-stability.not-found-either':
        'No stability paragraph found. Expected one of the 2 following sentences: <blockquote>${expected1}<br>or<br>${expected2}</blockquote>',
    // sotd/pp
    'sotd.pp.no-pp':
        'Required patent policy paragraph not found. Expected text related to patent policy requirements: <blockquote>${expected}</blockquote>',
    'sotd.pp.no-pp-from-charter':
        'Cannot find the patent policy version from the groups charter. Please make sure the group has a current charter with a patent policy',
    'sotd.pp.no-pp-link':
        'Required patent policy link not found. Expected text related to patent policy requirements: <blockquote>${expected}</blockquote>',
    'sotd.pp.undefined':
        "Could not determine the patent policy the WG is operating under. Check the WG's charter.",
    'sotd.pp.no-pp2017':
        'The WG is operating under the patent policy 2017 but the document mentions a different one, please check the text as well as the link.',
    'sotd.pp.no-pp2020':
        'The WG is operating under the patent policy 2020 but the document mentions a different one, please check the text as well as the link.',
    'sotd.pp.no-disclosures':
        'No valid HTTPS link to public list of disclosures (<code>https://www.w3.org/2004/01/pp-impl/NNNNN/status</code>).',
    'sotd.pp.no-claims':
        'No valid HTTPS link to definition of essential claims (<code>${link}</code>).',
    'sotd.pp.no-section6':
        'No valid HTTPS link to the Disclosure section of the patent policy (<code>${link}</code>).',
    'sotd.pp.joint-publication': 'Joint publication detected.',
    'sotd.pp.joint-different-pp':
        'This document is published by multiple groups operating under different versions of the Patent Policy. A document should be published under one and only one Patent Policy, to which all participants in contributing groups have agreed.',
    'sotd.pp.wrong-pp-from-charter':
        'The Working Group delivering the document operates under the patent policy "${pp_charter}", but the check is against "${pp_config}". Please select the right patent policy to match the charter\'s version.',
    // sotd/charter
    'sotd.charter.no-group':
        'Unable to find the group(s) ID(s) (in the <code>data-deliverer</code> attribute for Note-Track documents, and in the "Status of This Document" for REC-Track documents).',
    'sotd.charter.text-not-found':
        'No texts about charter for disclosure obligations found.',
    'sotd.charter.link-not-found':
        'No link to charter for disclosure obligations found.',
    'sotd.charter.wrong-link':
        "The link to charter for disclosure obligations should be <a href='${expectedHref}'>${expectedHref}</a>.",
    'sotd.charter.no-charter':
        'The group does not have any current charter, please contact the team contact.',
    // sotd/rec-addition
    'sotd.rec-addition.no-section':
        'This document contains ${typeOfChange}, cannot find corresponding paragraph <code>&lt;p class="${sectionClass}"&gt;${expectText}&lt;/p&gt;</code>',
    'sotd.rec-addition.wrong-text':
        "This document contains ${typeOfChange}. The text in 'p.${sectionClass}' paragraph should be <code>${expectText}</code>",
    'sotd.rec-addition.unnecessary-section':
        'This document doesn\'t contain ${typeOfChange}, paragraph <code>&lt;p class="${sectionClass}"&gt;${expectText}&lt;/p&gt;</code> should be removed.',
    // sotd/publish
    'sotd.publish.not-found':
        'Cannot find the paragraph introducing document type and publisher in Status of This Document. It should match regular expression: <code>${publishReg}</code>',
    'sotd.publish.url-text-not-found':
        'Cannot find text "${text}" in publisher paragraph in Status of This Document. The right link is: <code>&lt;a href="${url}"&gt;${text}&lt;/a&gt;</code>',
    'sotd.publish.url-not-match':
        'The link for "${text}" in publisher paragraph in the Status of This Document is not correct. The right link is: <code>&lt;a href="${url}"&gt;${text}&lt;/a&gt;</code>',
    'sotd.publish.no-homepage-link':
        'The homepage ${homepage} should appear in the <em>&ldquo;status of this document&rdquo;</em>',
    // sotd/rec-comment-end
    'sotd.rec-comment-end.not-found':
        'This W3C Recommendation has substantive changes or new features, cannot find comment end date no earlier than ${minimumEndDate}.',
    'sotd.rec-comment-end.multi-found':
        'This W3C Recommendation has substantive changes or new features, multiple dates no earlier than ${minimumEndDate} were found: ${date}.',
    // 'sotd.group-homepage.no-key': `This instance of Pubrules is missing a valid <a href="https://w3c.github.io/w3c-api/#apikeys">key
    //     for the W3C API</a>; contact <a href="mailto:sysreq@w3.org"><code>sysreq@w3.org</code></a> for help.`,
    // sotd/process-document
    'sotd.process-document.multiple-times':
        'The governing process statement has been found multiple times.',
    'sotd.process-document.not-found':
        'The document must mention the governing process: ${process}',
    'sotd.process-document.wrong-link':
        'The link to the process rules specified in the document is erroneous.',
    'sotd.process-document.wrong-process':
        "The document doesn't specify the right governing process: ${process}.",
    // sotd/ac-review
    'sotd.ac-review.found':
        'Found a link to an online questionnaire: ${link}. Does this link provide access to the review form?',
    'sotd.ac-review.not-found':
        'Did not find information about a forum for AC Representative feedback.',
    // sotd/diff
    'sotd.diff.note': false,
    // sotd/rescind
    'sotd.obsl-rescind.no-rationale': 'No rationale section found.',
    'sotd.obsl-rescind.no-explanation-link':
        'Link to "explanation of Obsoleting and Rescinding W3C Specifications" not found.',
    // sotd/delivererNote
    'sotd.deliverer-note.not-found':
        'Deliverer not found. An attribute <code>data-deliverer</code> must be in the SotD',
    // sotd/new-features
    'sotd.new-features.no-link':
        'The paragraph on future updates to the recommendation should include a link to the new features: https://www.w3.org/2021/Process-20211102/#allow-new-features',
    'sotd.new-features.no-warning':
        "<strong style='font-size: 20px;'>If it is the intention to incorporate new features in future updates of the Recommendation, please make sure to identify the document as intending to allow new features.</strong>",
    // structure/canonical
    'structure.canonical.not-found': 'No canonical link found.',
    // structure/name
    'structure.name.wrong':
        'The main page should be called <code>Overview.html</code>${note}.',
    // structure/section-ids
    'structure.section-ids.no-id': "No ID for section: '${text}'.",
    // structure/security-privacy
    'structure.security-privacy.no-security-privacy':
        'No security and privacy considerations section found.',
    'structure.security-privacy.no-security':
        'No security considerations section found.',
    'structure.security-privacy.no-privacy':
        'No privacy considerations section found.',
    // structure/h2
    'structure.h2.abstract':
        'First <code>&lt;h2&gt;</code> after <code>div.head</code> must be &ldquo;Abstract&rdquo;, but was &ldquo;${was}&rdquo;.',
    'structure.h2.sotd':
        'Second <code>&lt;h2&gt;</code> after <code>div.head</code> must be &ldquo;status of this document&rdquo;, but was &ldquo;${was}&rdquo;.',
    'structure.h2.toc':
        'Third <code>&lt;h2&gt;</code> after <code>div.head</code> must be &ldquo;Table of Contents&rdquo;, but was &ldquo;${was}&rdquo;.',
    // structure/display-only
    'structure.display-only.customised-paragraph': false,
    'structure.display-only.known-disclosures': false,
    'structure.display-only.visual-style':
        'Visual styles <strong>should not</strong> vary significantly among normative alternatives.',
    'structure.display-only.alt-representation':
        'Authors <strong>may</strong> provide links to alternative (non-normative) representations or packages for the document. For instance: <br><code>&lt;p&gt;This document is also available in these non-normative formats: &lt;a href="WD-shortname-20020101.html"&gt;single HTML file&lt;/a&gt;, &lt;a href="WD-shortname-20020101.tgz"&gt;gzipped tar file of HTML&lt;/a&gt;.&lt;/p&gt;</code>',
    'structure.display-only.normative-representation':
        'At least one normative representation <strong>must</strong> be available for requests that use the "This Version" URI. More than one normative representation <strong>may</strong> be delivered in response to such requests. A "This Version" URI <strong>MUST NOT</strong> be used to identify a non-normative representation.',

    'structure.display-only.special-box-markup':
        'Remember to use classes <code>example</code>, <code>def</code>, <code>note</code> and <code>marker</code>, and <a href="https://fantasai.inkedblade.net/style/design/w3c-restyle/2016/sample#boxes">other special box markup</a>.',
    'structure.display-only.index-list-tables':
        'Remember to use class <code>index</code> for <a href="https://fantasai.inkedblade.net/style/design/w3c-restyle/2016/sample#indexing">index lists and tables</a>.',
    'structure.display-only.fit-in-a4':
        'Make sure spec illustrations/tables fit within an A4 sheet of paper when printed; use class <code>overlarge</code> if needed to improve experience on-screen for things that overflow.',
    // structure/neutral
    'structure.neutral.neutral':
        'Please make sure the expressions in document are neutral, "${words}" found in document. Check <a href="https://w3c.github.io/manual-of-style/#inclusive">W3C Manual of Style</a> for more information.',
    // style/sheet
    'style.sheet.last': 'W3C TR style sheet must be last.',
    'style.sheet.not-found': 'Missing W3C TR style sheet "${url}".',
    // style/meta
    'style.meta.not-found':
        'The viewport meta tag is required (<code>&lt;meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"&gt;</code>).',
    // style/script
    'style.script.not-found':
        'A link to the script <code>fixup.js</code> is required (eg, <code>&lt;script src="//www.w3.org/scripts/TR/2021/fixup.js"&gt;&lt;/script&gt;</code>).',
    // style/back-to-top
    'style.back-to-top.not-found':
        'It is recommended to include this <em>back-to-top</em> hyperlink at the end of <code>&lt;body&gt;</code>: <code>&lt;p role="navigation" id="back-to-top"&gt;&lt;a href="#title"&gt;&lt;abbr title="Back to top"&gt;&uarr;&lt;/abbr&gt;&lt;/a&gt;&lt;/p&gt;</code>.',
    // style/body-toc-sidebar
    'style.body-toc-sidebar.class-found':
        'The class <code>toc-sidebar</code> should be added by <code>fixup.js</code>.',
    'style.body-toc-sidebar.selector-fail':
        'Selector <code>body</code> failed.',
    // validation/html
    'validation.html.skipped': 'HTML validation was skipped.',
    'validation.html.no-source': 'No HTML source to validate.',
    'validation.html.failure': 'Failure code from HTML validator: ${status}.',
    'validation.html.no-response': 'No response from HTML validator.',
    'validation.html.error':
        '[${line}@${column}] ${message}<br><a href="${link}">HTML validator</a>',
    'validation.html.warning':
        '${message}<br><a href="${link}">HTML validator</a>',
    'validation.html.non-document-error': '[${subType}] ${message}',
    'validation.html.timeout': 'The HTML validator timed out.',
    // validation/wcag
    'validation.wcag.tools':
        "Please verify using <a href='https://www.w3.org/WAI/ER/existingtools.html'>Accessibility Evaluation and Repair Services</a>.",
    // heuristic/date-format
    'heuristic.date-format.wrong':
        'This date found on a boilerplate section of the document does not have the expected format (<code>DD Month YYYY</code>, with an optional leading zero in the day): <em>&ldquo;${text}&rdquo;</em>.',
    // Echidna
    'echidna.todays-date.wrong-date':
        'The publication date of this document must be set to today (UTC).',
    'echidna.todays-date.date-not-detected':
        'Could not find a publication date in the document.',
    // Metadata:
    'metadata.deliverers': false,
    'metadata.dl.latest-not-found':
        'Metadata extraction could not find the latest version link.',
    'metadata.docDate': false,
    'metadata.editor-ids': false,
    'metadata.editor-names': false,
    'metadata.informative': false,
    'metadata.process': false,
    'metadata.profile': false,
    'metadata.title': false,
    'metadata.errata': false,
    'metadata.patent-policy': false,
    'metadata.charters': false,
};
