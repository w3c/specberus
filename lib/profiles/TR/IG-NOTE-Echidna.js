exports.name = 'IG-NOTE-Echidna';
exports.config = require('./IG-NOTE').config;

const base = require('../base');
exports.rules = base.insertAfter(require('./IG-NOTE').rules, 'sotd.status', [
    require('../../rules/echidna/todays-date'),
]);
