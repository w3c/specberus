const self = {
    name: 'sotd.new-features'
,   section: 'document-status'
,   rule: 'newFeatures'
};

exports.name = self.name;

exports.check = function (sr, done) {

    const sotd = sr.getSotDSection()
    ,     docType = sr.config.status === "PR" ? "specification" : "Recommendation"
    ,     warning = new RegExp("Future updates to this " + docType + " may incorporate new features.")
    ,     linkTxt = "new features"
    ,     linkhref = "https://www.w3.org/2020/Process-20200915/#allow-new-features"
    ;

    if (sotd && sr.norm(sotd.textContent).match(warning)) {
        const foundLink = Array.prototype.some.call(sotd.querySelectorAll("a"), a => {
            return (a.textContent === linkTxt && a.href === linkhref);
        });
        if (!foundLink) {
            sr.error(self, 'no-link');
        }
    } else {
        sr.warning(self, "no-warning");
    }
    done();
};
