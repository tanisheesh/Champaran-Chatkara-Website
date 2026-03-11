
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { PlusCircle, UtensilsCrossed, Trash2, Star, TrendingUp, Tags, LogOut, RefreshCw, Search, X } from 'lucide-react';
import { getAllMenuItems, getAllMenuCategories } from '@/lib/supabase-db';
import { signOutAdmin } from '@/lib/auth';
import { useAuth } from '@/contexts/auth-context';
import type { MenuItem, MenuCategory } from '@/lib/types';
import { imageMap } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Memoized computed values to prevent unnecessary recalculations
  const bestSellers = useMemo(() => 
    menuItems.filter(item => item.is_best_seller), 
    [menuItems]
  );

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems;
    
    const query = searchQuery.toLowerCase().trim();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.menu_category.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [menuItems, searchQuery]);

  const categorizedItems = useMemo(() => {
    const result = new Map<string, MenuItem[]>();
    filteredItems.forEach(item => {
      const category = item.menu_category;
      if (!result.has(category)) {
        result.set(category, []);
      }
      result.get(category)!.push(item);
    });
    return result;
  }, [filteredItems]);

  const loadData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const [items, categories] = await Promise.all([
        getAllMenuItems(),
        getAllMenuCategories()
      ]);
      
      setMenuItems(items || []);
      setMenuCategories(categories || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load menu data. Please try again.',
      });
      
      // Set empty arrays to prevent infinite loading
      setMenuItems([]);
      setMenuCategories([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const handleDelete = async (id: string, itemName: string) => {
    try {
      const result = await deleteMenuItem(id);
      if (result.success) {
        toast({
          title: 'Item deleted',
          description: `"${itemName}" has been deleted successfully`,
        });
        // Optimistically update the UI
        setMenuItems(prev => prev.filter(item => item.id !== id));
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

  const handleRefresh = () => {
    loadData(true);
  };

  const MenuItemCard = ({ item }: { item: MenuItem }) => {
    const placeholder = imageMap.get(item.image || '');
    const priceOptions = useMemo(() => {
      const options = [];
      if (item.qtr_price) options.push({ label: 'Quarter', price: item.qtr_price });
      if (item.half_price) options.push({ label: 'Half', price: item.half_price });
      if (item.full_price) options.push({ label: 'Full', price: item.full_price });
      if (item.single_price) options.push({ label: 'Single', price: item.single_price });
      return options;
    }, [item.qtr_price, item.half_price, item.full_price, item.single_price]);

    return (
      <Card key={item.id} className="flex flex-col h-full">
        <CardHeader className="pb-3">
          {placeholder && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md mb-3">
              <Image
                src={item.image_url || placeholder.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
                data-ai-hint={placeholder.imageHint}
              />
            </div>
          )}
          <CardTitle className="font-headline text-base sm:text-lg lg:text-xl line-clamp-2">{item.name}</CardTitle>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1 min-w-0">
              {priceOptions.length > 0 ? (
                <div className="grid grid-cols-2 gap-1">
                  {priceOptions.slice(0, 4).map((price, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground truncate">{price.label}</span>
                      <span className="font-semibold text-primary text-sm">₹{price.price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="font-semibold text-destructive text-sm">Price not set</span>
              )}
            </div>
            <Badge variant={item.category === 'Veg' ? 'secondary' : 'destructive'} className="capitalize text-xs self-start sm:self-center flex-shrink-0">
              {item.category}
            </Badge>
          </div>
          <div className="flex gap-1 flex-wrap">
            {item.is_best_seller && (
              <Badge className="w-fit text-xs" variant="outline">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Best Seller</span>
                <span className="sm:hidden">Best</span>
              </Badge>
            )}
            <Badge variant="outline" className="w-fit text-xs">
              <Tags className="w-3 h-3 mr-1" />
              <span className="truncate max-w-[100px]">{item.menu_category}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow pb-3">
          <CardDescription className="line-clamp-3 text-xs sm:text-sm">{item.description}</CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-3">
          <MenuForm menuItem={item} onSuccess={() => loadData(true)}>
            <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs">
              Edit
            </Button>
          </MenuForm>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                <Trash2 className="h-3 w-3 sm:mr-1" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md mx-4">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm">
                  This action cannot be undone. This will permanently delete the item "{item.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(item.id, item.name)} className="w-full sm:w-auto">
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
            <div className="flex items-center justify-between h-14 sm:h-16">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-headline">
                  Champaran Chatkara
                </h1>
              </div>
              <Skeleton className="h-8 w-20 sm:h-10 sm:w-32" />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader>
                  <Skeleton className="aspect-video w-full rounded-md mb-3 sm:mb-4" />
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-3 sm:h-4 w-full mb-2" />
                  <Skeleton className="h-3 sm:h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-7 sm:h-8 w-16 sm:w-20 mr-2" />
                  <Skeleton className="h-7 sm:h-8 w-7 sm:w-8" />
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
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-headline truncate">
                  Champaran Chatkara
                </h1>
                <span className="text-xs sm:text-sm text-muted-foreground font-body font-normal hidden sm:inline">
                  Admin Dashboard
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <span className="text-xs sm:text-sm text-muted-foreground hidden md:block truncate">
                Welcome, {user?.displayName || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="hidden sm:flex">
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden lg:inline">Refresh</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="sm:hidden">
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="flex-shrink-0">
                <LogOut className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto sm:mx-0 sm:max-w-none sm:w-auto lg:w-[450px]">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">All Items</span>
              <span className="sm:hidden">All</span>
              <span className="ml-1">({menuItems.length})</span>
            </TabsTrigger>
            <TabsTrigger value="bestsellers" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Best Sellers</span>
              <span className="sm:hidden">Best</span>
              <span className="ml-1">({bestSellers.length})</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Categories</span>
              <span className="sm:hidden">Cat</span>
              <span className="ml-1">({menuCategories.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 sm:mt-6">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <MenuForm onSuccess={() => loadData(true)}>
                <Button className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> 
                  <span className="hidden sm:inline">Add New Item</span>
                  <span className="sm:hidden">Add Item</span>
                </Button>
              </MenuForm>
              
              {menuItems.length > 0 && (
                <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
                  <div className="sm:hidden">
                    {filteredItems.length} of {menuItems.length} items • {menuCategories.length} categories
                  </div>
                  <div className="hidden sm:block">
                    Showing: {filteredItems.length} of {menuItems.length} items across {menuCategories.length} categories
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search items by name, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 text-sm"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {searchQuery && (
                <p className="text-xs text-muted-foreground mt-2">
                  {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found for "{searchQuery}"
                </p>
              )}
            </div>
            
            {/* Category-wise Items Display */}
            <div className="space-y-6 sm:space-y-8">
              {menuCategories
                .filter(category => category.is_active !== false) // Include categories without is_active field
                .map((category) => {
                  const categoryItems = categorizedItems.get(category.name) || [];
                  
                  if (categoryItems.length === 0) return null;
                  
                  return (
                    <div key={`category-section-${category.id}`} className="space-y-3 sm:space-y-4">
                      {/* Category Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                        <div className="min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold font-headline text-foreground truncate">
                            {category.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {category.description && `${category.description} • `}{categoryItems.length} items
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs self-start sm:self-center flex-shrink-0">
                          Order: {category.order || 0}
                        </Badge>
                      </div>
                      
                      {/* Category Items */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {categoryItems.map((item) => (
                          <MenuItemCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              
              {/* Show message if no items */}
              {menuItems.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No menu items yet</h3>
                  <p className="text-sm text-muted-foreground mb-4 px-4">
                    Start by adding your first menu item
                  </p>
                  <MenuForm onSuccess={() => loadData(true)}>
                    <Button className="w-full sm:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" /> 
                      <span className="hidden sm:inline">Add First Item</span>
                      <span className="sm:hidden">Add Item</span>
                    </Button>
                  </MenuForm>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bestsellers" className="mt-4 sm:mt-6">
            <BestSellersForm onSuccess={() => loadData(true)} />
          </TabsContent>

          <TabsContent value="categories" className="mt-4 sm:mt-6">
            <CategoriesForm onSuccess={() => loadData(true)} />
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
