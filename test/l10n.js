/**
 * Test L10n features.
 */

// External packages:
const expect = require('expect.js');

// Internal packages:
const wording = require('../lib/rules')
,   selectors = require('../lib/l10n-selectors')
;

describe('L10n', function() {

    describe('UI messages module', function() {
        it('Should be a valid object', function() {
            expect(wording).to.be.an('object');
        });
    });

    describe('Selectors module', function() {
        const s = selectors.selectors;
        it('Should be a valid object', function() {
            expect(s).to.be.an('object');
        });
        it('Should contain only selectors that resolve correctly', function() {
            var message;
            Object.keys(s).forEach(function (key) {
                message = eval('wording.' + [s[key]]);
                expect(message).to.be.a('string');
            });
        });
    });

});
