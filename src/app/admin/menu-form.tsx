
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

import { addOrUpdateMenuItem } from './actions';
import { getAllMenuCategories, clearCategoriesCache } from '@/lib/supabase-db';
import type { MenuItem, MenuCategory } from '@/lib/types';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  category: z.enum(['Veg', 'Non-Veg']),
  menuCategory: z.string().min(1, { message: 'Menu category is required.' }),
  
  // Independent pricing fields - no cross validation
  qtr_price: z.union([z.coerce.number().positive(), z.literal(''), z.literal(0)]).optional(),
  half_price: z.union([z.coerce.number().positive(), z.literal(''), z.literal(0)]).optional(),
  full_price: z.union([z.coerce.number().positive(), z.literal(''), z.literal(0)]).optional(),
  single_price: z.union([z.coerce.number().positive(), z.literal(''), z.literal(0)]).optional(),
  
  is_best_seller: z.boolean().default(false)
});

type MenuFormValues = z.infer<typeof formSchema>;

interface MenuFormProps {
  menuItem?: MenuItem;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function MenuForm({ menuItem, children, onSuccess }: MenuFormProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditing = !!menuItem;

  const loadCategories = async () => {
    if (categoriesLoading) return; // Prevent duplicate calls
    
    setCategoriesLoading(true);
    try {
      // Clear cache to get fresh data
      clearCategoriesCache();
      const categoriesData = await getAllMenuCategories(true); // Force refresh
      console.log('Loaded categories:', categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        variant: "destructive",
        title: "Error Loading Categories",
        description: "Failed to load menu categories. Please try again.",
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (open && categories.length === 0) {
      loadCategories();
    }
  }, [open]);

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing ? {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description || '',
        category: menuItem.category,
        menuCategory: menuItem.menu_category,
        qtr_price: menuItem.qtr_price || '',
        half_price: menuItem.half_price || '',
        full_price: menuItem.full_price || '',
        single_price: menuItem.single_price || '',
        is_best_seller: menuItem.is_best_seller || false
    } : {
      name: '',
      description: '',
      category: 'Veg',
      menuCategory: '',
      qtr_price: '',
      half_price: '',
      full_price: '',
      single_price: '',
      is_best_seller: false
    },
  });

  const onSubmit: SubmitHandler<MenuFormValues> = async (data) => {
    if (submitting) return; // Prevent double submission
    
    // Check if at least one price is provided
    const hasPrice = data.qtr_price || data.half_price || data.full_price || data.single_price;
    
    if (!hasPrice) {
      toast({
        variant: "destructive",
        title: "Pricing Required",
        description: "Please add at least one price option.",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Add id for editing
      if (isEditing && menuItem?.id) {
        formData.append('id', menuItem.id);
      }
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      const result = await addOrUpdateMenuItem(formData);
      
      if (result.success) {
        toast({
          title: `Item ${isEditing ? 'Updated' : 'Added'}`,
          description: `"${data.name}" has been successfully ${isEditing ? 'updated' : 'added'}.`,
        });
        setOpen(false);
        form.reset();
        onSuccess?.(); // Call the callback to refresh data
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: result.error || "Could not save the item. Please check the form for errors.",
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="font-headline text-lg sm:text-xl">{isEditing ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription className="text-sm">
            {isEditing ? 'Update the details of the menu item.' : 'Fill in the details for the new menu item.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isEditing && (
              <input type="hidden" name="id" value={menuItem?.id || ''} />
            )}
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Litti Chokha" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the dish..." {...field} className="text-sm min-h-[80px]" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Veg">Veg</SelectItem>
                        <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="menuCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Menu Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={categoriesLoading}>
                    <FormControl>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select category"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </div>
                        </SelectItem>
                      ) : categories.length === 0 ? (
                        <SelectItem value="no-categories" disabled>
                          No categories available
                        </SelectItem>
                      ) : (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                  {categories.length === 0 && !categoriesLoading && (
                    <FormDescription className="text-xs">
                      No categories found. Please create a category first.
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            {/* Simplified Pricing Structure */}
            <div className="space-y-4">
              <FormLabel className="text-sm font-medium">Pricing Options</FormLabel>
              <FormDescription className="text-xs">
                Add prices for different quantities (at least one required).
              </FormDescription>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="qtr_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Quarter Price (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Optional" 
                          {...field}
                          value={field.value || ''}
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="half_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Half Price (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Optional" 
                          {...field}
                          value={field.value || ''}
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="full_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Full Price (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Optional" 
                          {...field}
                          value={field.value || ''}
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="single_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Single Price (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Optional" 
                          {...field}
                          value={field.value || ''}
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
              <Button type="submit" disabled={submitting || categoriesLoading} className="w-full sm:w-auto">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Saving...' : 'Adding...'}
                  </>
                ) : (
                  isEditing ? 'Save Changes' : 'Add Item'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
