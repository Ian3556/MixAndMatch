import type { Outfit, OutfitScoreBreakdown } from './Outfit';

export type RejectionReasonCode =
  | 'AVOIDED_CATEGORY'
  | 'AVOIDED_COLOR'
  | 'EXCLUDED_ITEM'
  | 'FORMALITY_MISMATCH'
  | 'NEVER_RECOMMEND'
  | 'OUTERWEAR_TOO_WARM'
  | 'SELECTED_ITEM_MISSING';

export type RejectedCandidate = {
  outfitId: string;
  reason: RejectionReasonCode;
  itemId?: string;
  detail?: string;
};

export type StylingRecommendation = {
  outfit: Outfit;
  score: number;
  explanation: string;
  scoreBreakdown: OutfitScoreBreakdown;
};

export type StylingDiagnostics = {
  normalizedItemCount: number;
  candidateCount: number;
  validCandidateCount: number;
  rejectedCandidates: RejectedCandidate[];
  rankedCandidates: {
    outfitId: string;
    score: number;
    scoreBreakdown: OutfitScoreBreakdown;
  }[];
};

export type StylingEngineResult = {
  recommendations: StylingRecommendation[];
  diagnostics: StylingDiagnostics;
};
