
var url = require("url");

exports.name = "links.compound";
exports.check = function (sr, done) {
    var links = [];
    if ( typeof String.prototype.startsWith != 'function' ) {
        String.prototype.startsWith = function( str ) {
            return this.substring( 0, str.length ) === str;
        }
    };

    sr.$('a[href]').each(function () {
        var parsedLink = url.parse(url.resolve(sr.url, sr.$(this).attr("href"))),
        l = parsedLink.protocol + '//' + parsedLink.host + parsedLink.pathname;
        if (l.startsWith(sr.url) && l != sr.url) {
            links.push(l);
        }
    });
    // sort and remove duplicates
    links = links.sort().filter(function (item, pos) {return (!pos || item != links[pos - 1]);});
    links.forEach(function (l) {
        sr.info(exports.name, "links", { file : l.split('/').pop(), link : l } )
    });
};
