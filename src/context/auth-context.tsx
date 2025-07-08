"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { VillageState } from '@/lib/constants';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  villageState: VillageState | null;
  saveVillageState: (state: VillageState) => Promise<void>;
  clearVillageState: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [villageState, setVillageState] = useState<VillageState | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        // User is signed in, see if they have data.
        const userDocRef = doc(db, 'villages', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setVillageState(userDoc.data() as VillageState);
        } else {
          setVillageState(null);
        }
      } else {
        // User is signed out
        setUser(null);
        setVillageState(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    return firebaseSignOut(auth);
  };

  const saveVillageState = async (state: VillageState) => {
    if (!user) throw new Error("User not authenticated to save data.");
    try {
      const userDocRef = doc(db, 'villages', user.uid);
      await setDoc(userDocRef, state);
      setVillageState(state);
    } catch (error) {
      console.error("Error saving village state to Firestore: ", error);
      throw error;
    }
  };

  const clearVillageState = async () => {
     if (!user) throw new Error("User not authenticated to clear data.");
    try {
      const userDocRef = doc(db, 'villages', user.uid);
      await deleteDoc(userDocRef);
      setVillageState(null);
      // Optional: reload to ensure survey is shown, or rely on state management
      window.location.reload();
    } catch (error) {
      console.error("Error clearing village state from Firestore: ", error);
    }
  }

  const value = {
    user,
    loading,
    villageState,
    signUp,
    signIn,
    signOut,
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
