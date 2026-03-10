export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'Veg' | 'Non-Veg';
  menu_category: string; // Snake case for Supabase
  is_best_seller: boolean; // Snake case for Supabase
  show_in_about: boolean; // Snake case for Supabase - New field for about section
  image: string;
  image_url?: string; // Snake case for Supabase
  pricing: MenuItemPricing[]; // Qty-wise pricing
  created_at?: string;
  updated_at?: string;
}

export interface MenuItemPricing {
  id: string;
  quantity: string; // e.g., "Half", "Full", "250g", "500g"
  price: number;
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
