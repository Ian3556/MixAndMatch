export type ParsedAuthCallback = {
  handled: boolean;
  kind: 'recovery' | 'verification';
  accessToken: string;
  refreshToken: string;
  tokenHash: string;
  code: string;
  error: string;
};

const VERIFICATION_PATH = 'auth/verify-email';
const RECOVERY_PATH = 'auth/reset-password';

export function parseAuthCallback(url: string): ParsedAuthCallback {
  const params = collectUrlParameters(url);
  const type = params.get('type')?.toLowerCase() ?? '';
  const lowerUrl = url.toLowerCase();
  const isRecovery = type === 'recovery' || lowerUrl.includes(RECOVERY_PATH);
  const isVerification =
    type === 'signup' || type === 'email' || lowerUrl.includes(VERIFICATION_PATH);

  return {
    handled: isRecovery || isVerification,
    kind: isRecovery ? 'recovery' : 'verification',
    accessToken: params.get('access_token') ?? '',
    refreshToken: params.get('refresh_token') ?? '',
    tokenHash: params.get('token_hash') ?? '',
    code: params.get('code') ?? '',
    error: params.get('error_description') ?? params.get('error_code') ?? params.get('error') ?? '',
  };
}

function collectUrlParameters(url: string): URLSearchParams {
  const params = new URLSearchParams();
  const queryStart = url.indexOf('?');
  const hashStart = url.indexOf('#');
  const queryEnd = hashStart >= 0 ? hashStart : url.length;

  if (queryStart >= 0 && queryStart < queryEnd) {
    copyParameters(new URLSearchParams(url.slice(queryStart + 1, queryEnd)), params);
  }

  if (hashStart >= 0) {
    copyParameters(new URLSearchParams(url.slice(hashStart + 1)), params);
  }

  return params;
}

function copyParameters(source: URLSearchParams, target: URLSearchParams) {
  source.forEach((value, key) => target.set(key, value));
}
