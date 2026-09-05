import { useState } from 'react';

import { useAuthStore } from '@/store/authStore';
import type { StyleProfile } from '@/types/profile';

export function useStyleProfileSave() {
  const profile = useAuthStore((state) => state.profile);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const save = async (styleProfile: StyleProfile) => {
    if (isSubmitting || !profile?.displayName) return;
    setIsSubmitting(true);
    setError(null);
    setIsSaved(false);
    const result = await updateProfile({ displayName: profile.displayName, styleProfile });
    if (result.ok) setIsSaved(true);
    else setError(result.error.message);
    setIsSubmitting(false);
  };

  const markDirty = () => setIsSaved(false);

  return { error, isSaved, isSubmitting, markDirty, profile, save };
}
