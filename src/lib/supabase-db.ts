import { supabase } from './supabase';
import type { MenuItem, MenuCategory, PriceOption } from './types';

// Helper function to get price options for display
export function getPriceOptions(item: MenuItem): PriceOption[] {
  const options: PriceOption[] = [];
  
  if (item.qtr_price) options.push({ label: 'Quarter', price: item.qtr_price });
  if (item.half_price) options.push({ label: 'Half', price: item.half_price });
  if (item.full_price) options.push({ label: 'Full', price: item.full_price });
  if (item.single_price) options.push({ label: 'Single', price: item.single_price });
  
  return options;
}

// Helper function to get minimum price for sorting/display
export function getMinPrice(item: MenuItem): number {
  const prices = [item.qtr_price, item.half_price, item.full_price, item.single_price]
    .filter(price => price !== null && price !== undefined) as number[];
  
  return prices.length > 0 ? Math.min(...prices) : 0;
}

// Menu Items Functions with proper error handling and retry logic
export async function getAllMenuItems(): Promise<MenuItem[]> {
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Attempt ${attempts + 1} - Error fetching menu items:`, error);
        if (attempts === maxAttempts - 1) throw error;
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        continue;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching menu items:', error);
      if (attempts === maxAttempts - 1) return [];
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }
  
  return [];
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching menu item:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return null;
  }
}

export async function addMenuItem(menuItem: Omit<MenuItem, 'id'>): Promise<string | null> {
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([menuItem])
        .select()
        .single();
      
      if (error) {
        console.error(`Attempt ${attempts + 1} - Error adding menu item:`, error);
        if (attempts === maxAttempts - 1) throw error;
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        continue;
      }
      
      return data?.id || null;
    } catch (error) {
      console.error('Error adding menu item:', error);
      if (attempts === maxAttempts - 1) return null;
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }
  
  return null;
}

export async function updateMenuItem(id: string, menuItem: Partial<MenuItem>): Promise<boolean> {
  try {
    console.log('updateMenuItem called with:', { id, menuItem });
    
    // First check if the item exists
    const { data: existingItem, error: fetchError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching existing item:', fetchError);
      return false;
    }
    
    if (!existingItem) {
      console.error('Item not found with ID:', id);
      return false;
    }
    
    console.log('Existing item found:', existingItem);
    
    // Try update with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const { error } = await supabase
          .from('menu_items')
          .update({ ...menuItem, updated_at: new Date().toISOString() })
          .eq('id', id);
        
        if (error) {
          console.error(`Attempt ${attempts + 1} - Supabase update error:`, error);
          if (attempts === maxAttempts - 1) throw error;
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          continue;
        }
        
        console.log('Update completed successfully');
        return true;
      } catch (retryError) {
        console.error(`Attempt ${attempts + 1} failed:`, retryError);
        if (attempts === maxAttempts - 1) return false;
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
    
    return false;
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
    
    if (error) {
      console.error('Error deleting menu item:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return false;
  }
}

// Menu Categories Functions with caching and deduplication
let categoriesCache: { data: MenuCategory[]; timestamp: number } | null = null;
const CATEGORIES_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// Function to clear categories cache (can be called externally)
export function clearCategoriesCache() {
  categoriesCache = null;
}

export async function getAllMenuCategories(forceRefresh = false): Promise<MenuCategory[]> {
  // Check cache first (unless force refresh is requested)
  if (!forceRefresh && categoriesCache && Date.now() - categoriesCache.timestamp < CATEGORIES_CACHE_DURATION) {
    return categoriesCache.data;
  }
  
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('order', { ascending: true });
      
      if (error) {
        console.error(`Attempt ${attempts + 1} - Error fetching menu categories:`, error);
        if (attempts === maxAttempts - 1) throw error;
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        continue;
      }
      
      const categories = data || [];
      
      // Deduplicate categories by name (keep the first occurrence)
      const uniqueCategories = categories.reduce((acc: MenuCategory[], current) => {
        const exists = acc.find(cat => cat.name === current.name);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      // Update cache
      categoriesCache = { data: uniqueCategories, timestamp: Date.now() };
      
      return uniqueCategories;
    } catch (error) {
      console.error('Error fetching menu categories:', error);
      if (attempts === maxAttempts - 1) return [];
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }
  
  return [];
}

export async function addMenuCategory(category: Omit<MenuCategory, 'id'>): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .insert([category])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding menu category:', error);
      return null;
    }
    
    clearCategoriesCache();
    return data?.id || null;
  } catch (error) {
    console.error('Error adding menu category:', error);
    return null;
  }
}

export async function updateMenuCategory(id: string, category: Partial<MenuCategory>): Promise<boolean> {
  try {
    // If we're updating the category name, we need to update menu items first
    if (category.name) {
      // Get the current category to find the old name
      const { data: currentCategory, error: fetchError } = await supabase
        .from('menu_categories')
        .select('name')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching current category:', fetchError);
        return false;
      }
      
      // Update all menu items that reference this category
      if (currentCategory && currentCategory.name !== category.name) {
        const { error: updateItemsError } = await supabase
          .from('menu_items')
          .update({ menu_category: category.name })
          .eq('menu_category', currentCategory.name);
        
        if (updateItemsError) {
          console.error('Error updating menu items category references:', updateItemsError);
          return false;
        }
      }
    }
    
    // Now update the category
    const { error } = await supabase
      .from('menu_categories')
      .update({ ...category, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating menu category:', error);
      return false;
    }
    
    clearCategoriesCache();
    return true;
  } catch (error) {
    console.error('Error updating menu category:', error);
    return false;
  }
}

export async function deleteMenuCategory(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First check if there are any menu items using this category
    const { data: categoryData, error: fetchError } = await supabase
      .from('menu_categories')
      .select('name')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching category for deletion:', fetchError);
      return { success: false, error: 'Category not found' };
    }
    
    if (categoryData) {
      const { data: menuItems, error: itemsError } = await supabase
        .from('menu_items')
        .select('id')
        .eq('menu_category', categoryData.name);
      
      if (itemsError) {
        console.error('Error checking menu items for category:', itemsError);
        return { success: false, error: 'Failed to check category usage' };
      }
      
      if (menuItems && menuItems.length > 0) {
        return {
          success: false,
          error: `Cannot delete category "${categoryData.name}" because it has ${menuItems.length} menu item(s) using it. Please move or delete those items first.`
        };
      }
    }
    
    // If no items are using this category, safe to delete
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: 'Failed to delete category' };
    }
    
    clearCategoriesCache();
    return { success: true };
  } catch (error) {
    console.error('Error deleting menu category:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete category'
    };
  }
}

// Best Sellers with caching
let bestSellersCache: { data: MenuItem[]; timestamp: number } | null = null;

export async function getBestSellers(): Promise<MenuItem[]> {
  // Check cache first
  if (bestSellersCache && Date.now() - bestSellersCache.timestamp < CATEGORIES_CACHE_DURATION) {
    return bestSellersCache.data;
  }
  
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_best_seller', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching best sellers:', error);
      return [];
    }
    
    const bestSellers = data || [];
    bestSellersCache = { data: bestSellers, timestamp: Date.now() };
    
    return bestSellers;
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
}

// Items by Category with pagination support
export async function getMenuItemsByCategory(
  categoryName: string, 
  limit?: number, 
  offset?: number
): Promise<MenuItem[]> {
  try {
    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('menu_category', categoryName)
      .order('name', { ascending: true });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.range(offset, offset + (limit || 50) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching items by category:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching items by category:', error);
    return [];
  }
}

// Bulk insert for CSV import with transaction-like behavior
export async function bulkInsertMenuItems(items: Omit<MenuItem, 'id'>[]): Promise<boolean> {
  try {
    // Insert in batches to avoid timeout
    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    
    for (const batch of batches) {
      const { error } = await supabase
        .from('menu_items')
        .insert(batch);
      
      if (error) {
        console.error('Error in bulk insert batch:', error);
        return false;
      }
    }
    
    // Clear caches after bulk insert
    clearCategoriesCache();
    bestSellersCache = null;
    
    return true;
  } catch (error) {
    console.error('Error bulk inserting menu items:', error);
    return false;
  }
}

// Clear all menu data (for fresh import) with proper error handling
export async function clearAllMenuData(): Promise<boolean> {
  try {
    // Delete items first (due to foreign key constraint)
    const { error: itemsError } = await supabase
      .from('menu_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (itemsError) {
      console.error('Error clearing menu items:', itemsError);
      return false;
    }
    
    // Delete categories
    const { error: categoriesError } = await supabase
      .from('menu_categories')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (categoriesError) {
      console.error('Error clearing menu categories:', categoriesError);
      return false;
    }
    
    // Clear all caches
    clearCategoriesCache();
    bestSellersCache = null;
    
    return true;
  } catch (error) {
    console.error('Error clearing menu data:', error);
    return false;
  }
}