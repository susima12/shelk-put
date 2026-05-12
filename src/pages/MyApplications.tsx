import { useEffect, useState } from "react";
import { Link, useNavigate } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MessageCircle, FileDown, BellRing } from "lucide-react";
import { toast } from "sonner";

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  new: { text: "Новая", cls: "bg-blue-500/15 text-blue-700" },
  reviewing: { text: "На рассмотрении", cls: "bg-amber-500/15 text-amber-700" },
  approved: { text: "Одобрена", cls: "bg-emerald-500/15 text-emerald-700" },
  rejected: { text: "Отклонена", cls: "bg-rose-500/15 text-rose-700" },
};

const MyApplications = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [comps, setComps] = useState<Record<string, { name: string; slug: string }>>({});
  const [invites, setInvites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { nav("/auth"); return; }
      const uid = sess.session.user.id;
      const [{ data: apps }, { data: cs }, { data: members }] = await Promise.all([
        supabase
          .from("applications")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", { ascending: false }),
        supabase.from("competitions").select("id, name, slug"),
        supabase.from("chat_members").select("competition_id, banned").eq("user_id", uid),
      ]);
      setItems(apps ?? []);
      const map: any = {};
      (cs ?? []).forEach((c: any) => { map[c.id] = c; });
      setComps(map);
      const inv: Record<string, boolean> = {};
      (members ?? []).forEach((m: any) => { if (!m.banned) inv[m.competition_id] = true; });
      setInvites(inv);
      setLoading(false);
    })();
  }, [nav]);

  const downloadFile = async (path: string) => {
    const { data, error } = await supabase.storage.from("applications").createSignedUrl(path, 60 * 5);
    if (error || !data?.signedUrl) { toast.error(error?.message ?? "Файл недоступен"); return; }
    window.open(data.signedUrl, "_blank");
  };

  if (loading) return <div className="container py-32 text-center">Загрузка...</div>;

  return (
    <>
      <PageHero eyebrow="Личный кабинет" title="Мои заявки" />
      <section className="py-16">
        <div className="container max-w-4xl">
          {items.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-6">У вас пока нет заявок.</p>
              <Button asChild variant="festival"><Link to="/competitions">К конкурсам</Link></Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {items.map((a) => {
                const st = STATUS_LABEL[a.status] ?? STATUS_LABEL.new;
                const comp = comps[a.competition_id];
                const invited = comp ? !!invites[a.competition_id] : false;
                return (
                  <Card key={a.id} className="p-5">
                    <div className="flex justify-between items-start gap-4 flex-wrap mb-3">
                      <div>
                        <div className="font-serif text-lg">{comp?.name ?? "Конкурс"}</div>
                        <div className="text-sm text-muted-foreground">
                          {a.participant_name} · {format(new Date(a.created_at), "dd.MM.yyyy HH:mm")}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 space-x-3">
                          {a.age_category && <span>Возраст: <strong>{a.age_category}</strong></span>}
                          {a.nomination && <span>Номинация: <strong>{a.nomination}</strong></span>}
                          {a.performance_title && <span>Номер: <strong>{a.performance_title}</strong></span>}
                        </div>
                      </div>
                      <Badge className={st.cls}>{st.text}</Badge>
                    </div>

                    {(a.attachment_path || a.payment_receipt_path) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {a.attachment_path && (
                          <Button size="sm" variant="outline" onClick={() => downloadFile(a.attachment_path)}>
                            <FileDown className="h-4 w-4" /> Файл-приложение
                          </Button>
                        )}
                        {a.payment_receipt_path && (
                          <Button size="sm" variant="outline" onClick={() => downloadFile(a.payment_receipt_path)}>
                            <FileDown className="h-4 w-4" /> Чек об оплате
                          </Button>
                        )}
                      </div>
                    )}

                    {a.admin_notes && (
                      <p className="text-sm bg-secondary/40 p-3 rounded mb-3">
                        <strong>Сообщение администратора:</strong> {a.admin_notes}
                      </p>
                    )}

                    {a.status === "approved" && comp && (
                      <div className="pt-2 border-t border-border mt-3">
                        {invited ? (
                          <Button asChild variant="festival" size="sm">
                            <Link to={`/chat/${comp.slug}`}>
                              <MessageCircle className="h-4 w-4" /> Войти в чат конкурса
                            </Link>
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BellRing className="h-4 w-4 text-gold" />
                            Ожидайте приглашения администратора в чат конкурса.
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MyApplications;
