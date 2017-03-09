/**
 * REST API.
 */

// Internal packages:
const self = require('../package')
,   sink = require('./sink')
,   util = require('./util')
,   validator = require('./validator')
;

const Sink = sink.Sink
,   version = self.version
;

/**
 * Send the JSON result to the client.
 *
 * @param {Array} err - errors.
 * @param {Array} warn - warnings.
 * @param {Array} inf - informative messages.
 * @param {Object} res - Express HTTP response.
 * @param {Object} metadata - dictionary with some found metadata.
 */

const sendJSONresult = function(err, warn, inf, res, metadata) {

    const wrapper = util.buildJSONresult(err, warn, inf, metadata);
    res.status(wrapper.success ? 200 : 400).json(wrapper);

};

/**
 * Handle an API request: parse method and parameters, handle common errors and call the validator.
 *
 * @param {Object} req - Express HTTP request.
 * @param {Object} res - Express HTTP response.
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
        ,   warnings
        ,   warnings2
        ,   info
        ,   info2
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
            return sendJSONresult([err.toString()], [], [], res, {});
        }
        if (validate && 'auto' === options.profile) {
            errors = [];
            v = new validator.Specberus();
            handler = new Sink(function(data) {
                errors.push(data);
            }, function(data) {
                if (errors.length > 0)
                    sendJSONresult(errors, [], [], res, {});
                else {
                    var meta = data.metadata;
                    if (options.url)
                        meta.url = options.url;
                    else
                        meta.file = options.file;
                    try {
                        options2 = util.processParams(
                            meta,
                            undefined,
                            {allowUnknownParams: true}
                        );
                    }
                    catch (err) {
                        return sendJSONresult([err.toString()], [], [], res, {});
                    }
                    options2.validation = 'simple-validation';
                    options2.noRecTrack = !meta.rectrack;
                    errors2 = [];
                    warnings2 = [];
                    info2 = [];
                    v2 = new validator.Specberus();
                    handler2 = new Sink(function(data2) {
                        errors2.push(data2);
                    }, function() {
                        sendJSONresult(errors2, warnings2, info2, res, meta);
                    }, function(data2) {
                        warnings2.push(data2);
                    }, function(data2) {
                        info2.push(data2);
                    });
                    options2.events = handler2;
                    v2.validate(options2);
                }
            });
            handler.on('exception', function(data) {
                sendJSONresult([data.message ? data.message : data], [], [], res, {});
            });
            options.events = handler;
            v.extractMetadata(options);
        }
        else {
            errors = [];
            warnings = [];
            info = [];
            v = new validator.Specberus();
            handler = new Sink(function(data) {
                errors.push(data);
            }, function(data) {
                sendJSONresult(errors, warnings, info, res, data.metadata);
            }, function(data) {
                warnings.push(data);
            }, function(data) {
                info.push(data);
            });
            handler.on('exception', function(data) {
                sendJSONresult([data.message ? data.message : data], [], [], res, {});
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
