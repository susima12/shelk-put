import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Ornament, SealMark } from "@/components/ui/ornament";
import {
  BookOpen,
  Building2,
  Globe,
  HandHeart,
  Palette,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

const goals = [
  {
    icon: Users,
    title: "Объединение талантов",
    text: "Объединение творческих ресурсов детей и молодёжи, разнообразие форм творческой деятельности.",
  },
  {
    icon: Palette,
    title: "Развитие искусства",
    text: "Популяризация, развитие и совершенствование театрального творчества и художественного дизайна.",
  },
  {
    icon: Sparkles,
    title: "Условия для роста",
    text: "Обеспечение условий для личностного развития, профессионального самообразования и творческого труда.",
  },
  {
    icon: BookOpen,
    title: "Поддержка педагогов",
    text: "Стимулирование профессионального уровня педагогов и руководителей детских коллективов.",
  },
  {
    icon: Globe,
    title: "Международное сотрудничество",
    text: "Развитие межведомственного и международного сотрудничества в сфере культуры и искусства.",
  },
  {
    icon: HandHeart,
    title: "Благотворительность",
    text: "Материальная и иная поддержка одарённых детей, детских и молодёжных коллективов.",
  },
];

const activities = [
  "Деятельность в области художественного, литературного и исполнительского творчества",
  "Организация и постановка театральных представлений, концертов и сценических выступлений",
  "Проведение фестивалей, конкурсов, мастер-классов, семинаров и презентаций",
  "Информационно-просветительская работа в области детского и молодёжного творчества",
  "Издание книг, брошюр, методических пособий и каталогов фестиваля",
  "Установление и развитие прямых международных связей с зарубежными организациями",
];

const About = () => (
  <>
    <PageHero
      eyebrow="С 2010 года · Оренбург"
      title={
        <>
          О фестивале
          <br />
          <span className="italic text-gradient-gold">«Шёлковый путь»</span>
        </>
      }
      description="Международный фестиваль детского и юношеского творчества, объединяющий таланты со всех уголков мира на протяжении более 15 лет."
    />

    {/* Вступление с буквицей */}
    <section className="py-20">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <span className="font-script text-3xl text-primary">наша история</span>
        </div>
        <div className="font-display text-2xl md:text-3xl leading-relaxed text-foreground/90 drop-cap">
          Фестиваль учреждён Автономной некоммерческой организацией
          детского и юношеского творчества «Шёлковый путь» в 2010 году
          в городе Оренбурге, на основе добровольных взносов учредителей,
          в целях оказания услуг в области художественного, литературного
          и исполнительского творчества.
        </div>

        <div className="my-14">
          <Ornament />
        </div>

        {/* Цифры */}
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { v: "15+", l: "Лет фестивалю" },
            { v: "10", l: "Конкурсных направлений" },
            { v: "1000+", l: "Участников ежегодно" },
          ].map((s) => (
            <Card
              key={s.l}
              className="relative p-8 text-center border-gold/30 bg-card/60 backdrop-blur overflow-hidden group hover:shadow-gold transition-silk"
            >
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 transition-silk" />
              <div className="font-display text-6xl text-gradient-gold font-medium leading-none">
                {s.v}
              </div>
              <div className="text-xs font-marcellus uppercase tracking-[0.2em] text-muted-foreground mt-3">
                {s.l}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Миссия — вынесенная цитата */}
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark opacity-95" />
      <SealMark className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 opacity-10 animate-spin-slow" />
      <div className="container relative max-w-4xl text-center" style={{ color: "hsl(40 30% 95%)" }}>
        <span className="font-marcellus text-xs uppercase tracking-[0.4em] text-gold">Миссия</span>
        <p className="mt-6 font-display italic text-3xl md:text-4xl leading-snug text-balance">
          «Создание условий для развития и поддержки одарённых детей и молодёжи,
          популяризация различных видов творчества и развитие
          <span className="text-gradient-gold not-italic"> международного культурного сотрудничества</span>».
        </p>
        <div className="mt-8 font-script text-2xl text-gold-soft">
          — устав АНО «Шёлковый путь»
        </div>
      </div>
    </section>

    {/* Цели */}
    <section className="py-20">
      <div className="container max-w-6xl">
        <div className="text-center mb-14">
          <span className="font-marcellus text-xs uppercase tracking-[0.32em] text-gold">
            Согласно уставу
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            Цели <span className="ink-underline italic">фестиваля</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(({ icon: Icon, title, text }) => (
            <Card
              key={title}
              className="p-7 border-border/60 hover:border-gold/40 hover:shadow-card transition-silk group"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-gold/15 border border-gold/30 flex items-center justify-center mb-5 group-hover:bg-gradient-gold group-hover:border-transparent transition-silk">
                <Icon className="h-6 w-6 text-gold group-hover:text-gold-foreground transition-silk" />
              </div>
              <h3 className="font-display text-2xl mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Виды деятельности */}
    <section className="py-20 bg-pattern-silk">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <span className="font-marcellus text-xs uppercase tracking-[0.32em] text-gold">
            Раздел 2.3 устава
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            Виды <span className="italic">деятельности</span>
          </h2>
        </div>
        <ol className="space-y-3">
          {activities.map((a, i) => (
            <li
              key={a}
              className="flex gap-5 p-5 rounded-lg bg-card/80 backdrop-blur border border-border/60 hover:border-gold/40 transition-silk"
            >
              <div className="font-display text-3xl text-gradient-gold leading-none w-10 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className="text-foreground/85 leading-relaxed">{a}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* Реквизиты организации */}
    <section className="py-20">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <Target className="h-8 w-8 text-gold mx-auto mb-3" />
          <h2 className="font-display text-4xl md:text-5xl">Об организации</h2>
        </div>

        <Card className="p-8 md:p-10 border-gold/30 bg-card/80 backdrop-blur shadow-elegant">
          <div className="flex items-start gap-5 mb-6">
            <Building2 className="h-7 w-7 text-gold shrink-0 mt-1" />
            <div>
              <div className="font-marcellus text-xs uppercase tracking-[0.22em] text-muted-foreground mb-1">
                Полное наименование
              </div>
              <div className="font-display text-2xl">
                Автономная некоммерческая организация детского и юношеского
                творчества <span className="italic">«Шёлковый путь»</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                на английском — <span className="font-marcellus">SILK WAY</span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6 mt-8 pt-8 border-t border-border">
            <Detail label="Юридический адрес" value="460035, Россия, г. Оренбург, ул. Мичурина, д. 4" />
            <Detail label="Почтовый адрес" value="460035, Россия, г. Оренбург, ул. Мичурина, д. 4" />
            <Detail label="Исполнительный орган" value="460000, Россия, г. Оренбург, пер. Хлебный, д. 2" />
            <Detail label="Дата учреждения" value="06 апреля 2010 года" />
            <Detail label="Организационно-правовая форма" value="Автономная некоммерческая организация" />
            <Detail label="Срок деятельности" value="Без ограничения срока" />
          </div>

        </Card>
      </div>
    </section>
  </>
);

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="font-marcellus text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">
      {label}
    </div>
    <div className="text-foreground/90">{value}</div>
  </div>
);

export default About;
