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
      title: 'Made with Love',
      description: 'Every dish is prepared with traditional techniques and generations of love.',
    },
    {
      icon: Award,
      title: 'Authentic Recipes',
      description: 'Original dishes from the heart of Bihar, maintaining authentic Champaran flavors.',
    },
    {
      icon: Users,
      title: 'Family Heritage',
      description: 'A family business serving authentic Bihari cuisine for over 25 years.',
    },
    {
      icon: Clock,
      title: 'Time-Honored Process',
      description: 'We slow-cook our dishes to perfection, ensuring every bite is flavorful.',
    },
  ];

  return (
    <section id="about" className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-b from-black to-gray-900 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="text-red-400 text-base sm:text-lg lg:text-xl mb-3 sm:mb-4 block">Our Journey</span>
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
                In the heart of <span className="text-red-400 font-semibold">Champaran, Bihar</span>, 
                our culinary journey began 25 years ago. What started as a small family kitchen 
                has now become a beloved destination for authentic Bihari cuisine.
              </p>
              
              <p>
                Our founder <span className="text-red-400 font-semibold">Master Chef</span> learned 
                these recipes from his grandmother, who believed that food is not just about filling 
                the stomach, but about warming the heart. Every dish tells a story of our rich cultural heritage.
              </p>
              
              <p>
                From the smoky flavors of our signature <span className="text-red-400 font-semibold">Litti Chokha</span> to 
                the slow-cooked <span className="text-red-400 font-semibold">Champaran Mutton</span>, 
                we preserve the authentic taste that has been cherished for generations.
              </p>

              <div className="pt-3 sm:pt-4 lg:pt-6">
                <blockquote className="border-l-4 border-red-500 pl-3 sm:pl-4 lg:pl-6 italic text-sm sm:text-base lg:text-lg xl:text-xl text-red-300">
                  "Food is not just about taste, it's about memories, culture, and love."
                  <footer className="text-gray-400 text-xs sm:text-sm lg:text-base mt-1 sm:mt-2 not-italic">
                    - Our Founder
                  </footer>
                </blockquote>
              </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
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
                Every dish contains the <span className="text-red-400 font-semibold">taste of home cooking</span>. 
                Our chefs use traditional techniques, preparing each dish on clay stoves with slow fire 
                to ensure perfect flavor.
              </p>
              <p>
                From <span className="text-red-400 font-semibold">Litti Chokha</span> to 
                <span className="text-red-400 font-semibold"> Champaran Mutton</span>, every dish carries 
                the essence of Bihar's soil and the magic of traditional spices.
              </p>
              <p>
                Come, taste the <span className="text-red-400 font-semibold">authentic Bihari flavors</span> 
                and feel the warmth of home.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}