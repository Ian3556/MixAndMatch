import type { RejectedCandidate, StylingDiagnostics } from '../types';

export function formatStylingDiagnostics(diagnostics: StylingDiagnostics): string {
  const ranked = diagnostics.rankedCandidates
    .map((candidate, index) =>
      [
        `OUTFIT #${index + 1} · ${candidate.outfitId}`,
        `Overall: ${candidate.score.toFixed(1)}`,
        ...Object.entries(candidate.scoreBreakdown).map(
          ([label, score]) => `${capitalize(label)}: ${score.toFixed(1)}`,
        ),
      ].join('\n'),
    )
    .join('\n\n');
  const rejections = diagnostics.rejectedCandidates.map(formatRejection).join('\n\n');
  return [
    `Normalized items: ${diagnostics.normalizedItemCount}`,
    `Candidates: ${diagnostics.candidateCount}`,
    `Valid: ${diagnostics.validCandidateCount}`,
    ranked,
    rejections,
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function formatRejection(rejection: RejectedCandidate): string {
  return [
    `REJECTED · ${rejection.outfitId}`,
    `Reason: ${rejection.reason}`,
    rejection.itemId ? `Item: ${rejection.itemId}` : '',
    rejection.detail ? `Detail: ${rejection.detail}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function capitalize(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
