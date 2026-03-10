import Link from 'next/link';
import { UtensilsCrossed, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <UtensilsCrossed className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-2xl font-bold font-headline">Champaran Chatkara</h3>
            </div>
            <p className="text-muted-foreground">
              Experience the authentic taste of Champaran. Every dish tells a story.
            </p>
             <div className="mt-4">
                <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Admin Panel
                </Link>
            </div>
          </div>
          
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="font-headline text-lg font-semibold mb-4">Contact & Hours</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <span>+91 123 456 7890</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  <span>contact@champaranchatkara.com</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span>123 Foodie Lane, Patna, Bihar</span>
                </li>
              </ul>
               <div className="mt-4 text-muted-foreground">
                <p><strong>Mon - Fri:</strong> 12:00 PM - 10:00 PM</p>
                <p><strong>Sat - Sun:</strong> 12:00 PM - 11:00 PM</p>
              </div>
            </div>

            <div className="w-full h-48 sm:h-full rounded-lg overflow-hidden">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115132.86105439366!2d85.07300222166542!3d25.60767137580791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5844f0bb7823%3A0x3344d186f91ea4a6!2sPatna%2C%20Bihar%2C%20India!5e0!3m2!1sen!2sus!4v1684343210987!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps location of Patna, Bihar, India"
                ></iframe>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Champaran Chatkara. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
