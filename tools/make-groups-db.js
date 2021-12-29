// XXX
//  This script is obsolete.
//  I keep it here in case the RDF source becomes reliable and turns out to be better than the
//  alternative we have. But for now, don't use this.

// This script is used to update the database of groups used in recognising that a draft is
// really published by the right group as per the information provided.
//
// The database is not automatically up to date with the information available on the W3C
// web site since the latter is in RDF and in any case we don't wish to hit it up for every check.
// The process to update the database we have here is simple:
//
// 1. Visit http://kwz.me/8p. Copy the JSON into groups-sparql.json
// 2. Run this script

'use strict';

const fs = require('fs');
const pth = require('path');
const src = require('./groups-sparql.json');

const res = {};
for (let i = 0, n = src.results.bindings.length; i < n; i += 1) {
    const group = src.results.bindings[i];
    const key = group.mailbox.value.replace('mailto:', '');
    res[key] = {
        url: group.homepage.value,
        name: group.name.value,
    };
}

fs.writeFileSync(
    pth.join(__dirname, '../lib/groups-db.json'),
    JSON.stringify(res, null, 4)
);
