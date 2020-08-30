exports.messages = {
    // dummy/h2-foo
    "dummy.h2-foo.not-found":   "Selector h2.foo not found."
    // dummy/h1
,   "dummy.h1.not-found":       "Selector h1 not found."
    // dummy/dahut
,   "dummy.dahut.not-found":    "No element containing DAHUT."
    // Generic
,   'generic.sotd.not-found': 'No <em>&ldquo;status of this document&rdquo;</em> section found. Some errors related to this one will be omitted from the output, but most likely this will cause further problems along the line.'
    // headers/title
,   "headers.title.not-found":  "Document does not have a title."
    // headers/logo
,   "headers.logo.not-found":   "Failed to include logo in link with absolute URLs."
    // headers/subm-logo
,   "headers.subm-logo.not-found":  "Failed to include logo in link with absolute URLs for ${type} Submission."
    // headers/hr
,   "headers.hr.not-found":     "No <code>&lt;hr&gt;</code> at the end of, or right after, <code>div.head</code>."
,   "headers.hr.duplicate":     "Duplicate <code>&lt;hr&gt;</code> at the end of, and right after, <code>div.head</code>."
    // headers/h2-status
,   "headers.h2-status.no-h2":  "No status+date h2 element."
,   "headers.h2-status.bad-h2": "Incorrect status h2 header."
    // headers/h2-toc
,   'headers.h2-toc.not-found': 'There is no table of contents inside a navigation element (<code>&lt;nav id="toc"&gt; &hellip; &lt;h2&gt;Table of Contents&lt;/h2&gt; &hellip; &lt;/nav&gt;</code>).'
,   'headers.h2-toc.too-many':  'Found more than one navigation elements; possibly containing the table of contents. There should be just one <code>&lt;nav id="toc"&gt;</code>.'
,   'headers.h2-toc.not-html5': 'Support for old HTML doctypes is deprecated and will be abandoned soon; please upgrade to HTML5. The expected navigation element is: <code>&lt;nav id="toc"&gt;</code>.'
,   'headers.h2-toc.mixed':     'The expected navigation element is: <code>&lt;nav id="toc"&gt;</code>; remove older versions like <code>&lt;div id="toc"&gt;</code>.'
    // headers/ol-toc
,   'headers.ol-toc.not-found':  'The TOC should be an <code>&lt;ol class="toc"&gt;</code> inside the main navigation element (<code>&lt;nav id="toc"&gt;</code>).'
    // headers/secno
,   'headers.secno.not-found':  'Please consider wrapping section numbers (in the TOC and in headings) with <code>&lt;span class="secno"&gt;</code>.'
    // headers/h1-title
,   "headers.h1-title.title":   "Content of title and h1 do not match."
    // headers/dl
,   "headers.dl.this-version":              "This Version is missing."
,   "headers.dl.latest-version":            "Latest Version is missing."
,   "headers.dl.previous-version":          "Previous Version is missing."
,   "headers.dl.previous-not-needed":       "Previous Version is included but does not seem necessary."
,   "headers.dl.this-latest-order":         "This Version must be before Latest Version."
,   "headers.dl.latest-previous-order":     "Latest Version must be before Previous Version."
,   "headers.dl.this-link":                 "Link href and text differ for This Version."
,   "headers.dl.this-date":                 "Mismatch between document date and This Version link."
,   "headers.dl.no-date":                   "Cannot find document date."
,   "headers.dl.this-syntax":               "Wrong syntax for This Version link."
,   "headers.dl.latest-link":               "Link href and text differ for Latest Version."
,   "headers.dl.this-latest-shortname":     "<em>Shortnames</em> differ between This and Latest Versions."
,   "headers.dl.latest-syntax":             "Wrong syntax for Latest Version link."
,   "headers.dl.previous-link":             "Link href and text differ for Previous Version."
,   "headers.dl.this-previous-shortname":   "<em>Shortnames</em> differ between This and Previous Versions."
,   "headers.dl.previous-syntax":           "Wrong syntax for Previous Version link (perhaps not using HTTPS)."
,   "headers.dl.rescinds":                  "Rescinds this Recommendation is missing."
,   "headers.dl.rescinds-not-needed":       "Rescinds this Recommendation is included but does not seem necessary."
,   "headers.dl.latest-rescinds-order":     "Latest Version must be before Rescinds this Recommendation."
,   "headers.dl.rescinds-link":             "Link href and text differ for Rescinds this Recommendation."
,   "headers.dl.this-rescinds-shortname":   "<em>Shortnames</em> differ between This Version and Rescinds this Recommendation."
,   "headers.dl.rescinds-syntax":           "Wrong syntax for Rescinds this Recommendation link."
,   "headers.dl.obsoletes":                 "Obsoletes this Recommendation is missing."
,   "headers.dl.obsoletes-not-needed":      "Obsoletes this Recommendation is included but does not seem necessary."
,   "headers.dl.latest-obsoletes-order":    "Latest Version must be before Obsoletes this Recommendation."
,   "headers.dl.obsoletes-link":            "Link href and text differ for Obsoletes this Recommendation."
,   "headers.dl.this-obsoletes-shortname":  "<em>Shortnames</em> differ between This Version and Obsoletes this Recommendation."
,   "headers.dl.obsoletes-syntax":          "Wrong syntax for Obsoletes this Recommendation link."
,   "headers.dl.supersedes":                "Supersedes this Recommendation is missing."
,   "headers.dl.supersedes-not-needed":     "Supersedes this Recommendation is included but does not seem necessary."
,   "headers.dl.latest-supersedes-order":   "Latest Version must be before Supersedes this Recommendation."
,   "headers.dl.supersedes-link":           "Link href and text differ for Supersedes this Recommendation."
,   "headers.dl.this-supersedes-shortname": "<em>Shortnames</em> differ between This Version and Supersedes this Recommendation."
,   "headers.dl.supersedes-syntax":         "Wrong syntax for Supersedes this Recommendation link."
,   "headers.dl.cant-retrieve":             "Could not retrieve URI for previous version or for latest version."
,   "headers.dl.latest-is-not-previous":    "Retrieved \"previous\" and \"latest\" documents, but their contents don't match."
,   "headers.dl.same-this-and-previous":    "\"This\" version and \"previous\" version have the same URL."
,   "headers.dl.same-day-publication":      "The document was already published today."
,   "headers.dl.implelink-should-be-https": "Implementation report link should start with <em>https://</em>, current link in <code>&lt;dl&gt;</code> is: `${link}`."
,   "headers.dl.editors-draft-should-be-https": "Editor's draft link should start with <em>https://</em>, current link is: `${link}`."
    // headers/errata
,   "headers.errata.not-found":             "Errata paragraph not found."
,   "headers.errata.link-should-be-https":         "Errata link should start with <em>https://</em>, current link is: `${link}`."
    // headers/div-head
,   "headers.div-head.not-found":           "No div.head found."
    // headers/copyright
,   "headers.copyright.no-match":           "Copyright string does not match requirements."
,   "headers.copyright.kitten-friendly":    "Using CC-BY kitten-friendly license."
,   "headers.copyright.link-text":          "Missing link '${href}' with text '${text}'."
,   "headers.copyright.not-found":          "Missing copyright paragraph."
,   'headers.memsub-copyright.not-found': 'Missing link to the W3C document notice (https://www.w3.org/Consortium/Legal/copyright-documents).'
    // links/internal
,   "links.internal.anchor":    "Link to missing anchor: '${id}'."
    // links/linkchecker
,   "links.linkchecker.display":      "Please verify using <a href=\"http://validator.w3.org/checklink?uri=${link}&recursive=on\">Link Checker</a>."
    // links/compound
,   "links.compound.skipped":           "HTML and CSS validations for compound documents were skipped. "
,   "links.compound.no-validation":     "Validation of <a href=\"${link}\">${file}</a> <a href=\"http://validator.w3.org/nu/doc=${link}\">HTML</a> <a href=\"http://jigsaw.w3.org/css-validator/validator?profile=css3svg&uri=${link}\">CSS</a>"
,   "links.compound.link":              "Validation of <a href=\"${link}\">${file}</a> <a href=\"http://validator.w3.org/nu/doc=${link}\">HTML ${markup}</a> <a href=\"http://jigsaw.w3.org/css-validator/validator?profile=css3svg&uri=${link}\">CSS ${css}</a>"
,   "links.compound.error":             "Validation of <a href=\"${link}\">${file}</a> <a href=\"http://validator.w3.org/nu/doc=${link}\">HTML</a> <a href=\"http://jigsaw.w3.org/css-validator/validator?profile=css3svg&uri=${link}\">CSS</a>: ${errMsg}"
,   "links.compound.html-timeout":      "The HTML validator timed out."
,   "links.compound.css-timeout":       "The CSS validator timed out."
    // sotd/supersedable
,   "sotd.supersedable.no-sotd-intro":  "No <em>&ldquo;status of this document&rdquo;</em> introduction (eg absent, not using HTTPS, wrong copy)."
,   "sotd.supersedable.no-sotd-tr":     "No <em>&ldquo;status of this document&rdquo;</em> introduction link to TR (or perhaps not using HTTPS)."
    // sotd/submission
,   "sotd.submission.no-submission-text":   "No member submission paragraph."
,   "sotd.submission.link-text":            "Missing link '${href}' with text '${text}'."
,   "sotd.submission.no-sm-link":           "Missing link 'http://www.w3.org/Submission/...' with text 'Submitting Members'."
,   "sotd.submission.no-tc-link":           "Missing link 'http://www.w3.org/Submission/...' with text 'W3C Team Comment'."
    // sotd/stability
,   "sotd.stability.no-stability":  "No stability warning paragraph."
,   "sotd.stability.no-rec-review": "No indication that the Director, developers, and interested parties have reviewed this Recommendation."
    // sotd/status
,   "sotd.status.no-mention":   "<em>&ldquo;status of this document&rdquo;</em> does not mention that this is a ${status}."
    // sotd/review-end
,   "sotd.review-end.not-found":    "No review end date found."
,   "sotd.review-end.found":        "Review end date found: ${date}"
    // sotd/cr-end
,   "sotd.cr-end.not-found":      "No minimal CR end date found."
,   "sotd.cr-end.multiple-found": "Multiple feedback due dates found. Choosing the closest date."
,   "sotd.cr-end.found-not-valid": "Feedback due date detected: ${date}, but not <a href='/doc/rules/?profile=CR#implEstimation'>valid</a>: minimum review period is 28 days after publication."
,   "sotd.cr-end.date-found":     "Feedback due date detected: ${date}"
,   "sotd.cr-end.editorial":      "Skip review end date check for CR updates with editorial changes."
    // sotd/pp
,   "sotd.pp.no-pp":             "Required patent policy paragraph not found."
,   "sotd.pp.no-aug1":           "No valid HTTPS link to the current patent policy (<code>https://www.w3.org/Consortium/Patent-Policy/</code>)."
,   "sotd.pp.no-disclosures":    "No valid HTTPS link to public list of disclosures (<code>https://www.w3.org/2004/01/pp-impl/NNNNN/status</code>)."
,   "sotd.pp.no-claims":         "No valid HTTPS link to definition of essential claims (<code>https://www.w3.org/Consortium/Patent-Policy/#def-essential</code>)."
,   "sotd.pp.no-section6":       "No valid HTTPS link to the Disclosure section of the patent policy (<code>https://www.w3.org/Consortium/Patent-Policy/#sec-Disclosure</code>)."
,   "sotd.pp.no-jan24":          "No valid link to 2002 Jan 24 patent policy (eg absent, or not using HTTPS)."
,   "sotd.pp.no-pp-transition":  "No valid link to PP transition procedure (eg absent, or not using HTTPS)."
,   "sotd.pp.joint-publication": "Joint publication detected."
,   "sotd.pp.expected-pp":       "Expected text related to patent policy requirements: <blockquote>${expected}</blockquote>"
,   "sotd.pp.deprecated":        "The patent policy link (${policy}) you are using is no longer allowed. Please use the undated link <code>https://www.w3.org/Consortium/Patent-Policy/</code>."
,   "sotd.pp.deprecatedAllowed": "The patent policy (${policy}) you are using is deprecated. Please use the undated link <code>https://www.w3.org/Consortium/Patent-Policy/</code>."
,   "sotd.pp.no-errata":         "No errata link was found in the patent policy section."
    // sotd/charter-disclosure
,   "sotd.charter-disclosure.no-group":       "Unable to find the deliverer id."
,   "sotd.charter-disclosure.text-not-found": "No texts about charter for disclosure obligations found."
,   "sotd.charter-disclosure.link-not-found": "No link to charter for disclosure obligations found."
,   "sotd.charter-disclosure.wrong-link":     "The link to charter for disclosure obligations should be <a href='${expectedHref}'>${expectedHref}</a>."
,   "sotd.charter-disclosure.no-response":    "The connection to the API failed: HTTP ${status}"
    // sotd/rec-addition
,   "sotd.rec-addition.no-correction":  "This document contains substantive changes, cannot find corresponding paragraph <code>&lt;p class=\"correction\"&gt;Proposed corrections are marked in the document.&lt;/p&gt;</code>"
,   "sotd.rec-addition.no-addition":    "This document contains new feature, cannot find corresponding paragraph <code>&lt;p class=\"addition\"&gt;Proposed additions are marked in the document.&lt;/p&gt;</code>"
,   "sotd.rec-addition.wrong-text":     "The text in '.${type}' paragraph should be <code>${CORRECTION}'</code>"
,   "sotd.rec-addition.unnecessary-correction": "This document doesn't contain substantive change, paragraph <code>&lt;p class=\"correction\"&gt;Proposed corrections are marked in the document.&lt;/p&gt;</code> should be removed."
,   "sotd.rec-addition.unnecessary-addition": "This document doesn't contain new feature, paragraph <code>&lt;p class=\"addition\"&gt;Proposed additions are marked in the document.&lt;/p&gt;</code> should be removed."
    // sotd/rec-intro
,   "sotd.rec-intro.not-found": "Cannot find introduction for W3C Recommendation."
    // sotd/cr-intro
,   "sotd.cr-intro.not-found": "Cannot find following paragraph in Status of This Document: <code>&lt;p&gt;${txt}&lt;/p&gt;</code>."
    // sotd/rec-comment-end
,   "sotd.rec-comment-end.not-found": "This W3C Recommendation has subtantive changes or new features, cannot find comment end date no earlier than ${minimumEndDate}."
,   "sotd.rec-comment-end.multi-found": "This W3C Recommendation has subtantive changes or new features, multiple dates no earlier than ${minimumEndDate} was found: ${date}."
    // sotd/mailing-list
,   "sotd.mailing-list.no-list":    "No mailing list link."
,   "sotd.mailing-list.no-sub":     "No mailing list subscription link."
,   "sotd.mailing-list.no-arch":    "No mailing list archives link."
,   "sotd.mailing-list.no-repo":    "No GitHub repository issue link. The link is expected to be of the form <code>https://github.com/&lt;USER_OR_ORG&gt;/&lt;REPO_NAME&gt;/issues[/&hellip;]</code>."
    // sotd/group-homepage
,   "sotd.group-homepage.no-response":  "The connection to the API failed: HTTP ${status}"
,   "sotd.group-homepage.no-homepage":  "The homepage ${homepage} should appear in the <em>&ldquo;status of this document&rdquo;</em>"
,   "sotd.group-homepage.no-group":     "Unable to find the deliverer"
,   "sotd.group-homepage.no-key":       `This instance of Pubrules is missing a valid <a href="https://w3c.github.io/w3c-api/#apikeys">key
        for the W3C API</a>; contact <a href="mailto:sysreq@w3.org"><code>sysreq@w3.org</code></a> for help.`
    // sotd/process-document
,   "sotd.process-document.deprecated":        "The process document (${process}) you are using is no longer allowed."
,   "sotd.process-document.deprecatedAllowed": "The process document (${process}) you are using is deprecated."
,   "sotd.process-document.multiple-times":    "The governing process statement has been found multiple times."
,   "sotd.process-document.not-found":         "The document must mention the governing process: ${process}"
,   "sotd.process-document.wrong-link":        "The link to the process rules specified in the document is erroneous."
,   "sotd.process-document.wrong-process":     "The document doesn't specify the right governing process: ${process}."
    // sotd/implementation
,   "sotd.implementation.candidate":    "Found link to a preliminary interoperability/implementation report: <em><a href=\"${url}\">${text}</a></em>."
,   "sotd.implementation.no-report":    "Found a statement about a (missing) preliminary interoperability/implementation report: <em>“…${text}…”</em>."
,   "sotd.implementation.unknown":      "Could not find statements nor links about preliminary implementation/interoperability reports."
,   "sotd.implementation.link-should-be-https": "Implementation report link should start with <em>https://</em>, current link(s) in <em>Status of This Document</em> is/are: ${link}."
    // sotd/ac-review
,   "sotd.ac-review.found":       "Found a link to an online questionnaire: ${link}. Does this link provide access to the review form?"
,   "sotd.ac-review.not-found":   "Did not find information about a forum for AC Representative feedback."
    // sotd/diff
,   "sotd.diff.note":   false
    // sotd/rescind
,   "sotd.obsl-rescind.no-rationale":          "No rationale section found."
,   "sotd.obsl-rescind.no-explanation-link":   "Link to \"explanation of Obsoleting and Rescinding W3C Specifications\" not found."
    // sotd/delivererNote
,   "sotd.deliverer-note.not-found": "Deliverer not found. An attribute <code>data-deliverer</code> must be in the SotD"
    // structure/canonical
,   "structure.canonical.not-found":         "No canonical link found."
    // structure/name
,   'structure.name.wrong':  'The main page should be called <code>Overview.html</code>${note}.'
    // structure/section-ids
,   "structure.section-ids.no-id":  "No ID for section: '${text}'."
    // structure/security-privacy
,   "structure.security-privacy.no-security-privacy":  "No security and privacy considerations section found."
,   "structure.security-privacy.no-security":  "No security considerations section found."
,   "structure.security-privacy.no-privacy":  "No privacy considerations section found."
    // structure/h2
,   "structure.h2.abstract":    "First <code>&lt;h2&gt;</code> after <code>div.head</code> must be &ldquo;Abstract&rdquo;, but was &ldquo;${was}&rdquo;."
,   "structure.h2.sotd":        "Second <code>&lt;h2&gt;</code> after <code>div.head</code> must be &ldquo;status of this document&rdquo;, but was &ldquo;${was}&rdquo;."
,   "structure.h2.toc":         "Third <code>&lt;h2&gt;</code> after <code>div.head</code> must be &ldquo;Table of Contents&rdquo;, but was &ldquo;${was}&rdquo;."
    // structure/display-only
,   'structure.display-only.customised-paragraph': false
,   'structure.display-only.known-disclosures': false
,   'structure.display-only.visual-style':         'Visual styles <strong>should not</strong> vary significantly among normative alternatives.'
,   'structure.display-only.alt-representation':   'Authors <strong>may</strong> provide links to alternative (non-normative) representations or packages for the document. For instance: <br><code>&lt;p&gt;This document is also available in these non-normative formats: &lt;a href="WD-shortname-20020101.html"&gt;single HTML file&lt;/a&gt;, &lt;a href="WD-shortname-20020101.tgz"&gt;gzipped tar file of HTML&lt;/a&gt;.&lt;/p&gt;</code>'
,   'structure.display-only.normative-representation': 'At least one normative representation <strong>must</strong> be available for requests that use the "This Version" URI. More than one normative representation <strong>may</strong> be delivered in response to such requests. A "This Version" URI <strong>MUST NOT</strong> be used to identify a non-normative representation.'

,   'structure.display-only.special-box-markup':       'Remember to use classes <code>example</code>, <code>def</code>, <code>note</code> and <code>marker</code>, and <a href="http://fantasai.inkedblade.net/style/design/w3c-restyle/2016/sample#boxes">other special box markup</a>.'
,   'structure.display-only.index-list-tables':        'Remember to use class <code>index</code> for <a href="http://fantasai.inkedblade.net/style/design/w3c-restyle/2016/sample#indexing">index lists and tables</a>.'
,   'structure.display-only.fit-in-a4':                'Make sure spec illustrations/tables fit within an A4 sheet of paper when printed; use class <code>overlarge</code> if needed to improve experience on-screen for things that overflow.'
    // structure/neutral
,   "structure.neutral.neutral": 'Please make sure the expressions in document are neutral, "${words}" found in document. Check <a href="https://w3c.github.io/manual-of-style/#inclusive">W3C Manual of Style</a> for more information.'
    // style/sheet
,   "style.sheet.last":         "W3C TR style sheet must be last."
,   "style.sheet.not-found":    "Missing W3C TR style sheet."
    // style/meta
,   "style.meta.not-found":           "The viewport meta tag is required (<code>&lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"&gt;</code>)."
    // style/script
