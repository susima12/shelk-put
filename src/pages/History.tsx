import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Ornament, SealMark } from "@/components/ui/ornament";
import { Calendar } from "lucide-react";

const periods = [
  {
    range: "I — V",
    years: "2010 — 2014",
    title: "Рождение фестиваля",
    text: "Основание АНО «Шёлковый путь» в Оренбурге. Первые региональные конкурсы по вокалу, хореографии и декоративно-прикладному искусству. Формирование оргкомитета и постоянного состава жюри.",
  },
  {
    range: "VI — X",
    years: "2015 — 2019",
    title: "Международное признание",
    text: "Расширение географии: к фестивалю присоединяются делегации из Казахстана, Узбекистана, Беларуси и Киргизии. Запуск отдельного конкурса «Юный модельер» и Театров моды. Выход на международный уровень.",
  },
  {
    range: "XI — XIV",
    years: "2020 — 2024",
    title: "Эпоха роста",
    text: "Появление онлайн-формата и заочных туров. Открытие новых номинаций по театральному искусству и инструментальному исполнительству. Сотрудничество с CID UNESCO и ведущими творческими союзами.",
  },
  {
    range: "XV",
    years: "2025 — 2026",
    title: "Юбилейный сезон",
    text: "К 15-летию фестиваля — обновлённая программа, расширенный состав жюри из 25 экспертов и приглашение участников из десяти стран. Гала-концерт, мастер-классы и творческие лаборатории.",
  },
];

const winnersByYear = [
  {
    festival: "XI фестиваль",
    text: "Гран-При получили участники конкурсов вокала, инструментального исполнительства, театров моды и хореографии. Также были определены победители конкурса «Мисс и Мистер «Шелковый путь» по возрастным категориям и обладатели приза зрительских симпатий.",
  },
  {
    festival: "XII фестиваль",
    text: "В 2023 году фестиваль «Время новых побед» собрал около 4000 участников. Победители были определены в номинациях «Мисс и Мистер «Шелковый путь», а Гран-При вручены в конкурсах инструментального исполнительства, театральных коллективов, театров моды, юных модельеров и хореографии.",
  },
  {
    festival: "XIII фестиваль",
    text: "Около 4500 участников из разных регионов России приняли участие в очных и заочных конкурсах. По итогам вручены 10 Гран-При фестиваля и 8 титулов «Мисс и Мистер Шелковый путь».",
  },
  {
    festival: "XIV фестиваль",
    text: "С 10 по 13 апреля 2025 года фестиваль объединил около 4000 участников из России и ближнего зарубежья. Жюри определило победителей Гран-При практически во всех очных номинациях: инструментальное исполнительство, вокал, хореография, театр и художественное слово, мода и дизайн, а также победительниц конкурса «Мисс Шелковый путь» в пяти возрастных категориях.",
  },
];

const History = () => (
  <>
    <PageHero
      eyebrow="2010 — 2026"
      title={
        <>
          История <span className="italic text-gradient-gold">фестиваля</span>
        </>
      }
      description="Пятнадцать лет «Шёлкового пути»: от региональной инициативы — к международному смотру детского и юношеского творчества."
    />

    <section className="py-20">
      <div className="container max-w-5xl">
        <div className="relative">
          {/* вертикальная линия */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent" />

          <div className="space-y-12">
            {periods.map((p, i) => (
              <div
                key={p.range}
                className={`relative grid md:grid-cols-2 gap-6 items-center ${
                  i % 2 === 0 ? "" : "md:[direction:rtl]"
                }`}
              >
                {/* маркер */}
                <span className="absolute left-6 md:left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-gold border-4 border-background shadow-gold" />

                <div className={`pl-16 md:pl-0 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:[direction:ltr]"}`}>
                  <div className="font-marcellus text-xs uppercase tracking-[0.32em] text-gold mb-1">
                    Фестивали {p.range}
                  </div>
                  <div className="font-display text-3xl md:text-4xl text-primary">
                    {p.years}
                  </div>
                </div>

                <div className={`pl-16 md:pl-0 ${i % 2 === 0 ? "md:pl-12" : "md:pr-12 md:[direction:ltr]"}`}>
                  <Card className="p-6 border-gold/20 hover:border-gold/50 hover:shadow-elegant transition-silk relative">
                    <Calendar className="absolute top-4 right-4 h-4 w-4 text-gold/60" />
                    <h3 className="font-display text-2xl mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {p.text}
                    </p>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <Ornament className="my-4" />

    <section className="py-20">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <div className="font-marcellus text-xs uppercase tracking-[0.32em] text-gold">
            XI — XIV фестивали
          </div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            Победители и <span className="italic">главные итоги</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {winnersByYear.map((item) => (
            <Card key={item.festival} className="p-6 border-gold/20">
              <h3 className="font-display text-2xl mb-3">{item.festival}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container max-w-4xl">
        <Card className="relative overflow-hidden p-10 md:p-14 bg-card/80 backdrop-blur border-gold/30">
          <SealMark className="absolute -top-12 -right-12 w-56 h-56 opacity-10" />
          <div className="relative">
            <div className="font-marcellus text-xs uppercase tracking-[0.32em] text-gold mb-3">
              СМИ о фестивале
            </div>
            <h2 className="font-display text-3xl md:text-4xl mb-5">
              «Шёлковый путь» в прессе
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              За пятнадцать лет существования фестиваль не раз становился
              героем публикаций региональных и федеральных СМИ. О нашем смотре
              писали «Российская газета», «Культура», «Оренбургская неделя»,
              телеканалы ОРТ-Планета, ГТРК «Оренбург».
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Архив публикаций пополняется. Если вы — журналист и хотите
              получить аккредитацию или комментарий оргкомитета — напишите нам
              на{" "}
              <a
                href="mailto:zayavka@shelk-put.com"
                className="text-primary hover:text-gold transition-silk underline-offset-4 hover:underline"
              >
                zayavka@shelk-put.com
              </a>
              .
            </p>
          </div>
        </Card>
      </div>
    </section>
  </>
);

export default History;
