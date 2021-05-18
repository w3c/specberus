// Working Draft profile

exports.name = 'WD-Echidna';
exports.config = require('./WD').config;

const base = require('../base');
exports.rules = base.insertAfter(require('./WD').rules, 'sotd.status', [
    require('../../rules/echidna/todays-date'),
]);
