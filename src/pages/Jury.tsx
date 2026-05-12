import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Award, Scale, Sparkles } from "lucide-react";
import { Ornament, SealMark } from "@/components/ui/ornament";

interface JuryMember {
  id: string;
  full_name: string;
  title?: string | null;
  regalia?: string | null;
  bio?: string | null;
  country?: string | null;
  photo_url?: string | null;
}

const fallbackJuryMembers: JuryMember[] = [
  {
    id: "fallback-1",
    full_name: "Денис Бочило",
    regalia:
      "Аттестованный тренер академии Vidal Sasoon (Лондон), основатель и владелец производственно-косметического предприятия «GelaRash», член Международной команды топ стилистов, кандидат биохимических наук.",
    country: "Россия. г. Москва",
  },
  {
    id: "fallback-2",
    full_name: "Руслан Пшеничный",
    regalia:
      "Заслуженный артист РФ, ведущий солист ГАХА «Берёзка» им. Н.С. Надеждиной, солист театра классического танца «Театр балета Надежды Павловой», ведущий педагог по современной хореографии в Красногорском хореографическом училище при Московском Губернском колледже искусств, постоянный член жюри Международных и Всероссийских конкурсов и фестивалей.",
    country: "Россия. г. Москва",
  },
  {
    id: "fallback-3",
    full_name: "Эльвира Таха",
    regalia:
      "Ведущий педагог отделения современного танца Московского хореографического училища при Московском государственном академическом театре танца «Гжель», эксперт высшей категории фестивалей в России и Международного фестиваля «World folk vision», стипендиат Европейского и Американского фестивалей современного танца, Парижского института джазового танца",
    country: "Россия. г. Москва",
  },
  {
    id: "fallback-4",
    full_name: "Алексей Сухарев",
    regalia:
      "Балетмейстер, педагог-хореограф, художественный руководитель Театра Танца MIFS, участник мирового тура, в рамках проекта «Лучшие на Бродвее»",
    country: "Россия. г. Москва",
  },
  {
    id: "fallback-5",
    full_name: "Павел Куров",
    regalia:
      "преподаватель Академии русского балета им. А.Я. Вагановой, судья международных и российских конкурсов, многократный победитель конкурсов молодых хореографов",
    country: "Россия. г. Санкт-Петербург",
  },
  {
    id: "fallback-6",
    full_name: "Виктория Касумова",
    regalia:
      "Эксперт Международной Академии музыки имени Е. Образцовой, саунд-продюсер Санкт-Петербургского Театра Спорта, член Российской общественной академии голоса, лауреат Международных конкурсов",
    country: "Россия. г. Санкт-Петербург",
  },
  {
    id: "fallback-7",
    full_name: "Мария Казак",
    regalia:
      "Художник-модельер, арт-директор Фестиваля моды «Поволжские сезоны Александра Васильева», член Союза Дизайнеров России",
    country: "Россия. г. Самара",
  },
  {
    id: "fallback-8",
    full_name: "Лев Франк",
    regalia:
      "Заслуженный артист РФ и Республики Башкортостан, профессор Уфимского государственного института искусств",
    country: "Россия. г. Уфа",
  },
  {
    id: "fallback-9",
    full_name: "Полина Шабаева",
    regalia:
      "Актриса театра и кино, главный режиссер Уфимского театра юного зрителя, педагог школы-студии театра «Нур» и студии творческого развития «Оперение», основанной Константином Хабенским",
    country: "Россия. г. Уфа",
  },
  {
    id: "fallback-10",
    full_name: "Светлана Вовк",
    regalia:
      "Заслуженный работник культуры Самарской области, магистр эстрадно-джазового вокала, руководитель «Образцовой вокальной студии «Мелодия», заведующий предметно-цикловой комиссией «Музыкальное искусство эстрады» Тольяттинского колледжа искусств им. Р.К. Щедрина, член федерации педагогов вокального искусства РФ, директор Международного конкурса вокального искусства «Открой свое сердце»",
    country: "Россия. г. Тольятти",
  },
  {
    id: "fallback-11",
    full_name: "Любовь Суслова",
    regalia:
      "Преподаватель отделения оркестровых струнных инструментов музыкального колледжа Оренбургского государственного института искусств им. М. и Л. Ростроповичей, лауреат международных конкурсов, артистка ансамбля старинной и современной музыки «Дивертисмент» Оренбургской областной филармонии",
    country: "Россия. г. Оренбург",
  },
  {
    id: "fallback-12",
    full_name: "Наталья Бровко",
    regalia:
      "Заместитель начальника управления по архитектуре и комплексному развитию территорий города Оренбурга, член союза дизайнеров России",
    country: "Россия. г. Оренбург",
  },
  {
    id: "fallback-13",
    full_name: "Юлия Ефимова",
    regalia:
      "Балетмейстер, режиссёр, генеральный директор Международного культурного проекта «Tevy Art Group», директор театральной студии развития личности «Таланты», член совета по танцу CID UNESCO",
    country: "Россия. г. Оренбург",
  },
  {
    id: "fallback-14",
    full_name: "Игорь Табаков",
    regalia: "Заслуженный артист Российской Федерации, профессиональный танцовщик, хореограф",
    country: "Россия. г. Оренбург",
  },
  {
    id: "fallback-15",
    full_name: "Игорь Батаев",
    regalia:
      "Преподаватель отделения оркестровых народных инструментов музыкального колледжа Оренбургского государственного института искусств им. Л. и М. Ростроповичей, лауреат международных конкурсов",
    country: "Россия. г. Оренбург",
  },
  {
    id: "fallback-16",
    full_name: "Анна Ефимова",
    regalia:
      "Преподаватель высшей категории Оренбургского областного колледжа культуры и искусств, руководитель, режиссёр-постановщик студенческого театра «Синяя Птица», лауреат премии Правительства Оренбургской области «Преподаватель года в сфере культуры и искусства». Победитель многочисленных театральных конкурсов и фестивалей, Россия",
    country: "Россия. г. Оренбург",
  },
  {
    id: "fallback-17",
    full_name: "Светлана Банникова",
    regalia:
      "Доцент кафедры «Вокальное искусство» Оренбургского государственного института искусств им. Л. и М. Ростроповичей, лауреат Международных и всероссийских конкурсов, обладатель премий «Преподаватель года». В сфере культуры и искусства",
    country: "Россия. г. Оренбург",
  },
  {
    id: "fallback-18",
    full_name: "Инна Нечаева",
    regalia:
      "Эксперт международного класса конкурсов творческого мастерства по вокалу, преподаватель отделения музыкального искусства эстрады Оренбургского областного колледжа культуры и искусств, Почётный работник общего образования РФ",
    country: "Россия. г. Оренбург",
  },
  {
    id: "fallback-19",
    full_name: "Александра Яблокова",
    regalia: "Член Союза дизайнеров России, руководитель «Yablokova famely art school»",
    country: "Россия. г. Оренбург",
  },
  {
    id: "fallback-20",
    full_name: "Альбина Демченко",
    regalia:
      "Ведущая актриса, мастер сцены Оренбургского государственного драматического театра имени М. Горького, лауреат премии «Оренбургская Лира»",
    country: "Россия. г. Оренбург",
  },
  {
    id: "fallback-21",
    full_name: "Майя Яньшина",
    regalia:
      "Кандидат искусствоведения, член союза дизайнеров России, победитель международных и всероссийских конкурсов по дизайну костюма и декоративно – прикладному искусству, доцент кафедры дизайна ОГУ",
    country: "Россия. г. Оренбург",
  },
  {
    id: "fallback-22",
    full_name: "Татьяна Бреусова",
    regalia:
      "Кандидат педагогических наук, доцент кафедры теории и методики начального и дошкольного образования ФГБОУ ВО «Оренбургский государственный педагогический университет»",
    country: "Россия, г. Оренбург",
  },
  {
    id: "fallback-23",
    full_name: "Ойбек Касимов",
    regalia:
      "Доктор искусствоведения (PhD), член Евразийского союза дизайнеров, член союз дизайнеров Узбекистана, профессор кафедры «Дизайн», Национальный институт художеств и дизайна имени К. Бехзода",
    country: "Республика Узбекистан, г. Ташкент",
  },
  {
    id: "fallback-24",
    full_name: "Юлия Кузнецова",
    regalia:
      "Магистр искусствоведческих наук, Академик Национальной Академии дизайна, член Евразийского Союза Дизайнеров, старший преподаватель кафедры «Художественный труд и дизайн», Актюбинский региональный университет имени К.Жубанова",
    country: "Республика Казахстан, г. Актобе",
  },
  {
    id: "fallback-25",
    full_name: "Иван Савельев",
    regalia:
      "Член союза мастеров народного творчества, старший преподаватель кафедры художественно-педагогического образования Белорусского государственного педагогического университета имени М. Танка",
    country: "Республика Беларусь, г. Минск",
  },
];

