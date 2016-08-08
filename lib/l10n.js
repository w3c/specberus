/**
 * Compose user messages.
 */

// Internal packages:
const rulesWrapper = require('./rules-wrapper')
,   english = require('./l10n-en_GB')
;

// Constants:
const en_GB = english.messages;

// Variables:
var lang;

/**
 * Set a locale to be used globally by this module.
 *
 * @param {String} language - locale, expressed as a string, eg <code>en_GB</code>.
 */

exports.setLanguage = function(language) {
    if (!language)
        throw new Error('l10n.setLanguage() invoked without passing a language code as parameter');
    else if (language.match(/^en([\.\-_]?gb)?$/i))
        lang = en_GB;
    else
        throw new Error('Language code passed to l10n.setLanguage() is not valid');
};

/**
 * @TODO Document.
 */

exports.message = function (profile, rule, key, extra) {
    const result = {};
    var name
    ,   additionalMessage = ''
    ;
    if ('string' === typeof rule)
        name = rule;
    else
        name = rule.name;
    profile = profile.replace('-Echidna', '');
    if (!lang)
        throw new Error('l10n.message() invoked before a locale is defined; call l10n.setLanguage() first');
    else if (!rulesWrapper.hasOwnProperty(profile))
        throw new Error(`l10n.message(): unknown profile code “${profile}”`);
    else {
        if (!lang.hasOwnProperty(name + '.' + key))
            throw new Error(`l10n.message() could not interpret key “${name}.${key}”`);
        result.message = lang[name + '.' + key];
        if (false === result.message)
            result.message = '';
        else
            result.message = `<div class="message">${result.message}</div>`;
        if (extra)
            result.message = result.message.replace(/\$\{([^\}]+)\}/g, function interpolate (m, p1) {
                if (extra.hasOwnProperty(p1))
                    return extra[p1];
                else {
                    additionalMessage +=
                        `<div class="message"><strong>NB:</strong> Pubrules <em>may</em> have found an internal error while checking this rule.
Feel free to <a href="https://github.com/w3c/specberus/issues/new?title=Bug:%20could%20not%20interpolate%20variable
%20%E2%80%9C${p1}%E2%80%9Din%20rule%20%E2%80%9C${name}%E2%80%9D&labels=from-template">file this issue on GitHub</a>
to let developers examine the problem (you can submit it as is; no additional information is required).</div>`;
                    return `[unknown ${p1}]`;
                }
            });
        if (rule.section && rule.rule) {
            var selector;
            if (rulesWrapper[profile][rule.section]) {
                if (rulesWrapper[profile][rule.section][rule.rule]) {
                    if (rulesWrapper[profile][rule.section][rule.rule].text) {
                        result.message += `<div class="quote">${rulesWrapper[profile][rule.section][rule.rule].text}</div>`;
                    } else
                        selector = encodeURIComponent(`[${profile}][${rule.section}][${rule.rule}].text`);
                } else
                    selector = encodeURIComponent(`[${profile}][${rule.section}][${rule.rule}]`);
            } else
                selector = encodeURIComponent(`[${profile}][${rule.section}]`);
            if (selector)
                result.message += `<div class="message"><strong>NB:</strong> Pubrules hit an internal error while checking this rule.
Please <a href="https://github.com/w3c/specberus/issues/new?title=Bug:%20missing%20L10n%20message%20
${selector}&labels=from-template">file this issue on GitHub</a> to help developers fix the problem
(you can submit it as is; no additional information is required).</div>`;
            result.id = rule.rule;
            result.name = rule.name;
        }
        if (additionalMessage)
            result.message += additionalMessage;
        return result;
    }
};
