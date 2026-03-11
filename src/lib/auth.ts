import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  displayName?: string;
}

// Simple admin verification without timeout bullshit
export async function signInAdmin(email: string, password: string): Promise<AdminUser | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('No user data returned');
    }

    // Check if user is admin - simple query, no timeout
    const { data: adminData } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (!adminData) {
      await supabase.auth.signOut();
      throw new Error('Unauthorized: Not an admin user');
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      role: 'admin',
      displayName: data.user.user_metadata?.display_name || data.user.email?.split('@')[0],
    };
  } catch (error) {
    console.error('Error signing in admin:', error);
    throw error;
  }
}

// Simple sign out
export async function signOutAdmin(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Simple current user check
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Simple auth state listener - no timeout, no cache, no bullshit
export function onAuthStateChange(callback: (user: AdminUser | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      // Simple admin check
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (adminData) {
        callback({
          id: session.user.id,
          email: session.user.email!,
          role: 'admin',
          displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
        });
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}