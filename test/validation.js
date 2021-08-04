/**
 * Test HTML and CSS checkers.
 *
 * This file is not runnable by Mocha directly; it is used by "rules.js".
 *
 * HTML and CSS validations often time out, and Travis CI thinks the build is broken when it happens.
 * Therefore, we only add these test cases when testing locally.
 * See <a href="https://github.com/w3c/specberus/issues/164">w3c/specberus#164</a> and
 * <a href="https://docs.travis-ci.com/user/ci-environment/#Environment-variables">Travis documentation</a>.
 */

if (
    !process ||
    !process.env ||
    (process.env.TRAVIS !== 'true' && !process.env.SKIP_NETWORK)
) {
    exports.html = [
        { doc: 'validation/simple.html' },
        { doc: 'validation/invalid.html', errors: ['validation.html.error'] },
    ];
}
