
var url = require("url"),
http = require("http");

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
    links = links.sort().filter(function (item, pos) {return (!pos || item != links[pos - 1]);});
    var c = 0;
    links.forEach(function (l, i) {
        var parsedLink = url.parse(l),
            options = {method: 'HEAD', host: parsedLink.hostname, port: parsedLink.port, path: parsedLink.pathname},
            req = http.request(options, function(res) {
                if (res.headers["content-type"].indexOf("text/html") > -1 || res.headers["content-type"].indexOf("application/xhtml+xml") > -1) {
                    sr.warning(exports.name, "links", { file : l.split('/').pop(), link : l } )
                }
                c++;
                if (c === links.length - 1) {
                    done();
                }
            });
        req.end();
    });
};
