export type StylingRequest = {
  occasion?: string;
  desiredStyle?: string[];
  temperature?: number;
  weather?: string;
  season?: string;
  formality?: number;
  selectedItems?: string[];
  excludedItems?: string[];
};
