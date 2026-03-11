'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Star, Upload, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ImageCropUpload } from '@/components/admin/image-crop-upload';

import { getAllMenuItems, updateMenuItem } from '@/lib/supabase-db';
import { uploadImage, cleanupBestSellerImages } from '@/lib/storage';
import type { MenuItem } from '@/lib/types';

const bestSellersSchema = z.object({
  bestSeller1: z.string().optional(),
  bestSeller2: z.string().optional(),
  bestSeller3: z.string().optional(),
  bestSeller4: z.string().optional(),
});

type BestSellersFormValues = z.infer<typeof bestSellersSchema>;

interface BestSellersFormProps {
  onSuccess?: () => void;
}

export function BestSellersForm({ onSuccess }: BestSellersFormProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [bestSellers, setBestSellers] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  
  const { toast } = useToast();

  const form = useForm<BestSellersFormValues>({
    resolver: zodResolver(bestSellersSchema),
    defaultValues: {
      bestSeller1: 'none',
      bestSeller2: 'none',
      bestSeller3: 'none',
      bestSeller4: 'none',
    },
  });

  // Filter items based on search queries for each slot
  const getFilteredItems = (slot: number) => {
    const searchQuery = searchQueries[`bestSeller${slot}`] || '';
    if (!searchQuery.trim()) return menuItems;
    
    const query = searchQuery.toLowerCase().trim();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(query) ||
      (item.description || '').toLowerCase().includes(query) ||
      item.menu_category.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const items = await getAllMenuItems();
      setMenuItems(items);
      
      const currentBestSellers = items.filter(item => item.is_best_seller);
      setBestSellers(currentBestSellers);
      
      // Set form values
      const formValues: BestSellersFormValues = {
        bestSeller1: currentBestSellers[0]?.id || 'none',
        bestSeller2: currentBestSellers[1]?.id || 'none',
        bestSeller3: currentBestSellers[2]?.id || 'none',
        bestSeller4: currentBestSellers[3]?.id || 'none',
      };
      
      form.reset(formValues);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load menu items',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (itemId: string, file: File, croppedBlob: Blob): Promise<string | null> => {
    try {
      setUploading(itemId);
      
      // Get current image URL to delete later
      const currentItem = menuItems.find(item => item.id === itemId);
      const oldImageUrl = currentItem?.image_url;
      
      // Upload the cropped image
      const imageUrl = await uploadImage(croppedBlob, `best-seller-${itemId}-${Date.now()}.jpg`);
      
      if (imageUrl) {
        // Update the menu item with the new image URL
        const success = await updateMenuItem(itemId, { image_url: imageUrl });
        
        if (success) {
          // Delete old image if it exists and is different
          if (oldImageUrl && oldImageUrl !== imageUrl) {
            try {
              const { deleteImage } = await import('@/lib/storage');
              await deleteImage(oldImageUrl);
              console.log('Old image deleted successfully');
            } catch (error) {
              console.error('Failed to delete old image:', error);
            }
          }
          
          // Refresh data to show updated image
          await loadData();
          return imageUrl;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploading(null);
    }
  };

  const onSubmit = async (data: BestSellersFormValues) => {
    try {
      // Get selected item IDs (filter out 'none' values)
      const selectedIds = Object.values(data).filter(id => id && id !== 'none');
      
      // Check for duplicates
      const uniqueIds = new Set(selectedIds);
      if (uniqueIds.size !== selectedIds.length) {
        toast({
          variant: 'destructive',
          title: 'Duplicate Selection',
          description: 'Please select different items for each best seller slot.',
        });
        return;
      }

      // Get current best seller images before update
      const currentBestSellers = menuItems.filter(item => item.is_best_seller);
      const oldImageUrls = currentBestSellers
        .map(item => item.image_url)
        .filter((url): url is string => Boolean(url));

      // Update all items: remove best seller status from all, then add to selected
      const updatePromises = menuItems.map(item => {
        const shouldBeBestSeller = selectedIds.includes(item.id);
        if (item.is_best_seller !== shouldBeBestSeller) {
          return updateMenuItem(item.id, { is_best_seller: shouldBeBestSeller });
        }
        return Promise.resolve(true);
      });

      await Promise.all(updatePromises);

      // Get new best seller images after update
      const updatedItems = await getAllMenuItems();
      const newBestSellers = updatedItems.filter(item => item.is_best_seller);
      const newImageUrls = newBestSellers
        .map(item => item.image_url)
        .filter((url): url is string => Boolean(url));

      // Cleanup old images that are no longer used
      await cleanupBestSellerImages(newImageUrls);

      toast({
        title: 'Success',
        description: 'Best sellers updated successfully! Old images cleaned up.',
      });

      await loadData();
      onSuccess?.();
    } catch (error) {
      console.error('Error updating best sellers:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update best sellers',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Best Sellers Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Best Sellers Management
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select up to 4 items to feature as best sellers. Add images to make them stand out!
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Best Seller Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((slot) => {
                const searchQuery = searchQueries[`bestSeller${slot}`] || '';
                const filteredItems = getFilteredItems(slot);
                
                return (
                  <FormField
                    key={slot}
                    control={form.control}
                    name={`bestSeller${slot}` as keyof BestSellersFormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Best Seller #{slot}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an item" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {/* Search Input inside dropdown */}
                            <div className="sticky top-0 bg-background border-b p-2">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  placeholder="Search items..."
                                  value={searchQuery}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    setSearchQueries(prev => ({
                                      ...prev,
                                      [`bestSeller${slot}`]: e.target.value
                                    }));
                                  }}
                                  onKeyDown={(e) => e.stopPropagation()}
                                  className="pl-10 pr-10 text-sm h-8"
                                />
                                {searchQuery && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSearchQueries(prev => ({
                                        ...prev,
                                        [`bestSeller${slot}`]: ''
                                      }));
                                    }}
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            <SelectItem value="none">None</SelectItem>
                            {filteredItems.map((item) => {
                              // Get all currently selected values except current field
                              const currentValues = form.getValues();
                              const otherSelectedValues = Object.entries(currentValues)
                                .filter(([key]) => key !== `bestSeller${slot}`)
                                .map(([, value]) => value)
                                .filter(value => value && value !== 'none');
                              
                              // Don't show item if it's already selected in another slot
                              const isAlreadySelected = otherSelectedValues.includes(item.id);
                              
                              if (isAlreadySelected) return null;
                              
                              return (
                                <SelectItem key={item.id} value={item.id}>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={item.category === 'Veg' ? 'secondary' : 'destructive'} className="text-xs">
                                      {item.category}
                                    </Badge>
                                    <span className="truncate">{item.name}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                            {filteredItems.length === 0 && searchQuery && (
                              <div className="px-2 py-1 text-sm text-muted-foreground">
                                No items found for "{searchQuery}"
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>

            <Button type="submit" className="w-full">
              Update Best Sellers
            </Button>
          </form>
        </Form>

        {/* Image Upload Section */}
        {bestSellers.length > 0 && (
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-semibold">Best Seller Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bestSellers.map((item) => (
                <div key={item.id} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.category === 'Veg' ? 'secondary' : 'destructive'}>
                      {item.category}
                    </Badge>
                    <h4 className="font-medium">{item.name}</h4>
                  </div>
                  
                  <ImageCropUpload
                    currentImageUrl={item.image_url}
                    onImageUpload={(file, croppedBlob) => handleImageUpload(item.id, file, croppedBlob)}
                    aspectRatio={16/9}
                    maxWidth={800}
                    maxHeight={450}
                  />
                  
                  {uploading === item.id && (
                    <div className="text-sm text-muted-foreground">
                      Uploading image...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}