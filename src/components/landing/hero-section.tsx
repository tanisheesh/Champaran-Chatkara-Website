'use client';

import { useEffect, useState } from 'react';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1)_0%,transparent_70%)]" />
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[
            { left: 10, top: 20, delay: 0, duration: 2.5 },
            { left: 85, top: 15, delay: 0.5, duration: 3 },
            { left: 25, top: 70, delay: 1, duration: 2.8 },
            { left: 70, top: 80, delay: 1.5, duration: 3.2 },
            { left: 5, top: 50, delay: 2, duration: 2.3 },
            { left: 90, top: 30, delay: 0.3, duration: 2.7 },
            { left: 45, top: 10, delay: 0.8, duration: 3.5 },
            { left: 60, top: 90, delay: 1.2, duration: 2.9 },
            { left: 15, top: 85, delay: 1.8, duration: 2.4 },
            { left: 80, top: 25, delay: 0.2, duration: 3.1 },
            { left: 35, top: 60, delay: 0.7, duration: 2.6 },
            { left: 95, top: 75, delay: 1.3, duration: 3.3 },
            { left: 20, top: 40, delay: 0.9, duration: 2.2 },
            { left: 75, top: 55, delay: 1.7, duration: 2.8 },
            { left: 50, top: 5, delay: 0.4, duration: 3.4 },
            { left: 8, top: 95, delay: 1.1, duration: 2.5 },
            { left: 88, top: 65, delay: 0.6, duration: 3.0 },
            { left: 40, top: 35, delay: 1.4, duration: 2.7 },
            { left: 65, top: 20, delay: 0.1, duration: 2.9 },
            { left: 30, top: 75, delay: 1.6, duration: 3.2 }
          ].map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-500/30 rounded-full animate-pulse"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Main heading */}
        <h1 
          className={`transition-all duration-1000 delay-500 mb-12 pt-24 sm:pt-28 lg:pt-32 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className="block text-6xl sm:text-7xl lg:text-8xl font-bold font-headline mb-6">
            <span className="cinematic-text">Champaran</span>
          </span>
          <span className="block text-4xl sm:text-5xl lg:text-6xl font-script text-red-400">
            Chatkara
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className={`text-lg sm:text-xl lg:text-2xl text-red-400 font-semibold mb-6 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Authentic Bihari Flavours in Kaushambi
        </p>

        {/* Description */}
        <p 
          className={`text-base sm:text-lg lg:text-xl text-gray-300 max-w-5xl mx-auto mb-16 leading-relaxed transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          From crispy stuffed parathas to slow-cooked handi mutton, Champaran Chatkara brings together the 
          <span className="text-red-400 font-semibold"> bold flavours of Bihar</span> with popular North Indian favourites. 
          Every dish is cooked fresh using traditional spices and techniques, creating meals that feel satisfying and full of flavour. 
          Perfect for <span className="text-red-400">family dinners, office lunches, and late-night cravings</span>.
        </p>

        {/* Stats */}
        <div 
          className={`flex flex-wrap justify-center gap-12 sm:gap-16 pb-8 sm:pb-10 lg:pb-12 transition-all duration-1000 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {[
            { number: '25+', label: 'Years Experience' },
            { number: '5000+', label: 'Happy Customers' },
            { number: '30+', label: 'Traditional Dishes' },
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl sm:text-5xl font-bold text-red-500 font-headline group-hover:scale-110 transition-transform duration-300 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-base sm:text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator - removed to prevent overlap */}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-red-500/20 rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-10 w-16 h-16 border border-red-500/30 rounded-full animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
      <div className="absolute top-1/3 right-5 w-3 h-3 bg-red-500/50 rounded-full animate-ping delay-500" />
    </section>
  );
}