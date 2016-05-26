/**
 * Compose user messages.
 */

// Internal packages:
const rulesWrapper = require('./rules-wrapper')
,   english = require('./l10n-en_GB')
,   spanish = require('./l10n-es_ES')
;

// Constants:
const rules = rulesWrapper.rules
,   en_GB = english.messages
,   es_ES = spanish.messages
;

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
    else if (language.match(/^es([\.\-_]?es)?$/i))
        lang = es_ES;
    else
        throw new Error('Language code passed to l10n.setLanguage() is not valid');
};

/**
 * @TODO Document.
 */

exports.message = function (profile, rule, key, extra) {
    const result = {};
    var name;
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
                else
                    throw new Error(`l10n.message() could not interpolate variable “${p1}”`);
            });
        if (rule.section && rule.rule) {
            result.message += `<div class="quote">&ldquo;${rulesWrapper[profile][rule.section][rule.rule].text}&rdquo;</div>`;
            result.id = rule.rule;
            result.name = rule.name;
        }
        return result;
    }
};
