import { Heart } from 'lucide-react';

export function Footer() {
  // Simple JavaScript se current year fetch kar rahe hain
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-red-500/20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Simple footer content */}
        <div className="py-8 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-400 text-sm">
            <span>© {currentYear} Champaran Chatkara. Made with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>in Bihar | All Rights Reserved</span>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
    </footer>
  );
}