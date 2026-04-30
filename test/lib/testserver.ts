/** @file Starts a server to host doc, response to sr.url requests */

import express, { type Request, type Response } from 'express';
import { dirname, join } from 'path';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';

const DEFAULT_PORT = 8001;
const PORT = process.env.PORT || DEFAULT_PORT;
const ENDPOINT = `http://localhost:${PORT}`;

const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();
app.use('/docs', express.static(join(__dirname, 'docs')));

// use express-handlebars
app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: join(__dirname, '..', 'doc-views', 'layout', 'spec'),
        layoutsDir: join(__dirname, '..', 'doc-views'),
        partialsDir: join(__dirname, '..', 'doc-views', 'partials'),
    })
);
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, '..', 'doc-views'));

async function renderByConfig(req: Request, res: Response) {
    const { rule, type } = req.query;
    const suffix = req.params.track
        ? `${req.params.track}/${req.params.profile}`
        : req.params.profile;

    // get data for template from json (.js)
    const path = join(
        __dirname,
        '..',
        'doc-views',
        `${req.params.docType}`,
        `${suffix}.js`
    );
    const data = (await import(path)).default;
    let finalData;

    if (typeof type !== 'string') {
        res.status(400).send(
            '<h1>Error: please add the parameter "type" in the URL </h1>'
        );
        return;
    } else if (type.startsWith('good')) {
        finalData = data[type];
    } else {
        if (typeof rule !== 'string') {
            res.status(400).send(
                '<h1>Error: please add the parameter "rule" in the URL </h1>'
            );
            return;
        }
        // for data causes error, make rule and the type of error specific.
        finalData = data[rule][type];
    }

    res.render(join(__dirname, '..', 'doc-views', 'layout', 'spec'), finalData);
}

app.get('/doc-views/:docType/:track/:profile', renderByConfig);
app.get('/doc-views/:docType/:profile', renderByConfig);

// config single redirection
app.get('/docs/links/image/logo', (_, res) => {
    res.redirect('/docs/links/image/logo.png');
});
// config single redirection to no where (404)
app.get('/docs/links/image/logo-fail', (_, res) => {
    res.redirect('/docs/links/image/logo-fail.png');
});
// config multiple redirection
app.get('/docs/links/image/logo-redirection-1', (_, res) => {
    res.redirect(301, '/docs/links/image/logo-redirection-2');
});
app.get('/docs/links/image/logo-redirection-2', (_, res) => {
    res.redirect(307, '/docs/links/image/logo-redirection-3');
});
app.get('/docs/links/image/logo-redirection-3', (_, res) => {
    res.redirect('/docs/links/image/logo.png');
});

// if run from `npm run testserver`, console sample links.
if (import.meta.url === `file://${process.argv[1]}`) {
    app.listen(PORT, async () => {
        console.log(
            `===== Local test server running at ===== \n===== ${ENDPOINT} =====`
        );
        console.log(
            `\nGood document link e.g. \n${ENDPOINT}/doc-views/TR/Registry/CRY?type=good`
        );
        console.log(
            `\nBad document link e.g. \n${ENDPOINT}/doc-views/TR/Note/DNOTE-Echidna?rule=charter&type=noGroup`
        );
        console.log(
            `\nBad document link for Member Submission e.g. \n${ENDPOINT}/doc-views/SUBM/MEM-SUBM?rule=reliability&type=hasUnreliableLinks`
        );
    });
} else {
    // server run by test suite
    console.log(`\nTestserver running for test suite. \nHosting ${ENDPOINT}`);
}
