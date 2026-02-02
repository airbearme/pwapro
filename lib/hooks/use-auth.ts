import { useEffect, useMemo, useState } from "react";

import type { User } from "@supabase/supabase-js";

import { getSupabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types/database";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    const init = async () => {
      let supabase;
      try {
        supabase = getSupabaseClient();
      } catch {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      const sessionResult = await supabase.auth.getSession();
      const sessionUser = sessionResult.data.session?.user ?? null;

      if (isMounted) {
        setUser(sessionUser);
      }

      if (sessionUser) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", sessionUser.id)
          .single();

        if (isMounted) {
          setProfile(data ?? null);
        }
      } else if (isMounted) {
        setProfile(null);
      }

      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event: string, session: any) => {
          if (!isMounted) return;
          const nextUser = session?.user ?? null;
          setUser(nextUser);

          if (nextUser) {
            const { data } = await supabase
              .from("users")
              .select("*")
              .eq("id", nextUser.id)
              .single();
            if (isMounted) {
              setProfile(data ?? null);
            }
          } else {
            setProfile(null);
          }
        },
      );

      unsubscribe = listener.subscription.unsubscribe;

      if (isMounted) {
        setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  return {
    user,
    profile,
    loading,
    signOut,
    isAuthenticated,
  };
}
