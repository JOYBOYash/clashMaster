"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { VillageState } from '@/lib/constants';

// This is a mock user type. In a real auth system, this would be more complex.
interface MockUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

interface AuthContextType {
  user: MockUser | null; // We'll keep a mock user for UI consistency
  loading: boolean;
  villageState: VillageState | null;
  saveVillageState: (state: VillageState) => Promise<void>;
  clearVillageState: () => void;
  signInWithGoogle?: () => Promise<void>; // Make these optional
  signOut?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VILLAGE_STATE_KEY = 'clashMasterVillageState';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [villageState, setVillageState] = useState<VillageState | null>(null);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(VILLAGE_STATE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setVillageState(parsedState);
        // Create a mock user if data exists, for UI consistency
        setUser({
            uid: 'local-user',
            displayName: 'Clash Master',
            email: 'local@user.com'
        });
      }
    } catch (error) {
      console.error("Failed to load village state from localStorage", error);
      setVillageState(null);
    }
    setLoading(false);
  }, []);

  const saveVillageState = async (state: VillageState) => {
    try {
      const stateString = JSON.stringify(state);
      localStorage.setItem(VILLAGE_STATE_KEY, stateString);
      setVillageState(state);
       // Create a mock user when data is saved
      setUser({
            uid: 'local-user',
            displayName: 'Clash Master',
            email: 'local@user.com'
      });
    } catch (error) {
      console.error("Error saving village state to localStorage: ", error);
    }
  };

  const clearVillageState = () => {
    try {
      localStorage.removeItem(VILLAGE_STATE_KEY);
      setVillageState(null);
      setUser(null);
      // Reload to ensure survey is shown
      window.location.reload();
    } catch (error) {
      console.error("Error clearing village state from localStorage: ", error);
    }
  }

  const value = {
    user,
    loading,
    villageState,
    saveVillageState,
    clearVillageState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
