import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Ornament } from "@/components/ui/ornament";
import { Brush, Mic2, Music, Scissors, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";

const classes = [
  {
    icon: Mic2,
    title: "Эстрадный и народный вокал",
    teacher: "Светлана Вовк, Виктория Касумова",
    text: "Постановка дыхания, работа с микрофоном, сценическое движение. Индивидуальные прослушивания.",
    duration: "2 дня · 6 часов",
  },
  {
    icon: Sparkles,
    title: "Современная хореография",
    teacher: "Руслан Пшеничный, Эльвира Таха",
    text: "Импровизация, contemporary, работа с пространством сцены. Разбор конкурсных номеров.",
    duration: "2 дня · 8 часов",
  },
  {
    icon: Music,
    title: "Инструментальное исполнительство",
    teacher: "Игорь Батаев, Любовь Суслова",
    text: "Мастер-классы по струнным и народным инструментам. Камерное музицирование, ансамблевая игра.",
    duration: "1 день · 4 часа",
  },
  {
    icon: Scissors,
    title: "Дизайн костюма и мода",
    teacher: "Мария Казак, Александра Яблокова",
    text: "Разработка коллекции, создание мудбордов, презентация показа. Работа с фактурой и цветом.",
    duration: "2 дня · 8 часов",
  },
  {
    icon: Brush,
    title: "Стилистика и образ",
    teacher: "Денис Бочило",
    text: "Постановка причёски и сценического образа от мастера академии Vidal Sassoon (Лондон).",
    duration: "1 день · 4 часа",
  },
  {
    icon: Users,
    title: "Театральное мастерство",
    teacher: "Полина Шабаева, Анна Ефимова, Альбина Демченко",
    text: "Сценическая речь, работа актёра над ролью, режиссёрский разбор. Лаборатория для педагогов и руководителей коллективов.",
    duration: "3 дня · 10 часов",
  },
];

const MasterClasses = () => (
  <>
    <PageHero
      eyebrow="Творческая лаборатория"
      title={
        <>
          Мастер-<span className="italic text-gradient-gold">классы</span>
        </>
      }
      description="Параллельно с конкурсной программой проходят мастер-классы от членов жюри — для участников, педагогов и руководителей творческих коллективов."
    />

    <section className="py-20">
      <div className="container max-w-6xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(({ icon: Icon, title, teacher, text, duration }) => (
            <Card
              key={title}
              className="p-7 border-gold/20 hover:border-gold/50 hover:shadow-elegant transition-silk relative"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-gold/15 border border-gold/40 flex items-center justify-center mb-5">
                <Icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-display text-2xl mb-2 leading-tight">{title}</h3>
              <div className="font-marcellus text-[11px] uppercase tracking-[0.18em] text-primary mb-4">
                {teacher}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {text}
              </p>
              <div className="pt-4 border-t border-dashed border-foreground/15 text-xs text-muted-foreground">
                {duration}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <Ornament className="my-4" />

    <section className="py-16">
      <div className="container max-w-3xl text-center">
        <h2 className="font-display text-3xl md:text-4xl mb-4">
          Запись на мастер-классы
        </h2>
        <p className="text-muted-foreground mb-8">
          Места ограничены. Запись осуществляется одновременно с подачей
          конкурсной заявки или отдельно — через форму регистрации.
        </p>
        <Button asChild variant="festival" size="lg">
          <Link to="/apply">Подать заявку</Link>
        </Button>
      </div>
    </section>
  </>
);

export default MasterClasses;
