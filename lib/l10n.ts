/**
 * Compose user messages.
 */

import { messages } from './l10n-en_GB.js';
import originalRules from './rules.json' with { type: 'json' };
import type {
    GenericRulesSection,
    RuleBase,
    RuleMeta,
    RulesProfile,
    RulesSection,
} from './types.js';
import { isRuleTrack } from './util.js';

const enGB = messages;

type LanguageMap = Record<string, string | false>;

let lang: LanguageMap | undefined;
const profileRules: Record<string, RulesProfile> = {};

for (const t of Object.keys(originalRules))
    if (isRuleTrack(t))
        for (const [p, profile] of Object.entries(originalRules[t].profiles))
            profileRules[p] = profile;

const genericSections = originalRules['*'].sections as Record<
    string,
    GenericRulesSection
>;

/**
 * Set a locale to be used globally by this module.
 *
 * @param {string} language - locale, expressed as a string, eg <code>en_GB</code>.
 */

/**
 * @param language
 */
export function setLanguage(language: string) {
    if (!language)
        throw new Error(
            'l10n.setLanguage() invoked without passing a language code as parameter'
        );
    else if (language.match(/^en([.\-_]?gb)?$/i)) lang = enGB;
    else
        throw new Error(
            'Language code passed to l10n.setLanguage() is not valid'
        );
}

function assertLanguageDefined(
    lang: LanguageMap | undefined
): asserts lang is LanguageMap {
    if (!lang)
        throw new Error(
            'l10n.assembleData() invoked before a locale is defined; call l10n.setLanguage() first'
        );
}

export function assembleData(
    profileCode: string | null,
    rule: RuleBase | RuleMeta | string,
    key: string,
    extra?: Record<string, any>
) {
    // Corner case: if the profile is unknown, let's assume 'WD' (most common).
    const profile = profileCode ? profileCode.replace('-Echidna', '') : 'WD';
    const name = typeof rule === 'string' ? rule : rule.name;
    assertLanguageDefined(lang);

    if (!Object.hasOwn(profileRules, profile))
        throw new Error(
            `l10n.assembleData(): unknown profile code “${profile}”`
        );

    if (!Object.hasOwn(lang, `${name}.${key}`))
        throw new Error(
            `l10n.assembleData() could not interpret key “${name}.${key}”`
        );

    const messageData = {
        additionalMessage: '',
        message: lang[`${name}.${key}`] || '',
        profile,
    };

    if (extra)
        messageData.message = messageData.message.replace(
            /\$\{([^}]+)\}/g,
            (_, p1) => {
                if (Object.hasOwn(extra, p1)) return extra[p1];

                messageData.additionalMessage = `<div class="message"><strong>NB:</strong> Pubrules <em>may</em> have found an internal error while checking this rule.
Feel free to <a href="https://github.com/w3c/specberus/issues/new?title=Bug:%20could%20not%20interpolate%20variable
%20%E2%80%9C${p1}%E2%80%9Din%20rule%20%E2%80%9C${name}%E2%80%9D&labels=from-template">file this issue on GitHub</a>
to let developers examine the problem (you can submit it as is; no additional information is required).</div>`;
                return `[unknown ${p1}]`;
            }
        );
    return messageData;
}

export function message(
    profileCode: string | null,
    rule: RuleBase | RuleMeta | string,
    key: string,
    extra?: Record<string, any>
) {
    const messageData = assembleData(profileCode, rule, key, extra);
    if (!messageData) return;
    let message =
        messageData.message && messageData.message.length
            ? `<div class="message">${messageData.message}</div>`
            : '';
    const { profile } = messageData;

    if (typeof rule === 'object' && 'rule' in rule) {
        let selector;
        const profileSections = profileRules[profile].sections as Record<
            string,
            RulesSection
        >;
        if (profileSections[rule.section]) {
            if (profileSections[rule.section].rules[rule.rule]) {
                const genericRules =
                    genericSections[
                        rule.section as keyof typeof genericSections
                    ].rules;
                const genericRule =
                    genericRules[rule.rule as keyof typeof genericRules];
                const profileRule =
                    profileSections[rule.section].rules[rule.rule];
                if (typeof profileRule === 'boolean') {
                    // Common rule, with no parameters
                    message += `<div class="quote">${genericRule}</div>`;
                } else if (typeof profileRule === 'string') {
                    // Specific rule
                    message += `<div class="quote">${profileRule}</div>`;
                } else if (typeof profileRule === 'object') {
                    // Array (common rule with parameters)
                    const template = profileRule.reduce(
                        (rule, value, i) =>
                            rule.replace(
                                new RegExp(`@{param${i + 1}}`, 'g'),
                                value
                            ),
                        genericRule
                    );
                    message += `<div class="quote">${template}</div>`;
                } else {
                    // Error
                    selector = encodeURIComponent(
                        `[${profile}][${rule.section}][${rule.rule}].text`
                    );
                }
                message = message.replace(
                    new RegExp(`@{year}`, 'g'),
                    '' + new Date().getFullYear()
                );
            } else
                selector = encodeURIComponent(
                    `[${profile}][${rule.section}][${rule.rule}]`
                );
        } else selector = encodeURIComponent(`[${profile}][${rule.section}]`);
        if (selector)
            message += `<div class="message"><strong>NB:</strong> Pubrules hit an internal error while checking this rule.
Please <a href="https://github.com/w3c/specberus/issues/new?title=Bug:%20missing%20L10n%20message%20
${selector}&labels=from-template">file this issue on GitHub</a> to help developers fix the problem
(you can submit it as is; no additional information is required).</div>`;
    }
    if (messageData.additionalMessage) message += messageData.additionalMessage;
    if (typeof rule === 'object' && 'rule' in rule)
        return { id: rule.rule, name: rule.name, message };
    return { message };
}
