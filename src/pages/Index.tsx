import { Hero } from "@/components/sections/Hero";
import { CompetitionsSection } from "@/components/sections/Competitions";
import { Quote } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { Ornament } from "@/components/ui/ornament";

const Index = () => {
  return (
    <>
      <Hero />

      {/* About teaser */}
      <section className="py-24 relative">
        <div className="container grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-marcellus text-xs uppercase tracking-[0.32em] text-gold">
              О фестивале
            </span>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-[1.05] mb-6">
              Творческий путь,
              <br />
              <span className="italic text-gradient-gold">объединяющий культуры</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              XV Международный фестиваль-конкурс детского и юношеского творчества
              «ШЕЛКОВЫЙ ПУТЬ». Место проведения: город Оренбург.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Организаторы: АНО детского и юношеского творчества «Шелковый путь»
              и МАУДО «Дворец творчества детей и молодежи» г. Оренбурга.
              Контакты оргкомитета: +7 (3532) 70-31-62, zayavka@shelk-put.com.
            </p>
            <Button asChild variant="wine" size="lg">
              <Link to="/about">Подробнее о фестивале</Link>
            </Button>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl bg-gradient-silk shadow-elegant relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-overlay opacity-60" />
              <div
                className="absolute inset-0 flex flex-col justify-end p-10"
                style={{ color: "hsl(40 30% 95%)" }}
              >
                <Quote className="h-10 w-10 text-gold mb-4" />
                <p className="font-display italic text-3xl mb-4 leading-snug">
                  Искусство — это нить, что соединяет сердца через границы и поколения.
                </p>
                <div className="font-script text-2xl text-gold-soft">— девиз фестиваля</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ornament className="container my-6" />

      <CompetitionsSection />

      {/* CTA */}
      <section className="py-24">
        <div className="container">
          <div
            className="rounded-2xl bg-gradient-dark p-12 md:p-16 text-center shadow-elegant relative overflow-hidden"
            style={{ color: "hsl(40 30% 95%)" }}
          >
            <div className="absolute inset-0 bg-pattern-silk opacity-[0.04]" />
            <div className="relative">
              <span className="font-script text-3xl text-gold-soft">присоединяйтесь</span>
              <h2 className="mt-2 font-display text-4xl md:text-6xl mb-5 text-gradient-gold leading-[1.05]">
                Готовы стать частью фестиваля?
              </h2>
              <p className="text-lg max-w-2xl mx-auto mb-8 opacity-85">
                Заполните заявку онлайн — мы проверим её и свяжемся с вами для
                подтверждения участия.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="festival" size="xl">
                  <Link to="/apply">Подать заявку</Link>
                </Button>
                <Button asChild variant="outlineGold" size="xl">
                  <Link to="/payment">Реквизиты для оплаты</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
