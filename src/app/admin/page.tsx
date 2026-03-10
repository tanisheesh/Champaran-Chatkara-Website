
'use client';

import { useEffect, useState } from 'react';
import { PlusCircle, UtensilsCrossed, Trash2, Star, TrendingUp, Tags, LogOut } from 'lucide-react';
import { getAllMenuItems, getAllMenuCategories } from '@/lib/supabase-db';
import { signOutAdmin } from '@/lib/auth';
import { useAuth } from '@/contexts/auth-context';
import type { MenuItem, MenuCategory } from '@/lib/types';
import { imageMap } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

import { MenuForm } from './menu-form';
import { BestSellersForm } from './best-sellers-form';
import { CategoriesForm } from './categories-form';
import { deleteMenuItem } from './actions';
import { AuthGuard } from '@/components/admin/auth-guard';

function AdminPageContent() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const bestSellers = menuItems.filter(item => item.is_best_seller);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [items, categories] = await Promise.all([
        getAllMenuItems(),
        getAllMenuCategories()
      ]);
      setMenuItems(items);
      setMenuCategories(categories);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load menu data',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutAdmin();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
      router.push('/admin/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign out',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteMenuItem(id);
      if (result.success) {
        toast({
          title: 'Item deleted',
          description: 'Menu item has been deleted successfully',
        });
        // Refresh data
        loadData();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to delete item',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    }
  };

  const MenuItemCard = ({ item }: { item: MenuItem }) => {
    const placeholder = imageMap.get(item.image);

    return (
      <Card key={item.id} className="flex flex-col">
        <CardHeader>
          {placeholder && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md mb-4">
              <Image
                src={item.image_url || placeholder.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                data-ai-hint={placeholder.imageHint}
              />
            </div>
          )}
          <CardTitle className="font-headline text-xl">{item.name}</CardTitle>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {item.pricing && item.pricing.length > 0 ? (
                item.pricing.map((price: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{price.quantity}</span>
                    <span className="font-semibold text-primary">₹{price.price}</span>
                  </div>
                ))
              ) : (
                <span className="font-semibold text-primary">Price not set</span>
              )}
            </div>
            <Badge variant={item.category === 'Veg' ? 'secondary' : 'destructive'} className="capitalize">
              {item.category}
            </Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            {item.is_best_seller && (
              <Badge className="w-fit" variant="outline">
                <TrendingUp className="w-3 h-3 mr-1" />
                Best Seller
              </Badge>
            )}
            <Badge variant="outline" className="w-fit">
              <Tags className="w-3 h-3 mr-1" />
              {item.menu_category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription>{item.description}</CardDescription>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <MenuForm menuItem={item} onSuccess={loadData}>
            <Button variant="outline" size="sm">Edit</Button>
          </MenuForm>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the item "{item.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(item.id)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold font-headline">
                  Champaran Chatkara <span className="text-muted-foreground font-body font-normal text-lg">- Admin</span>
                </h1>
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader>
                  <Skeleton className="aspect-video w-full rounded-md mb-4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-8 w-20 mr-2" />
                  <Skeleton className="h-8 w-8" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold font-headline">
                Champaran Chatkara <span className="text-muted-foreground font-body font-normal text-lg">- Admin</span>
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[450px]">
            <TabsTrigger value="all">All Items ({menuItems.length})</TabsTrigger>
            <TabsTrigger value="bestsellers">Best Sellers</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="mb-6">
              <MenuForm onSuccess={loadData}>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
                </Button>
              </MenuForm>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bestsellers" className="mt-6">
            <BestSellersForm onSuccess={loadData} />
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <CategoriesForm onSuccess={loadData} />
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {category.name}
                      <Badge variant={category.is_active ? 'default' : 'secondary'}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">
                        {menuItems.filter(item => item.menu_category === category.name).length} items
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminPageContent />
    </AuthGuard>
  );
}
