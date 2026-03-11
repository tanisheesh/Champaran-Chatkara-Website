'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoDoubleClick = () => {
    window.location.href = '/admin';
  };

  const navItems = [
    { href: '/', label: 'Home', isExternal: false },
    { href: '/#about', label: 'About', isExternal: false },
    { href: '/menu', label: 'Menu', isExternal: false },
    { href: '/#contact', label: 'Contact', isExternal: false },
  ];

  const handleNavClick = (href: string, isExternal: boolean) => {
    setIsMobileMenuOpen(false);
    
    // For menu page, use router navigation for better performance
    if (href === '/menu') {
      router.push(href);
      return;
    }
    
    if (isExternal || href.startsWith('/#')) {
      // For hash links, navigate to home first if not already there
      if (pathname !== '/' && href.startsWith('/#')) {
        router.push(href);
      }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md border-b border-red-500/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div 
              className="cursor-pointer opacity-0 absolute w-8 h-8"
              onDoubleClick={handleLogoDoubleClick}
              title="Double-click for admin access"
            />
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-xl sm:text-2xl font-bold font-headline text-white">
                Champaran <span className="text-red-400">Chatkara</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href, item.isExternal)}
                  className={`relative transition-colors duration-300 font-medium text-base group ${
                    isActive ? 'text-red-400' : 'text-white hover:text-red-400'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-500 transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              );
            })}
          </nav>

          {/* Contact Info - Desktop */}
          <div className="hidden xl:flex items-center space-x-6 text-sm text-gray-300">
            <a 
              href="tel:+919939183918" 
              className="flex items-center space-x-2 hover:text-red-400 transition-colors duration-300"
            >
              <Phone className="h-4 w-4" />
              <span>+91 99391 83918</span>
            </a>
            <a 
              href="https://maps.app.goo.gl/jbEFdo7V9sxjvrk18" 
              target="_blank"
              className="flex items-center space-x-2 hover:text-red-400 transition-colors duration-300"
            >
              <MapPin className="h-4 w-4" />
              <span>Kaushambi</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white hover:text-red-400 transition-colors duration-300 p-2 z-60"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Sliding Panel */}
      <div 
        className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-md border-l border-red-500/20 transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full">
          {/* Navigation Links */}
          <nav className="flex-1 py-8 px-6">
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavClick(item.href, item.isExternal)}
                    className={`block py-4 text-xl font-medium transition-colors duration-300 ${
                      isActive 
                        ? 'text-red-400' 
                        : 'text-white hover:text-red-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Close button on the side */}
          <div className="flex items-start justify-center pt-8 pr-6">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-red-400 transition-colors duration-300 p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}