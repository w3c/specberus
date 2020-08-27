const self = {
    name: 'sotd.rec-comment-end'
,   section: 'document-status'
,   rule: 'commentEnd'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    if (sotd) {
        var recType = sr.getRecMetadata({});
        if (recType.substantiveChanges || recType.newFeatures) {
            var txt = sr.norm(sotd.textContent)
            ,   rex = new RegExp(sr.dateRegexStrCapturing, "g")
            ,   docDate = sr.getDocumentDate();
            
            
            // 60 days later than docDate;
            var minimumEndDate = new Date(docDate - 0 + 60 * 24 * 60 * 60 * 1000);
            if (!rex.test(txt))
                sr.error(self, "not-found", { minimumEndDate: minimumEndDate });
            else {
                var matches = txt.match(rex);
                var dateFound = [];
                for (var i in matches) {
                    if (sr.stringToDate(matches[i]) > minimumEndDate) {
                        dateFound.push(sr.stringToDate(matches[i]));
                    }
                }
                if (dateFound.length > 1) { 
                    sr.warning(self, "multi-found", { date: dateFound.join(', '), minimumEndDate: minimumEndDate });
                } else if(!dateFound.length) {
                    sr.error(self, "not-found", { minimumEndDate: minimumEndDate });
                }
            }
        }
    }
    done();
};
