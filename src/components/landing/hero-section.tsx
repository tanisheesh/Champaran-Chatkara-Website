import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { imageMap } from '@/lib/placeholder-images';

export function HeroSection() {
  const heroImage = imageMap.get('hero_main');
  
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 p-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tight">
          The Authentic Taste of Champaran
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-200">
          Savor the rich, rustic flavors of traditional Bihari cuisine, slow-cooked to perfection.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="#menu">Explore Our Menu</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
