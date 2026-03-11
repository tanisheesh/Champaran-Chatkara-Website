'use client';

import { useEffect, useState } from 'react';
import { getAllMenuItems, getAllMenuCategories } from '@/lib/supabase-db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Vegan, Beef } from 'lucide-react';

export function MenuSection() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [menuCategories, setMenuCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [items, categories] = await Promise.all([
          getAllMenuItems(),
          getAllMenuCategories()
        ]);
        
        // Remove any potential duplicates on the client side
        const uniqueCategories = categories.filter((category, index, self) => 
          index === self.findIndex(c => c.name === category.name)
        );
        
        setMenuItems(items);
        setMenuCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeCategories = menuCategories.filter(cat => cat.is_active).sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <section id="menu" className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="text-white text-xl">Loading menu...</div>
          </div>
        </div>
      </section>
    );
  }

  // Simple Menu Item (List format - no image, no description)
  const MenuItemRow = ({ item, index }: { item: any; index: number }) => {
    // Build price options from new structure
    const priceOptions = [];
    if (item.qtr_price) priceOptions.push({ label: 'Quarter', price: item.qtr_price });
    if (item.half_price) priceOptions.push({ label: 'Half', price: item.half_price });
    if (item.full_price) priceOptions.push({ label: 'Full', price: item.full_price });
    if (item.single_price) priceOptions.push({ label: 'Single', price: item.single_price });

    return (
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-red-500/10 last:border-b-0 hover:bg-red-500/5 transition-colors duration-300 rounded-lg px-4 animate-slideInLeft gap-4 sm:gap-0"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="flex-1">
            <h4 className="font-medium font-headline text-white text-base sm:text-lg hover:text-red-400 transition-colors duration-300">
              {item.name}
            </h4>
            <div className="flex gap-2 mt-2">
              <Badge 
                variant={item.category === 'Veg' ? 'secondary' : 'destructive'} 
                className="text-xs"
              >
                {item.category === 'Veg' ? <Vegan className="w-2 h-2 sm:w-3 sm:h-3 mr-1" /> : <Beef className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />}
                {item.category}
              </Badge>
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right">
          {priceOptions.length > 0 ? (
            <div className="space-y-1">
              {priceOptions.map((price, priceIndex) => (
                <div key={priceIndex} className="flex flex-row sm:flex-row items-center justify-between sm:justify-end gap-3">
                  <span className="text-sm text-gray-400 min-w-[60px]">{price.label}</span>
                  <span className="font-bold text-red-400 text-base sm:text-lg">₹{price.price}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-bold text-red-400 text-base sm:text-lg">Price not available</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="menu" className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-40 h-40 border border-red-500/5 rounded-full" />
        <div className="absolute bottom-20 left-20 w-32 h-32 border border-red-500/5 rounded-full" />
        <div className="absolute top-1/2 left-10 w-3 h-3 bg-red-500/20 rounded-full animate-pulse" />
        <div className="absolute top-1/4 right-10 w-2 h-2 bg-red-500/30 rounded-full animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="animate-fadeInUp">
            <span className="text-red-400 text-lg sm:text-xl mb-4 block">Culinary Excellence</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-white mb-6">
              Our <span className="cinematic-text">Menu</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              A selection of our finest dishes, crafted with tradition and love, 
              bringing you the authentic taste of Bihar.
            </p>
            <div className="w-24 h-1 bg-red-500 mx-auto mt-6 sm:mt-8" />
          </div>
        </div>

        {/* Menu Categories - No Best Sellers Section */}
        <div className="animate-fadeInUp" style={{ animationDelay: '600ms' }}>
          <Tabs defaultValue={activeCategories[0]?.name.toLowerCase().replace(/\s+/g, '-')} className="w-full">
            <div className="flex justify-center mb-8 sm:mb-12">
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 bg-black/40 border border-red-500/20 p-1 sm:p-2 rounded-xl w-full max-w-2xl">
                {activeCategories.slice(0, 5).map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.name.toLowerCase().replace(/\s+/g, '-')} 
                    className="text-xs sm:text-sm font-medium data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 hover:text-white transition-colors duration-300 px-2 sm:px-4 py-2"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Category Content */}
            {activeCategories.map((category) => {
              const categoryItems = menuItems.filter(item => item.menu_category === category.name);
              return (
                <TabsContent key={category.id} value={category.name.toLowerCase().replace(/\s+/g, '-')} className="mt-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold font-headline text-white mb-2">{category.name}</h3>
                    <p className="text-gray-400 text-lg">{category.description}</p>
                  </div>
                  <div className="max-w-6xl mx-auto">
                    <Card className="bg-gradient-to-br from-red-900/5 to-black/20 border-red-500/20">
                      <CardContent className="p-8">
                        {categoryItems.length > 0 ? (
                          <div className="space-y-0">
                            {categoryItems.map((item, index) => (
                              <MenuItemRow key={item.id} item={item} index={index} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                              <TrendingUp className="h-8 w-8 text-red-500/50" />
                            </div>
                            <p className="text-gray-400 text-lg">
                              No items available in this category yet
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                              Check back soon for delicious additions!
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </section>
  );
}