/**
 * Check the presence of this <code>meta</code> tag in the head of the page:
 * <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"&gt;</code>
 */
// @ts-ignore (no typings)
import mvp from 'metaviewport-parser';
import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'style.meta',
    section: 'metadata',
    rule: 'viewport',
};

export const { name } = self;

const width = /^device-width$/i;
const shrinkToFit = /^no$/i;

export const check: RuleCheckFunction = (sr, done) => {
    const $meta = sr.$("head > meta[name='viewport'][content]");
    if ($meta.length !== 1) {
        sr.error(self, 'not-found');
    } else {
        const props = mvp.parseMetaViewPortContent(
            $meta.first().attr('content')
        );
        if (
            !props ||
            Object.keys(props.invalidValues).length !== 0 ||
            Object.keys(props.validProperties).length !== 3 ||
            !props.validProperties.width ||
            !width.test(props.validProperties.width) ||
            !props.validProperties['initial-scale'] ||
            props.validProperties['initial-scale'] !== 1 ||
            !props.validProperties['shrink-to-fit'] ||
            !shrinkToFit.test(props.validProperties['shrink-to-fit']) ||
            Object.keys(props.unknownProperties).length !== 0
        ) {
            sr.error(self, 'not-found');
        }
    }
    done();
};
