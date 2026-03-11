'use client';

import { useEffect, useState } from 'react';
import { Heart, Award, Users, Clock } from 'lucide-react';
import { getBestSellers } from '@/lib/supabase-db';
import { imageMap } from '@/lib/placeholder-images';
import Image from 'next/image';
import type { MenuItem } from '@/lib/types';

export function AboutSection() {
  const [bestSellers, setBestSellers] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const items = await getBestSellers();
        setBestSellers(items);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const features = [
    {
      icon: Heart,
      title: 'Traditional Flavours',
      description: 'Our dishes are prepared using classic spice combinations that bring out authentic taste.',
    },
    {
      icon: Award,
      title: 'Freshly Cooked Food',
      description: 'Every order is prepared fresh in the kitchen to maintain quality and flavour.',
    },
    {
      icon: Users,
      title: 'Wide Variety',
      description: 'From parathas and thalis to tandoori dishes, rolls, and Chinese favourites, the menu offers something for everyone.',
    },
    {
      icon: Clock,
      title: 'Family-Friendly Dining',
      description: 'A comfortable place where families, office groups, and friends can enjoy a satisfying meal together.',
    },
  ];

  return (
    <section id="about" className="py-4 sm:py-6 md:py-8 lg:py-12 bg-gradient-to-b from-black to-gray-900 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-headline text-white mb-4 sm:mb-6">
            <span className="cinematic-text">Tradition</span> & Story
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-0.5 sm:h-1 bg-red-500 mx-auto mb-6 sm:mb-8" />
        </div>

        {/* Story content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center mb-8 sm:mb-12 lg:mb-16 xl:mb-20">
          {/* Story text */}
          <div className="order-2 lg:order-1">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6 text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
              <p>
                <span className="text-red-400 font-semibold">Champaran Chatkara</span> started with a simple idea: 
                serve food that people genuinely enjoy and want to come back for. Inspired by the cooking traditions of 
                <span className="text-red-400 font-semibold"> Bihar</span>, our kitchen focuses on bold spices, slow cooking, 
                and recipes that bring out deep, comforting flavours.
              </p>
              
              <p>
                Over time, the menu has expanded to include <span className="text-red-400 font-semibold">North Indian classics, 
                tandoor dishes, rolls, Chinese favourites, and hearty thalis</span> — making it a place where everyone 
                at the table finds something they enjoy.
              </p>

              <p>
                From morning parathas to late evening dinners, our goal remains the same: 
                <span className="text-red-400 font-semibold"> good food, generous portions, and a welcoming place to share a meal</span>.
              </p>
            </div>
          </div>

          {/* Restaurant Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Main image placeholder */}
              <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-red-900/20 to-black/40 border border-red-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
                <div className="flex items-center justify-center h-full p-3 sm:p-4">
                  <div className="text-center">
                    <div className="w-10 sm:w-12 lg:w-16 xl:w-20 h-10 sm:h-12 lg:h-16 xl:h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Heart className="h-5 sm:h-6 lg:h-8 xl:h-10 w-5 sm:w-6 lg:w-8 xl:w-10 text-red-500" />
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white mb-1 sm:mb-2">
                      Restaurant Photo
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      [Placeholder - Add restaurant interior/exterior image]
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating stats card */}
              <div className="absolute -bottom-2 sm:-bottom-3 lg:-bottom-4 xl:-bottom-6 -right-2 sm:-right-3 lg:-right-4 xl:-right-6 bg-gradient-to-br from-red-900/90 to-black/90 backdrop-blur-sm border border-red-500/30 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 xl:p-6">
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-red-500">25+</div>
                  <div className="text-xs sm:text-sm text-gray-300">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold font-headline text-white mb-3 sm:mb-4">
              What Makes Us <span className="text-red-400">Special</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-red-500/20 transition-colors duration-300">
                  <feature.icon className="h-5 sm:h-6 lg:h-8 w-5 sm:w-6 lg:w-8 text-red-500" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold font-headline text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-xs sm:text-sm lg:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Food showcase section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Food images */}
          <div className="order-2 lg:order-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="aspect-video rounded-lg sm:rounded-xl bg-gradient-to-br from-red-900/20 to-black/40 border border-red-500/20 animate-pulse">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-400 text-xs">Loading...</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : bestSellers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {bestSellers.slice(0, 4).map((item, index) => {
                  const placeholder = item.image ? imageMap.get(item.image) : null;
                  // Build price options
                  const priceOptions = [];
                  if (item.qtr_price) priceOptions.push({ label: 'Quarter', price: item.qtr_price });
                  if (item.half_price) priceOptions.push({ label: 'Half', price: item.half_price });
                  if (item.full_price) priceOptions.push({ label: 'Full', price: item.full_price });
                  if (item.single_price) priceOptions.push({ label: 'Single', price: item.single_price });
                  
                  return (
                    <div key={item.id} className="aspect-video rounded-lg sm:rounded-xl bg-gradient-to-br from-red-900/20 to-black/40 border border-red-500/20 flip-card">
                      <div className="flip-card-inner">
                        {/* Front side - Image */}
                        <div className="flip-card-front bg-gradient-to-br from-red-900/20 to-black/40 border border-red-500/20">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover"
                              priority={index < 2}
                            />
                          ) : placeholder ? (
                            <Image
                              src={placeholder.imageUrl}
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover"
                              data-ai-hint={placeholder.imageHint}
                              priority={index < 2}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <div className="text-center opacity-50">
                                <div className="text-xs text-gray-400">[Food Photo]</div>
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-1 sm:bottom-2 lg:bottom-4 left-1 sm:left-2 lg:left-4 right-1 sm:right-2 lg:right-4">
                            <h4 className="text-white font-bold text-xs sm:text-sm truncate">{item.name}</h4>
                            <p className="text-red-400 text-xs">Tap for prices</p>
                          </div>
                        </div>
                        
                        {/* Back side - Details */}
                        <div className="flip-card-back bg-gradient-to-br from-red-900/90 to-black/90 backdrop-blur-sm border border-red-500/30 p-2 sm:p-3 flex flex-col justify-center">
                          <div className="text-center">
                            <h4 className="text-white font-bold text-xs sm:text-sm mb-2 truncate">{item.name}</h4>
                            <div className="space-y-1">
                              {priceOptions.length > 0 ? (
                                priceOptions.map((price, priceIndex) => (
                                  <div key={priceIndex} className="flex justify-between items-center">
                                    <span className="text-xs text-gray-300">{price.label}</span>
                                    <span className="font-bold text-red-400 text-xs sm:text-sm">₹{price.price}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-400 text-xs">Price not available</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 lg:py-12">
                <div className="w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Heart className="h-5 sm:h-6 lg:h-8 w-5 sm:w-6 lg:w-8 text-red-500/50" />
                </div>
                <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
                  No special dishes available yet
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 px-4">
                  Add some best sellers from the admin panel to showcase here!
                </p>
              </div>
            )}
          </div>

          {/* Text content */}
          <div className="order-1 lg:order-2">
            <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold font-headline text-white mb-3 sm:mb-4 lg:mb-6">
              Our <span className="text-red-400">Special Dishes</span>
            </h3>
            <div className="space-y-2 sm:space-y-3 lg:space-y-4 text-gray-300 leading-relaxed text-xs sm:text-sm lg:text-base">
              <p>
                At <span className="text-red-400 font-semibold">Champaran Chatkara</span>, every dish is prepared using 
                traditional spices and cooking methods that bring out rich, satisfying flavour. From crispy stuffed parathas 
                to slow-cooked handi preparations, our menu combines <span className="text-red-400 font-semibold">bold Bihari-style cooking</span> with 
                popular North Indian favourites.
              </p>
              <p>
                Our signature <span className="text-red-400 font-semibold">Handi Chicken, Handi Mutton, and freshly prepared parathas</span> are 
                cooked with care to deliver deep flavour in every bite. Come and enjoy <span className="text-red-400 font-semibold">hearty meals that are fresh, flavourful, and perfect for sharing</span> with 
                family and friends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}