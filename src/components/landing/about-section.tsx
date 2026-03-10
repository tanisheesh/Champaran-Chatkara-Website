import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { imageMap } from '@/lib/placeholder-images';

export function AboutSection() {
  const aboutImage = imageMap.get('about_us_image');

  return (
    <section id="about" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2">
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl font-bold font-headline text-primary mb-4">
                Our Story
              </h2>
              <p className="text-muted-foreground mb-4">
                Born from a passion for authentic Bihari cuisine, Champaran Chatkara brings the legendary flavors of traditional clay pot cooking to your table. Our journey began with a simple dream: to share the rich culinary heritage of Champaran with the world.
              </p>
              <p className="text-muted-foreground">
                We use age-old recipes, sourcing the freshest local ingredients and a secret blend of hand-ground spices. Each dish is a labor of love, a testament to the time-honored techniques that make our food so unique and flavorful.
              </p>
            </div>
            {aboutImage && (
              <div className="relative min-h-[300px] md:min-h-full">
                <Image
                  src={aboutImage.imageUrl}
                  alt={aboutImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={aboutImage.imageHint}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
