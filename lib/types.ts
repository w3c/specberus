import type { Specberus } from './validator.js';

// TODO: ideally make this more precise
export type HandlerMessage = Record<string, string | undefined>;

type IsoDateString = `${number}-${number}-${number}`;

export interface RecMetadata {
    cryFeedbackDue?: IsoDateString;
    cSubChanges?: boolean;
    cNewFeatures?: boolean;
    implementationFeedbackDue?: IsoDateString;
    implementationReport?: string | undefined;
    prReviewsDue?: IsoDateString;
    profile?: string;
    pNewFeatures?: boolean;
    pSubChanges?: boolean;
    rectrack?: string | null;
}

export type RuleCheckFunction<R = void> = (
    sr: Specberus,
    done: (result: R) => void
) => void | Promise<void>;

export interface RuleBase {
    name: string;
}

export interface RuleMeta extends RuleBase {
    rule: string;
    section: string;
}

export interface Rule extends RuleBase {
    check: RuleCheckFunction<any>;
}

/** `section` from lib/rules.json */
export interface RulesSection {
    name: string;
    rules: Record<string, boolean | string[]>;
}

/** `profile` from lib/rules.json */
export interface RulesProfile {
    name: string;
    order: number;
    sections: RulesSection[];
}

// The following are minimal types that would ideally be defined more completely in node-w3capi

export interface ApiCharter {
    end: string;
    start: string;
    uri: string;
}

export interface ApiSpecificationVersion {
    uri: string;
}
