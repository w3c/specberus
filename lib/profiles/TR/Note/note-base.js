import * as deliverNote from '../../../rules/sotd/deliverer-note.js';
import { insertAfter } from '../../profileUtil.js';
import { rules as baseRules } from '../../TR.js';

export const config = {
    track: 'Note',
};

export const rules = insertAfter(baseRules, 'sotd.pp', [deliverNote]);
