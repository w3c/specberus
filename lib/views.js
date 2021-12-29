/**
 * Views.
 */

// Settings:
const DEBUG = process && process.env && process.env.DEBUG;
const BASE_URI = `${process.env.BASE_URI ? process.env.BASE_URI : ''}/`.replace(
    /\/+$/,
    '/'
);
// Internal packages:
const handlebars = require('express-handlebars');
const rules = require('./rules.json');
const self = require('../package.json');
// External packages:

const { version } = self;
const nav = `<p class="pull-right">
        <a href="${BASE_URI}about/">About</a> &middot;
        <a href="${BASE_URI}sitemap/">Site map</a> &middot;
        <a href="https://github.com/w3c/specberus">Github</a> &middot;
        <a href="${BASE_URI}help/">Help</a>
        </p>`;
/**
 * @TODO Document.
 */

const serveStraight = function (req, res) {
    const fragment = req.path.replace(/^\/|\/$/gi, '');
    res.render(fragment, {
        DEBUG,
        BASE_URI,
        version,
        nav,
        title: fragment,
    });
};

/**
 * @TODO Document.
 */

const handleWIP = function (req, res) {
    res.render('wip', {
        DEBUG,
        BASE_URI,
        version,
        nav,
        title: 'coming soon',
    });
};

/**
 * @TODO Document.
 */

const handleWrongPage = function (req, res) {
    res.render('error', {
        DEBUG,
        BASE_URI,
        version,
        nav,
        title: 'whut?',
    });
};

/**
 * @TODO Document.
 */

const listProfiles = function () {
    const result = [];
    const sortByOrderField = (a, b) => {
        if (a.order < b.order) return -1;
        if (a.order > b.order) return +1;
        return 0;
    };
    for (const t in rules) {
        if (t !== '*') {
            result.push({
                order: rules[t].order,
                abbr: t,
                name: rules[t].name,
                profiles: [],
            });
            for (const p in rules[t].profiles)
                result[result.length - 1].profiles.push({
                    order: rules[t].profiles[p].order,
                    abbr: p,
                    name: rules[t].profiles[p].name,
                });
            result[result.length - 1].profiles.sort(sortByOrderField);
        }
        result.sort(sortByOrderField);
    }
    return result;
};

const sortedProfiles = listProfiles();
exports.sortedProfiles = sortedProfiles;
/**
 * @TODO Document.
 */

const formatRules = function (sections, common) {
    const total = [];
    for (const s in sections) {
        let result = `<h3 id ="${s}"><a href="#${s}">${sections[s].name}</a></h3>
            <ul>`;
        for (const r in sections[s].rules)
            if (typeof sections[s].rules[r] === 'boolean') {
                // Common rule, with no parameters
                result += `<li id="${r}">
                    <a href="#${r}">&sect;</a>
                    ${common.sections[s].rules[r]}
                    </li>`;
            } else if (typeof sections[s].rules[r] === 'string') {
                // Specific rule
                result += `<li id="${r}">
                    <a href="#${r}">&sect;</a>
                    ${sections[s].rules[r]}
                    </li>`;
            } else if (typeof sections[s].rules[r] === 'object') {
                // Array (common rule with parameters)
                const values = sections[s].rules[r];
                let template = common.sections[s].rules[r];
                for (let p = 0; p < values.length; p += 1)
                    template = template.replace(
                        new RegExp(`@{param${p + 1}}`, 'g'),
                        values[p]
                    );
                result += `<li id="${r}">
                    <a href="#${r}">&sect;</a>
                    ${template}
                    </li>`;
            }
        result += '</ul>\n';
        result = result.replace(
            // eslint-disable-next-line prefer-regex-literals
            new RegExp(`@{year}`, 'g'),
            new Date().getFullYear()
        );
        total.push({ order: sections[s].name, content: result });
    }

    return total
        .sort((a, b) => {
            if (a.order < b.order) return -1;
            if (a.order > b.order) return +1;
            return 0;
        })
        .map(a => a.content)
        .join('');
};

/**
 * @TODO Document.
 */

const retrieveProfile = function (query) {
    const qs = require('querystring');
    const result = {};

    if (query && query.profile) {
        const codename = qs.escape(query.profile).trim().toUpperCase();
        if (rules)
            for (const t in rules)
                if (
                    t !== '*' &&
                    Object.prototype.hasOwnProperty.call(
                        rules[t].profiles,
                        codename
                    )
                ) {
                    const profile = rules[t].profiles[codename];
                    result.abbr = codename;
                    result.name = `<em>${profile.name}</em>`;
                    result.body = formatRules(profile.sections, rules['*']);
                }
        if (Object.keys(result).length === 0)
            result.error = `<p>Error: unknown profile <code>${qs.escape(
                query.profile
            )}</code>.</p>\n`;
    } else
        result.error =
            '<p>Error: no profile specified. Try appending eg <code>?profile=WD</code> to the URL.</p>\n';

    return result;
};

/**
 * Set up HTML views using templates and Express Handlebars.
 *
 * @param {object} app - the Express application.
 */

const setUp = function (app) {
    const hb = handlebars.create({ defaultLayout: 'main' });
    app.engine('handlebars', hb.engine);
    app.set('view engine', 'handlebars');

    app.get('/', (req, res) => {
        res.render('index', {
            DEBUG,
            BASE_URI,
            version,
            nav,
            interactive: true,
            tracks: sortedProfiles,
        });
    });

    app.get('/doc', (req, res) => {
        res.render('doc', {
            DEBUG,
            BASE_URI,
            version,
            nav,
            title: 'documentation',
            tracks: sortedProfiles,
        });
    });

    app.get('/doc/rules', (req, res) => {
        res.render('doc/rules', {
            DEBUG,
            BASE_URI,
            version,
            nav,
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
