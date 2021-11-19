const self = {
    name: 'structure.security-privacy',
    section: 'document-body',
    rule: 'securityAndPrivacy',
};

exports.name = self.name;

exports.check = function (sr, done) {
    let security = false;
    let privacy = false;

    sr.jsDocument.querySelectorAll('h2, h3, h4, h5, h6').forEach(element => {
        const text = sr.norm(element.textContent).toLowerCase();

        if (text.includes('security')) {
            security = true;
        }
        if (text.includes('privacy')) {
            privacy = true;
        }
    });

    if (!security && !privacy) {
        sr.warning(self, 'no-security-privacy');
    } else {
        if (!security) sr.warning(self, 'no-security');

        if (!privacy) sr.warning(self, 'no-privacy');
    }

    done();
};
