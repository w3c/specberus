const self = {
    name: 'structure.name'
,   section: 'compound'
,   rule: 'compoundOverview'
};

exports.name = self.name;

exports.check = function (sr, done) {

    // Pseudo-constants:
    var EXPECTED_NAME = /\/Overview\.html$/
    ,   OVERVIEW = 'Overview.html'
    ,   ALTERNATIVE_ENDING = /\/$/
    ,   FILE_NAME = /[^/]+$/;

    var superagent = require('superagent')
    ,   fileName
    ;

    if (!sr || !sr.url || EXPECTED_NAME.test(sr.url)) {
        return done();
    }
    else {
        if (!ALTERNATIVE_ENDING.test(sr.url)) {
            fileName = sr.url.match(FILE_NAME);
            if (fileName && 1 === fileName.length) {
                fileName = fileName[0];
                sr.warning(self, 'wrong', {note: ' (instead of <code>' + fileName + '</code>)'});
            }
            else {
                sr.warning(self, 'wrong', {note: ''});
            }
            return done();
        }
        else {
            superagent.get(sr.url).end(function(err1, result1) {
                superagent.get(sr.url + OVERVIEW).end(function(err2, result2) {
                    if (!result1 || !result2 || !result1.ok || !result2.ok || result1.text !== result2.text) {
                        sr.warning(self, 'wrong', {note: ''});
                    }
                    return done();
                });
            });
        }
    }

};
