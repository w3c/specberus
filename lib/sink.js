/**
 * Generic sink.
 */

// Native packages:
const util = require('util');
const events = require('events');
/**
 * Build a generic event handler that can be used by Specberus.
 *
 * @param {Function} error - function to call in case of exception or error.
 * @param {Function} done - function to call at the very end of the process.
 * @param {Function} warn - function to call in case of warning.
 * @param {Function} inf - function to call in case of informative message.
 */

const Sink = function (error, done, warn, inf) {
    this.ok = 0;
    this.errors = [];
    this.warnings = [];
    this.done = 0;

    if (error) {
        this.on('exception', data => {
            error(data);
        });
        this.on('err', (...data) => {
            error(...data);
        });
    }

    if (done) {
        this.on('end-all', data => {
            done(data);
        });
    }

    if (warn) {
        this.on('warning', (...data) => {
            warn(...data);
        });
    }

    if (inf) {
        this.on('info', (...data) => {
            inf(...data);
        });
    }
};

util.inherits(Sink, events.EventEmitter);

exports.Sink = Sink;
