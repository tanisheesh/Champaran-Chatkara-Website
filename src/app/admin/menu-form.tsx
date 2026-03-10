
"use client";

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus } from 'lucide-react';

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
import { Checkbox } from '@/components/ui/checkbox';

import { addOrUpdateMenuItem } from './actions';
import { getAllMenuCategories } from '@/lib/supabase-db';
import type { MenuItem, MenuCategory } from '@/lib/types';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  category: z.enum(['Veg', 'Non-Veg']),
  menuCategory: z.string().min(1, { message: 'Menu category is required.' }),
  pricing: z.array(z.object({
    quantity: z.string().min(1, { message: 'Quantity is required.' }),
    price: z.coerce.number().positive({ message: 'Price must be positive.' })
  })).min(1, { message: 'At least one pricing option is required.' })
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
  const { toast } = useToast();
  const isEditing = !!menuItem;

  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  const loadCategories = async () => {
    try {
      const data = await getAllMenuCategories();
      setCategories(data.filter(cat => cat.is_active));
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing ? {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        category: menuItem.category,
        menuCategory: menuItem.menu_category,
        pricing: menuItem.pricing || [{ quantity: 'Full', price: 0 }]
    } : {
      name: '',
      description: '',
      category: 'Veg',
      menuCategory: '',
      pricing: [{ quantity: 'Full', price: 0 }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'pricing'
  });

  const onSubmit: SubmitHandler<MenuFormValues> = async (data) => {
    const formData = new FormData();
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of the menu item.' : 'Fill in the details for the new menu item.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isEditing && <input type="hidden" {...form.register('id')} />}
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Litti Chokha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the dish..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Veg">Veg</SelectItem>
                        <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="menuCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity-wise Pricing */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Pricing Options</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ quantity: '', price: 0 })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Price
                </Button>
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`pricing.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className={index === 0 ? '' : 'sr-only'}>
                          Quantity
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Half, Full, 250g" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`pricing.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className={index === 0 ? '' : 'sr-only'}>
                          Price (₹)
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Remove image upload from regular items */}

            {/* Remove Best Seller checkbox - handled separately */}

            <DialogFooter>
              <Button type="submit">
                {isEditing ? 'Save Changes' : 'Add Item'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
