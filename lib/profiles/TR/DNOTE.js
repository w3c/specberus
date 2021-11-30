exports.name = 'DNOTE';
const note = require('./NOTE');

const config = { ...note.config };
config.status = 'DNOTE';
config.longStatus = 'Group Draft Note';
config.styleSheet = 'W3C-DNOTE';

exports.config = config;

const base = require('../base');
const rules = base.insertAfter(note.rules, 'sotd.supersedable', [
    require('../../rules/sotd/draft-stability'),
]);

exports.rules = rules;
