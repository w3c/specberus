
// errata, right after dl
exports.name = "headers.errata";
exports.check = function (sr, done) {
    var $errata = sr.$("body > div.head dl + p").first()
    ,   $errLink = $errata.find("strong > a[href], a[href] > strong").first()
    ;
    
    if (!$errata.length || !$errLink.length ||
        sr.norm($errLink.text()) !== "errata" ||
        sr.norm($errata.text()) !== "Please check the errata for any errors or issues reported since publication.")
            sr.error(exports.name, "not-found");

    done();
};
