import { useEffect, useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AdminTopbar } from "./AdminTopbar";
import { useLocation } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";

export const SiteLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  // Админ должен видеть админ-навигацию также при работе с чатами и сообщениями,
  // чтобы не появлялась шапка обычного пользователя.
  const isChatLike = pathname.startsWith("/chat/") || pathname === "/messages";

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user?.id;
      if (!userId) {
        if (mounted) setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (mounted) setIsAdmin(!!data);
    };

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const useAdminShell = isAdminPath || (isAdmin && isChatLike);

  if (useAdminShell) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {isAdmin ? <AdminTopbar /> : null}
        <main className="flex-1">{children}</main>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
};
