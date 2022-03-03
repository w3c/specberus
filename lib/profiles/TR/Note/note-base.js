import * as deliverNote from '../../../rules/sotd/deliverer-note';
import { insertAfter } from '../../profileUtil';
import { rules as baseRules } from '../../TR';

export const config = {
    track: 'Note',
};

export const rules = insertAfter(baseRules, 'sotd.pp', [deliverNote]);
