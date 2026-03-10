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
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-500/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
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

        {/* Description */}
        <p 
          className={`text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto mb-16 leading-relaxed transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Experience the <span className="text-red-400 font-semibold">authentic taste of Bihar</span>! 
          Our traditional recipes bring you the flavors of Champaran streets, where every bite 
          feels like <span className="text-red-400 font-semibold">home-cooked love</span>.
        </p>

        {/* Stats */}
        <div 
          className={`flex flex-wrap justify-center gap-12 sm:gap-16 transition-all duration-1000 delay-900 ${
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