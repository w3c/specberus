exports.base = {
    heuristic: {
        'date-format': [
            { data: 'todo', errors: ['wrong'], warnings: [], config: {} },
        ],
    },
    headers: {
        'details-summary': [
            { data: 'todo', errors: ['no-details'] },
            { data: 'todo', errors: ['no-details-open'] },
            { data: 'todo', errors: ['no-details-dl'] },
            { data: 'todo', errors: ['no-details-summary'] },
            { data: 'todo', errors: ['wrong-summary-text'] },
        ],
        copyright: [
            { data: 'todo', errors: ['no-data-from-API'] },
            { data: 'todo', errors: ['no-license-found-joint'] },
            { data: 'todo', errors: ['no-license-found'] },
            { data: 'todo', errors: ['no-match'] },
            { data: 'todo', errors: ['no-link'] },
            { data: 'todo', errors: ['href-not-match'] },
            { data: 'todo', errors: ['not-found'] },
        ],
        errata: [{ data: 'todo', errors: ['no-errata'] }],
        dl: [
            { data: 'todo', errors: ['not-found'] },
            { data: 'todo', errors: ['link-diff'] },
            { data: 'todo', errors: ['this-version'] },
            { data: 'todo', errors: ['latest-version'] },
            { data: 'todo', errors: ['no-history'] },
            { data: 'todo', errors: ['rescinds'] },
            { data: 'todo', errors: ['obsoletes'] },
            { data: 'todo', errors: ['supersedes'] },
            { data: 'todo', errors: ['this-latest-order'] },
            { data: 'todo', errors: ['latest-rescinds-order'] },
            { data: 'todo', errors: ['latest-obsoletes-order'] },
            { data: 'todo', errors: ['latest-supersedes-order'] },
            { data: 'todo', errors: ['this-date'] },
            { data: 'todo', errors: ['this-syntax'] },
            { data: 'todo', errors: ['this-latest-shortname'] },
            { data: 'todo', errors: ['latest-syntax'] },
            { data: 'todo', errors: ['history-syntax'] },
            { data: 'todo', errors: ['history-bad-previous'] },
            { data: 'todo', errors: ['this-rescinds-shortname'] },
            { data: 'todo', errors: ['rescinds-syntax'] },
            { data: 'todo', errors: ['this-obsoletes-shortname'] },
            { data: 'todo', errors: ['obsoletes-syntax'] },
            { data: 'todo', errors: ['this-supersedes-shortname'] },
            { data: 'todo', errors: ['supersedes-syntax'] },
            { data: 'todo', errors: ['implelink-should-be-https'] },
            { data: 'todo', errors: ['editors-draft-should-be-https'] },
            { data: 'todo', errors: ['editor-missing-id'] },
            { data: 'todo', errors: ['editor-not-found'] },
            { data: 'todo', warnings: ['rescinds-not-needed'] },
            { data: 'todo', warnings: ['obsoletes-not-needed'] },
            { data: 'todo', warnings: ['supersedes-not-needed'] },
            { data: 'todo', warnings: ['no-date'] },
            { data: 'todo', warnings: ['implelink-comfirm-no'] },
        ],
        'h1-title': [
            { data: 'todo', errors: ['not-found'] },
            { data: 'todo', errors: ['not-match'] },
        ],
        'github-repo': [
            { data: 'todo', errors: ['no-feedback'] },
            { data: 'todo', errors: ['no-repo'] },
        ],
        'h2-toc': [
            { data: 'todo', errors: ['mixed'] },
            { data: 'todo', warnings: ['not-html5'] },
            { data: 'todo', errors: ['not-found'] }, // 2 places?
            { data: 'todo', errors: ['too-many'] },
        ],
        hr: [
            { data: 'todo', errors: ['duplicate'] },
            { data: 'todo', errors: ['not-found'] },
        ],
        'memsub-copyright': [
            // not for every profiles
            { data: 'todo', errors: ['not-found'] }, // 2 places?
        ],
        secno: [{ data: 'todo', warnings: ['not-found'] }],
        logo: [{ data: 'todo', errors: ['not-found'] }],
        'ol-toc': [{ data: 'todo', warnings: ['not-found'] }],
        'subm-logo': [
            // not for every profiles
            { data: 'todo', errors: ['not-found'] },
        ],
        'w3c-state': [
            { data: 'todo', errors: ['no-w3c-state'] },
            { data: 'todo', errors: ['bad-w3c-state'] },
            { data: 'todo', errors: ['bad-w3c-state'] },
            { data: 'todo', errors: ['no-w3c-state-link'] },
            { data: 'todo', errors: ['wrong-w3c-state-link'] },
        ],
    },
    links: {
        compound: [
            { data: 'todo', warnings: ['skipped'] },
            { data: 'todo', errors: ['error'] },
            { data: 'todo', warnings: ['html-timeout'] },
            { data: 'todo', infos: ['link'] },
            { data: 'todo', errors: ['link'] },
            { data: 'todo', infos: ['no-validation'] },
        ],
        linkchecker: [
            { data: 'todo', warnings: ['display'] },
            { data: 'todo', errors: ['not-same-folder'] },
            { data: 'todo', errors: ['response-error-with-redirect'] },
            { data: 'todo', errors: ['response-error'] },
        ],
        reliability: [{ data: 'todo', warnings: ['unreliable-link'] }],
        internal: [{ data: 'todo', errors: ['anchor'] }],
    },
    structure: {
        canonical: [{ data: 'todo', errors: ['not-found'] }],
        h2: [
            { data: 'todo', errors: ['abstract'] },
            { data: 'todo', errors: ['sotd'] },
            { data: 'todo', errors: ['toc'] },
        ],
        name: [
            { data: 'todo', warnings: ['wrong'] }, // 3 times
        ],
        neutral: [{ data: 'todo', warnings: ['neutral'] }],
        'section-ids': [{ data: 'todo', errors: ['no-id'] }],
    },
    sotd: {
        'ac-review': [
            // not for every profiles
            { data: 'todo', errors: ['not-found'] },
        ],
        charter: [
            { data: 'todo', errors: ['no-group'] },
            { data: 'todo', errors: ['no-charter'] },
            { data: 'todo', errors: ['text-not-found'] },
            { data: 'todo', errors: ['no-group'] },
            { data: 'todo', errors: ['link-not-found'] },
            { data: 'todo', errors: ['wrong-link'] },
        ],
        'deliverer-note': [
            // not for every profiles
            { data: 'todo', errors: ['not-found'] },
        ],
        'candidate-review-end': [
            { data: 'todo', warnings: ['editorial'] },
            { data: 'todo', errors: ['not-found'] },
            { data: 'todo', infos: ['date-found'] },
            { data: 'todo', warnings: ['multiple-found'] },
            { data: 'todo', infos: ['date-found'] },
            { data: 'todo', errors: ['found-not-valid'] },
        ],
        'obsl-rescind': [
            { data: 'todo', errors: ['no-rationale'] },
            { data: 'todo', errors: ['no-explanation-link'] },
        ],
        pp: [
            { data: 'todo', warnings: ['joint-publication'] },
            { data: 'todo', errors: ['no-pp-from-charter'] },
            { data: 'todo', errors: ['joint-different-pp'] },
            { data: 'todo', errors: ['wrong-pp-from-charter'] },
            { data: 'todo', errors: ['undefined'] },
            { data: 'todo', errors: ['no-pp'] },
            { data: 'todo', errors: ['no-pp2017'] },
            { data: 'todo', errors: ['no-pp2020'] },
            { data: 'todo', errors: ['no-pp-link'] },
            { data: 'todo', errors: ['no-disclosures'] },
            { data: 'todo', errors: ['no-claims'] },
            { data: 'todo', errors: ['no-section6'] },
        ],
        'draft-stability': [
            { data: 'todo', errors: ['not-found-either'] },
            { data: 'todo', errors: ['not-found'] },
        ],
        'process-document': [
            { data: 'todo', errors: ['multiple-times'] },
            { data: 'todo', errors: ['wrong-process'] },
            { data: 'todo', errors: ['wrong-link'] },
            { data: 'todo', errors: ['not-found'] },
        ],
        'new-features': [
            { data: 'todo', errors: ['no-link'] },
            { data: 'todo', warnings: ['no-warning'] },
        ],
        publish: [
            { data: 'todo', errors: ['not-found'] },
            { data: 'todo', errors: ['url-not-match'] },
            { data: 'todo', errors: ['no-homepage-link'] },
            { data: 'todo', errors: ['url-not-match'] },
            { data: 'todo', errors: ['url-text-not-found'] },
        ],
        deployment: [{ data: 'todo', errors: ['not-found'] }],
        'rec-comment-end': [
            { data: 'todo', errors: ['not-found'] },
            { data: 'todo', warnings: ['multi-found'] },
            { data: 'todo', errors: ['not-found'] },
        ],
        stability: [
            { data: 'todo', errors: ['no-rec-review'] },
            { data: 'todo', errors: ['no-stability'] },
            { data: 'todo', errors: ['no-cr-review'] },
            { data: 'todo', errors: ['wrong-cr-review-link'] },
            { data: 'todo', errors: ['no-licensing-link'] },
        ],
        'review-end': [
            { data: 'todo', warnings: ['not-found'] },
            { data: 'todo', infos: ['found'] },
            { data: 'todo', warnings: ['not-found'] },
        ],
        submission: [
            { data: 'todo', errors: ['no-submission-text'] },
            { data: 'todo', errors: ['link-text'] },
            { data: 'todo', errors: ['link-text'] },
            { data: 'todo', errors: ['link-text'] },
            { data: 'todo', errors: ['link-text'] },
            { data: 'todo', errors: ['no-sm-link'] },
            { data: 'todo', errors: ['no-tc-link'] },
        ],
        'rec-addition': [
            { data: 'todo', errors: ['wrong-text'] },
            { data: 'todo', errors: ['no-section'] },
            { data: 'todo', errors: ['unnecessary-section'] },
        ],
        supersedable: [
            { data: 'todo', errors: ['no-sotd-intro'] },
            { data: 'todo', errors: ['no-sotd-tr'] },
        ],
        usage: [{ data: 'todo', errors: ['not-found'] }],
    },
    style: {
        'back-to-top': [{ data: 'todo', warnings: ['not-found'] }],
        'body-toc-sidebar': [
            { data: 'todo', errors: ['class-found'] },
            { data: 'todo', errors: ['selector-fail'] },
        ],
        meta: [
            { data: 'todo', errors: ['not-found'] },
            { data: 'todo', errors: ['not-found'] },
        ],
        script: [{ data: 'todo', errors: ['not-found'] }],
        sheet: [
            { data: 'todo', errors: ['not-found'] },
            { data: 'todo', errors: ['last'] },
        ],
    },
    validation: {
        html: [
            { data: 'todo', warnings: ['skipped'] },
            { data: 'todo', warnings: ['no-source'] },
            { data: 'todo', warnings: ['timeout'] },
            { data: 'todo', errors: ['no-response'] },
            { data: 'todo', errors: ['failure'] },
            { data: 'todo', errors: ['error'] },
            { data: 'todo', warnings: ['warning'] },
            { data: 'todo', errors: ['non-document-error'] },
        ],
    },
    metadata: {
        dl: [{ data: 'todo', errors: ['latest-not-found'] }],
    },
};