,   "style.script.not-found":   "A link to the script <code>fixup.js</code> is required (eg, <code>&lt;script src=\"//www.w3.org/scripts/TR/2016/fixup.js\"&gt;&lt;/script&gt;</code>)."
    // style/back-to-top
,   "style.back-to-top.not-found":  'It is recommended to include this <em>back-to-top</em> hyperlink at the end of <code>&lt;body&gt;</code>: <code>&lt;p role="navigation" id="back-to-top"&gt;&lt;a href="#title"&gt;&lt;abbr title="Back to top"&gt;&uarr;&lt;/abbr&gt;&lt;/a&gt;&lt;/p&gt;</code>.'
    // style/body-toc-sidebar
,   "style.body-toc-sidebar.class-found": 'The class <code>toc-sidebar</code> should be added by <code>fixup.js</code>.'
,   "style.body-toc-sidebar.selector-fail": 'Selector <code>body</code> failed.'
    // validation/css
,   "validation.css.skipped":       "CSS validation was skipped."
,   "validation.css.no-source":     "No CSS source to validate."
,   "validation.css.failure":       "Failure code from CSS validator: ${status}."
,   "validation.css.no-response":   "No response from CSS validator."
,   "validation.css.warning":       "[${level}:${type}] ${message} (${source}, line ${line})<br><a href=\"${link}\">CSS validator</a>"
,   "validation.css.error":         "[${type}] ${message} (${source}, line ${line} in “${context}”)<br><a href=\"${link}\">CSS validator</a>"
,   "validation.css.timeout":       "The CSS validator timed out."
    // validation/html
