'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { getAllMenuItems, getBestSellers, updateMenuItem } from '@/lib/supabase-db';
import { uploadToSupabaseStorage } from '@/lib/storage';
import type { MenuItem } from '@/lib/types';

export function BestSellersForm({ onSuccess }: { onSuccess?: () => void }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [bestSellers, setBestSellers] = useState<(MenuItem | null)[]>([null, null, null, null]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null, null]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allItems, currentBestSellers] = await Promise.all([
        getAllMenuItems(),
        getBestSellers()
      ]);
      
      setMenuItems(allItems);
      
      // Fill best sellers array (max 4)
      const bestSellersArray: (MenuItem | null)[] = [null, null, null, null];
      currentBestSellers.slice(0, 4).forEach((item, index) => {
        bestSellersArray[index] = item;
      });
      setBestSellers(bestSellersArray);
      
      // Set image previews
      const previews = bestSellersArray.map(item => item?.image_url || null);
      setImagePreviews(previews);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load data',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = async (slotIndex: number, itemId: string) => {
    if (!itemId) return;
    
    const selectedItem = menuItems.find(item => item.id === itemId);
    if (!selectedItem) return;

    // Check if item is already selected in another slot
    const isAlreadySelected = bestSellers.some((item, index) => 
      index !== slotIndex && item?.id === itemId
    );
    
    if (isAlreadySelected) {
      toast({
        variant: 'destructive',
        title: 'Item already selected',
        description: 'This item is already selected as a best seller',
      });
      return;
    }

    // Update the slot
    const newBestSellers = [...bestSellers];
    newBestSellers[slotIndex] = selectedItem;
    setBestSellers(newBestSellers);
  };

  const handleImageUpload = async (slotIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const currentItem = bestSellers[slotIndex];
    if (!currentItem) {
      toast({
        variant: 'destructive',
        title: 'No item selected',
        description: 'Please select a menu item first',
      });
      return;
    }

    try {
      setUploading(slotIndex);
      
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPreviews = [...imagePreviews];
        newPreviews[slotIndex] = e.target?.result as string;
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      const imageUrl = await uploadToSupabaseStorage(file);
      
      // Update item in database
      await updateMenuItem(currentItem.id, {
        is_best_seller: true,
        image: `best_seller_${Date.now()}`,
        image_url: imageUrl
      });
      
      toast({
        title: 'Image uploaded',
        description: 'Best seller image updated successfully',
      });
      
      onSuccess?.();
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
      });
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveItem = async (slotIndex: number) => {
    const currentItem = bestSellers[slotIndex];
    if (!currentItem) return;

    try {
      // Remove from best sellers
      await updateMenuItem(currentItem.id, {
        is_best_seller: false,
        image: undefined,
        image_url: undefined
      });

      // Update local state
      const newBestSellers = [...bestSellers];
      newBestSellers[slotIndex] = null;
      setBestSellers(newBestSellers);

      const newPreviews = [...imagePreviews];
      newPreviews[slotIndex] = null;
      setImagePreviews(newPreviews);

      toast({
        title: 'Item removed',
        description: 'Item removed from best sellers',
      });
      
      onSuccess?.();
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove item',
      });
    }
  };

  const availableItems = menuItems.filter(item => 
    !bestSellers.some(bestSeller => bestSeller?.id === item.id)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Best Sellers Management</h3>
        <p className="text-sm text-muted-foreground">
          Select up to 4 items as best sellers. Each must have an image.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bestSellers.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-base">Best Seller Slot {index + 1}</CardTitle>
              <CardDescription>
                {item ? `Selected: ${item.name}` : 'No item selected'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Item Selection */}
              <div>
                <Label>Select Menu Item</Label>
                <Select
                  value={item?.id || ''}
                  onValueChange={(value) => handleItemSelect(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an item..." />
                  </SelectTrigger>
                  <SelectContent>
                    {item && (
                      <SelectItem value={item.id}>
                        {item.name} (Current)
                      </SelectItem>
                    )}
                    {availableItems.map((menuItem) => (
                      <SelectItem key={menuItem.id} value={menuItem.id}>
                        {menuItem.name} - {menuItem.menu_category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              {item && (
                <div>
                  <Label>Best Seller Image *</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        disabled={uploading === index}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        disabled={uploading === index}
                        size="sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading === index ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                    
                    {imagePreviews[index] && (
                      <div className="relative w-full h-32 border rounded-md overflow-hidden">
                        <img
                          src={imagePreviews[index]!}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-2 left-2"
                          onClick={() => handleRemoveItem(index)}
                        >
                          Remove
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            const newPreviews = [...imagePreviews];
                            newPreviews[index] = null;
                            setImagePreviews(newPreviews);
                            // Clear image but keep item selected
                            if (bestSellers[index]) {
                              updateMenuItem(bestSellers[index]!.id, {
                                image_url: undefined
                              });
                            }
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}