/**
 * @file REST API.
 */

import EventEmitter from 'events';

import { fileTypeFromFile } from 'file-type';
import type { Express, Request, Response } from 'express';

import { buildJSONresult, processParams } from './util.js';
import { Specberus } from './validator.js';
import type { HandlerMessage } from './types.js';

import pkg from '../package.json' with { type: 'json' };

/**
 * Send the JSON result to the client.
 *
 * @param errors - errors
 * @param warnings - warnings
 * @param info - informative messages
 * @param res - Express HTTP response
 * @param metadata - dictionary with some found metadata
 */
const sendJSONresult = function (
    res: Response,
    errors: HandlerMessage[] = [],
    warnings: HandlerMessage[] = [],
    info: HandlerMessage[] = [],
    metadata: Record<string, string> = {}
) {
    delete metadata.file;
    const wrapper = buildJSONresult(errors, warnings, info, metadata);
    res.status(wrapper.success ? 200 : 400).json(wrapper);
};

const getFullUrl = (req: Request) =>
    new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`);

/**
 * Handle an API request: parse method and parameters, handle common errors and call the validator.
 */
const processGet = () => async (req: Request, res: Response) => {
    const path = getFullUrl(req).pathname;
    if (path === '/api/version') {
        res.status(200).send(pkg.version);
    } else if (path === '/api/metadata' || path === '/api/validate') {
        await processRequest(req, res, req.query);
    } else {
        res.status(400).send('Wrong API endpoint.');
    }
};

const processPost = () => async (req: Request, res: Response) => {
    const path = getFullUrl(req).pathname;

    if (path === '/api/metadata' || path === '/api/validate') {
        if (!req.files || !req.files.file) {
            return res.send({
                status: 400,
                message: 'Missing file.',
            });
        }
        if (Array.isArray(req.files.file)) {
            return res.send({
                status: 400,
                message: 'Expected a single file.',
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

function createHandler(res: Response) {
    const metaErrors: HandlerMessage[] = [];
    const warnings: HandlerMessage[] = [];
    const info: HandlerMessage[] = [];
    const handler = new EventEmitter();
    handler.on('error', (...data) => {
        metaErrors.push(Object.assign({}, ...data));
    });
    handler.on('end-all', () => {
        sendJSONresult(res, metaErrors, warnings, info);
    });
    handler.on('warning', (...data) => {
        warnings.push(Object.assign({}, ...data));
    });
    handler.on('info', (...data) => {
        info.push(Object.assign({}, ...data));
    });
    handler.on('exception', data => {
        sendJSONresult(res, [data.message ? data.message : data]);
    });
    return handler;
}

const processRequest = async (
    req: Request,
    res: Response,
    params: qs.ParsedQs
) => {
    const shouldValidate = getFullUrl(req).pathname === '/api/validate';

    let options;
    try {
        options = await processParams(params, undefined, {
            required: shouldValidate ? ['profile'] : [],
            forbidden: ['document', 'source'],
        });
    } catch (err) {
        return sendJSONresult(res, [err.toString()]);
    }

    if (shouldValidate && options.profile === 'auto') {
        const errors: HandlerMessage[] = [];
        const sr = new Specberus();
        const handler = new EventEmitter();
        handler.on('error', (...data) => {
            errors.push(Object.assign({}, ...data));
        });
        handler.on('end-all', async data => {
            if (errors.length) sendJSONresult(res, errors);
            else {
                const meta = data.metadata;
                if (options.url) meta.url = options.url;
                else meta.file = options.file;
                let metaOptions;
                try {
                    metaOptions = await processParams(meta, undefined, {
                        allowUnknownParams: true,
                    });
                } catch (err) {
                    return sendJSONresult(res, [err.toString()]);
                }
                metaOptions.validation = 'simple-validation';
                metaOptions.events = createHandler(res);

                const metaSr = new Specberus();
                metaSr.validate(metaOptions);
            }
        });
        handler.on('exception', data => {
            sendJSONresult(res, [data.message ? data.message : data]);
        });
        options.events = handler;
        sr.extractMetadata(options);
    } else {
        options.events = createHandler(res);
        options.additionalMetadata = req.query.additionalMetadata === 'true';

        const sr = new Specberus();
        if (shouldValidate) sr.validate(options);
        else sr.extractMetadata(options);
    }
};

export const setUp = function (app: Express) {
    app.get(/\/api\/.*/, processGet());
    app.post(/\/api\/.*/, processPost());
};
