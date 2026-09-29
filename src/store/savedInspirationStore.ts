import { useStore } from 'zustand';
import { savedInspirationService } from '@/services/savedInspirationService';
import { createSavedInspirationStore } from './savedInspirationState';

export const savedInspirationStore = createSavedInspirationStore(savedInspirationService);
export const useSavedInspirationStore = () => useStore(savedInspirationStore);
