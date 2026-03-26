import type { Specberus, ValidateOptions } from './validator.js';

type Status =
    | 'FPWD'
    | 'WD'
    | 'CR'
    | 'CRD'
    | 'REC'
    | 'DISC'
    | 'DNOTE'
    | 'NOTE'
    | 'STMT'
    | 'DRY'
    | 'CRY'
    | 'CRYD'
    | 'RY'
    | 'SUBM'
    | 'MEM-SUBM';

type SubmissionType = 'member';

type Track = 'Note' | 'Recommendation' | 'Registry';

// TODO: add properties and narrow types
export interface SpecberusConfig {
    /** Candidate Recommendation type is only defined for CR/CRD statuses */
    crType?: 'Draft' | 'Snapshot';
    /** Candidate Registry type is only defined for CRY/CRYD statuses */
    cryType?: 'Draft' | 'Snapshot';
    editorial?: 'true';
    htmlValidator?: string;
    longStatus: string;
    rescinds?: boolean;
    skipValidation?: boolean;
    status: Status;
    styleSheet: string;
    /** Submission type is only defined for MEM-SUBM status */
    submissionType?: SubmissionType;
    /** Track (Recommendation or Note); not defined for MEM-SUBM status */
    track?: Track;
    /** Validation setting, inherited from options passed to validate */
    validation?: ValidateOptions['validation'];
}

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

export interface RuleModule extends RuleBase {
    check: RuleCheckFunction<any>;
}

/** `section` from lib/rules.json */
export interface RulesSection {
    name: string;
    rules: Record<string, boolean | string | string[]>;
}

/** `section` under `*` from lib/rules.json */
export interface GenericRulesSection {
    name: string;
    rules: Record<string, string>;
}

/** `profile` from lib/rules.json */
export interface RulesProfile {
    name: string;
    order: number;
    sections: {
        '*': GenericRulesSection;
        [index: string]: RulesSection;
    };
}

export interface ProfileModule {
    config: SpecberusConfig;
    name: string;
    rules: RuleModule[];
}

// The following are minimal types that would ideally be defined more completely in node-w3capi

export interface ApiCharter {
    'doc-licenses': { name: string; uri: string }[];
    end: string;
    start: string;
    uri: string;
}

export interface ApiSpecificationVersion {
    uri: string;
}
