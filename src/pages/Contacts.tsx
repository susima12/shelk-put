import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

const Contacts = () => (
  <>
    <PageHero eyebrow="Связаться с нами" title="Контакты" description="Оргкомитет фестиваля «Шёлковый путь» в Оренбурге." />
    <section className="py-20">
      <div className="container max-w-4xl grid sm:grid-cols-2 gap-5">
        {[
          { icon: MapPin, t: "Адрес", v: "460035, Россия,\nг. Оренбург, ул. Мичурина, д. 4" },
          { icon: Mail, t: "Email для заявок", v: "zayavka@shelk-put.com" },
          { icon: Phone, t: "Телефон оргкомитета", v: "+7 (3532) 70-31-62" },
          { icon: Clock, t: "Часы работы", v: "Пн–Пт: 10:00 – 18:00\nМСК+2" },
        ].map((c) => (
          <Card key={c.t} className="p-7 hover:shadow-elegant transition-silk">
            <c.icon className="h-7 w-7 text-gold mb-4" />
            <div className="font-serif text-xl mb-2">{c.t}</div>
            <div className="text-muted-foreground whitespace-pre-line">{c.v}</div>
          </Card>
        ))}
      </div>

      <div className="container max-w-4xl mt-10">
        <Card className="p-8 bg-secondary/40">
          <h3 className="font-serif text-2xl mb-3">Учредитель</h3>
          <p className="text-muted-foreground">
            Автономная некоммерческая организация детского и юношеского
            творчества «Шёлковый путь» (АНО «Шёлковый путь» / SILK WAY) основана
            в 2010 году. Создана в целях оказания услуг в области
            художественного, литературного и исполнительского творчества.
          </p>
        </Card>
      </div>
    </section>
  </>
);

export default Contacts;
