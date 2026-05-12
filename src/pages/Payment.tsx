import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Building2, FileText, Banknote } from "lucide-react";
import { Link } from "@/lib/router-compat";

const Row = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border/60 last:border-0">
      <div className="text-sm text-muted-foreground min-w-[160px] sm:min-w-[200px]">{label}</div>
      <div className="flex-1 font-medium text-sm sm:text-base text-foreground/90">{value}</div>
    </div>
  );
};

const Payment = () => {
  return (
    <>
      <PageHero
        eyebrow="Оргвзнос участника"
        title="Оплата и реквизиты"
        description="Официальные финансовые условия и реквизиты фестиваля «Шелковый путь»."
      />

      <section className="py-20">
        <div className="container max-w-4xl space-y-10">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: FileText, t: "1. Заявка", d: "Заполните онлайн-форму и выберите конкурс" },
              { icon: Banknote, t: "2. Оплата", d: "Переведите оргвзнос по реквизитам ниже" },
              { icon: CheckCircle2, t: "3. Подтверждение", d: "Прикрепите чек к заявке или пришлите на email" },
            ].map((s) => (
              <Card key={s.t} className="p-5 border-gold/30">
                <s.icon className="h-6 w-6 text-gold mb-3" />
                <div className="font-serif text-lg mb-1">{s.t}</div>
                <div className="text-sm text-muted-foreground">{s.d}</div>
              </Card>
            ))}
          </div>

          <Card className="p-8 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-6 w-6 text-primary" />
              <h2 className="font-serif text-2xl">Банковские реквизиты</h2>
            </div>
            <div className="space-y-1">
              <Row label="Получатель" value="Автономная некоммерческая организация детского и юношеского творчества «Шелковый путь»" />
              <Row label="ИНН" value="5610098740" />
              <Row label="КПП" value="561001001" />
              <Row label="Расчётный счёт" value="40703810300490003642" />
              <Row label="Банк" value="ФИЛИАЛ «ЦЕНТРАЛЬНЫЙ» БАНКА ВТБ (ПАО) г. Москва" />
              <Row label="БИК" value="044525411" />
              <Row label="Корр. счёт" value="30101810145250000411" />
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="font-serif text-2xl mb-4">Финансовые условия</h3>
            <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <li>Заявки на участие заполняются только на сайте фестиваля.</li>
              <li>Заявка считается зарегистрированной после получения копии платежного документа.</li>
              <li>Участники допускаются к конкурсу только при внесении 100% предоплаты оргвзноса.</li>
              <li>Оргвзнос за участие перечисляется до 06.04.2026 г.</li>
              <li>Копии платежных документов направляются на email: zayavka@shelk-put.com.</li>
              <li>При отказе позднее 7 дней до начала конкурса 50% взноса не возвращается, позднее 5 дней — сумма не возвращается полностью.</li>
            </ul>
          </Card>

          <Card className="p-8 bg-gradient-dark text-foreground" style={{ color: "hsl(40 30% 95%)" }}>
            <h3 className="font-serif text-2xl mb-3">Готовы подать заявку?</h3>
            <p className="opacity-80 mb-6">
              После оплаты направьте копию платежного документа в оргкомитет и подайте заявку на участие.
            </p>
            <Button asChild variant="festival" size="lg">
              <Link to="/apply">Перейти к заявке</Link>
            </Button>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Payment;
