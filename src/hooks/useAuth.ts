import { useState, useEffect } from 'react';
import { AuthService } from '../services/auth-service';
import type { User } from '../types/user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return { user, loading };
};