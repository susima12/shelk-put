import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Waits for Supabase to restore the session from storage before resolving.
 * Use this in any component that queries protected tables on mount —
 * otherwise the first request fires with the anon key and RLS returns empty.
 */
export function useAuthReady() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    const fallback = window.setTimeout(() => {
      if (!mounted) return;
      setIsReady(true);
    }, 1500);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      window.clearTimeout(fallback);
      setUser(session?.user ?? null);
      setIsReady(true);
    }).catch(() => {
      if (!mounted) return;
      window.clearTimeout(fallback);
      setUser(null);
      setIsReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setIsReady(true);
    });

    return () => {
      mounted = false;
      window.clearTimeout(fallback);
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isReady };
}
