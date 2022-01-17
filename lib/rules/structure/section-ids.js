const self = {
    name: 'structure.section-ids',
    section: 'document-body',
    rule: 'headingWithoutID',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const headers = sr.jsDocument.querySelectorAll('h2, h3, h4, h5, h6');
    const ignoreH3 = sr.jsDocument.querySelector('.head>h1+h2+h3');

    Array.prototype.every.call(headers, h => {
        // has an id
        if (h.getAttribute('id') || h === ignoreH3) return true;

        // has no element previous sibling, has parent div or section, and that has an id
        //  without prevAll that sucks... get children of parent and find self
        const parent = h.parentElement;
        const sibs = parent.children;
        if (
            sibs[0] === h &&
            (parent.matches('section') || parent.matches('div')) &&
            parent.getAttribute('id')
        )
            return true;
        // has a descendant that has an id
        if (h.querySelectorAll('*[id]').length) return true;

        // has an a[name] descendant
        if (h.querySelectorAll('a[name]').length) return true;

        // has a[name] as previous element sibling
        for (let i = 1, n = sibs.length; i < n; i += 1) {
            if (sibs[i] === h && sibs[i - 1].matches('a[name]')) return true;
        }

        // this is the status h2
        const stateEle = sr.getDocumentStateElement();
        if (stateEle && h === stateEle) return true;

        sr.error(self, 'no-id', { text: h.nodeName });
        return true;
    });
    done();
};
