const self = {
    name: 'sotd.pp-note'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if ($sotd && $sotd.length) {
        var findPPNote = false
        ,   config = sr.config
        ,   isWGNote = (config.longStatus === "Working Group Note")
        ,   isIGNote = (config.longStatus === "Interest Group Note")
            // a Working Group Note || an Interest Group Note
        ,   keyword = isWGNote ? 'a Working' : 'an Interest'
        ,   wantedText = "^Publication as " + keyword + " Group Note does not imply " +
            "endorsement by the W3C Membership. This is a draft document " +
            "and may be updated, replaced or obsoleted " +
            "by other documents at any time. It is inappropriate to cite this document as other than work in progress.$"
        ,   wantedReg = new RegExp(wantedText)
        ;
        console.log('wantedText: ');
        console.log(wantedText);

        $sotd.filter("p").add($sotd.find("p")).each(function () {
            var $p = sr.$(this)
            ,   text = sr.norm($p.text())
            ;
            if (wantedReg.test(text)) {
                findPPNote = true;
                return false;
            }
        });
        if (!findPPNote) {
            sr.info(self, "expected", { "text": wantedText });
        }
    }
    done();
};
