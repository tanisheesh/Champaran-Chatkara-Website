'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { 
  addMenuItem as addMenuItemToDb, 
  updateMenuItem as updateMenuItemInDb, 
  deleteMenuItem as deleteMenuItemFromDb 
} from '@/lib/supabase-db';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  category: z.enum(['Veg', 'Non-Veg']),
  menu_category: z.string().min(1, { message: 'Menu category is required.' }),
  
  // New simplified pricing structure - allow null/undefined for empty fields
  qtr_price: z.number().positive().nullable().optional(),
  half_price: z.number().positive().nullable().optional(),
  full_price: z.number().positive().nullable().optional(),
  single_price: z.number().positive().nullable().optional(),
  
  is_best_seller: z.boolean().default(false)
});

export async function addOrUpdateMenuItem(formData: FormData) {
  try {
    console.log('FormData entries:', Array.from(formData.entries()));
    
    const values: Record<string, any> = Object.fromEntries(formData.entries());
    console.log('Initial values:', values);
    
    // Convert field mappings
    values.menu_category = values.menuCategory;
    
    // Handle pricing fields - convert empty strings to null, valid numbers to numbers
    ['qtr_price', 'half_price', 'full_price', 'single_price'].forEach(field => {
      const value = values[field];
      if (value === '' || value === '0' || value === 0) {
        values[field] = null;
      } else if (value && !isNaN(Number(value))) {
        values[field] = Number(value);
      } else {
        values[field] = null;
      }
    });
    
    // Validate at least one price is set
    const hasPrice = ['qtr_price', 'half_price', 'full_price', 'single_price']
      .some(field => values[field] && values[field] > 0);
    
    if (!hasPrice) {
      return { success: false, error: 'At least one pricing option is required.' };
    }
    
    // Set default values for regular menu items (no images)
    values.is_best_seller = values.is_best_seller === 'true' || false;
    values.image = null;
    values.image_url = null;
    
    const parsed = formSchema.safeParse(values);

    if (!parsed.success) {
      console.error('Validation failed:', parsed.error.flatten().fieldErrors);
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    console.log('Parsed data:', parsed.data);
    const { id, ...menuItemData } = parsed.data;

    // Use service role for admin operations (temporary solution)
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    if (id) {
      // Update existing item
      console.log('Updating item with ID:', id);
      console.log('Update data:', menuItemData);
      
      const { error } = await adminSupabase
        .from('menu_items')
        .update({ ...menuItemData, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        console.error('Update error:', error);
        return { success: false, error: 'Failed to update menu item' };
      }
      
      console.log('Successfully updated menu item:', id);
    } else {
      // Add new item
      const { data: newItem, error } = await adminSupabase
        .from('menu_items')
        .insert(menuItemData)
        .select()
        .single();
      
      if (error) {
        console.error('Insert error:', error);
        return { success: false, error: 'Failed to add menu item' };
      }
      
      console.log('Added new menu item:', newItem?.id);
    }
    
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error in addOrUpdateMenuItem:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    if (!id) {
      console.error('Deletion failed: ID is missing.');
      return { success: false, error: 'ID is missing' };
    }
    
    // Use service role for admin operations (temporary solution)
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    const { error } = await adminSupabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: 'Failed to delete menu item' };
    }
    
    console.log('Deleted menu item with ID:', id);
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteMenuItem:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}