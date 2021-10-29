// SotD
//  must start with
//      <p><em>This section describes the status of this document at the time of its publication.
//      A list of current W3C publications and the
//      latest revision of this technical report can be found in the
//      <a href="https://www.w3.org/TR/">W3C technical reports index</a> at https://www.w3.org/TR/.</em></p>

const util = require('../../util');

const self = {
    name: 'sotd.supersedable',
    section: 'document-status',
    rule: 'boilerplateTRDoc',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    if (sotd) {
        let em;
        Array.prototype.some.call(util.filter(sotd, 'p'), paragraph => {
            if (paragraph.querySelector('em')) {
                em = paragraph.querySelector('em');
                return true;
            }
        });
        if (!em)
            em =
                (sotd.querySelectorAll('p em') && sotd.querySelector('p em')) ||
                '';
        const txt = sr.norm(em.textContent);
        const wanted = `${'This section describes the status of this document at the time of its publication. A list of current W3C publications '}${
            sr.config.status === 'SUBM'
                ? ''
                : 'and the latest revision of this technical report '
        }can be found in the W3C technical reports index at https://www.w3.org/TR/.`;

        const a = em && em.querySelectorAll("a[href='https://www.w3.org/TR/']");
        if (txt !== wanted) sr.error(self, 'no-sotd-intro');
        if (!a || !a.length) sr.error(self, 'no-sotd-tr');
    }
    done();
};
