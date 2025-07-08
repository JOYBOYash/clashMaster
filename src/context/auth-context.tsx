
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithRedirect, signOut as firebaseSignOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import type { VillageState } from '@/lib/constants';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  villageState: VillageState | null;
  saveVillageState: (state: VillageState) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [villageState, setVillageState] = useState<VillageState | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVillageState(docSnap.data().villageState as VillageState);
        } else {
          setVillageState(null);
        }
      } else {
        setVillageState(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error)
    {
      console.error("Error signing out: ", error);
    }
  };

  const saveVillageState = async (state: VillageState) => {
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), { villageState: state });
        setVillageState(state);
      } catch (error) {
        console.error("Error saving village state: ", error);
      }
    }
  };

  const value = {
    user,
    loading,
    villageState,
    saveVillageState,
    signInWithGoogle,
    signOut,
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
