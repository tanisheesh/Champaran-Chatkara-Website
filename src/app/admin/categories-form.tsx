'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { getAllMenuCategories, getAllMenuItems, addMenuCategory, updateMenuCategory, deleteMenuCategory } from '@/lib/supabase-db';
import type { MenuCategory } from '@/lib/types';

const categorySchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().optional(),
  order: z.number().min(1, { message: 'Order must be at least 1.' }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function CategoriesForm({ onSuccess }: { onSuccess?: () => void }) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      order: 1,
    },
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        description: editingCategory.description || '',
        order: editingCategory.order,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        order: Math.max(...categories.map(c => c.order), 0) + 1,
      });
    }
  }, [editingCategory, categories, form]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const [categoriesData, itemsData] = await Promise.all([
        getAllMenuCategories(),
        getAllMenuItems()
      ]);
      setCategories(categoriesData);
      setMenuItems(itemsData);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load categories',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      // Check if order already exists (for new categories or when changing order)
      const orderExists = categories.some(cat => 
        cat.order === data.order && cat.id !== editingCategory?.id
      );
      
      if (orderExists) {
        toast({
          variant: 'destructive',
          title: 'Order already exists',
          description: `Order ${data.order} is already taken by another category.`,
        });
        return;
      }

      if (editingCategory) {
        // Update existing category
        const success = await updateMenuCategory(editingCategory.id, {
          ...data,
          updated_at: new Date().toISOString(),
        });
        
        if (!success) {
          throw new Error('Failed to update category');
        }
        
        toast({
          title: 'Category updated',
          description: `"${data.name}" has been updated successfully.`,
        });
      } else {
        // Add new category
        const newId = await addMenuCategory({
          ...data,
          is_active: true,
        });
        
        if (!newId) {
          throw new Error('Failed to add category');
        }
        
        toast({
          title: 'Category added',
          description: `"${data.name}" has been added successfully.`,
        });
      }
      
      setDialogOpen(false);
      setEditingCategory(null);
      form.reset();
      loadCategories();
      onSuccess?.();
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: editingCategory ? 'Failed to update category' : 'Failed to add category',
      });
    }
  };

  const handleEdit = (category: MenuCategory) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    try {
      const success = await deleteMenuCategory(categoryId);
      
      if (!success) {
        throw new Error('Failed to delete category');
      }
      
      toast({
        title: 'Category deleted',
        description: `"${categoryName}" has been deleted permanently.`,
      });
      
      loadCategories();
      onSuccess?.();
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete category. Make sure no menu items are using this category.',
      });
    }
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Categories Management</h3>
          <p className="text-sm text-muted-foreground">
            Add, edit, or manage menu categories
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory 
                  ? 'Update the category details below.' 
                  : 'Fill in the details for the new category.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Main Course" {...field} />
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
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of this category..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          placeholder="e.g., 1, 2, 3..."
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">
                    {editingCategory ? 'Update Category' : 'Add Category'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                {category.name}
                <Badge variant={category.is_active ? 'default' : 'secondary'}>
                  {category.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    Order: {category.order} | {menuItems.filter(item => item.menu_category === category.name).length} items
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{category.name}" category. This action cannot be undone. Make sure no menu items are using this category.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(category.id, category.name)}
                        >
                          Delete Permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}