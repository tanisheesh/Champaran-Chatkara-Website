import Image from 'next/image';
import { menuItems } from '@/data/menu';
import { imageMap } from '@/lib/placeholder-images';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vegan, Beef } from 'lucide-react';

export function MenuSection() {
  const vegItems = menuItems.filter((item) => item.category === 'Veg');
  const nonVegItems = menuItems.filter((item) => item.category === 'Non-Veg');

  return (
    <section id="menu" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-headline text-primary">Our Menu</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            A selection of our finest dishes, crafted with tradition and love.
          </p>
        </div>
        <Tabs defaultValue="veg" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="veg"><Vegan className="mr-2" /> Veg</TabsTrigger>
            <TabsTrigger value="non-veg"><Beef className="mr-2" /> Non-Veg</TabsTrigger>
          </TabsList>
          <TabsContent value="veg" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vegItems.map((item) => {
                const placeholder = imageMap.get(item.image);
                return (
                  <Card key={item.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
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
                      {item.isSignature && <Badge className="w-fit mt-1">Signature</Badge>}
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{item.description}</CardDescription>
                       <p className="font-bold text-primary text-lg mt-4">₹{item.price}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="non-veg" className="mt-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nonVegItems.map((item) => {
                const placeholder = imageMap.get(item.image);
                return (
                  <Card key={item.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
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
                      {item.isSignature && <Badge className="w-fit mt-1">Signature</Badge>}
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{item.description}</CardDescription>
                      <p className="font-bold text-primary text-lg mt-4">₹{item.price}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
