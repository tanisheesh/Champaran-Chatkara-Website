import Image from 'next/image';
import { menuItems } from '@/data/menu';
import { imageMap } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SignatureDishesSection() {
  const signatureDishes = menuItems.filter((item) => item.isSignature);

  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-headline text-primary">Our Signature Dishes</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            The heart of our kitchen, loved by all.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {signatureDishes.map((item) => {
              const placeholder = imageMap.get(item.image);
              return (
                <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="h-full overflow-hidden transition-all hover:shadow-xl">
                      {placeholder && (
                        <div className="relative aspect-video w-full">
                          <Image
                            src={placeholder.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            data-ai-hint={placeholder.imageHint}
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="font-headline">{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{item.description}</CardDescription>
                        <p className="font-bold text-primary text-lg mt-4">₹{item.price}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
