/**
 * @file REST API.
 */

import { fileTypeFromFile } from 'file-type';
import type { Express, Request, Response } from 'express';

import { buildJSONresult, processParams, specberusVersion } from './util.js';
import {
    ExceptionsError,
    Specberus,
    type ValidateOptions,
} from './validator.js';
import type { HandlerMessage } from './types.js';

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
    // TODO(kgf): Is buildJSONresult no longer needed once promise-based APIs are used?
    const wrapper = buildJSONresult(errors, warnings, info, metadata);
    res.status(wrapper.success ? 200 : 400).json(wrapper);
};

const getFullUrl = (req: Request) =>
    new URL(`${req.protocol}://${req.host}${req.url}`);

/**
 * Handle an API request: parse method and parameters, handle common errors and call the validator.
 */
const processGet = () => async (req: Request, res: Response) => {
    const path = getFullUrl(req).pathname;
    if (path === '/api/version') {
        res.status(200).send(specberusVersion);
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

function handlePromise(
    promise: Promise<ReturnType<typeof buildJSONresult>>,
    res: Response,
    metadataOverride?: Record<string, any>
) {
    return promise.then(
        result => {
            sendJSONresult(
                res,
                result.errors,
                result.warnings,
                result.info,
                metadataOverride || result.metadata
            );
        },
        (error: ExceptionsError) => {
            sendJSONresult(
                res,
                error.exceptions.map(exception => ({ exception }))
            );
        }
    );
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
            forbidden: ['source'],
        });
    } catch (err) {
        return sendJSONresult(res, [err.toString()]);
    }

    if (shouldValidate && options.profile === 'auto') {
        const sr = new Specberus();
        try {
            const result = await sr.extractMetadata(options);
            if (result.errors.length) return sendJSONresult(res, result.errors);
            const meta = result.metadata;
            if (options.url) meta.url = options.url;
            else meta.file = options.file;
            let metaOptions: ValidateOptions;
            try {
                metaOptions = await processParams(meta, undefined, {
                    allowUnknownParams: true,
                });
            } catch (error) {
                return sendJSONresult(res, [error.toString()]);
            }

            const metaSr = new Specberus();
            return handlePromise(metaSr.validate(metaOptions), res, meta);
        } catch (error) {
            sendJSONresult(res, [error.message]);
        }
    } else {
        options.additionalMetadata = req.query.additionalMetadata === 'true';

        const sr = new Specberus();
        return handlePromise(
            shouldValidate ? sr.validate(options) : sr.extractMetadata(options),
            res
        );
    }
};

/**
 * Adds middleware for handling pubrules requests.
 * NOTE: This requires express-fileupload middleware to be hooked up separately!
 */
export const setUp = function (app: Express) {
    app.get(/\/api\/.*/, processGet());
    app.post(/\/api\/.*/, processPost());
};
