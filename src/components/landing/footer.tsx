import { Heart, Phone, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-red-500/20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Simple footer content */}
        <div className="py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 gap-4">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-400 text-sm">
              <span>© {currentYear} Champaran Chatkara.</span>
              <span>All Rights Reserved.</span>
            </div>
            
            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <a 
                href="tel:+919939183918" 
                className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors duration-300"
              >
                <Phone className="h-4 w-4" />
                <span>+91 99391 83918</span>
              </a>
              <a 
                href="mailto:champaranchatkara@gmail.com" 
                className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors duration-300"
              >
                <Mail className="h-4 w-4" />
                <span>champaranchatkara@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
    </footer>
  );
}