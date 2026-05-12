import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@/lib/router-compat";
import { MessageSquare, ShieldAlert } from "lucide-react";
import { useAuthReady } from "@/hooks/use-auth-ready";

const AdminUsers = () => {
  const nav = useNavigate();
  const { user, isReady } = useAuthReady();
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      nav("/auth?redirect=/admin/users");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        // 1. Check the current user actually has an admin role.
        const { data: roles, error: rErr } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin");
        if (rErr) throw rErr;
        if (cancelled) return;
        const admin = (roles?.length ?? 0) > 0;
        setIsAdmin(admin);
        if (!admin) {
          setLoading(false);
          return;
        }
        // 2. Load profiles (RLS allows admins).
        const { data, error: pErr } = await supabase
          .from("profiles")
          .select("user_id, username, display_name, email, avatar_url, bio, created_at")
          .order("created_at", { ascending: false })
          .limit(500);
        if (pErr) throw pErr;
        if (cancelled) return;
        setRows(data ?? []);
      } catch (e: any) {
        console.error("AdminUsers load failed", e);
        if (!cancelled) setError(e?.message ?? "Не удалось загрузить пользователей");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isReady, user, nav]);

  const filtered = rows.filter((r) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (r.email?.toLowerCase().includes(s) || r.display_name?.toLowerCase().includes(s)
      || r.username?.toLowerCase().includes(s) || r.user_id?.toLowerCase().includes(s));
  });

  if (!isReady || loading) {
    return <div className="container py-32 text-center text-muted-foreground">Загрузка...</div>;
  }

  if (isAdmin === false) {
    return (
      <section className="py-20">
        <div className="container max-w-xl">
          <Card className="p-8 text-center">
            <ShieldAlert className="h-12 w-12 text-gold mx-auto mb-4" />
            <h1 className="font-display text-2xl mb-2">Нет доступа</h1>
            <p className="text-muted-foreground mb-6">
              Этот раздел доступен только администраторам конкурсов.
              Войдите в учётную запись администратора на странице{" "}
              <Link to="/admin" className="underline text-primary">/admin</Link>.
            </p>
            <Button asChild variant="wine"><Link to="/admin">К входу администратора</Link></Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container max-w-5xl">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h1 className="font-display text-3xl">Пользователи</h1>
          <Input placeholder="Поиск: email, имя, username, ID" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        </div>
        {error && <p className="text-sm text-destructive mb-4">{error}</p>}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Всего: {filtered.length}</p>
          {filtered.map((u) => (
            <Card key={u.user_id} className="p-4 flex items-center gap-4">
              <Avatar><AvatarImage src={u.avatar_url} /><AvatarFallback>{(u.display_name || u.email || "?").slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <strong>{u.display_name || u.email}</strong>
                  {u.username && <Badge variant="secondary">@{u.username}</Badge>}
                </div>
                <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                <div className="text-[10px] text-muted-foreground font-mono truncate">{u.user_id}</div>
              </div>
              <Button asChild size="sm" variant="outline"><Link to={`/admin/chat?to=${u.user_id}`}><MessageSquare className="h-3 w-3" /> Написать</Link></Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default AdminUsers;
