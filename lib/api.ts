/**
 * @file REST API.
 */

import { fileTypeFromFile } from 'file-type';
import type { Express, Request, Response } from 'express';

import type { HandlerMessage, ParsedQs } from './types.js';
import { processParams, specberusVersion } from './util.js';
import {
    ExceptionsError,
    Specberus,
    type SpecberusResult,
    type ValidateOptions,
} from './specberus.js';

/** Data types emitted by error events */
type ErrorHandlerMessage =
    | { error: string }
    | { exception: string }
    | HandlerMessage;

interface ApiResult extends Omit<SpecberusResult, 'errors'> {
    errors: ErrorHandlerMessage[];
}

/** Sends the result to the client. */
const sendResult = function (res: Response, result: SpecberusResult) {
    delete result.metadata.file;
    res.status(result.success ? 200 : 400).json(result);
};

/**
 * Sends a list of validation errors or processing exceptions to the client.
 * @param res Express Response
 * @param error An ExceptionsError (yields HTTP 500), or any other error (yields HTTP 400)
 */
function sendErrors(res: Response, error: ExceptionsError | Error) {
    res.status(error instanceof ExceptionsError ? 500 : 400).json({
        errors:
            error instanceof ExceptionsError
                ? error.exceptions.map(exception => ({ exception }))
                : [{ error: error.toString() }],
        info: [],
        metadata: {},
        success: false,
        warnings: [],
    } satisfies ApiResult);
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
            return res.status(400).send({
                message: 'Missing file.',
            });
        }
        if (Array.isArray(req.files.file)) {
            return res.status(400).send({
                message: 'Expected a single file.',
            });
        }
        try {
            const { tempFilePath } = req.files.file;

            // file must be an html file
            const type = await fileTypeFromFile(tempFilePath);
            if (type != null) {
                return res.status(400).send({
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
            sendErrors(res, error);
        }
    );
}

const processRequest = async (
    req: Request,
    res: Response,
    params: ParsedQs
) => {
    const shouldValidate = getFullUrl(req).pathname === '/api/validate';

    let options;
    try {
        options = await processParams(params, undefined, {
            required: shouldValidate ? ['profile'] : [],
            forbidden: ['source'],
        });
    } catch (error) {
        return sendErrors(res, error);
    }

    if (shouldValidate && options.profile === 'auto') {
        const sr = new Specberus();
        const result = await sr
            .extractMetadata(options)
            .catch((error: ExceptionsError) => {
                sendErrors(res, error);
            });
        if (!result) return;
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
            return sendErrors(res, error);
        }

        const metaSr = new Specberus();
        return handlePromise(metaSr.validate(metaOptions), res, meta);
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
