/**
 * Generic sink.
 */

// Native packages:
const util = require('util')
,   events = require('events')
;

/**
 * Build a generic event handler that can be used by Specberus.
 *
 * @param {Function} error - function to call in case of exception or error.
 * @param {Function} done - function to call at the very end of the process.
 */

var Sink = function(error, done) {

    this.ok = 0;
    this.errors = [];
    this.warnings = [];
    this.done = 0;

    if(error) {

        this.on('exception', function (data) {
            error(data);
        });

        this.on('err', function (data) {
            error(data);
        });

    }

    if(done) {

        this.on('end-all', function (data) {
            done(data);
        });

    }

};

util.inherits(Sink, events.EventEmitter);

exports.Sink = Sink;
