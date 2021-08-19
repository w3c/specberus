const self = {
    name: 'sotd.rec-comment-end',
    section: 'document-status',
    rule: 'commentEnd',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    if (sotd) {
        const recType = sr.getRecMetadata({});
        if (recType.pSubChanges || recType.pNewFeatures) {
            const txt = sr.norm(sotd.textContent);
            const rex = new RegExp(sr.dateRegexStrCapturing, 'g');
            const docDate = sr.getDocumentDate();

            // 60 days later than docDate;
            const minimumEndDate = new Date(
                docDate - 0 + 60 * 24 * 60 * 60 * 1000
            );
            // "Mon Nov 02 2020 16:26:28 GMT+0800 (@@ Standard Time)" -> "Nov 02 2020"
            const readableDate = minimumEndDate
                .toDateString()
                .split(' ')
                .slice(1)
                .join(' ');
            if (!rex.test(txt))
                sr.error(self, 'not-found', { minimumEndDate: readableDate });
            else {
                const matches = txt.match(rex);
                const dateFound = [];
                for (const i in matches) {
                    if (sr.stringToDate(matches[i]) > minimumEndDate) {
                        dateFound.push(sr.stringToDate(matches[i]));
                    }
                }
                if (dateFound.length > 1) {
                    sr.warning(self, 'multi-found', {
                        date: dateFound.join(', '),
                        minimumEndDate: readableDate,
                    });
                } else if (!dateFound.length) {
                    sr.error(self, 'not-found', {
                        minimumEndDate: readableDate,
                    });
                }
            }
        }
    }
    done();
};
