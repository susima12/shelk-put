import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const News = () => {
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("news").select("*").order("published_at", { ascending: false }).then(({ data }) => setNews(data ?? []));
  }, []);

  return (
    <>
      <PageHero eyebrow="Афиша и события" title="Новости фестиваля" description="Анонсы, итоги конкурсов, мастер-классы и встречи." />
      <section className="py-20">
        <div className="container max-w-4xl">
          {news.length === 0 ? (
            <Card className="p-12 text-center">
              <Newspaper className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-serif text-2xl mb-2">Новостей пока нет</h3>
              <p className="text-muted-foreground">Следите за обновлениями — скоро здесь появятся анонсы.</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {news.map((n) => (
                <Card key={n.id} className="p-8 hover:shadow-elegant transition-silk">
                  <div className="text-xs uppercase tracking-wider text-gold mb-2">
                    {format(new Date(n.published_at), "d MMMM yyyy", { locale: ru })}
                  </div>
                  <h3 className="font-serif text-2xl mb-3">{n.title}</h3>
                  {n.excerpt && <p className="text-muted-foreground">{n.excerpt}</p>}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default News;
