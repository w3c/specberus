exports.name = 'DNOTE';
const note = require('./NOTE');

const config = { ...note.config };
config.longStatus = 'Group Draft Note';

exports.config = config;

// const base = require('../base');
// exports.rules = base.insertAfter(note.rules, 'sotd.status', [
//     require('../../rules/sotd/note-not-endorsed'),
// ]);

exports.rules = note.rules;
