
'use strict';

exports.name = 'heuristic.group';

exports.check = function (sr, done) {

    var patterns = /.+ interest group$|.+ community group$|.+ working group$/i;
    var candidates = {};
    var item;

    sr.$('a').each(function () {
	item = sr.$(this);

	if (patterns.exec(item.text())) {
	    candidates[item.attr('href')] = item.text();
	}

    });

    if (Object.keys(candidates).length > 0) {

	for (item in candidates) {
	    sr.info(exports.name, 'candidate', {name: candidates[item], url: item});
	}

    }
    else {
        sr.error(exports.name, 'not-found');
    }

    return done();

};

