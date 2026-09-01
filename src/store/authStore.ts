import { create } from 'zustand';

import type { SaveProfileInput } from '@/types/profile';

import { createAuthAccountActions } from './authAccountActions';
import { createAuthFlowActions } from './authFlowActions';
import { createSignedOutSnapshot, type AuthSnapshot, type AuthStateError } from './authState';
import { disposeAuth, initializeAuth, type AuthStoreAccess } from './authStoreRuntime';

export type AuthActionResult = { ok: true } | { ok: false; error: AuthStateError };

export type AuthActions = {
  initialize: () => Promise<void>;
  dispose: () => void;
  signUp: (email: string, password: string) => Promise<AuthActionResult>;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => Promise<AuthActionResult>;
  requestPasswordReset: (email: string) => Promise<AuthActionResult>;
  updatePassword: (password: string) => Promise<AuthActionResult>;
  resendVerification: () => Promise<AuthActionResult>;
  checkEmailVerification: () => Promise<AuthActionResult>;
  refreshProfile: () => Promise<AuthActionResult>;
  updateProfile: (input: SaveProfileInput) => Promise<AuthActionResult>;
  handleAuthUrl: (url: string) => Promise<void>;
  finishPasswordRecovery: () => Promise<void>;
  cancelPasswordRecovery: () => Promise<void>;
  returnToSignIn: () => Promise<void>;
  retryAuthState: () => Promise<void>;
  clearAuthError: () => void;
};

export type AuthStore = AuthSnapshot & AuthActions;

let initializationPromise: Promise<void> | null = null;

const initialSnapshot: AuthSnapshot = {
  ...createSignedOutSnapshot(),
  isInitializing: true,
};

export const useAuthStore = create<AuthStore>((set, get) => {
  const store: AuthStoreAccess = { getState: get, setState: set };

  return {
    ...initialSnapshot,
    ...createAuthAccountActions(store),
    ...createAuthFlowActions(store),

    async initialize() {
      if (initializationPromise) return initializationPromise;
      initializationPromise = initializeAuth(store);

      try {
        await initializationPromise;
      } finally {
        initializationPromise = null;
      }
    },

    dispose() {
      disposeAuth();
    },
  };
});
