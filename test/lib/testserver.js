// start an server to host doc, response to sr.url requests
import express from 'express';
import pth, { dirname } from 'path';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';

const DEFAULT_PORT = 8001;
const PORT = process.env.PORT || DEFAULT_PORT;
const ENDPOINT = `http://localhost:${PORT}`;

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();
app.use('/docs', express.static(pth.join(__dirname, 'docs')));

// use express-handlebars
app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: pth.join(__dirname, '../doc-views/layout/spec'),
        layoutsDir: pth.join(__dirname, '../doc-views'),
        partialsDir: pth.join(__dirname, '../doc-views/partials/'),
    })
);
app.set('view engine', 'handlebars');
app.set('views', pth.join(__dirname, '../doc-views'));

function renderByConfig(req, res) {
    const { rule, type } = req.query;
    const suffix = req.params.track
        ? `${req.params.track}/${req.params.profile}`
        : req.params.profile;

    // get data for template from json (.js)
    const path = pth.join(
        __dirname,
        `../doc-views/${req.params.docType}/${suffix}.js`
    );

    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    import(path).then(module => {
        const data = module.default;

        let finalData;
        if (!type)
            res.send(
                '<h1>Error: please add the parameter "type" in the URL </h1>'
            );
        else if (type.startsWith('good')) {
            finalData = data[type];
        } else {
            if (!rule)
                res.send(
                    '<h1>Error: please add the parameter "rule" in the URL </h1>'
                );

            // for data causes error, make rule and the type of error specific.
            finalData = data[rule][type];
        }
        res.render(pth.join(__dirname, '../doc-views/layout/spec'), finalData);
    });
}

app.get('/doc-views/:docType/:track/:profile', renderByConfig);
app.get('/doc-views/:docType/:profile', renderByConfig);

// config single redirection
app.get('/docs/links/image/logo', (req, res) => {
    res.redirect('/docs/links/image/logo.png');
});
// config single redirection to no where (404)
app.get('/docs/links/image/logo-fail', (req, res) => {
    res.redirect('/docs/links/image/logo-fail.png');
});
// config multiple redirection
app.get('/docs/links/image/logo-redirection-1', (req, res) => {
    res.redirect(301, '/docs/links/image/logo-redirection-2');
});
app.get('/docs/links/image/logo-redirection-2', (req, res) => {
    res.redirect(307, '/docs/links/image/logo-redirection-3');
});
app.get('/docs/links/image/logo-redirection-3', (req, res) => {
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
    // server run by mocha
    console.log(`\nTestserver running for mocha. \nHosting ${ENDPOINT}`);
}
