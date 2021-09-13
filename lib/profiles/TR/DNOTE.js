exports.name = 'DNOTE';
exports.config = require('./NOTE').config;

// TODO: delete
// const base = require('../base');
// exports.rules = base.insertAfter(require('./NOTE').rules, 'sotd.status', [
//     require('../../rules/echidna/todays-date'),
// ]);

exports.rules = require('./NOTE').rules;
