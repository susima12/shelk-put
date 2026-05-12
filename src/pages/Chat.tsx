import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { translateError } from "@/lib/translate-error";
import { Send, Trash2, UserPlus, Users, Check } from "lucide-react";
import { format } from "date-fns";

const Chat = () => {
  const { slug } = useParams<{ slug: string }>();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [comp, setComp] = useState<any>(null);
  const [me, setMe] = useState<{ id: string; email: string; name: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [showInvitePanel, setShowInvitePanel] = useState(false);
  const [approved, setApproved] = useState<any[]>([]);
  const [memberIds, setMemberIds] = useState<Set<string>>(new Set());

  const scrollRef = useRef<HTMLDivElement>(null);
  const stickyBottom = useRef(true);

  const isAtBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 60;
  };

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { nav("/auth"); return; }
      const u = sess.session.user;
      const { data: c } = await supabase
        .from("competitions").select("*").eq("slug", slug!).maybeSingle();
      if (!c) { setLoading(false); return; }
      setComp(c);

      const { data: prof } = await supabase
        .from("profiles").select("display_name, email")
        .eq("user_id", u.id).maybeSingle();
      setMe({ id: u.id, email: u.email!, name: prof?.display_name ?? u.email! });

      // Глобальный админ (role=admin без привязки к конкурсу) ИЛИ админ конкурса
      const { data: roles } = await supabase
        .from("user_roles").select("role, competition_id")
        .eq("user_id", u.id).eq("role", "admin");
      const admin = (roles ?? []).some(
        (r: any) => r.competition_id === null || r.competition_id === c.id
      );
      setIsAdmin(admin);

      const { data: existing } = await supabase
        .from("chat_members").select("id, banned")
        .eq("competition_id", c.id).eq("user_id", u.id).maybeSingle();

      const canChat = admin || (!!existing && !existing.banned);
      setAllowed(canChat);

      if (canChat) {
        const { data: msgs } = await supabase
          .from("chat_messages").select("*")
          .eq("competition_id", c.id)
          .order("created_at", { ascending: true });
        setMessages(msgs ?? []);
      }
      setLoading(false);
    })();
  }, [slug, nav]);

  // Load invite panel data for admins
  const loadInviteData = async () => {
    if (!comp) return;
    const [{ data: apps }, { data: members }] = await Promise.all([
      supabase.from("applications")
        .select("id, user_id, participant_name, leader_full_name, email")
        .eq("competition_id", comp.id).eq("status", "approved")
        .not("user_id", "is", null),
      supabase.from("chat_members").select("user_id, banned").eq("competition_id", comp.id),
    ]);
    setApproved(apps ?? []);
    setMemberIds(new Set((members ?? []).filter((m: any) => !m.banned).map((m: any) => m.user_id)));
  };

  useEffect(() => {
    if (isAdmin && comp && showInvitePanel) loadInviteData();
    // eslint-disable-next-line
  }, [isAdmin, comp, showInvitePanel]);

  useEffect(() => {
    if (!comp || !allowed) return;
    const ch = supabase
      .channel(`chat:${comp.id}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "chat_messages",
        filter: `competition_id=eq.${comp.id}`,
      }, (payload) => {
        stickyBottom.current = isAtBottom();
        setMessages((prev) => [...prev, payload.new as any]);
      })
      .on("postgres_changes", {
        event: "DELETE", schema: "public", table: "chat_messages",
        filter: `competition_id=eq.${comp.id}`,
      }, (payload) => {
        setMessages((prev) => prev.filter((m) => m.id !== (payload.old as any).id));
      })
      .subscribe();
    return () => { try { supabase.removeChannel(ch); } catch { /* игнорируем — канал уже закрыт */ } };
  }, [comp, allowed]);

  // Smart auto-scroll: only when user is near bottom
  useEffect(() => {
    if (stickyBottom.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onScroll = () => { stickyBottom.current = isAtBottom(); };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || !me || !comp) return;
    if (value.length > 2000) { toast.error("Слишком длинное сообщение"); return; }
    stickyBottom.current = true;
    const { error } = await supabase.from("chat_messages").insert({
      competition_id: comp.id,
      user_id: me.id,
      author_name: me.name,
      content: value,
      is_admin: isAdmin,
    });
    if (error) toast.error(translateError(error));
    else setText("");
  };

  const removeMsg = async (id: string) => {
    const { error } = await supabase.from("chat_messages").delete().eq("id", id);
    if (error) toast.error(translateError(error));
  };

  const inviteUser = async (a: any) => {
    if (!comp) return;
    const { error } = await supabase.from("chat_members").insert({
      competition_id: comp.id,
      user_id: a.user_id,
      display_name: a.participant_name ?? a.leader_full_name ?? a.email,
    });
    if (error) { toast.error(translateError(error)); return; }
    toast.success(`${a.participant_name ?? a.email} приглашён в чат`);
    setMemberIds((prev) => new Set(prev).add(a.user_id));
  };

  if (loading) return <div className="container py-32 text-center">Загрузка...</div>;
  if (!comp) return <div className="container py-32 text-center">Конкурс не найден</div>;

  if (!allowed) {
    return (
      <>
        <PageHero eyebrow="Чат" title={comp.name} />
        <section className="py-16">
          <div className="container max-w-2xl">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Доступ к чату открывается после приглашения администратором конкурса.
              </p>
            </Card>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Чат конкурса" title={comp.name} />
      <section className="py-12">
        <div className="container max-w-5xl">
          <div className={`grid gap-4 ${isAdmin && showInvitePanel ? "lg:grid-cols-[1fr_320px]" : ""}`}>
            <Card className="flex flex-col h-[70vh]">
              {isAdmin && (
                <div className="border-b border-border p-2 flex justify-end">
                  <Button
                    size="sm"
                    variant={showInvitePanel ? "wine" : "outline"}
                    onClick={() => setShowInvitePanel((v) => !v)}
                  >
                    <Users className="h-4 w-4" />
                    {showInvitePanel ? "Скрыть участников" : "Пригласить участников"}
                  </Button>
                </div>
              )}
              <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Пока нет сообщений</p>
                )}
                {messages.map((m) => {
                  const mine = m.user_id === me?.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        mine ? "bg-primary text-primary-foreground" : "bg-secondary"
                      }`}>
                        <div className="flex items-center gap-2 text-xs opacity-80 mb-0.5">
                          <span className="font-semibold">{m.author_name ?? "—"}</span>
                          {m.is_admin && <Badge variant="outline" className="text-[10px] py-0">админ</Badge>}
                          <span>{format(new Date(m.created_at), "HH:mm")}</span>
                          {isAdmin && (
                            <button onClick={() => removeMsg(m.id)} className="ml-auto opacity-60 hover:opacity-100">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <div className="whitespace-pre-wrap break-words">{m.content}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={send} className="border-t border-border p-3 flex gap-2">
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Сообщение..."
                  maxLength={2000}
                />
                <Button type="submit" variant="wine" size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Card>

            {isAdmin && showInvitePanel && (
              <Card className="p-4 h-[70vh] overflow-y-auto">
                <h4 className="font-serif text-base mb-3">Одобренные участники</h4>
                {approved.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Нет одобренных заявок с зарегистрированными пользователями.</p>
                ) : (
                  <div className="space-y-2">
                    {approved.map((a) => {
                      const inChat = memberIds.has(a.user_id);
                      return (
                        <div key={a.id} className="flex items-center gap-2 p-2 rounded border border-border">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{a.participant_name}</div>
                            <div className="text-xs text-muted-foreground truncate">{a.email}</div>
                          </div>
                          {inChat ? (
                            <Badge variant="secondary" className="text-xs">
                              <Check className="h-3 w-3" /> в чате
                            </Badge>
                          ) : (
                            <Button size="sm" variant="festival" onClick={() => inviteUser(a)}>
                              <UserPlus className="h-3 w-3" /> Пригласить
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Chat;
