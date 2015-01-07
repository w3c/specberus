
'use strict';

exports.name = 'heuristic.group';

exports.check = function (sr, done) {
    var patterns = /.+ interest group$|.+ community group$|.+ working group$/i;
    var candidates = [];
    var item;
    var i;

    sr.$('a').each(function () {
        item = sr.$(this);

        if (patterns.exec(item.text())) {
            candidates.push({homepage: item.attr('href'), name: item.text()});
        }
    });

    if (candidates.length > 0) {
        for (i = 0; i < candidates.length; i ++) {
            sr.info(exports.name, 'candidate', {name: candidates[i].name, url: candidates[i].homepage});
        }
        sr.metadata('deliverers', candidates);
    }
    else {
        sr.error(exports.name, 'not-found');
    }

    return done();
};