,   "validation.html.skipped":              "HTML validation was skipped."
,   "validation.html.no-source":            "No HTML source to validate."
,   "validation.html.failure":              "Failure code from HTML validator: ${status}."
,   "validation.html.no-response":          "No response from HTML validator."
,   "validation.html.error":                "[${line}@${column}] ${message}<br><a href=\"${link}\">HTML validator</a>"
,   "validation.html.warning":              "${message}<br><a href=\"${link}\">HTML validator</a>"
,   "validation.html.non-document-error":   "[${subType}] ${message}"
,   "validation.html.timeout":              "The HTML validator timed out."
    // validation/wcag
,   "validation.wcag.tools":    "Please verify using <a href='http://www.w3.org/WAI/ER/existingtools.html'>Accessibility Evaluation and Repair Services</a>."
    // heuristic/date-format
,   'heuristic.date-format.wrong':          'This date found on a boilerplate section of the document does not have the expected format (<code>DD Month YYYY</code>, with an optional leading zero in the day): <em>&ldquo;${text}&rdquo;</em>.'
    // heuristic/shortname
,   'heuristic.shortname.latest-link':      "Couldn't find the latest version link"
    // Echidna
,   'echidna.editor-ids.no-editor-id': 'Editor IDs must be set for each editor, in the <code>data-editor-id</code> attribute.'
,   'echidna.todays-date.wrong-date': 'The publication date of this document must be set to today (UTC).'
,   'echidna.todays-date.date-not-detected': 'Could not find a publication date in the document.'
    // Metadata:
,   'metadata.deliverers':        false
,   'metadata.dl.latest-not-found': 'Metadata extraction could not find the latest version link.'
,   'metadata.dl.previous-not-found': 'Metadata extraction could not find the previous version link.'
,   'metadata.docDate':           false
,   'metadata.editor-ids':        false
,   'metadata.editor-names':      false
,   'metadata.informative':       false
,   'metadata.process':           false
,   'metadata.profile':           false
,   'metadata.rectrack':          false
,   'metadata.title':             false
,   'metadata.errata':            false
};
