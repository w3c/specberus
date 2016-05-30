/**
 * Views.
 */

// Settings:
const DEBUG = (process && process.env && process.env.DEBUG)
,   BASE_URI = ((process.env.BASE_URI ? process.env.BASE_URI : '') + '/').replace(/\/+$/, '/')
;

// Internal packages:
const rulesWrapper = require('./rules-wrapper')
,   self = require('../package')
;

// External packages:
const handlebars = require('express-handlebars');

const version = self.version
,   rules = rulesWrapper.rules
,   nav = `<p class="pull-right">
        <a href="${BASE_URI}about/">About</a> &middot;
        <a href="${BASE_URI}sitemap/">Site map</a> &middot;
        <a href="${BASE_URI}help/">Help</a>
        </p>`
;

/**
 * @TODO Document.
 */

const serveStraight = function(req, res) {
    const fragment = req.path.replace(/^\/|\/$/gi, '');
    res.render(fragment, {DEBUG: DEBUG, BASE_URI: BASE_URI, version: version, nav: nav, title: fragment});
};

/**
 * @TODO Document.
 */

const handleWIP = function(req, res) {
    res.render('wip', {DEBUG: DEBUG, BASE_URI: BASE_URI, version: version, nav: nav, title: 'coming soon'});
};

/**
 * @TODO Document.
 */

const handleWrongPage = function(req, res) {
    res.render('error', {DEBUG: DEBUG, BASE_URI: BASE_URI, version: version, nav: nav, title: "whut?"});
};

/**
 * @TODO Document.
 */

const listProfiles = function() {
    const result = [];
    for (var p in rules)
        result.push({abbr: rules[p].abbr, name: rules[p].name});
    return result;
};

/**
 * @TODO Document.
 */

const formatRules = function(sections) {

    var result = '';
    if (!sections || !sections.length || sections.length < 1)
        result += '<p>Error! No rules to render</p>\n';
    for (var s in sections) {
        result += `<h3 id ="${sections[s].abbr}"><a href="#${sections[s].abbr}">${sections[s].name}</a></h3>
            <ul>`;
        for (var r in sections[s].rules)
            result += `<li id="${sections[s].rules[r].abbr}">
                <a href="#${sections[s].rules[r].abbr}">&sect;</a>
                ${sections[s].rules[r].text}
                </li>`;
        result += '</ul>\n';
    }

    return result;

};

/**
 * @TODO Document.
 */

const retrieveProfile = function(query) {

    var result = {};

    if (query && query.profile) {
        const codename = query.profile.trim().toUpperCase();
        if (rulesWrapper && rulesWrapper.hasOwnProperty(codename)) {
            const profile = rulesWrapper[codename];
            result.abbr = profile.abbr;
            result.name = '<em>' + profile.name + '</em>';
            result.body = formatRules(profile.sections);
        }
        else {
            result.error = '<p>Error: unknown profile <code>' + query.profile + '</code>.</p>\n';
        }
    }
    else {
        result.error = '<p>Error: no profile specified. Try appending eg <code>?profile=wd</code> to the URL.</p>\n';
    }

    return result;

};

/**
 * Set up HTML views using templates and Express Handlebars.
 *
 * @param {Object} app - the Express application.
 */

const setUp = function(app) {

    const hb = handlebars.create({defaultLayout:'main'});
    app.engine('handlebars', hb.engine);
    app.set('view engine', 'handlebars');

    app.get('/', function(req, res) {
        res.render('index', {DEBUG: DEBUG, BASE_URI: BASE_URI, version: version, nav: nav, interactive: true});
    });

    app.get('/doc', function(req, res) {
        res.render('doc', {DEBUG: DEBUG, BASE_URI: BASE_URI, version: version, nav: nav, title: 'documentation', profiles: listProfiles()});
    });

    app.get('/doc/rules', function(req, res) {
        res.render('doc/rules', {
            DEBUG: DEBUG,
            BASE_URI: BASE_URI,
            version: version,
            nav: nav,
            title: 'publication rules',
            content: retrieveProfile(req.query),
            scroll: true,
        });
    });

    // Sections without any additional logic:
    app.get('/sitemap', serveStraight);
    app.get('/help', serveStraight);

    // Pending sections:
    app.get('/about', handleWIP);

    // Catch-all:
    app.get('*', handleWrongPage);

};

exports.setUp = setUp;
