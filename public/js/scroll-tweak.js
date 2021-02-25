'use strict';

$(document).ready(function () {
    var scrolled = 0;

    var scrollTo = function (selector) {
        var elem = $(selector);
        if (elem) {
            var elemOffset = elem[0].offsetTop;
            var elemHeight = elem.outerHeight(true);
            var windowHeight = $(window).height();
            window.scrollTo(
                window.pageXOffset,
                elemOffset - (windowHeight - elemHeight) / 2
            );
        }
    };

    $(window).scroll(function () {
        scrolled++;
    });

    $('a[href^="#"]').click(function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        document.location.hash = e.target.hash;
        scrollTo(e.target.hash);
    });

    if (document.location && document.location.hash) {
        window.setTimeout(function () {
            $(window).off('scroll');
            if (scrolled < 3)
                // Merely loading a page may trigger one or two scroll events.
                scrollTo(document.location.hash);
        }, 500);
    }
});
