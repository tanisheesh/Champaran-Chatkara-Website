'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { onAuthStateChange, type AdminUser } from '@/lib/auth';

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('Auth loading timeout, setting loading to false');
        setLoading(false);
      }
    }, 2000); // 2 second timeout

    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      clearTimeout(loadingTimeout);
    });

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, [loading]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Conditional provider that only loads auth for admin routes
export function ConditionalAuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  // For non-admin routes, provide a default context without loading
  return (
    <AuthContext.Provider value={{ user: null, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}