const principles = [
  {
    icon: Scale,
    title: "Объективность",
    text: "Каждое выступление оценивается независимо по утверждённым критериям конкурса.",
  },
  {
    icon: Award,
    title: "Профессионализм",
    text: "В состав жюри входят заслуженные деятели искусств, педагоги вузов и лауреаты международных премий.",
  },
  {
    icon: Sparkles,
    title: "Поддержка",
    text: "Помимо оценок, члены жюри проводят мастер-классы и индивидуальные консультации для участников.",
  },
];

const juryPhotoByName: Record<string, string> = {
  "Руслан Пшеничный": "https://shelk-put.com/wp-content/uploads/2025/04/%D0%A0%D1%83%D1%81%D0%BB%D0%B0%D0%BD-%D0%9F%D1%88%D0%B5%D0%BD%D0%B8%D1%87%D0%BD%D1%8B%D0%B9.jpg",
  "Эльвира Таха": "https://shelk-put.com/wp-content/uploads/2025/04/%D0%AD%D0%BB%D1%8C%D0%B2%D0%B8%D1%80%D0%B0-%D0%A2%D0%B0%D1%85%D0%B02.jpg",
  "Алексей Сухарев": "https://shelk-put.com/wp-content/uploads/2025/04/%D0%A1%D1%83%D1%85%D0%BE%D0%B2.jpg",
  "Павел Куров": "https://shelk-put.com/wp-content/uploads/2025/04/%D0%9F%D0%B0%D0%B2%D0%B5%D0%BB-%D0%9A%D1%83%D1%80%D0%BE%D0%B2.jpg",
  "Виктория Касумова": "https://shelk-put.com/wp-content/uploads/2023/03/%D0%9A%D0%B0%D1%81%D1%83%D0%BC%D0%BE%D0%B2%D0%B0-%D0%92%D0%B8%D0%BA%D1%82%D0%BE%D1%80%D0%B8%D1%8F-scaled.jpg",
  "Полина Шабаева": "https://shelk-put.com/wp-content/uploads/2025/04/%D0%A8%D0%B0%D0%B1%D0%B0%D0%B5%D0%B2%D0%B0-%D0%9F%D0%BE%D0%BB%D0%B8%D0%BD%D0%B0.jpg",
  "Светлана Вовк": "https://shelk-put.com/wp-content/uploads/2025/04/%D0%A1%D0%B2%D0%B5%D1%82%D0%BB%D0%B0%D0%BD%D0%B0-%D0%92%D0%BE%D0%B2%D0%BA.jpg",
  "Юлия Ефимова": "https://shelk-put.com/wp-content/uploads/2023/03/%D0%95%D1%84%D0%B8%D0%BC%D0%BE%D0%B2%D0%B0-%D0%AE%D0%BB%D0%B8%D1%8F-%D0%90%D0%BB%D0%B5%D1%81%D0%B0%D0%BD%D0%B4%D1%80%D0%BE%D0%B2%D0%BD%D0%B0.jpg",
  "Анна Ефимова": "https://shelk-put.com/wp-content/uploads/2024/03/%D0%95%D1%84%D0%B8%D0%BC%D0%BE%D0%B2%D0%B0-%D0%90%D0%BD%D0%BD%D0%B0_.jpg",
  "Светлана Банникова": "https://shelk-put.com/wp-content/uploads/2025/04/%D0%A1%D0%B2%D0%B5%D1%82%D0%BB%D0%B0%D0%BD%D0%B0-%D0%91%D0%B0%D0%BD%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%D0%B0.jpg",
  "Майя Яньшина": "https://shelk-put.com/wp-content/uploads/2025/04/%D0%9C%D0%B0%D0%B9%D1%8F.jpg",
  "Альбина Демченко": "https://shelk-put.com/wp-content/uploads/2025/04/%D0%94%D0%B5%D0%BC%D1%87%D0%B5%D0%BD%D0%BA%D0%BE-%D0%90%D0%BB%D1%8C%D0%B1%D0%B8%D0%BD%D0%B0.jpg",
  "Ойбек Касимов": "https://shelk-put.com/wp-content/uploads/2025/11/%D0%A4%D0%BE%D1%82%D0%BE-%D0%9A%D0%B0%D1%81%D0%B8%D0%BC%D0%BE%D0%B2-%D0%9E.%D0%A1.jpg",
  "Юлия Кузнецова": "https://shelk-put.com/wp-content/uploads/2025/11/%D0%A4%D0%BE%D1%82%D0%BE-%D0%9A%D1%83%D0%B7%D0%BD%D0%B5%D1%86%D0%BE%D0%B2%D0%B0-%D0%AE.%D0%9D-e1763980516116.jpg",
  "Иван Савельев": "https://shelk-put.com/wp-content/uploads/2025/11/%D0%A4%D0%BE%D1%82%D0%BE-%D0%A1%D0%B0%D0%B2%D0%B5%D0%BB%D1%8C%D0%B5%D0%B2-%D0%98.%D0%A1.jpg",
  "Лев Франк": "https://shelk-put.com/wp-content/uploads/2021/04/%D0%9C%D0%B0%D1%81%D1%82%D0%B5%D1%80-%D0%BA%D0%BB%D0%B0%D1%81%D1%81%D1%8B-2021.-%D0%A4%D1%80%D0%B0%D0%BD%D0%BA-scaled.jpg",
};

