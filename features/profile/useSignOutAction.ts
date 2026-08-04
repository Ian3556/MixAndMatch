import { useState } from 'react';

import { useAuthStore } from '@/store/authStore';

export function useSignOutAction() {
  const signOut = useAuthStore((state) => state.signOut);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setSignOutError(null);
    const result = await signOut();
    if (!result.ok) setSignOutError(result.error.message);
    setIsSigningOut(false);
  };

  return { handleSignOut, isSigningOut, signOutError };
}
