import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Competition = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  accepting_applications: boolean;
};

const Competitions = () => {
  const [items, setItems] = useState<Competition[]>([]);
  useEffect(() => {
    supabase
      .from("competitions")
      .select("id, slug, name, short_description, accepting_applications")
      .order("display_order")
      .then(({ data }) => setItems((data ?? []) as Competition[]));
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Конкурсные направления"
        title="Конкурсы фестиваля «Шёлковый путь»"
        description="Выберите конкурс и подайте заявку через индивидуальную форму."
      />
      <section className="py-16">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((c) => (
              <Card key={c.id} className="p-5 flex flex-col">
                <div className="font-serif text-lg mb-2">{c.name}</div>
                {c.short_description && (
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {c.short_description}
                  </p>
                )}
                <Button asChild variant="festival" size="sm" disabled={!c.accepting_applications}>
                  <Link to={`/apply/${c.slug}`}>
                    {c.accepting_applications ? "Подать заявку" : "Приём закрыт"}
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Competitions;
