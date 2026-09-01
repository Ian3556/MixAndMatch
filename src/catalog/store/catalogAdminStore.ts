import { create } from 'zustand';

import type { CatalogManagementAction } from '@supabase/functions/_shared/catalog/management-actions';

import {
  invokeCatalogManagement,
  loadCatalogDashboard,
} from '@/catalog/services/catalogAdminService';
import type { CatalogDashboardData } from '@/catalog/types';

type CatalogAdminStatus = 'idle' | 'loading' | 'ready' | 'error';

type CatalogAdminStore = {
  data: CatalogDashboardData | null;
  status: CatalogAdminStatus;
  error: string | null;
  actionPending: boolean;
  actionError: string | null;
  selectedErrorJobId: string | null;
  refresh: () => Promise<void>;
  runAction: (action: CatalogManagementAction) => Promise<boolean>;
  showErrorsForJob: (jobId: string | null) => Promise<void>;
  reset: () => void;
};

let requestVersion = 0;

export const useCatalogAdminStore = create<CatalogAdminStore>((set, get) => ({
  data: null,
  status: 'idle',
  error: null,
  actionPending: false,
  actionError: null,
  selectedErrorJobId: null,

  async refresh() {
    const version = ++requestVersion;
    set({ status: 'loading', error: null });
    try {
      const data = await loadCatalogDashboard(get().selectedErrorJobId);
      if (version === requestVersion) set({ data, status: 'ready', error: null });
    } catch (error) {
      if (version === requestVersion) {
        set({
          status: 'error',
          error: error instanceof Error ? error.message : 'The catalogue dashboard could not load.',
        });
      }
    }
  },

  async runAction(action) {
    set({ actionPending: true, actionError: null });
    try {
      await invokeCatalogManagement(action);
      set({ actionPending: false, actionError: null });
      await get().refresh();
      return true;
    } catch (error) {
      set({
        actionPending: false,
        actionError: error instanceof Error ? error.message : 'The catalogue action failed.',
      });
      return false;
    }
  },

  async showErrorsForJob(jobId) {
    set({ selectedErrorJobId: jobId });
    await get().refresh();
  },

  reset() {
    requestVersion += 1;
    set({
      data: null,
      status: 'idle',
      error: null,
      actionPending: false,
      actionError: null,
      selectedErrorJobId: null,
    });
  },
}));
