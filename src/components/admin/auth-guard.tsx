'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // First check if there's a current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          if (mounted) {
            setLoading(false);
            setChecking(false);
            router.push('/admin/login');
          }
          return;
        }

        // Check if user is admin
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (mounted) {
          if (adminData) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              role: 'admin'
            });
          } else {
            router.push('/admin/login');
          }
          setLoading(false);
          setChecking(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setLoading(false);
          setChecking(false);
          router.push('/admin/login');
        }
      }
    };

    // Initial check
    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        router.push('/admin/login');
        return;
      }

      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (adminData) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: 'admin'
          });
        } else {
          setUser(null);
          router.push('/admin/login');
        }
      }
    });

    // Timeout fallback
    const timeout = setTimeout(() => {
      if (mounted && checking) {
        console.log('Auth check timeout, redirecting to login');
        setLoading(false);
        setChecking(false);
        router.push('/admin/login');
      }
    }, 3000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router, checking]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-red-500" />
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-red-500" />
          <p className="text-white">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}