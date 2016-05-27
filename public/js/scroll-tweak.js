/* globals $: false, document: false, window: false */

'use strict'; // jshint ignore: line

$(document).ready(function() {
    if (document.location && document.location.hash && window.pageYOffset && window.innerHeight)
        window.setTimeout(function() {
            const elem = $(document.location.hash);
            if (elem && elem.length > 0) elem[0].scrollIntoViewIfNeeded();
            window.setTimeout(function() {
                window.scrollTo(window.pageXOffset, window.pageYOffset - window.innerHeight * 0.5);
            }, 500);
        }, 500);
});
