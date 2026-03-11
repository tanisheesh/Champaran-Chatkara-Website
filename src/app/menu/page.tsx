'use client';

import { useEffect, useState } from 'react';
import { getAllMenuItems, getAllMenuCategories } from '@/lib/supabase-db';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Badge } from '@/components/ui/badge';
import { Vegan, Beef, Star, Search, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { MenuItem, MenuCategory } from '@/lib/types';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Show content with animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Handle scroll to show/hide scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [items, categories] = await Promise.all([
          getAllMenuItems(),
          getAllMenuCategories()
        ]);
        
        const uniqueCategories = categories.filter((category, index, self) => 
          index === self.findIndex(c => c.name === category.name)
        );
        
        setMenuItems(items);
        setMenuCategories(uniqueCategories);
        
        // Set first active category as default
        const activeCategories = uniqueCategories.filter(cat => cat.is_active).sort((a, b) => a.order - b.order);
        if (activeCategories.length > 0) {
          setSelectedCategory(activeCategories[0].name);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeCategories = menuCategories.filter(cat => cat.is_active).sort((a, b) => a.order - b.order);
  
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = !selectedCategory || item.menu_category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.menu_category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const MenuItemRow = ({ item, index }: { item: MenuItem; index: number }) => {
    const priceOptions = [];
    if (item.qtr_price) priceOptions.push({ label: 'Qtr', price: item.qtr_price });
    if (item.half_price) priceOptions.push({ label: 'Half', price: item.half_price });
    if (item.full_price) priceOptions.push({ label: 'Full', price: item.full_price });
    if (item.single_price) priceOptions.push({ label: 'Single', price: item.single_price });

    return (
      <div 
        className={`bg-gradient-to-r from-red-900/5 to-transparent border-b border-red-500/10 last:border-b-0 p-4 hover:bg-red-500/5 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ 
          transitionDelay: `${Math.min(index * 50, 500)}ms` 
        }}
      >
        <div className="flex justify-between items-start gap-4">
          {/* Left side - Item info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-white text-base sm:text-lg">
                {item.name}
              </h3>
              <div className="flex gap-1">
                <Badge 
                  variant={item.category === 'Veg' ? 'secondary' : 'destructive'} 
                  className="text-xs px-1.5 py-0.5"
                >
                  {item.category === 'Veg' ? <Vegan className="w-2.5 h-2.5" /> : <Beef className="w-2.5 h-2.5" />}
                </Badge>
                {item.is_best_seller && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                    <Star className="w-2.5 h-2.5 mr-1" />
                    Best
                  </Badge>
                )}
              </div>
            </div>
            {item.description && (
              <p className="text-gray-400 text-sm leading-relaxed mb-2 line-clamp-2">
                {item.description}
              </p>
            )}
            <p className="text-gray-500 text-xs">{item.menu_category}</p>
          </div>
          
          {/* Right side - Prices */}
          <div className="text-right flex-shrink-0">
            {priceOptions.length > 0 ? (
              <div className="space-y-1">
                {priceOptions.map((price, index) => (
                  <div key={index} className="flex items-center justify-end gap-2 text-sm">
                    <span className="text-gray-400 min-w-[40px] text-right">{price.label}</span>
                    <span className="font-bold text-red-400 min-w-[50px] text-right">₹{price.price}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-gray-500 text-sm">N/A</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white animate-pulse">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white relative">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-8 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-white mb-4">
              Our <span className="cinematic-text">Menu</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
              Authentic Bihari cuisine crafted with traditional recipes and love
            </p>
            <div className="w-24 h-1 bg-red-500 mx-auto mt-4" />
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-4 sm:py-6 bg-black/20 border-b border-red-500/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`flex flex-col gap-4 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Search */}
            <div className="relative max-w-md mx-auto w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900/50 border-red-500/30 text-white placeholder-gray-400 focus:border-red-500 h-10 sm:h-11 transition-all duration-300"
              />
            </div>
            
            {/* Category Filters - Scrollable */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max px-2">
                {activeCategories.map((category, index) => {
                  const count = menuItems.filter(item => item.menu_category === category.name).length;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.name ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.name)}
                      className={`text-xs whitespace-nowrap flex-shrink-0 px-3 py-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedCategory === category.name 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white'
                      }`}
                      style={{ 
                        transitionDelay: `${index * 50}ms` 
                      }}
                    >
                      {category.name} ({count})
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length > 0 ? (
            <div 
              className={`bg-gradient-to-br from-red-900/10 to-black/20 border border-red-500/20 rounded-xl overflow-hidden transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {filteredItems.map((item, index) => (
                <MenuItemRow key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div 
              className={`text-center py-12 sm:py-16 transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-red-500/50" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No dishes found</h3>
              <p className="text-gray-400 mb-6 text-sm sm:text-base px-4">
                {searchTerm 
                  ? `No results for "${searchTerm}"` 
                  : `No items in ${selectedCategory} category.`}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  if (activeCategories.length > 0) {
                    setSelectedCategory(activeCategories[0].name);
                  }
                }}
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-500 transform ${
          showScrollTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      <Footer />
    </div>
  );
}