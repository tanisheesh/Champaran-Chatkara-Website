import { Loader2, UtensilsCrossed } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-headline">
                Champaran Chatkara
              </h1>
            </div>
            <div className="w-20 h-8 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h2 className="text-xl font-semibold">Loading Admin Dashboard</h2>
            <p className="text-muted-foreground">Please wait while we load your data...</p>
          </div>
        </div>
      </main>
    </div>
  );
}