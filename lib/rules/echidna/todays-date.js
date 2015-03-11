'use strict';

exports.name = "echidna.todays-date";

exports.check = function (sr, done) {

    function getDate(date) {
        if (date) return date.setHours(0, 0, 0, 0);
        else return null;
    }

    if (getDate(sr.getDocumentDate()) !== getDate(new Date())) {
        sr.error(exports.name, 'wrong-date');
    }

    done();
};
