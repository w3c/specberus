/**
 * REST API.
 */

import { fileTypeFromFile } from 'file-type';
import { Sink } from './sink.js';
import { buildJSONresult, importJSON, processParams } from './util.js';
import { Specberus } from './validator.js';

const { version } = importJSON('../package.json', import.meta.url);

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
    delete metadata.file;
    const wrapper = buildJSONresult(err, warn, inf, metadata);
    res.status(wrapper.success ? 200 : 400).json(wrapper);
};

/**
 * Handle an API request: parse method and parameters, handle common errors and call the validator.
 */
const processGet = () => async (req, res) => {
    const path = req._parsedUrl.pathname;
    if (path === '/api/version') {
        res.status(200).send(version);
    } else if (path === '/api/metadata' || path === '/api/validate') {
        await processRequest(req, res, req.query);
    } else {
        res.status(400).send('Wrong API endpoint.');
    }
};

const processPost = () => async (req, res) => {
    const path = req._parsedUrl.pathname;

    if (path === '/api/metadata' || path === '/api/validate') {
        if (!req.files || !req.files.file) {
            return res.send({
                status: 500,
                message: 'Missing file.',
            });
        }
        try {
            const { tempFilePath } = req.files.file;

            // file must be an html file
            const type = await fileTypeFromFile(tempFilePath);
            if (type != null) {
                return res.send({
                    status: 500,
                    message: 'Invalid file type. Please send an HTML file.',
                });
            }
            const params = req.body || {};
            params.file = tempFilePath;

            await processRequest(req, res, params);
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        res.status(400).send('Wrong API endpoint.');
    }
};

const processRequest = async (req, res, params) => {
    const validate = req._parsedUrl.pathname === '/api/validate';
    let v;
    let v2;
    let options;
    let options2;
    let errors;
    let errors2;
    let warnings;
    let warnings2;
    let info;
    let info2;
    let handler;
    let handler2;

    try {
        options = await processParams(params, undefined, {
            required: validate ? ['profile'] : [],
            forbidden: ['document', 'source'],
        });
    } catch (err) {
        return sendJSONresult([err.toString()], [], [], res, {});
    }
    if (validate && options.profile === 'auto') {
        errors = [];
        v = new Specberus();
        handler = new Sink(
            (...data) => {
                errors.push(Object.assign({}, ...data));
            },
            async data => {
                if (errors.length > 0) sendJSONresult(errors, [], [], res, {});
                else {
                    const meta = data.metadata;
                    if (options.url) meta.url = options.url;
                    else meta.file = options.file;
                    try {
                        options2 = await processParams(meta, undefined, {
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
                    errors2 = [];
                    warnings2 = [];
                    info2 = [];
                    v2 = new Specberus();
                    handler2 = new Sink(
                        (...data2) => {
                            errors2.push(Object.assign({}, ...data2));
                        },
                        () => {
                            sendJSONresult(
                                errors2,
                                warnings2,
                                info2,
                                res,
                                meta
                            );
                        },
                        (...data2) => {
                            warnings2.push(Object.assign({}, ...data2));
                        },
                        (...data2) => {
                            info2.push(Object.assign({}, ...data2));
                        }
                    );
                    options2.events = handler2;
                    handler2.on('exception', data => {
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
        handler.on('exception', data => {
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
        v = new Specberus();
        handler = new Sink(
            (...data) => {
                errors.push(Object.assign({}, ...data));
            },
            data => {
                sendJSONresult(errors, warnings, info, res, data.metadata);
            },
            (...data) => {
                warnings.push(Object.assign({}, ...data));
            },
            (...data) => {
                info.push(Object.assign({}, ...data));
            }
        );
        handler.on('exception', data => {
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
};

export const setUp = function (app) {
    app.get('/api/*', processGet());

    app.post('/api/*', processPost());
};
