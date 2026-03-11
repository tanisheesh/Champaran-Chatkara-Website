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

// Upload image function for cropped images (accepts Blob)
export async function uploadImage(file: File | Blob, fileName?: string): Promise<string> {
  try {
    const timestamp = Date.now();
    const finalFileName = fileName || `${timestamp}_image.jpg`;
    
    // Clean filename - remove any existing menu-images prefix
    const cleanFileName = finalFileName.replace(/^menu-images\//, '');
    
    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(cleanFileName, file, {
        cacheControl: '3600',
        upsert: true // Allow overwriting existing files
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(cleanFileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload image');
  }
}

// Delete image from storage
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    if (!imageUrl) return true;
    
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    // Don't add menu-images prefix since it's already in the bucket
    const filePath = fileName;
    
    const { error } = await supabase.storage
      .from('menu-images')
      .remove([filePath]);
    
    if (error) {
      console.error('Delete image error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete image:', error);
    return false;
  }
}

// Clean up old best seller images (keep only current 4)
export async function cleanupBestSellerImages(currentImageUrls: string[]): Promise<void> {
  try {
    // List all files in menu-images bucket
    const { data: files, error } = await supabase.storage
      .from('menu-images')
      .list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (error || !files) return;
    
    // Filter best-seller images
    const bestSellerFiles = files.filter(file => 
      file.name.includes('best-seller-')
    );
    
    // Get current file names from URLs
    const currentFileNames = currentImageUrls
      .filter(url => url)
      .map(url => {
        try {
          const urlObj = new URL(url);
          return urlObj.pathname.split('/').pop() || '';
        } catch {
          return '';
        }
      })
      .filter(name => name);
    
    // Delete old best-seller files not in current list
    const filesToDelete = bestSellerFiles
      .filter(file => !currentFileNames.includes(file.name))
      .map(file => file.name);
    
    if (filesToDelete.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from('menu-images')
        .remove(filesToDelete);
      
      if (deleteError) {
        console.error('Error cleaning up old images:', deleteError);
      } else {
        console.log(`Cleaned up ${filesToDelete.length} old best-seller images`);
      }
    }
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

// Alias for backward compatibility
export const uploadToFirebaseStorage = uploadToSupabaseStorage;