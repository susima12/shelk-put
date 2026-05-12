import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";

const partnersList = [
  "ООО «Бен-Газ-Сакмара» (управляющая компания такси «Белое»)",
  "Газета «Оренбуржье»",
  "Рекламное агентство «Сакура»",
  "Компания «Могучий источник»",
  "Городской молодежный интернет-портал «Молодой Оренбург.РФ»",
  "ООО «Редакция газеты «Оренбургская Сударыня»",
  "ООО «Комус»",
  "ООО «Компания «Секретория»",
  "Общественно-политическая газета «Вечерний Оренбург»",
  "Салон красоты «На Жукова»",
  "ООО «Швейная фабрика «Образ»",
  "Салон красоты «Успех»",
  "Фотолавка",
  "ООО «Телекомпания РИАД»",
  "«Авторадио — Оренбург»",
  "Радио «Мир»",
  "Филиал ОАО «Уфанет»",
  "Отель «Твид»",
  "ГАПОУ «Колледж сервиса»",
  "Торговый дом «Чистый дом»",
  "Магазин «Светофор»",
  "Кондитерская «Дюймовочка»",
  "Школа гончарного искусства и мастерства «Гранат»",
  "Студия современной живописи, творчества и рукоделия «ТиффаниАрт»",
];

const Partners = () => {
  return (
    <>
      <PageHero
        eyebrow="Официальный раздел"
        title="Партнёры фестиваля"
        description="Социальные партнеры и спонсоры фестиваля «Шелковый путь» согласно официальному перечню."
      />
      <section className="py-20">
        <div className="container max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partnersList.map((name) => (
              <Card
                key={name}
                className="p-6 flex flex-col items-start text-left hover:shadow-elegant transition-silk min-h-[160px]"
              >
                <Award className="h-8 w-8 text-gold/60 mb-4" />
                <span className="text-sm font-medium leading-relaxed">{name}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Partners;
