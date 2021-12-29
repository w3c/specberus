/**
 * Compose user messages.
 */

// Internal packages:
const originalRules = require('./rules.json');
const english = require('./l10n-en_GB');
// Constants:
const enGB = english.messages;

// Variables:
let lang;
const rules = {};

for (const t in originalRules)
    if (t === '*') rules[t] = originalRules[t];
    else
        for (const p in originalRules[t].profiles)
            rules[p] = originalRules[t].profiles[p];

/**
 * Set a locale to be used globally by this module.
 *
 * @param {string} language - locale, expressed as a string, eg <code>en_GB</code>.
 */

exports.setLanguage = function (language) {
    if (!language)
        throw new Error(
            'l10n.setLanguage() invoked without passing a language code as parameter'
        );
    else if (language.match(/^en([.\-_]?gb)?$/i)) lang = enGB;
    else
        throw new Error(
            'Language code passed to l10n.setLanguage() is not valid'
        );
};

/**
 * @param profileCode
 * @param rule
 * @param key
 * @param extra
 */
exports.assembleData = function (profileCode, rule, key, extra) {
    const messageData = {};
    // Corner case: if the profile is unknown, let's assume 'WD' (most common).
    const profile = profileCode ? profileCode.replace('-Echidna', '') : 'WD';
    let name;
    if (typeof rule === 'string') name = rule;
    else name = rule.name;
    if (!lang)
        throw new Error(
            'l10n.assembleData() invoked before a locale is defined; call l10n.setLanguage() first'
        );
    else if (!Object.prototype.hasOwnProperty.call(rules, profile))
        throw new Error(
            `l10n.assembleData(): unknown profile code “${profile}”`
        );
    else {
        if (!Object.prototype.hasOwnProperty.call(lang, `${name}.${key}`))
            throw new Error(
                `l10n.assembleData() could not interpret key “${name}.${key}”`
            );

        messageData.message = lang[`${name}.${key}`] || '';
        if (extra)
            messageData.message = messageData.message.replace(
                /\$\{([^}]+)\}/g,
                (m, p1) => {
                    if (Object.prototype.hasOwnProperty.call(extra, p1))
                        return extra[p1];

                    messageData.additionalMessage = `<div class="message"><strong>NB:</strong> Pubrules <em>may</em> have found an internal error while checking this rule.
Feel free to <a href="https://github.com/w3c/specberus/issues/new?title=Bug:%20could%20not%20interpolate%20variable
%20%E2%80%9C${p1}%E2%80%9Din%20rule%20%E2%80%9C${name}%E2%80%9D&labels=from-template">file this issue on GitHub</a>
to let developers examine the problem (you can submit it as is; no additional information is required).</div>`;
                    return `[unknown ${p1}]`;
                }
            );
        messageData.profile = profile;
        return messageData;
    }
};

exports.message = function (profileCode, rule, key, extra) {
    const result = {};
    const messageData = exports.assembleData(profileCode, rule, key, extra);
    if (!messageData) return;
    result.message =
        messageData.message && messageData.message.length
            ? `<div class="message">${messageData.message}</div>`
            : '';
    const { profile } = messageData;

    if (rule.section && rule.rule) {
        let selector;
        if (rules[profile].sections[rule.section]) {
            if (rules[profile].sections[rule.section].rules[rule.rule]) {
                if (
                    typeof rules[profile].sections[rule.section].rules[
                        rule.rule
                    ] === 'boolean'
                ) {
                    // Common rule, with no parameters
                    result.message += `<div class="quote">${
                        rules['*'].sections[rule.section].rules[rule.rule]
                    }</div>`;
                } else if (
                    typeof rules[profile].sections[rule.section].rules[
                        rule.rule
                    ] === 'string'
                ) {
                    // Specific rule
                    result.message += `<div class="quote">${
                        rules[profile].sections[rule.section].rules[rule.rule]
                    }</div>`;
                } else if (
                    typeof rules[profile].sections[rule.section].rules[
                        rule.rule
                    ] === 'object'
                ) {
                    // Array (common rule with parameters)
                    const values =
                        rules[profile].sections[rule.section].rules[rule.rule];
                    let template =
                        rules['*'].sections[rule.section].rules[rule.rule];
                    for (let p = 0; p < values.length; p += 1)
                        template = template.replace(
                            new RegExp(`@{param${p + 1}}`, 'g'),
                            values[p]
                        );
                    result.message += `<div class="quote">${template}</div>`;
                } else {
                    // Error
                    selector = encodeURIComponent(
                        `[${profile}][${rule.section}][${rule.rule}].text`
                    );
                }
                result.message = result.message.replace(
                    // eslint-disable-next-line prefer-regex-literals
                    new RegExp(`@{year}`, 'g'),
                    new Date().getFullYear()
                );
            } else
                selector = encodeURIComponent(
                    `[${profile}][${rule.section}][${rule.rule}]`
                );
        } else selector = encodeURIComponent(`[${profile}][${rule.section}]`);
        if (selector)
            result.message += `<div class="message"><strong>NB:</strong> Pubrules hit an internal error while checking this rule.
Please <a href="https://github.com/w3c/specberus/issues/new?title=Bug:%20missing%20L10n%20message%20
${selector}&labels=from-template">file this issue on GitHub</a> to help developers fix the problem
(you can submit it as is; no additional information is required).</div>`;
        result.id = rule.rule;
        result.name = rule.name;
    }
    if (messageData.additionalMessage)
        result.message += messageData.additionalMessage;
    return result;
};
