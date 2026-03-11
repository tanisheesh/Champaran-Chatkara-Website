export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: 'Veg' | 'Non-Veg';
  menu_category: string; // Snake case for Supabase
  
  // Simplified pricing structure
  qtr_price?: number;    // Quarter price
  half_price?: number;   // Half price  
  full_price?: number;   // Full price
  single_price?: number; // Single price (for items without quantity variations)
  
  is_best_seller: boolean; // Snake case for Supabase
  image?: string;
  image_url?: string; // Snake case for Supabase
  created_at?: string;
  updated_at?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  is_active: boolean; // Snake case for Supabase
  created_at?: string;
  updated_at?: string;
}

// Helper type for pricing display
export interface PriceOption {
  label: string;
  price: number;
}

// CSV import structure
export interface CSVMenuItem {
  category: string;
  dish: string;
  qtr?: string;
  half?: string;
  full?: string;
  price?: string;
}
