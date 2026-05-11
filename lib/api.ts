/**
 * @file REST API.
 */

import { fileTypeFromFile } from 'file-type';
import type { Express, Request, Response } from 'express';

import { processParams, specberusVersion } from './util.js';
import {
    ExceptionsError,
    Specberus,
    type SpecberusResult,
    type ValidateOptions,
} from './validator.js';

/** Sends the result to the client. */
const sendResult = function (res: Response, result: SpecberusResult) {
    delete result.metadata.file;
    res.status(result.success ? 200 : 400).json(result);
};

/**
 * Sends a list of validation errors or processing exceptions to the client.
 * @param res Express Response
 * @param errors Array of error message strings
 * @param type 'error' to indicate invalid input, or 'exception' to indicate unexpected internal errors
 */
function sendErrors(
    res: Response,
    errors: string[],
    type: 'error' | 'exception'
) {
    res.status(type === 'error' ? 400 : 500).json({
        errors: errors.map(error => ({ [type]: error })),
        info: [],
        metadata: {},
        success: false,
        warnings: [],
    } satisfies SpecberusResult);
}

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
    promise: Promise<SpecberusResult>,
    res: Response,
    metadataOverride?: Record<string, any>
) {
    return promise.then(
        result => {
            sendResult(
                res,
                metadataOverride
                    ? { ...result, metadata: metadataOverride }
                    : result
            );
        },
        (error: ExceptionsError) => {
            sendErrors(res, error.exceptions, 'exception');
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
        return sendErrors(res, [err.toString()], 'error');
    }

    if (shouldValidate && options.profile === 'auto') {
        const sr = new Specberus();
        try {
            const result = await sr.extractMetadata(options);
            if (result.errors.length) return sendResult(res, result);
            const meta = result.metadata;
            if (options.url) meta.url = options.url;
            else meta.file = options.file;
            let metaOptions: ValidateOptions;
            try {
                metaOptions = await processParams(meta, undefined, {
                    allowUnknownParams: true,
                });
            } catch (error) {
                return sendErrors(res, [error.toString()], 'error');
            }

            const metaSr = new Specberus();
            return handlePromise(metaSr.validate(metaOptions), res, meta);
        } catch (error) {
            sendErrors(res, [error.message], 'exception');
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
