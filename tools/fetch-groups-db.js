// This script updates our local database of groups
//  Usage: node fetch-groups-db.js your-w3c-user your-w3c-password

// XXX also look at https://cvs.w3.org/Team/WWW/2000/04/mem-news/groups.rdf

const fs = require('fs');
const pth = require('path');
const ua = require('superagent');
const { JSDOM } = require('jsdom');

const user = process.argv[2];
const pass = process.argv[3];
const results = {};
if (!user || !pass) {
    throw new Error(
        'Please pass in your W3C username and password to fetch from the groups page.'
    );
}

/**
 * @param str source string to normalize
 * @returns {string} whitespace normalized string
 */
function norm(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s+/g, ' ');
}

/**
 * @param err
 * @param res
 */
function munge(err, res) {
    const jsdom = new JSDOM(res.text);
    const jsDocument = jsdom.window.document;

    jsDocument.querySelectorAll('tr.WG, tr.IG, tr.CG').forEach(tr => {
        const tds = tr.querySelectorAll('td');
        const td1 = tds && tds[0];
        const td4 = tds && tds[3];
        const name = td1 && norm(td1.textContent);
        let href =
            td1 &&
            td1.querySelector('a') &&
            td1.querySelector('a').getAttribute('href');
        if (td4) {
            td4.querySelectorAll('a').forEach(element => {
                let list = element.textContent;
                if (!/@w3\.org$/.test(list)) list += '@w3.org';
                // eslint-disable-next-line no-unused-expressions
                if (href.indexOf('http') === 0) true;
                else if (href.indexOf('/') === 0)
                    href = `https://www.w3.org${href}`;
                else if (/^(\.\.\/){2}\w/.test(href))
                    href = `https://www.w3.org/${href.replace(
                        /^(\.\.\/){2}/,
                        ''
                    )}`;
                else
                    console.error(
                        '--------------- UNKNOWN URL FORM -------------------'
                    );
                results[list] = { name, href };
            });
        }
    });
    fs.writeFileSync(
        pth.join(__dirname, '../lib/groups-db.json'),
        JSON.stringify(results, null, 4)
    );
}

ua.get('https://www.w3.org/Member/Mail/Overview.html')
    .auth(user, pass)
    .buffer(true)
    .end(munge);

// munge(err, { text: fs.readFileSync(pth.join(__dirname, "groups.html"), "utf8") });
