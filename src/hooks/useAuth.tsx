import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  mobile_number: string | null;
  profile_photo: string | null;
  address: string | null;
}

interface AuthState {
  user: any | null;
  session: any | null;
  profile: Profile | null;
  roles: AppRole[];
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isCustomer: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    setProfile(data);
  }, []);

  const fetchRoles = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    setRoles(data?.map((r) => r.role) ?? []);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await Promise.all([fetchProfile(user.id), fetchRoles(user.id)]);
    }
  }, [user, fetchProfile, fetchRoles]);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Use setTimeout to avoid Supabase client deadlock
          setTimeout(async () => {
            await Promise.all([
              fetchProfile(newSession.user.id),
              fetchRoles(newSession.user.id),
            ]);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setRoles([]);
          setLoading(false);
        }
      }
    );

    // THEN check existing session
    (supabase.auth as any).getSession().then(({ data: { session: existingSession } }: any) => {
      if (!existingSession) {
        setLoading(false);
      }
      // onAuthStateChange will handle setting the session
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, fetchRoles]);

  const signOut = useCallback(async () => {
    await (supabase.auth as any).signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
  }, []);

  const isAdmin = roles.includes("staff") || roles.includes("super_admin");
  const isSuperAdmin = roles.includes("super_admin");
  const isCustomer = roles.includes("customer");

  return (
    <AuthContext.Provider
      value={{ user, session, profile, roles, loading, isAdmin, isSuperAdmin, isCustomer, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
