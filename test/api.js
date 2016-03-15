/**
 * Test the API.
 */

// Settings:
const SPECS = [
    {url: 'https://www.w3.org/TR/2016/WD-appmanifest-20160312/', profile: 'WD'}
,   {url: 'https://www.w3.org/TR/2016/CR-WebIDL-1-20160308/', profile: 'CR'}
,   {url: 'https://www.w3.org/TR/2016/PR-ttml-imsc1-20160308/', profile: 'PR'}
,   {url: 'https://www.w3.org/TR/2016/NOTE-csvw-ucr-20160225/', profile: 'WG-NOTE'}
,   {url: 'https://www.w3.org/TR/2015/REC-tabular-data-model-20151217/', profile: 'REC'}
,   {url: 'https://www.w3.org/TR/2015/WD-tracking-compliance-20150714/', profile: 'LC'}
];

// External packages:
const expect = require('expect.js');

// Internal packages:
const validator = require('../lib/validator')
,   sink = require('../lib/sink')
,   profileMetadata = require('../lib/profiles/metadata')
;

/**
 * Assert that the profile detected in a spec is equal to the known profile.
 *
 * @param {String} url - public URL of a spec.
 * @param {String} profile - profile that should be detected.
 */

const detect = function(url, profile) {
    const specberus = new validator.Specberus
    ,   handler = new sink.Sink
    ;
    handler.on('exception', function () {
    });
    handler.on('done', function () {
    });
    const opts = {events: handler, profile: profileMetadata, url: url};
    it('should detect a ' + profile, function (done) {
        handler.on('end-all', function () {
            expect(specberus.detectedProfile).to.equal(profile);
            done();
        });
        specberus.validate(opts);
    });
};

if (!process || !process.env || !process.env.SKIP_NETWORK) {

    describe('API', function() {

        describe('Method "metadata"', function() {
            for(var i in SPECS) {
                detect(SPECS[i].url, SPECS[i].profile);
            }
        });

        describe('Method "validate"', function() {
            // @TODO
        });

    });

}
