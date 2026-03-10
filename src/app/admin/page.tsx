
import { PlusCircle, UtensilsCrossed, Trash2 } from 'lucide-react';
import { menuItems as allMenuItems } from '@/data/menu';
import type { MenuItem } from '@/lib/types';
import { imageMap } from '@/lib/placeholder-images';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

import { MenuForm } from './menu-form';
import { deleteMenuItem } from './actions';

export default function AdminPage() {
  const menuItems: MenuItem[] = allMenuItems;

  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold font-headline">
                Champaran Chatkara <span className="text-muted-foreground font-body font-normal text-lg">- Admin</span>
              </h1>
            </Link>
            <MenuForm>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
                </Button>
            </MenuForm>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => {
            const placeholder = imageMap.get(item.image);
            
            // Form for delete action
            const deleteAction = deleteMenuItem.bind(null, item.id);

            return (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  {placeholder && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-md mb-4">
                      <Image
                        src={placeholder.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        data-ai-hint={placeholder.imageHint}
                      />
                    </div>
                  )}
                  <CardTitle className="font-headline text-xl">{item.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">₹{item.price}</span>
                    <Badge variant={item.category === 'Veg' ? 'secondary' : 'destructive'} className="capitalize">{item.category}</Badge>
                  </div>
                   {item.isSignature && <Badge className="w-fit">Signature Dish</Badge>}
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <MenuForm menuItem={item}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </MenuForm>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the item "{item.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <form action={deleteAction}>
                          <AlertDialogAction type="submit">Continue</AlertDialogAction>
                        </form>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
