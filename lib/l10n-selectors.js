/**
 * JSON selectors to bind error messages coming from lib/rules/* to human-readable rules.
 */

exports.selectors = {
    'headers.h2-status.bad-h2': {section: 'front-matter', rule: 'dateTitleH2Test'}
,   'headers.h2-status.no-h2':  {section: 'front-matter', rule: 'dateTitleH2Test'}
,   'headers.hr.duplicate':     {section: 'front-matter', rule: 'hrAfterCopyrightTest'}
,   'headers.hr.not-found':     {section: 'front-matter', rule: 'hrAfterCopyrightTest'}
,   'headers.logo.not-found':   {section: 'front-matter', rule: 'logoTest'}
,   'headers.title.not-found':  {section: 'front-matter', rule: 'titleTest'}
};
