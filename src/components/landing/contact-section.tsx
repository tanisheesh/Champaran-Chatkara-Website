'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, Mail, Navigation, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Location',
      details: ['LG 4 & 5, Expressions Tower', 'Goyal Market, Asha Pushp Vihar', 'Sector 14, Kaushambi, Ghaziabad, UP 201010'],
      action: 'Get Directions',
      actionIcon: Navigation,
      link: 'https://maps.app.goo.gl/jbEFdo7V9sxjvrk18',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 99391 83918', 'WhatsApp Available', 'Quick Response'],
      action: 'Call Now',
      actionIcon: Phone,
      link: 'tel:+919939183918',
    },
    {
      icon: Clock,
      title: 'Opening Hours',
      details: ['Monday - Sunday', '9:00 AM - 11:30 PM', 'No Holidays!'],
      action: 'View Menu',
      actionIcon: Star,
      link: '#menu',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['champaranchatka@gmail.com', 'Quick Response', 'Order Inquiries'],
      action: 'Send Email',
      actionIcon: Mail,
      link: 'mailto:champaranchatka@gmail.com',
    },
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 border border-red-500/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-red-500/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-10 w-3 h-3 bg-red-500/30 rounded-full animate-ping" />
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-red-500/20 rounded-full animate-ping delay-500" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <div 
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-red-400 text-lg sm:text-xl mb-4 block">Get In Touch</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-white mb-6">
              Visit <span className="cinematic-text">Us Today</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              Experience authentic Bihari cuisine in the heart of Champaran. 
              We're here to serve you the best traditional flavors.
            </p>
            <div className="w-24 h-1 bg-red-500 mx-auto mt-6 sm:mt-8" />
          </div>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${300 + index * 200}ms` }}
            >
              <Card className="bg-gradient-to-br from-red-900/10 to-black/20 border-red-500/20 hover:border-red-500/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-red-500/10 group h-full">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500/20 transition-colors duration-300">
                    <info.icon className="h-6 sm:h-8 w-6 sm:w-8 text-red-500" />
                  </div>
                  <CardTitle className="font-headline text-white text-lg sm:text-xl group-hover:text-red-400 transition-colors duration-300">
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2 mb-6">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        {detailIndex === 0 && info.title === 'Call Us' ? (
                          <a href="tel:+919939183918" className="hover:text-red-400 transition-colors duration-300">
                            {detail}
                          </a>
                        ) : detailIndex === 0 && info.title === 'Email Us' ? (
                          <a href="mailto:champaranchatka@gmail.com" className="hover:text-red-400 transition-colors duration-300">
                            {detail}
                          </a>
                        ) : (
                          detail
                        )}
                      </p>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 w-full text-xs sm:text-sm"
                    asChild
                  >
                    <a href={info.link} target={info.link?.startsWith('http') ? '_blank' : '_self'}>
                      <info.actionIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      {info.action}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Map and additional info */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Embedded Google Map */}
          <div 
            className={`transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
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
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2">
                    <p className="text-white text-sm font-medium">📍 Champaran Chatkara</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional info */}
          <div 
            className={`transition-all duration-1000 delay-900 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
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

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <a href="tel:+919939183918">
                    <Phone className="h-5 w-5 mr-2" />
                    Call to Reserve
                  </a>
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold px-6 py-3 rounded-full transition-all duration-300"
                  asChild
                >
                  <Link href="https://www.zomato.com/ncr/champaran-chatkara-restaurant-kaushambi-ghaziabad" target="_blank">
                    <Navigation className="h-5 w-5 mr-2" />
                    Visit Zomato
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}