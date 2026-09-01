import type {
  CatalogBrandProgressRow,
  CatalogImportErrorRow,
  CatalogOverviewRow,
  CatalogRecentJobRow,
  CatalogReviewQueueRow,
} from '@/types/catalogDatabase';

export type CatalogOverview = CatalogOverviewRow;
export type CatalogReviewItem = CatalogReviewQueueRow;
export type CatalogRecentJob = CatalogRecentJobRow;
export type CatalogImportError = CatalogImportErrorRow;

export type CatalogBrandProgress = Omit<
  CatalogBrandProgressRow,
  'category_targets' | 'category_distribution'
> & {
  category_targets: Record<string, number>;
  category_distribution: Record<string, number>;
};

export type CatalogDashboardData = {
  overview: CatalogOverview;
  brands: CatalogBrandProgress[];
  reviewQueue: CatalogReviewItem[];
  recentJobs: CatalogRecentJob[];
  importErrors: CatalogImportError[];
};
