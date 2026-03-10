'use client';

import { useEffect, useState } from 'react';
import { Heart, Award, Users, Clock } from 'lucide-react';
import { getBestSellers } from '@/lib/supabase-db';
import { imageMap } from '@/lib/placeholder-images';
import Image from 'next/image';
import type { MenuItem } from '@/lib/types';

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [bestSellers, setBestSellers] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('about');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

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
    <section id="about" className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 border border-red-500/10 rounded-full" />
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-red-500/10 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-red-500/30 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-red-500/20 rounded-full animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <div 
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-red-400 text-lg sm:text-xl mb-4 block">Our Journey</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-white mb-6">
              <span className="cinematic-text">Tradition</span> & Story
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-8" />
          </div>
        </div>

        {/* Story content */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-16 sm:mb-20">
          {/* Story text */}
          <div 
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="space-y-4 sm:space-y-6 text-gray-300 text-base sm:text-lg leading-relaxed">
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

              <div className="pt-6">
                <blockquote className="border-l-4 border-red-500 pl-6 italic text-lg sm:text-xl text-red-300">
                  "Food is not just about taste, it's about memories, culture, and love."
                  <footer className="text-gray-400 text-sm sm:text-base mt-2 not-italic">
                    - Our Founder
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>

          {/* Restaurant Image */}
          <div 
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="relative">
              {/* Main image placeholder */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-red-900/20 to-black/40 border border-red-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 sm:h-10 w-8 sm:w-10 text-red-500" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Restaurant Photo
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      [Placeholder - Add restaurant interior/exterior image]
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating stats card */}
              <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-gradient-to-br from-red-900/90 to-black/90 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 sm:p-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-500">25+</div>
                  <div className="text-xs sm:text-sm text-gray-300">Years Experience</div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-6 sm:w-8 h-6 sm:h-8 bg-red-500/20 rounded-full animate-pulse" />
              <div className="absolute -bottom-4 -right-4 w-4 sm:w-6 h-4 sm:h-6 bg-red-500/30 rounded-full animate-pulse delay-1000" />
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${700 + index * 200}ms` }}
            >
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500/20 transition-colors duration-300">
                  <feature.icon className="h-6 sm:h-8 w-6 sm:w-8 text-red-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-headline text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Food showcase section */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Food images */}
          <div 
            className={`transition-all duration-1000 delay-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="aspect-square rounded-xl bg-gradient-to-br from-red-900/20 to-black/40 border border-red-500/20 animate-pulse">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-400 text-xs">Loading...</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : bestSellers.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {bestSellers.slice(0, 4).map((item, index) => {
                  const placeholder = imageMap.get(item.image);
                  return (
                    <div key={item.id} className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-red-900/20 to-black/40 border border-red-500/20 relative group">
                      {placeholder && item.image_url ? (
                        <Image
                          src={item.image_url || placeholder.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          data-ai-hint={placeholder.imageHint}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center opacity-50 group-hover:opacity-70 transition-opacity">
                            <div className="text-xs text-gray-400">[Food Photo]</div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                        <h4 className="text-white font-bold text-xs sm:text-sm">{item.name}</h4>
                        <p className="text-gray-300 text-xs">Best Seller</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-500/50" />
                </div>
                <p className="text-gray-400 text-lg">
                  No special dishes available yet
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Add some best sellers from the admin panel to showcase here!
                </p>
              </div>
            )}
          </div>

          {/* Text content */}
          <div 
            className={`transition-all duration-1000 delay-1200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <h3 className="text-2xl sm:text-3xl font-bold font-headline text-white mb-6">
              Our <span className="text-red-400">Special Dishes</span>
            </h3>
            <div className="space-y-4 text-gray-300 leading-relaxed text-sm sm:text-base">
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