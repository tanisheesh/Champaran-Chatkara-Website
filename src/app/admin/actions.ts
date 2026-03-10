
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
  pricing: z.array(z.object({
    quantity: z.string().min(1, { message: 'Quantity is required.' }),
    price: z.coerce.number().positive({ message: 'Price must be positive.' })
  })).min(1, { message: 'At least one pricing option is required.' })
});

export async function addOrUpdateMenuItem(formData: FormData) {
  try {
    const values: Record<string, any> = Object.fromEntries(formData.entries());
    
    // Convert field mappings
    values.menu_category = values.menuCategory;
    
    // Parse pricing data from form
    const pricingData = [];
    let index = 0;
    while (formData.has(`pricing.${index}.quantity`)) {
      const quantity = formData.get(`pricing.${index}.quantity`) as string;
      const price = parseFloat(formData.get(`pricing.${index}.price`) as string);
      if (quantity && price > 0) {
        pricingData.push({ quantity, price });
      }
      index++;
    }
    values.pricing = pricingData;
    
    // Set default values for regular menu items (no images)
    values.is_best_seller = false; // Regular items are not best sellers by default
    values.show_in_about = false; // Not shown in about section by default
    values.image = null;
    values.image_url = null;
    
    const parsed = formSchema.safeParse(values);

    if (!parsed.success) {
      console.error('Validation failed:', parsed.error.flatten().fieldErrors);
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    const { id, ...menuItemData } = parsed.data;

    if (id) {
      // Update existing item
      const success = await updateMenuItemInDb(id, menuItemData);
      if (!success) {
        return { success: false, error: 'Failed to update menu item' };
      }
      console.log('Updated menu item:', id);
    } else {
      // Add new item
      const newId = await addMenuItemToDb(menuItemData);
      if (!newId) {
        return { success: false, error: 'Failed to add menu item' };
      }
      console.log('Added new menu item:', newId);
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
    
    const success = await deleteMenuItemFromDb(id);
    if (!success) {
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
