
var messages = {
    en: {
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
        // headers/hr
    ,   "headers.hr.not-found":     "No <hr> at end of or right after div.head."
        // headers/h2-status
    ,   "headers.h2-status.no-h2":  "No status+date h2 element."
    ,   "headers.h2-status.bad-h2": "Incorrect status h2 header."
        // headers/h1-title
    ,   "headers.h1-title.title":   "Content of title and h1 do not match."
        // headers/dl
    ,   "headers.dl.this-version":              "This Version is missing."
    ,   "headers.dl.latest-version":            "Latest Version is missing."
    ,   "headers.dl.previous-version":          "Previous Version is missing."
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
    ,   "headers.dl.editor":                    "There must be at least an editor or an author."
        // headers/div-head
    ,   "headers.div-head.not-found":           "No div.head found."
        // headers/copyright
    ,   "headers.copyright.no-match":           "Copyright string does not match requirements."
    ,   "headers.copyright.kitten-friendly":    "Using CC-BY kitten-friendly license."
    ,   "headers.copyright.link-text":          "Missing link '${href}' with text '${text}'."
    ,   "headers.copyright.not-found":          "Missing copyright paragraph."
        // links/internal
    ,   "links.internal.anchor":    "Link to missing anchor: '${id}'."
        // sotd/supersedable
    ,   "sotd.supersedable.no-sotd":        "No SotD section."
    ,   "sotd.supersedable.no-sotd-intro":  "No SotD introduction."
    ,   "sotd.supersedable.no-sotd-tr":     "No SotD introduction link to TR."
        // sotd/stability
    ,   "sotd.stability.no-sotd":       "No SotD section."
    ,   "sotd.stability.no-stability":  "No stability warning paragraph."
        // sotd/pp
    ,   "sotd.pp.no-sotd":          "No SotD section."
    ,   "sotd.pp.no-pp":            "No patent policy paragraph."
    ,   "sotd.pp.no-feb5":          "No link to Feb 5 PP."
    ,   "sotd.pp.no-disclosures":   "No link to public list of disclosures."
    ,   "sotd.pp.no-claims":        "No link to definition of essential claims."
    ,   "sotd.pp.no-section6":      "No link to section 6."
        // sotd/mailing-list
    ,   "sotd.mailing-list.no-sotd":    "No SotD section."
    ,   "sotd.mailing-list.no-list":    "No mailing list link."
    ,   "sotd.mailing-list.no-sub":     "No mailing list subscription link."
    ,   "sotd.mailing-list.no-arch":    "No mailing list archives link."
        // structure/section-ids
    ,   "structure.section-ids.no-id":  "No ID for section: '${text}'."
        // structure/h2
    ,   "structure.h2.abstract":    "First <h2> after div.head must be 'Abstract', was '${was}'."
    ,   "structure.h2.sotd":        "Second <h2> after div.head must be 'Status of This Document', was '${was}'."
    ,   "structure.h2.toc":         "Third <h2> after div.head must be 'Table of Contents', was '${was}'."
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
    }
};

exports.message = function (lang, rule, key, extra) {
    if (!messages[lang]) return "@@@No such language: " + lang + "@@@";
    var l10n = messages[lang][rule + "." + key];
    if (!l10n) return "@@@No such entry: " + rule + "." + key + "@@@";
    if (extra) {
        return l10n.replace(/\$\{([^\}]+)\}/g, function (m, p1) {
            if (extra.hasOwnProperty(p1)) return extra[p1];
            return "@@@No such data: ${" + p1 + "}@@@";
        });
    }
    return l10n;
};
