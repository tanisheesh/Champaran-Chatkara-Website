'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import type { MenuCategory } from '@/lib/types';

// Create admin Supabase client with service role
function createAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function addMenuCategoryAction(category: Omit<MenuCategory, 'id'>) {
  try {
    const adminSupabase = createAdminSupabaseClient();

    const { data, error } = await adminSupabase
      .from('menu_categories')
      .insert([category])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding menu category:', error);
      return { success: false, error: 'Failed to add category' };
    }
    
    revalidatePath('/admin');
    return { success: true, data };
  } catch (error) {
    console.error('Error adding menu category:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateMenuCategoryAction(id: string, category: Partial<MenuCategory>) {
  try {
    const adminSupabase = createAdminSupabaseClient();

    // If we're updating the category name, we need to handle the foreign key constraint properly
    if (category.name) {
      // Get the current category to find the old name and other data
      const { data: currentCategory, error: fetchError } = await adminSupabase
        .from('menu_categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching current category:', fetchError);
        return { success: false, error: 'Category not found' };
      }
      
      // If the name is changing, we need to handle this carefully
      if (currentCategory && currentCategory.name !== category.name) {
        // Strategy: Create a temporary category, update items to temp, delete old, rename temp
        const tempCategoryName = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Get a unique order value for temp category (use max + 1)
        const { data: maxOrderData } = await adminSupabase
          .from('menu_categories')
          .select('order')
          .order('order', { ascending: false })
          .limit(1)
          .single();
        
        const tempOrder = (maxOrderData?.order || 0) + 1000; // Use a high number to avoid conflicts
        
        // Step 1: Create a temporary category with the new name
        const { data: tempCategory, error: createTempError } = await adminSupabase
          .from('menu_categories')
          .insert([{
            name: tempCategoryName,
            description: category.description || currentCategory.description || '',
            order: tempOrder, // Use unique order value
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();
        
        if (createTempError) {
          console.error('Error creating temp category:', createTempError);
          return { success: false, error: 'Failed to create temporary category' };
        }
        
        // Step 2: Update all menu items to reference the temp category
        const { error: updateItemsToTempError } = await adminSupabase
          .from('menu_items')
          .update({ menu_category: tempCategoryName })
          .eq('menu_category', currentCategory.name);
        
        if (updateItemsToTempError) {
          console.error('Error updating menu items to temp category:', updateItemsToTempError);
          // Cleanup: delete temp category
          await adminSupabase.from('menu_categories').delete().eq('id', tempCategory.id);
          return { success: false, error: 'Failed to update menu items to temporary category' };
        }
        
        // Step 3: Update the original category with new data (now it has no references)
        const { error: updateOriginalError } = await adminSupabase
          .from('menu_categories')
          .update({ ...category, updated_at: new Date().toISOString() })
          .eq('id', id);
        
        if (updateOriginalError) {
          console.error('Error updating original category:', updateOriginalError);
          // Rollback: move items back to original category and delete temp
          await adminSupabase
            .from('menu_items')
            .update({ menu_category: currentCategory.name })
            .eq('menu_category', tempCategoryName);
          await adminSupabase.from('menu_categories').delete().eq('id', tempCategory.id);
          return { success: false, error: 'Failed to update category' };
        }
        
        // Step 4: Update menu items to reference the updated category
        const { error: updateItemsToFinalError } = await adminSupabase
          .from('menu_items')
          .update({ menu_category: category.name })
          .eq('menu_category', tempCategoryName);
        
        if (updateItemsToFinalError) {
          console.error('Error updating menu items to final category:', updateItemsToFinalError);
          // Rollback: revert category name and move items back
          await adminSupabase
            .from('menu_categories')
            .update({ name: currentCategory.name, updated_at: new Date().toISOString() })
            .eq('id', id);
          await adminSupabase
            .from('menu_items')
            .update({ menu_category: currentCategory.name })
            .eq('menu_category', tempCategoryName);
          await adminSupabase.from('menu_categories').delete().eq('id', tempCategory.id);
          return { success: false, error: 'Failed to update menu items to final category' };
        }
        
        // Step 5: Delete the temporary category
        const { error: deleteTempError } = await adminSupabase
          .from('menu_categories')
          .delete()
          .eq('id', tempCategory.id);
        
        if (deleteTempError) {
          console.error('Error deleting temp category:', deleteTempError);
          // This is not critical, just log it
        }
        
      } else {
        // Just update the category without name change
        const { error } = await adminSupabase
          .from('menu_categories')
          .update({ ...category, updated_at: new Date().toISOString() })
          .eq('id', id);
        
        if (error) {
          console.error('Error updating menu category:', error);
          return { success: false, error: 'Failed to update category' };
        }
      }
    } else {
      // No name change, just update other fields
      const { error } = await adminSupabase
        .from('menu_categories')
        .update({ ...category, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating menu category:', error);
        return { success: false, error: 'Failed to update category' };
      }
    }
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error updating menu category:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteMenuCategoryAction(id: string) {
  try {
    const adminSupabase = createAdminSupabaseClient();

    // First check if there are any menu items using this category
    const { data: categoryData, error: fetchError } = await adminSupabase
      .from('menu_categories')
      .select('name')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching category for deletion:', fetchError);
      return { success: false, error: 'Category not found' };
    }
    
    if (categoryData) {
      const { data: menuItems, error: itemsError } = await adminSupabase
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
    const { error } = await adminSupabase
      .from('menu_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: 'Failed to delete category' };
    }
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting menu category:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}