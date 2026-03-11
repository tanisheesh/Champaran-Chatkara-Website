'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Navigation, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('contact');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 border border-red-500/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-red-500/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-10 w-3 h-3 bg-red-500/30 rounded-full animate-ping" />
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-red-500/20 rounded-full animate-ping delay-500" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div 
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-red-400 text-base sm:text-lg lg:text-xl mb-3 sm:mb-4 block">Get In Touch</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-headline text-white mb-4 sm:mb-6">
              Visit <span className="cinematic-text">Us Today</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              Experience authentic Bihari cuisine in the heart of Kaushambi, Ghaziabad. 
              We're here to serve you the best traditional flavors.
            </p>
            <div className="w-16 sm:w-20 lg:w-24 h-0.5 sm:h-1 bg-red-500 mx-auto mt-4 sm:mt-6 lg:mt-8" />
          </div>
        </div>

        {/* Main content - Desktop: 2 columns, Mobile: single column with specific flow */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* Left side - Map and buttons (Desktop) / Hidden on mobile */}
          <div 
            className={`hidden lg:block transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="space-y-6">
              {/* Map */}
              <Card className="bg-gradient-to-br from-red-900/10 to-black/20 border-red-500/20 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video relative overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.795581780161!2d77.3283866!3d28.635888100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfbb6377fc8b1%3A0x55ad2d3da043ef29!2schamparan%20chatkara!5e0!3m2!1sen!2sin!4v1773168415438!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                    />
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2">
                      <p className="text-white text-sm font-medium">📍 Champaran Chatkara</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Note */}
              <div className="bg-gradient-to-r from-red-900/20 to-transparent border-l-4 border-red-500 pl-6 py-4">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Special Note
                </h4>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  We recommend calling ahead during peak hours (7-9 PM) to ensure 
                  your table is ready. Our signature dishes like Litti Chokha and 
                  Champaran Mutton are prepared fresh and may take 20-30 minutes.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <a href="https://maps.app.goo.gl/jbEFdo7V9sxjvrk18" target="_blank">
                    <Navigation className="h-5 w-5 mr-2" />
                    Get Directions
                  </a>
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold px-6 py-3 rounded-full transition-all duration-300"
                  asChild
                >
                  <Link href="https://www.zomato.com/ncr/champaran-chatkara-restaurant-kaushambi-ghaziabad" target="_blank">
                    <Star className="h-5 w-5 mr-2" />
                    Visit Zomato
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - Restaurant info (Desktop) / Hidden on mobile */}
          <div 
            className={`hidden lg:block transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  Why Visit <span className="text-red-400">Us?</span>
                </h3>
                <div className="space-y-4">
                  {[
                    'Authentic Bihari recipes passed down through generations',
                    'Fresh ingredients sourced locally from Bihar',
                    'Traditional cooking methods and clay pot preparations',
                    'Warm hospitality and family-friendly atmosphere',
                    'Convenient location in Kaushambi, Ghaziabad',
                  ].map((reason, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Star className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opening Hours */}
              <div className="bg-gradient-to-r from-red-900/20 to-transparent border-l-4 border-red-500 pl-6 py-4">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center">
                  <Clock className="h-5 w-5 text-red-500 mr-2" />
                  Opening Hours
                </h4>
                <div className="space-y-1">
                  <p className="text-red-400 font-medium text-base">Monday - Sunday</p>
                  <p className="text-white font-medium text-lg">9:00 AM - 11:30 PM</p>
                  <p className="text-gray-300 text-sm">Open All Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only content with specific flow */}
        <div className="lg:hidden space-y-6 sm:space-y-8">
          {/* Why Visit Us section - Mobile */}
          <div 
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Why Visit <span className="text-red-400">Us?</span>
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  'Authentic Bihari recipes passed down through generations',
                  'Fresh ingredients sourced locally from Bihar',
                  'Traditional cooking methods and clay pot preparations',
                  'Warm hospitality and family-friendly atmosphere',
                  'Convenient location in Kaushambi, Ghaziabad',
                ].map((reason, index) => (
                  <div key={index} className="flex items-start space-x-3 text-left">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Opening Hours - Mobile */}
          <div 
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-gradient-to-r from-red-900/20 to-transparent border-l-4 border-red-500 pl-4 sm:pl-6 py-4 sm:py-6">
              <h4 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2" />
                Opening Hours
              </h4>
              <div className="space-y-1">
                <p className="text-red-400 font-medium text-sm sm:text-base">Monday - Sunday</p>
                <p className="text-white font-medium text-base sm:text-lg">9:00 AM - 11:30 PM</p>
                <p className="text-gray-300 text-xs sm:text-sm">Open All Days</p>
              </div>
            </div>
          </div>

          {/* Map - Mobile */}
          <div 
            className={`transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Card className="bg-gradient-to-br from-red-900/10 to-black/20 border-red-500/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video relative overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.795581780161!2d77.3283866!3d28.635888100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfbb6377fc8b1%3A0x55ad2d3da043ef29!2schamparan%20chatkara!5e0!3m2!1sen!2sin!4v1773168415438!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black/80 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                    <p className="text-white text-xs sm:text-sm font-medium">📍 Champaran Chatkara</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Special Note - Mobile */}
          <div 
            className={`transition-all duration-1000 delay-900 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-gradient-to-r from-red-900/20 to-transparent border-l-4 border-red-500 pl-4 sm:pl-6 py-4 sm:py-6">
              <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                Special Note
              </h4>
              <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">
                We recommend calling ahead during peak hours (7-9 PM) to ensure 
                your table is ready. Our signature dishes like Litti Chokha and 
                Champaran Mutton are prepared fresh and may take 20-30 minutes.
              </p>
            </div>
          </div>

          {/* Buttons - Mobile */}
          <div 
            className={`transition-all duration-1000 delay-1100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              <Button 
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 w-full"
                asChild
              >
                <a href="https://maps.app.goo.gl/jbEFdo7V9sxjvrk18" target="_blank">
                  <Navigation className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Get Directions
                </a>
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold px-6 py-3 rounded-full transition-all duration-300 w-full"
                asChild
              >
                <Link href="https://www.zomato.com/ncr/champaran-chatkara-restaurant-kaushambi-ghaziabad" target="_blank">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Visit Zomato
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}