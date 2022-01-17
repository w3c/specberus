'use strict';

$(document).ready(() => {
    let scrolled = 0;

    const scrollTo = function (selector) {
        const elem = $(selector);
        if (elem) {
            const elemOffset = elem[0].offsetTop;
            const elemHeight = elem.outerHeight(true);
            const windowHeight = $(window).height();
            window.scrollTo(
                window.pageXOffset,
                elemOffset - (windowHeight - elemHeight) / 2
            );
        }
    };

    $(window).scroll(() => {
        scrolled += 1;
    });

    $('a[href^="#"]').click(e => {
        e.stopImmediatePropagation();
        e.preventDefault();
        document.location.hash = e.target.hash;
        scrollTo(e.target.hash);
    });

    if (document.location && document.location.hash) {
        window.setTimeout(() => {
            $(window).off('scroll');
            if (scrolled < 3)
                // Merely loading a page may trigger one or two scroll events.
                scrollTo(document.location.hash);
        }, 500);
    }
});
