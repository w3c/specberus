import type { Express, Request, Response } from 'express';
import handlebars from 'express-handlebars';
import { escape } from 'querystring';

import type {
    GenericRulesSection,
    RulesProfile,
    RulesSection,
} from './types.js';
import { isRuleTrack } from './util.js';

import pkg from '../package.json' with { type: 'json' };
import rules from './rules.json' with { type: 'json' };

// Settings:
const DEBUG = process && process.env && process.env.DEBUG;
const BASE_URI = `${process.env.BASE_URI ? process.env.BASE_URI : ''}/`.replace(
    /\/+$/,
    '/'
);

const nav = `<p class="pull-right">
        <a href="${BASE_URI}sitemap/">Site map</a> &middot;
        <a href="https://github.com/w3c/specberus">Github</a> &middot;
        <a href="${BASE_URI}help/">Help</a>
        </p>`;

// TODO(tripu): Document.
const serveStraight = function (req: Request, res: Response) {
    const fragment = req.path.replace(/^\/|\/$/gi, '');
    res.render(fragment, {
        DEBUG,
        BASE_URI,
        version: pkg.version,
        nav,
        title: fragment,
    });
};

// TODO(tripu): Document.
const handleWrongPage = function (_: Request, res: Response) {
    res.render('error', {
        DEBUG,
        BASE_URI,
        version: pkg.version,
        nav,
        title: 'whut?',
    });
};

/** Profile object as returned by listProfiles (distinct from rules.json) */
interface Profile {
    order: number;
    abbr: string;
    name: string;
}

// TODO(tripu): Document.
function listProfiles() {
    const result = [];
    const sortByOrderField = (a: Profile, b: Profile) => {
        if (!a.order || !b.order) return 0;
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
        return 0;
    };
    for (const t in rules) {
        if (isRuleTrack(t)) {
            const rule = rules[t];
            result.push({
                order: rule.order,
                abbr: t,
                name: rule.name,
                profiles: [] as Profile[],
            });
            for (const [p, profile] of Object.entries(rule.profiles))
                result[result.length - 1].profiles.push({
                    order: profile.order,
                    abbr: p,
                    name: profile.name,
                });
            result[result.length - 1].profiles.sort(sortByOrderField);
        }
        result.sort(sortByOrderField);
    }
    return result;
}
export const sortedProfiles = listProfiles();

// TODO(tripu): Document.
function formatRules(sections: Record<string, RulesSection>) {
    const commonSections = rules['*'].sections as Record<
        string,
        GenericRulesSection
    >;
    const total = [];
    for (const s in sections) {
        let result = `<h3 id ="${s}"><a href="#${s}">${sections[s].name}</a></h3>
            <ul>`;
        for (const [r, rValue] of Object.entries(sections[s].rules))
            if (typeof rValue === 'boolean') {
                // Common rule, with no parameters
                result += `<li id="${r}">
                    <a href="#${r}">&sect;</a>
                    ${commonSections[s].rules[r]}
                    </li>`;
            } else if (typeof rValue === 'string') {
                // Specific rule
                result += `<li id="${r}">
                    <a href="#${r}">&sect;</a>
                    ${rValue}
                    </li>`;
            } else if (typeof rValue === 'object') {
                // Array (common rule with parameters)
                const values = rValue;
                let template = commonSections[s].rules[r];
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
            new RegExp(`@{year}`, 'g'),
            '' + new Date().getFullYear()
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
}

interface RetrieveProfileResult {
    abbr: string;
    name: string;
    body: string;
}

// TODO(tripu): Document.
function retrieveProfile(query: qs.ParsedQs) {
    let result: RetrieveProfileResult | { error: string } | undefined;

    if (query && query.profile && typeof query.profile === 'string') {
        const codename = escape(query.profile).trim().toUpperCase();
        if (rules)
            for (const t in rules) {
                if (isRuleTrack(t)) {
                    const profiles = rules[t].profiles;
                    if (Object.hasOwn(profiles, codename)) {
                        const profile = profiles[
                            codename as keyof typeof profiles
                        ] as RulesProfile;
                        result = {
                            abbr: codename,
                            name: `<em>${profile.name}</em>`,
                            body: formatRules(profile.sections),
                        };
                    }
                }
            }
        if (!result)
            result = {
                error: `<p>Error: unknown profile <code>${escape(
                    query.profile
                )}</code>.</p>\n`,
            };
    } else
        result = {
            error: '<p>Error: no profile specified. Try appending eg <code>?profile=WD</code> to the URL.</p>\n',
        };

    return result;
}

/**
 * Set up HTML views using templates and Express Handlebars.
 */
export function setUp(app: Express) {
    const hb = handlebars.create({ defaultLayout: 'main' });
    app.engine('handlebars', hb.engine);
    app.set('view engine', 'handlebars');

    app.get('/', (_, res) => {
        res.render('index', {
            DEBUG,
            BASE_URI,
            version: pkg.version,
            nav,
            interactive: true,
            tracks: sortedProfiles,
        });
    });

    app.get('/doc', (_, res) => {
        res.render('doc', {
            DEBUG,
            BASE_URI,
            version: pkg.version,
            nav,
            title: 'documentation',
            tracks: sortedProfiles,
        });
    });

    app.get('/doc/rules', (req, res) => {
        res.render('doc/rules', {
            DEBUG,
            BASE_URI,
            version: pkg.version,
            nav,
            title: 'publication rules',
            content: retrieveProfile(req.query),
            scroll: true,
        });
    });

    // Sections without any additional logic:
    app.get('/sitemap', serveStraight);
    app.get('/help', serveStraight);

    // Catch-all:
    app.get(/(.*)/, handleWrongPage);
}
