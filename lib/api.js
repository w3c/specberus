/**
 * REST API.
 */

// Internal packages:
const package = require('../package.json')
,   sink = require('./sink')
,   util = require('./util')
,   validator = require('./validator')
;

const Sink = sink.Sink
,   version = package.version
;

/**
 * Handle an API request: parse method and parameters, handle common errors and call the validator.
 *
 * @param {Object} req - HTTP request.
 * @param {Object} res - HTTP result.
 */

const processRequest = function(req, res) {

    if ('/api/version' === req.path) {
        res.status(200).send(version);
    }
    else if ('/api/metadata' === req.path || '/api/validate' === req.path) {
        const validate = ('/api/validate' === req.path);
        var v
        ,   v2
        ,   options
        ,   options2
        ,   errors
        ,   errors2
        ,   handler
        ,   handler2
        ;
        try {
            options = util.processParams(
                req.query,
                undefined,
                {required: (validate ? ['profile'] : []), forbidden: ['document', 'source']}
            );
        }
        catch (err) {
            return res.status(400).send(err.toString());
        }
        if (validate && 'auto' === options.profile) {
            errors = [];
            v = new validator.Specberus
            handler = new Sink(function(data) {
                errors.push(data);
            }, function(data) {
                if (errors.length > 0)
                    res.status(400).send(errors);
                else {
                    if (options.url)
                        data.url = options.url;
                    else
                        data.file = options.file;
                    try {
                        options2 = util.processParams(
                            data,
                            undefined,
                            {allowUnknownParams: true}
                        );
                    }
                    catch (err) {
                        return res.status(400).send(err.toString());
                    }
                    options2.validation = 'simple-validation';
                    options2.processDocument = 'http://www.w3.org/2015/Process-20150901/' === data.process ? '2015' : '2005';
                    options2.noRecTrack = !data.rectrack;
                    errors2 = [];
                    v2 = new validator.Specberus
                    handler2 = new Sink(function(data2) {
                        errors2.push(data2);
                    }, function(data2) {
                        if (errors2.length > 0)
                            res.status(400).send(errors2);
                        else
                            res.status(200).send(data2);
                    });
                    options2.events = handler2;
                    v2.validate(options2);
                }
            });
            options.events = handler;
            v.extractMetadata(options);
        }
        else {
            errors = [];
            v = new validator.Specberus
            handler = new Sink(function(data) {
                errors.push(data);
            }, function(data) {
                if (errors.length > 0)
                    res.status(400).send(errors);
                else if (validate)
                    res.status(200).send(data);
                else
                    res.status(200).send(v.meta);
            });
            options.events = handler;
            if (validate)
                v.validate(options);
            else
                v.extractMetadata(options);
        }
    }
    else {
        res.status(400).send('Wrong API method.');
    }

};

const setUp = function(app) {
    app.get('/api/*', processRequest);
};

exports.setUp = setUp;
