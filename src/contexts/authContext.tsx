"use client"

import type React from "react"

import { createClient } from "@/lib/auth/client"
import type { User } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState } from "react"

type AuthContextType = {
  user: User | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()
  const { auth } = supabase; // Destructure auth
  
  useEffect(() => {
    const {
      data: { subscription },
    } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
  
    auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.onAuthStateChange, auth.getSession]); 

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

