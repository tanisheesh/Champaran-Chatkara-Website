import { supabase } from './supabase';
import type { MenuItem, MenuCategory, MenuItemPricing } from './types';

// Menu Items Functions
export async function getAllMenuItems(): Promise<MenuItem[]> {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        pricing:menu_item_pricing(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        pricing:menu_item_pricing(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return null;
  }
}

export async function addMenuItem(menuItem: Omit<MenuItem, 'id'>): Promise<string | null> {
  try {
    const { pricing, ...itemData } = menuItem;
    
    // Insert menu item
    const { data, error } = await supabase
      .from('menu_items')
      .insert([itemData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Insert pricing data
    if (pricing && pricing.length > 0) {
      const pricingData = pricing.map(p => ({
        menu_item_id: data.id,
        quantity: p.quantity,
        price: p.price
      }));
      
      const { error: pricingError } = await supabase
        .from('menu_item_pricing')
        .insert(pricingData);
      
      if (pricingError) throw pricingError;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error('Error adding menu item:', error);
    return null;
  }
}

export async function updateMenuItem(id: string, menuItem: Partial<MenuItem>): Promise<boolean> {
  try {
    const { pricing, ...itemData } = menuItem;
    
    // Update menu item
    const { error } = await supabase
      .from('menu_items')
      .update({ ...itemData, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
    
    // Update pricing data if provided
    if (pricing) {
      // Delete existing pricing
      await supabase
        .from('menu_item_pricing')
        .delete()
        .eq('menu_item_id', id);
      
      // Insert new pricing
      if (pricing.length > 0) {
        const pricingData = pricing.map(p => ({
          menu_item_id: id,
          quantity: p.quantity,
          price: p.price
        }));
        
        const { error: pricingError } = await supabase
          .from('menu_item_pricing')
          .insert(pricingData);
        
        if (pricingError) throw pricingError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating menu item:', error);
    return false;
  }
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return false;
  }
}

// Menu Categories Functions
export async function getAllMenuCategories(): Promise<MenuCategory[]> {
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    return [];
  }
}

export async function addMenuCategory(category: Omit<MenuCategory, 'id'>): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error('Error adding menu category:', error);
    return null;
  }
}

export async function updateMenuCategory(id: string, category: Partial<MenuCategory>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('menu_categories')
      .update({ ...category, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating menu category:', error);
    return false;
  }
}

export async function deleteMenuCategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting menu category:', error);
    return false;
  }
}

// Best Sellers
export async function getBestSellers(): Promise<MenuItem[]> {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        pricing:menu_item_pricing(*)
      `)
      .eq('is_best_seller', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
}

// Items by Category
export async function getMenuItemsByCategory(categoryName: string): Promise<MenuItem[]> {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        pricing:menu_item_pricing(*)
      `)
      .eq('menu_category', categoryName)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching items by category:', error);
    return [];
  }
}

// Items for About Section
export async function getAboutSectionItems(): Promise<MenuItem[]> {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        pricing:menu_item_pricing(*)
      `)
      .eq('show_in_about', true)
      .order('created_at', { ascending: false })
      .limit(4); // Maximum 4 items for about section
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching about section items:', error);
    return [];
  }
}