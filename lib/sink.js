/**
 * Generic sink.
 */

// Native packages:
const util = require('util')
,   events = require('events')
;

var Sink = function() {
    this.ok = 0;
    this.errors = [];
    this.warnings = [];
    this.done = 0;
};

util.inherits(Sink, events.EventEmitter);

exports.Sink = Sink;
