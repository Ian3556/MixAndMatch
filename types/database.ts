export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          onboarding_completed: boolean;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          onboarding_completed?: boolean;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          display_name?: string | null;
          onboarding_completed?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      wardrobe_items: {
        Row: {
          brand: string | null;
          category: string;
          created_at: string;
          currency: string | null;
          deduplication_key: string;
          external_product_id: string | null;
          id: string;
          image_url: string | null;
          import_method: 'manual' | 'website-url';
          is_favorite: boolean;
          material: string | null;
          name: string;
          notes: string | null;
          occasion: string | null;
          pattern: string | null;
          price: number | null;
          primary_color: string | null;
          season: string | null;
          secondary_color: string | null;
          source_domain: string | null;
          source_url: string | null;
          subcategory: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          brand?: string | null;
          category: string;
          created_at?: string;
          currency?: string | null;
          deduplication_key: string;
          external_product_id?: string | null;
          id?: string;
          image_url?: string | null;
          import_method: 'manual' | 'website-url';
          is_favorite?: boolean;
          material?: string | null;
          name: string;
          notes?: string | null;
          occasion?: string | null;
          pattern?: string | null;
          price?: number | null;
          primary_color?: string | null;
          season?: string | null;
          secondary_color?: string | null;
          source_domain?: string | null;
          source_url?: string | null;
          subcategory?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          brand?: string | null;
          category?: string;
          currency?: string | null;
          deduplication_key?: string;
          external_product_id?: string | null;
          image_url?: string | null;
          import_method?: 'manual' | 'website-url';
          is_favorite?: boolean;
          material?: string | null;
          name?: string;
          notes?: string | null;
          occasion?: string | null;
          pattern?: string | null;
          price?: number | null;
          primary_color?: string | null;
          season?: string | null;
          secondary_color?: string | null;
          source_domain?: string | null;
          source_url?: string | null;
          subcategory?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'wardrobe_items_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
