import { useState } from 'react';

import { useAuthStore } from '@/store/authStore';
import { useWardrobeStore } from '@/store/wardrobeStore';

export function useSignOutAction() {
  const signOut = useAuthStore((state) => state.signOut);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setSignOutError(null);
    const result = await signOut();
    useWardrobeStore.getState().reset();
    if (!result.ok) setSignOutError(result.error.message);
    setIsSigningOut(false);
  };

  return { handleSignOut, isSigningOut, signOutError };
}
