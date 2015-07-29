
'use strict';

exports.messages = {
    // dummy/h2-foo
    "dummy.h2-foo.not-found":   "Selector h2.foo not found."
    // dummy/h1
,   "dummy.h1.not-found":       "Selector h1 not found."
    // dummy/dahut
,   "dummy.dahut.not-found":    "No element containing DAHUT."
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
,   'headers.h2-toc.missing':  'There is no table of contents after the status section, labeled with a <code>&lt;h2&gt;</code> element with content <em>&ldquo;Table of Contents&rdquo;</em>.'
    // headers/h1-title
,   "headers.h1-title.title":   "Content of title and h1 do not match."
    // headers/dl
,   "headers.dl.no-dd":                     "No &lt;dd&gt; element found for '${dt}'."
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
,   "headers.dl.this-latest-shortname":     "Short names differ between This and Latest Versions."
,   "headers.dl.latest-syntax":             "Wrong syntax for Latest Version link."
,   "headers.dl.previous-link":             "Link href and text differ for Previous Version."
,   "headers.dl.this-previous-shortname":   "Short names differ between This and Previous Versions."
,   "headers.dl.previous-syntax":           "Wrong syntax for Previous Version link."
,   "headers.dl.editor":                    "There must be at least one editor or author, with proper IDs as attributes."
,   "headers.dl.rescinds":                  "Rescinds this Recommendation is missing."
,   "headers.dl.rescinds-not-needed":       "Rescinds this Recommendation is included but does not seem necessary."
,   "headers.dl.latest-rescinds-order":     "Latest Version must be before Rescinds this Recommendation."
,   "headers.dl.rescinds-link":             "Link href and text differ for Rescinds this Recommendation."
,   "headers.dl.this-rescinds-shortname":   "Short names differ between This Version and Rescinds this Recommendation."
,   "headers.dl.rescinds-syntax":           "Wrong syntax for Rescinds this Recommendation link."
,   "headers.dl.cant-retrieve":             "Could not retrieve URI for previous version or for latest version."
,   "headers.dl.latest-is-not-previous":    "Retrieved \"previous\" and \"latest\" documents, but their contents don't match."
,   "headers.dl.same-this-and-previous":    "\"This\" version and \"previous\" version have the same URL."
,   "headers.dl.same-day-publication":      "The document was already published today."
    // headers/errata
,   "headers.errata.not-found":             "Errata paragraph not found."
    // headers/translations
,   "headers.translations.found":                   "Translations link <a href='${link}'>found</a>."
,   "headers.translations.not-found":               "Translations link not found."
,   "headers.translations.not-recommended-link":    "The recommended link is not used (<code>http[s]://[www.]w3.org/2003/03/Translations/byTechnology?technology=[shortname]</code>)"
    // headers/div-head
,   "headers.div-head.not-found":           "No div.head found."
    // headers/copyright
,   "headers.copyright.no-match":           "Copyright string does not match requirements."
,   "headers.copyright.kitten-friendly":    "Using CC-BY kitten-friendly license."
,   "headers.copyright.link-text":          "Missing link '${href}' with text '${text}'."
,   "headers.copyright.not-found":          "Missing copyright paragraph."
    // links/internal
,   "links.internal.anchor":    "Link to missing anchor: '${id}'."
    // links/linkchecker
,   "links.linkchecker.display":   "Please verify using <a href=\"http://validator.w3.org/checklink?uri=${link}&recursive=on\">Link Checker</a>."
    // links/compound
,   "links.compound.skipped":           "HTML and CSS validations were skipped"
,   "links.compound.no-validation":     "<a href=\"${link}\">${file}</a> <a href=\"http://validator.w3.org/check?uri=${link}\">HTML</a> <a href=\"http://jigsaw.w3.org/css-validator/validator?profile=css3&uri=${link}\">CSS</a>"
,   "links.compound.link":              "<a href=\"${link}\">${file}</a> <a href=\"http://validator.w3.org/check?uri=${link}\">HTML ${markup}</a> <a href=\"http://jigsaw.w3.org/css-validator/validator?profile=css3&uri=${link}\">CSS ${css}</a>"
,   "links.compound.error":             "<a href=\"${link}\">${file}</a> <a href=\"http://validator.w3.org/check?uri=${link}\">HTML</a> <a href=\"http://jigsaw.w3.org/css-validator/validator?profile=css3&uri=${link}\">CSS</a>: ${errMsg}"
    // sotd/supersedable
,   "sotd.supersedable.no-sotd":        "No SotD section."
,   "sotd.supersedable.no-sotd-intro":  "No SotD introduction."
,   "sotd.supersedable.no-sotd-tr":     "No SotD introduction link to TR."
    // sotd/submission
,   "sotd.submission.no-sotd":              "No SotD section."
,   "sotd.submission.no-submission-text":   "No member submission paragraph."
,   "sotd.submission.link-text":            "Missing link '${href}' with text '${text}'."
,   "sotd.submission.no-sm-link":           "Missing link 'http://www.w3.org/Submission/...' with text 'Submitting Members'."
,   "sotd.submission.no-tc-link":           "Missing link 'http://www.w3.org/Submission/...' with text 'W3C Team Comment'."
    // sotd/team-subm-link
,   "sotd.team-subm-link.no-sotd":  "No SotD section."
,   "sotd.team-subm-link.no-link":  "No link to all Team Submissions."
    // sotd/stability
,   "sotd.stability.no-sotd":       "No SotD section."
,   "sotd.stability.no-stability":  "No stability warning paragraph."
,   "sotd.stability.no-rec-review": "No indication that the Director, developers, and interested parties have reviewed this Recommendation."
    // sotd/status
,   "sotd.status.no-sotd":      "No SotD section."
,   "sotd.status.no-mention":   "SotD does not mention that this is a ${status}."
    // sotd/review-end
,   "sotd.review-end.no-sotd":      "No SotD section."
,   "sotd.review-end.not-found":    "No review end date found."
,   "sotd.review-end.found":        "Review end date found: ${date}"
    // sotd/cr-end
,   "sotd.cr-end.no-sotd":      "No SotD section."
,   "sotd.cr-end.not-found":    "No minimal CR end date found."
    // sotd/pp
,   "sotd.pp.no-sotd":           "No SotD section."
,   "sotd.pp.no-pp":             "Required patent policy paragraph not found."
,   "sotd.pp.no-feb5":           "No link to 2004 Feb 5 PP."
,   "sotd.pp.no-disclosures":    "No link to public list of disclosures."
,   "sotd.pp.no-claims":         "No link to definition of essential claims."
,   "sotd.pp.no-section6":       "No link to section 6."
,   "sotd.pp.no-jan24":          "No link to 2002 Jan 24 PP."
,   "sotd.pp.no-pp-transition":  "No link to PP transition procedure."
,   "sotd.pp.joint-publication": "Joint publication detected."
,   "sotd.pp.expected-pp":       "Expected text related to patent policy requirements: <blockquote>${expected}</blockquote>"
    // sotd/charter-disclosure
,   "sotd.charter-disclosure.no-sotd":      "No SotD section."
,   "sotd.charter-disclosure.not-found":    "No link to charter for disclosure obligations found."
    // sotd/mailing-list
,   "sotd.mailing-list.no-sotd":    "No SotD section."
,   "sotd.mailing-list.no-list":    "No mailing list link."
,   "sotd.mailing-list.no-sub":     "No mailing list subscription link."
,   "sotd.mailing-list.no-arch":    "No mailing list archives link."
    // sotd/group-name
,   "sotd.group-name.no-sotd":      "No SotD section."
,   "sotd.group-name.no-ml":        "No email address found with which to check group name."
,   "sotd.group-name.no-group":     "No group matching email address found in groups database."
,   "sotd.group-name.no-link":      "No link found to group (${name}, ${url})."
,   "sotd.group-name.no-name":      "Link to group found with wrong group name (${name}, ${url})."
    // sotd/processDocument
,   "sotd.processDocument.deprecated":        "It seems the document attemps to follow process 1 Aug 2014, which is deprecated in favour of <a href='http://www.w3.org/2015/Process-20150901/'>1 September 2015</a>."
,   "sotd.processDocument.multiple-times":    "The governing process statement has been found multiple times."
,   "sotd.processDocument.no-sotd":           "No SotD section."
,   "sotd.processDocument.not-found":         "According to your selection, the document must mention the governing process: ${process}"
,   "sotd.processDocument.not-specified":     "No process document specified."
,   "sotd.processDocument.wrong-link":        "The link to the process rules specified in the document is erroneous."
,   "sotd.processDocument.wrong-process":     "The document specifies a governing process that does not match your selection (${process})."
    // sotd/implementation
,   "sotd.implementation.candidate":    "Found link to a preliminary interoperability/implementation report: <em><a href=\"${url}\">${text}</a></em>."
,   "sotd.implementation.no-report":    "Found a statement about a (missing) preliminary interoperability/implementation report: <em>“…${text}…”</em>."
,   "sotd.implementation.unknown":      "Could not find statements nor links about preliminary implementation/interoperability reports."
    // sotd/ac-review
,   "sotd.ac-review.found":       "Found a link to an online questionnaire: ${link}. Does this link provide access to the review form?"
,   "sotd.ac-review.not-found":   "Did not find information about a forum for AC Representative feedback."
    // sotd/diff
,   "sotd.diff.note":   "It <strong>should</strong> include a link to changes since the previous draft (e.g., a list of changes or a diff document or both; see the <a href='http://www.w3.org/2007/10/htmldiff'>online HTML diff tool</a>)."
    // structure/name
,   'structure.name.wrong':  'The main page should be called <code>Overview.html</code>${note}.'
    // structure/section-ids
,   "structure.section-ids.no-id":  "No ID for section: '${text}'."
    // structure/h2
,   "structure.h2.abstract":    "First &lt;h2&gt; after div.head must be 'Abstract', was '${was}'."
,   "structure.h2.sotd":        "Second &lt;h2&gt; after div.head must be 'Status of This Document', was '${was}'."
,   "structure.h2.toc":         "Third &lt;h2&gt; after div.head must be 'Table of Contents', was '${was}'."
    // structure/display-only
,   'structure.display-only.broken-links': 'The document <strong>must not</strong> have any broken internal links or broken links to other resources at <code>w3.org</code>. The document <strong>should not</strong> have any other broken links.'
,   'structure.display-only.customised-paragraph': 'The document <strong>must</strong> include at least one customized paragraph. \
This section <strong>should</strong> include the title page date (i.e., the one next to the maturity level at the top of the document). \
These paragraphs <strong>should</strong> explain the publication context, including rationale and relationships to other work. \
See <a href="http://www.w3.org/2001/06/manual/#Status">examples and more discussion in the Manual of Style</a>.'
,   'structure.display-only.known-disclosures': 'It <strong>must not</strong> indicate the number of known disclosures at the time of publication.'
,   'structure.display-only.old-pubrules': 'This alternative pubrules checker is <strong>experimental</strong>, and provided only for early testing. <br> \
Please refer to <a href="http://www.w3.org/2005/07/pubrules?uimode=filter&uri=">Technical Report Publication Policy (Pubrules)</a> \
for extended information about the publication rules.'
    // style/sheet
,   "style.sheet.last":         "W3C TR style sheet must be last."
,   "style.sheet.not-found":    "Missing W3C TR style sheet."
    // validation/css
,   "validation.css.skipped":       "CSS validation was skipped."
,   "validation.css.no-source":     "No CSS source to validate."
,   "validation.css.failure":       "Failure code from CSS validator: ${status}."
,   "validation.css.no-response":   "No response from CSS validator."
,   "validation.css.warning":       "[${level}:${type}] ${message} (${source}, line ${line})"
,   "validation.css.error":         "[${type}] ${message} (${source}, line ${line} in '${context}')"
    // validation/html
,   "validation.html.skipped":              "HTML validation was skipped."
,   "validation.html.no-source":            "No HTML source to validate."
,   "validation.html.failure":              "Failure code from HTML validator: ${status}."
,   "validation.html.no-response":          "No response from HTML validator."
,   "validation.html.error":                "[${line}@${column}] ${message}"
,   "validation.html.warning":              "${message}"
,   "validation.html.non-document-error":   "[${subType}] ${message}"
    // validation/wcag
,   "validation.wcag.tools":    "Please verify using <a href='http://www.w3.org/WAI/ER/existingtools.html'>Accessibility Evaluation and Repair Services</a>."
    // heuristic/group
,   "heuristic.group.candidate":          "The group might be the <em><a href=\"${url}\">${name}</a></em>."
,   "heuristic.group.not-found":          "Could not identify a group behind this spec."
    // heuristic/date-format
,   'heuristic.date-format.wrong':          'This date found on a boilerplate section of the document does not have the expected format (<code>DD Month YYYY</code>, with an optional leading zero in the day): <em>&ldquo;${text}&rdquo;</em>.'
    // Echidna
,   'echidna.editor-ids.no-editor-id': 'Editor IDs must be set for each editor, in the <code>data-editor-id</code> attribute.'
,   'echidna.todays-date.wrong-date': 'The publication date of this document must be set to today.'
};

