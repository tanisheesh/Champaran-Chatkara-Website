
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  category: z.enum(['Veg', 'Non-Veg']),
  isSignature: z.boolean(),
  image: z.string().min(1, { message: 'Image is required.' }),
});

export async function addOrUpdateMenuItem(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  // Convert checkbox value
  values.isSignature = values.isSignature === 'on';
  
  const parsed = formSchema.safeParse(values);

  if (!parsed.success) {
    // In a real app, you'd want to return these errors to the form.
    console.error('Validation failed:', parsed.error.flatten().fieldErrors);
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { id, name, description, price, category, isSignature, image } = parsed.data;

  if (id) {
    // This is an update
    console.log('Updating menu item:', { id, name, description, price, category, isSignature, image });
    // Here you would typically call your database update function
  } else {
    // This is a new item
    const newId = Date.now().toString();
    console.log('Adding new menu item:', { id: newId, name, description, price, category, isSignature, image });
    // Here you would typically call your database create function
  }
  
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteMenuItem(id: string) {
    if (!id) {
        console.error('Deletion failed: ID is missing.');
        return;
    }
    console.log('Deleting menu item with ID:', id);
    // Here you would typically call your database delete function
    revalidatePath('/admin');
}
