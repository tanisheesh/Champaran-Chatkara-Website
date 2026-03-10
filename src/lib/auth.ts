import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  displayName?: string;
}

// Sign in admin
export async function signInAdmin(email: string, password: string): Promise<AdminUser | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error('Unauthorized: Not an admin user');
      }

      return {
        id: data.user.id,
        email: data.user.email!,
        role: 'admin',
        displayName: data.user.user_metadata?.display_name,
      };
    }

    return null;
  } catch (error) {
    console.error('Error signing in admin:', error);
    throw error;
  }
}

// Sign out
export async function signOutAdmin(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Check if current user is admin
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: adminData, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return !error && !!adminData;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Auth state listener
export function onAuthStateChange(callback: (user: AdminUser | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      try {
        // Check if user is admin
        const { data: adminData, error } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (!error && adminData) {
          callback({
            id: session.user.id,
            email: session.user.email!,
            role: 'admin',
            displayName: session.user.user_metadata?.display_name,
          });
        } else {
          callback(null);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });

  return () => subscription.unsubscribe();
}