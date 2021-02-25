/**
 * REST API.
 */

// Internal packages:
const self = require('../package');
const sink = require('./sink');
const util = require('./util');
const validator = require('./validator');
const Sink = sink.Sink;
const version = self.version;
/**
 * Send the JSON result to the client.
 *
 * @param {Array} err - errors.
 * @param {Array} warn - warnings.
 * @param {Array} inf - informative messages.
 * @param {object} res - Express HTTP response.
 * @param {object} metadata - dictionary with some found metadata.
 */

const sendJSONresult = function (err, warn, inf, res, metadata) {
    const wrapper = util.buildJSONresult(err, warn, inf, metadata);
    res.status(wrapper.success ? 200 : 400).json(wrapper);
};

/**
 * Handle an API request: parse method and parameters, handle common errors and call the validator.
 *
 * @param {object} req - Express HTTP request.
 * @param {object} res - Express HTTP response.
 */

const processRequest = function (req, res) {
    if (req.path === '/api/version') {
        res.status(200).send(version);
    } else if (req.path === '/api/metadata' || req.path === '/api/validate') {
        const validate = req.path === '/api/validate';
        var v;
        var v2;
        var options;
        var options2;
        var errors;
        var errors2;
        var warnings;
        var warnings2;
        var info;
        var info2;
        var handler;
        var handler2;
        try {
            options = util.processParams(req.query, undefined, {
                required: validate ? ['profile'] : [],
                forbidden: ['document', 'source'],
            });
        } catch (err) {
            return sendJSONresult([err.toString()], [], [], res, {});
        }
        if (validate && options.profile === 'auto') {
            errors = [];
            v = new validator.Specberus();
            handler = new Sink(
                function (...data) {
                    errors.push(Object.assign({}, ...data));
                },
                function (data) {
                    if (errors.length > 0)
                        sendJSONresult(errors, [], [], res, {});
                    else {
                        var meta = data.metadata;
                        if (options.url) meta.url = options.url;
                        else meta.file = options.file;
                        try {
                            options2 = util.processParams(meta, undefined, {
                                allowUnknownParams: true,
                            });
                        } catch (err) {
                            return sendJSONresult(
                                [err.toString()],
                                [],
                                [],
                                res,
                                {}
                            );
                        }
                        options2.validation = 'simple-validation';
                        options2.noRecTrack = !meta.rectrack;
                        errors2 = [];
                        warnings2 = [];
                        info2 = [];
                        v2 = new validator.Specberus();
                        handler2 = new Sink(
                            function (...data2) {
                                errors2.push(Object.assign({}, ...data2));
                            },
                            function () {
                                sendJSONresult(
                                    errors2,
                                    warnings2,
                                    info2,
                                    res,
                                    meta
                                );
                            },
                            function (...data2) {
                                warnings2.push(Object.assign({}, ...data2));
                            },
                            function (...data2) {
                                info2.push(Object.assign({}, ...data2));
                            }
                        );
                        options2.events = handler2;
                        handler2.on('exception', function (data) {
                            sendJSONresult(
                                [data.message ? data.message : data],
                                [],
                                [],
                                res,
                                {}
                            );
                        });
                        v2.validate(options2);
                    }
                }
            );
            handler.on('exception', function (data) {
                sendJSONresult(
                    [data.message ? data.message : data],
                    [],
                    [],
                    res,
                    {}
                );
            });
            options.events = handler;
            v.extractMetadata(options);
        } else {
            errors = [];
            warnings = [];
            info = [];
            v = new validator.Specberus();
            handler = new Sink(
                function (...data) {
                    errors.push(Object.assign({}, ...data));
                },
                function (data) {
                    sendJSONresult(errors, warnings, info, res, data.metadata);
                },
                function (...data) {
                    warnings.push(Object.assign({}, ...data));
                },
                function (...data) {
                    info.push(Object.assign({}, ...data));
                }
            );
            handler.on('exception', function (data) {
                sendJSONresult(
                    [data.message ? data.message : data],
                    [],
                    [],
                    res,
                    {}
                );
            });
            options.events = handler;
            if (validate) v.validate(options);
            else v.extractMetadata(options);
        }
    } else {
        res.status(400).send('Wrong API method.');
    }
};

const setUp = function (app) {
    app.get('/api/*', processRequest);
};

exports.setUp = setUp;