const Jury = () => {
  const [members, setMembers] = useState<JuryMember[]>([]);
  const [loading, setLoading] = useState(true);
  const displayedMembers = members.length > 0 ? members : fallbackJuryMembers;

  useEffect(() => {
    supabase
      .from("jury_members")
      .select("*")
      .order("display_order")
      .then(({ data }) => {
        setMembers(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Профессиональное жюри"
        title={
          <>
            Жюри <span className="italic text-gradient-gold">фестиваля</span>
          </>
        }
        description="Признанные мастера, педагоги и эксперты в своих областях оценивают работы участников «Шёлкового пути»."
      />

      {/* Принципы оценки */}
      <section className="py-20">
        <div className="container max-w-6xl">
          <div className="text-center mb-14">
            <span className="font-marcellus text-xs uppercase tracking-[0.32em] text-gold">
              Принципы работы
            </span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Как мы <span className="italic ink-underline">оцениваем</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {principles.map(({ icon: Icon, title, text }) => (
              <Card
                key={title}
                className="p-8 text-center border-gold/20 hover:border-gold/50 hover:shadow-gold transition-silk group"
              >
                <div className="mx-auto h-14 w-14 rounded-full bg-gradient-gold/15 border border-gold/40 flex items-center justify-center mb-5 group-hover:bg-gradient-gold transition-silk">
                  <Icon className="h-7 w-7 text-gold group-hover:text-gold-foreground transition-silk" />
                </div>
                <h3 className="font-display text-2xl mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Ornament className="my-4" />

      {/* Состав жюри */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <span className="font-marcellus text-xs uppercase tracking-[0.32em] text-gold">
              Сезон 2025
            </span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Состав <span className="italic">жюри</span>
            </h2>
          </div>

          {loading && members.length === 0 ? (
            <div className="text-center text-muted-foreground">Загрузка…</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMembers.map((m) => (
                <Card
                  key={m.id}
                  className="overflow-hidden group hover:shadow-elegant transition-silk border-border/60 hover:border-gold/40"
                >
                  <div className="aspect-[4/5] bg-gradient-silk relative overflow-hidden">
                    {(m.photo_url || juryPhotoByName[m.full_name]) ? (
                      <img
                        src={m.photo_url || juryPhotoByName[m.full_name]}
                        alt={m.full_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-silk"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <SealMark className="w-32 h-32 opacity-40" />
                      </div>
                    )}
                    {m.country && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/85 backdrop-blur text-[10px] font-marcellus uppercase tracking-[0.18em] text-foreground">
                        {m.country}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl mb-1 leading-tight">{m.full_name}</h3>
                    {m.title && (
                      <p className="text-sm text-primary font-medium italic">{m.title}</p>
                    )}
                    {m.regalia && (
                      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                        {m.regalia}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Jury;
