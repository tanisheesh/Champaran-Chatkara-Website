import { supabase } from './supabase';

// Supabase Storage integration
export async function uploadToSupabaseStorage(file: File): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileName = `menu-images/${timestamp}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(fileName, file);
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Supabase upload failed:', error);
    throw new Error('Failed to upload image to Supabase Storage');
  }
}

// Alias for backward compatibility
export const uploadToFirebaseStorage = uploadToSupabaseStorage;