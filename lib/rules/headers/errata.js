// errata, right after dl

const self = {
    name: 'headers.errata'
    // @TODO: find out rule?
};

exports.check = function (sr, done) {
    var $errata = sr.$("body div.head dl + p").first()
    ,   $errLink = $errata.find("strong > a[href], a[href] > strong").first()
    ;

    if (!$errata.length || !$errLink.length ||
        sr.norm($errLink.text()) !== "errata" ||
        sr.norm($errata.text()) !== "Please check the errata for any errors or issues reported since publication.")
            sr.error(self, "not-found");

    done();
};
