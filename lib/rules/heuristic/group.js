
'use strict';

exports.name = 'heuristic.group';

exports.check = function (sr, done) {

    var candidates = sr.$('a:contains("Working Group")');

    if (!candidates || candidates.length < 1) {
	candidates = sr.$('a:contains("working group"), a:contains("Working group"), a:contains("working Group")');
    }

    if (candidates && candidates.length > 0) {
        var text = sr.$(candidates[0]).html();

        if (text) {
            sr.info(exports.name, 'candidate', {name: text});
        }
        else {
            sr.error(exports.name, 'not-found');
        }

    }
    else {
        sr.error(exports.name, 'not-found');
    }

    return done();

};

