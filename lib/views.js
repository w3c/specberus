/**
 * Views.
 */

// Settings:
const DEBUG = (process && process.env && process.env.DEBUG)
,   BASE_URI = ((process.env.BASE_URI ? process.env.BASE_URI : '') + '/').replace(/\/+$/, '/')
;

// Internal packages:
const rules = require('./rules')
,   self = require('../package')
;

// External packages:
const handlebars = require('express-handlebars');

const version = self.version
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
    const sortByOrderField = (a, b) => {
        if (a.order < b.order)
            return -1;
        else if (a.order > b.order)
            return +1;
        else
            return 0;
    };
    for (var t in rules) {
        if ('*' !== t) {
            result.push({order: rules[t].order, abbr: t, name: rules[t].name, profiles: []});
            for (var p in rules[t].profiles)
                result[result.length - 1].profiles.push({order: rules[t].profiles[p].order, abbr: p, name: rules[t].profiles[p].name});
            result[result.length - 1].profiles.sort(sortByOrderField);
        }
        result.sort(sortByOrderField);
    }
    return result;
};

const sortedProfiles = listProfiles();

/**
 * @TODO Document.
 */

const formatRules = function(sections, common) {

    var total = [];
    for (var s in sections) {
        var result = `<h3 id ="${s}"><a href="#${s}">${sections[s].name}</a></h3>
            <ul>`;
        for (var r in sections[s].rules)
            if ('boolean' === typeof sections[s].rules[r]) {
                // Common rule, with no parameters
                result += `<li id="${r}">
                    <a href="#${r}">&sect;</a>
                    ${common.sections[s].rules[r]}
                    </li>`;
            } else if ('string' === typeof sections[s].rules[r]) {
                // Specific rule
                result += `<li id="${r}">
                    <a href="#${r}">&sect;</a>
                    ${sections[s].rules[r]}
                    </li>`;
            } else if ('object' === typeof sections[s].rules[r]) {
                // Array (common rule with parameters)
                const values = sections[s].rules[r];
                var template = common.sections[s].rules[r];
                for (var p = 0; p < values.length; p ++)
                    template = template.replace(new RegExp(`@{param${p+1}}`, 'g'), values[p]);
                result += `<li id="${r}">
                    <a href="#${r}">&sect;</a>
                    ${template}
                    </li>`;
            }
        result += '</ul>\n';
        result = result.replace(new RegExp(`@{year}`, 'g'), (new Date()).getFullYear());
        total.push({order: sections[s].name, content: result});
    }

    return total.sort((a, b) => {
        if (a.order < b.order)
            return -1;
        else if (a.order > b.order)
            return +1;
        else
            return 0;
    }).map((a) => a.content).join('');

};

/**
 * @TODO Document.
 */

const retrieveProfile = function(query) {

    var result = {};

    if (query && query.profile) {
        const codename = query.profile.trim().toUpperCase();
        if (rules)
            for (var t in rules)
                if ('*' !== t && rules[t].profiles.hasOwnProperty(codename)) {
                    const profile = rules[t].profiles[codename];
                    result.abbr = codename;
                    result.name = '<em>' + profile.name + '</em>';
                    result.body = formatRules(profile.sections, rules['*']);
                }
        if (0 === Object.keys(result).length)
            result.error = '<p>Error: unknown profile <code>' + query.profile + '</code>.</p>\n';
    } else
        result.error = '<p>Error: no profile specified. Try appending eg <code>?profile=WD</code> to the URL.</p>\n';

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
        res.render('index', {DEBUG: DEBUG, BASE_URI: BASE_URI, version: version, nav: nav, interactive: true, tracks: sortedProfiles});
    });

    app.get('/doc', function(req, res) {
        res.render('doc', {DEBUG: DEBUG, BASE_URI: BASE_URI, version: version, nav: nav, title: 'documentation', tracks: sortedProfiles});
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
