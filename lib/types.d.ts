import type { ValidateOptions } from './specberus.js';
import type { RuleContext } from './rule-context.js';

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

/** Data types emitted by error, warning, and info events */
export type HandlerMessage = RuleBase &
    Partial<RuleMeta> & {
        detailMessage: string;
        key: string;
        extra?: Record<string, any>;
    };

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
    context: RuleContext
) => R | Promise<R>;

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
