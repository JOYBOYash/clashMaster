
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
<<<<<<< HEAD
import { auth } from '@/lib/firebase';
=======
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  hasPlayerData: boolean | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
=======
  const [hasPlayerData, setHasPlayerData] = useState<boolean | null>(null);
>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
<<<<<<< HEAD
      } else {
        setUser(null);
=======
        // Check for player data when user is authenticated
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        setHasPlayerData(userDocSnap.exists() && !!userDocSnap.data().playerData);
      } else {
        setUser(null);
        setHasPlayerData(null);
>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4
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
    await firebaseSignOut(auth);
<<<<<<< HEAD
    window.location.href = '/';
=======
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('playerData');
      window.location.href = '/';
    }
>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
<<<<<<< HEAD
=======
    hasPlayerData
>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4
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
