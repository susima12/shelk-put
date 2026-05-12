import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search, Pin, Trash2, Pencil, X, Reply, PinOff, Check } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { translateError } from "@/lib/translate-error";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/ui/back-button";

type Profile = { user_id: string; username: string|null; display_name: string|null; email: string|null; avatar_url: string|null };
type Conv = { id: string; user_a: string; user_b: string; last_message_at: string; other?: Profile };
type Msg = { id: string; conversation_id: string; sender_id: string; content: string; created_at: string; edited_at: string|null; deleted_at: string|null; pinned_at: string|null; reply_to: string|null };

const Messages = ({ embedded = false }: { embedded?: boolean }) => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [me, setMe] = useState<{ id: string; email: string } | null>(null);
  const [convs, setConvs] = useState<Conv[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [profilesMap, setProfilesMap] = useState<Record<string, Profile>>({});
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [editing, setEditing] = useState<Msg | null>(null);
  const [replyTo, setReplyTo] = useState<Msg | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // bootstrap
  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { nav("/auth"); return; }
      setMe({ id: sess.session.user.id, email: sess.session.user.email! });
    })();
  }, [nav]);

  // load conversations
  const loadConvs = async (uid: string) => {
    const { data: cs } = await supabase
      .from("dm_conversations")
      .select("*")
      .or(`user_a.eq.${uid},user_b.eq.${uid}`)
      .order("last_message_at", { ascending: false });
    const list = cs ?? [];
    const otherIds = list.map((c) => (c.user_a === uid ? c.user_b : c.user_a));
    if (otherIds.length) {
      const { data: ps } = await supabase.from("profiles").select("user_id, username, display_name, email, avatar_url").in("user_id", otherIds);
      const map: Record<string, Profile> = {};
      (ps ?? []).forEach((p: any) => { map[p.user_id] = p; });
      setProfilesMap((prev) => ({ ...prev, ...map }));
      setConvs(list.map((c: any) => ({ ...c, other: map[c.user_a === uid ? c.user_b : c.user_a] })));
    } else setConvs([]);
  };

  useEffect(() => { if (me) loadConvs(me.id); }, [me]);

  // open from ?to=USER_ID or ?to=USERNAME
  useEffect(() => {
    const to = params.get("to");
    if (!me || !to) return;
    (async () => {
      try {
        let target: Profile | null = null;
        const isUuid = /^[0-9a-f-]{36}$/i.test(to);
        if (isUuid) {
          const { data } = await supabase.from("profiles").select("user_id, username, display_name, email, avatar_url").eq("user_id", to).maybeSingle();
          target = data as any;
        } else {
          const { data } = await supabase.from("profiles").select("user_id, username, display_name, email, avatar_url").eq("username", to.toLowerCase()).maybeSingle();
          target = data as any;
        }
        if (!target) return; // тихо выходим, без краша/тоста
        await openOrCreateConversation(target);
      } catch {
        // игнорируем — иначе страница падала
      }
    })();
    // eslint-disable-next-line
  }, [me, params]);

  // load messages for active conversation
  useEffect(() => {
    if (!activeId) { setMsgs([]); return; }
    (async () => {
      const { data } = await supabase.from("dm_messages").select("*").eq("conversation_id", activeId).order("created_at", { ascending: true });
      setMsgs(data ?? []);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 50);
    })();
    const ch = supabase.channel(`dm:${activeId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "dm_messages", filter: `conversation_id=eq.${activeId}` },
        (payload) => {
          if (payload.eventType === "INSERT") setMsgs((p) => [...p, payload.new as any]);
          else if (payload.eventType === "UPDATE") setMsgs((p) => p.map((m) => m.id === (payload.new as any).id ? payload.new as any : m));
          else if (payload.eventType === "DELETE") setMsgs((p) => p.filter((m) => m.id !== (payload.old as any).id));
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeId]);

  // search users
  useEffect(() => {
    if (!search.trim() || !me) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      const s = search.trim().toLowerCase();
      const isUuid = /^[0-9a-f-]{36}$/i.test(s);
      let query = supabase.from("profiles").select("user_id, username, display_name, email, avatar_url").neq("user_id", me.id).limit(15);
      if (isUuid) query = query.eq("user_id", s);
      else query = query.or(`username.ilike.%${s}%,display_name.ilike.%${s}%,email.ilike.%${s}%`);
      const { data } = await query;
      setSearchResults((data ?? []) as any);
    }, 250);
    return () => clearTimeout(t);
  }, [search, me]);

  const openOrCreateConversation = async (other: Profile) => {
    if (!me) return;
    const [a, b] = me.id < other.user_id ? [me.id, other.user_id] : [other.user_id, me.id];
    const { data: existing } = await supabase
      .from("dm_conversations").select("*")
      .eq("user_a", a).eq("user_b", b).maybeSingle();
    let conv = existing;
    if (!conv) {
      const { data: created, error } = await supabase
        .from("dm_conversations").insert({ user_a: a, user_b: b }).select().single();
      if (error || !created) {
        // Не показываем «получатель не одобрен» — просто молча выходим
        return;
      }
      conv = created;
    }
    setProfilesMap((p) => ({ ...p, [other.user_id]: other }));
    setActiveId(conv!.id);
    await loadConvs(me.id);
    setSearch(""); setSearchResults([]);
  };

  const send = async () => {
    if (!text.trim() || !activeId || !me) return;
    if (editing) {
      const { error } = await supabase.from("dm_messages").update({ content: text.trim(), edited_at: new Date().toISOString() }).eq("id", editing.id);
      if (error) toast.error(translateError(error));
      setEditing(null);
    } else {
      const { error } = await supabase.from("dm_messages").insert({
        conversation_id: activeId, sender_id: me.id, content: text.trim(),
        reply_to: replyTo?.id ?? null,
      });
      if (error) toast.error(translateError(error));
      setReplyTo(null);
    }
    setText("");
  };

  const togglePin = async (m: Msg) => {
    const { error } = await supabase.from("dm_messages").update({ pinned_at: m.pinned_at ? null : new Date().toISOString() }).eq("id", m.id);
    if (error) toast.error(translateError(error));
  };
  const remove = async (m: Msg) => {
    const { error } = await supabase.from("dm_messages").delete().eq("id", m.id);
    if (error) toast.error(translateError(error));
  };
  const startEdit = (m: Msg) => { setEditing(m); setText(m.content); setReplyTo(null); };

  const active = convs.find((c) => c.id === activeId);
  const pinned = msgs.filter((m) => m.pinned_at && !m.deleted_at);
  const findMsg = (id: string) => msgs.find((m) => m.id === id);

  return (
    <div className={cn("container", embedded ? "py-6" : "pt-8 pb-12")}>
      {!embedded && <BackButton fallbackTo="/profile" />}
      {!embedded && <h1 className="font-display text-3xl mb-6">Сообщения</h1>}
      <div className="grid md:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-180px)]">
        {/* Sidebar */}
        <Card className="flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="ID, @username, email" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {search && searchResults.length > 0 && (
              <div className="border-b border-border bg-secondary/30">
                <div className="px-3 py-2 text-xs uppercase text-muted-foreground">Найдено</div>
                {searchResults.map((u) => (
                  <button key={u.user_id} onClick={() => openOrCreateConversation(u)} className="w-full px-3 py-2 hover:bg-secondary flex items-center gap-3 text-left">
                    <Avatar className="h-9 w-9"><AvatarImage src={u.avatar_url ?? undefined} /><AvatarFallback>{(u.display_name||u.email||"?").slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{u.display_name || u.email}</div>
                      <div className="text-xs text-muted-foreground truncate">{u.username ? `@${u.username}` : u.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {convs.map((c) => (
              <button key={c.id} onClick={() => setActiveId(c.id)} className={cn("w-full px-3 py-3 flex items-center gap-3 text-left border-b border-border/40 hover:bg-secondary", activeId === c.id && "bg-secondary")}>
                <Avatar className="h-10 w-10"><AvatarImage src={c.other?.avatar_url ?? undefined} /><AvatarFallback>{(c.other?.display_name||c.other?.email||"?").slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.other?.display_name || c.other?.email || "—"}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(c.last_message_at), "dd.MM HH:mm")}</div>
                </div>
              </button>
            ))}
            {!convs.length && !search && <p className="p-4 text-sm text-muted-foreground text-center">Нет диалогов. Найдите пользователя в поиске выше.</p>}
          </div>
        </Card>

        {/* Conversation */}
        <Card className="flex flex-col overflow-hidden">
          {!activeId ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">Выберите диалог</div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                <Avatar className="h-9 w-9"><AvatarImage src={active?.other?.avatar_url ?? undefined} /><AvatarFallback>{(active?.other?.display_name||active?.other?.email||"?").slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{active?.other?.display_name || active?.other?.email}</div>
                  <div className="text-xs text-muted-foreground">{active?.other?.username ? `@${active.other.username}` : active?.other?.email}</div>
                </div>
              </div>
              {pinned.length > 0 && (
                <div className="px-4 py-2 bg-secondary/40 border-b border-border text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground"><Pin className="h-3 w-3" />Закреплено: {pinned.length}</div>
                  {pinned.slice(-1).map((m) => <div key={m.id} className="truncate mt-1">{m.content}</div>)}
                </div>
              )}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
                {msgs.map((m) => {
                  const mine = m.sender_id === me?.id;
                  if (m.deleted_at) return <div key={m.id} className={cn("text-xs italic text-muted-foreground", mine ? "text-right" : "")}>сообщение удалено</div>;
                  const reply = m.reply_to ? findMsg(m.reply_to) : null;
                  return (
                    <div key={m.id} className={cn("group flex", mine ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[75%] rounded-2xl px-3 py-2 relative", mine ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                        {reply && <div className={cn("text-xs border-l-2 pl-2 mb-1 opacity-80", mine ? "border-primary-foreground/40" : "border-primary/40")}>↳ {reply.content.slice(0, 80)}</div>}
                        <div className="whitespace-pre-wrap break-words text-sm">{m.content}</div>
                        <div className={cn("text-[10px] mt-1 flex items-center gap-1", mine ? "text-primary-foreground/70 justify-end" : "text-muted-foreground")}>
                          {m.pinned_at && <Pin className="h-2.5 w-2.5" />}
                          {format(new Date(m.created_at), "HH:mm")}
                          {m.edited_at && <span>· изм.</span>}
                        </div>
                        <div className={cn("absolute top-0 -translate-y-1/2 hidden group-hover:flex bg-background border border-border rounded-full shadow-sm", mine ? "left-0 -translate-x-full" : "right-0 translate-x-full")}>
                          <button className="p-1.5 hover:bg-secondary rounded-full" onClick={() => setReplyTo(m)} title="Ответить"><Reply className="h-3 w-3" /></button>
                          <button className="p-1.5 hover:bg-secondary rounded-full" onClick={() => togglePin(m)} title={m.pinned_at ? "Открепить" : "Закрепить"}>{m.pinned_at ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}</button>
                          {mine && <button className="p-1.5 hover:bg-secondary rounded-full" onClick={() => startEdit(m)} title="Редактировать"><Pencil className="h-3 w-3" /></button>}
                          {mine && <button className="p-1.5 hover:bg-secondary rounded-full text-destructive" onClick={() => remove(m)} title="Удалить"><Trash2 className="h-3 w-3" /></button>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {(editing || replyTo) && (
                <div className="px-4 py-2 border-t border-border bg-secondary/30 flex items-center gap-2 text-xs">
                  {editing ? <Pencil className="h-3 w-3" /> : <Reply className="h-3 w-3" />}
                  <span className="flex-1 truncate">{editing ? "Редактирование: " : "Ответ на: "}{(editing ?? replyTo)!.content.slice(0, 80)}</span>
                  <button onClick={() => { setEditing(null); setReplyTo(null); setText(""); }}><X className="h-3 w-3" /></button>
                </div>
              )}
              <div className="p-3 border-t border-border flex gap-2">
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Сообщение..." onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} maxLength={4000} />
                <Button onClick={send} variant="wine" disabled={!text.trim()}>{editing ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}</Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};
export default Messages;
