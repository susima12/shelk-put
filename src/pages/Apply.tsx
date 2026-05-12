import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "@/lib/router-compat";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CheckCircle2, Upload } from "lucide-react";

const schema = z.object({
  competition_id: z.string().uuid("Выберите конкурс"),
  leader_full_name: z.string().trim().min(2, "Укажите ФИО").max(150),
  email: z.string().trim().email("Некорректный email").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^(\+7|8)\d{10}$/, "Телефон должен начинаться с +7 или 8 и содержать 11 цифр (например +79991234567 или 89991234567)"),
  country: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
  organization: z.string().trim().max(200).optional(),
  participant_name: z.string().trim().min(2, "Укажите участника").max(200),
  age_category: z.string().optional(),
  nomination: z.string().optional(),
  performance_title: z.string().trim().max(200).optional(),
  duration_minutes: z.coerce.number().min(0).max(120).optional().or(z.literal("")),
  participants_count: z.coerce.number().int().min(1).max(500).optional().or(z.literal("")),
  video_url: z.string().trim().url("Некорректная ссылка").max(500).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional(),
  consent_given: z.literal(true, { message: "Необходимо согласие" } as any),
});
type FormValues = z.infer<typeof schema>;

const Apply = () => {
  const [params] = useSearchParams();
  const routeParams = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);

  const initialSlug = routeParams.slug ?? params.get("competition") ?? "";
  const lockedToSlug = !!routeParams.slug;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      competition_id: "",
      consent_given: false as any,
    },
  });

  const competitionId = form.watch("competition_id");
  const selectedComp = competitions.find((c) => c.id === competitionId);

  useEffect(() => {
    supabase
      .from("competitions")
      .select("*")
      .eq("accepting_applications", true)
      .order("display_order")
      .then(({ data }) => {
        const list = data ?? [];
        setCompetitions(list);
        if (initialSlug) {
          const found = list.find((c: any) => c.slug === initialSlug);
          if (found) form.setValue("competition_id", found.id, { shouldValidate: true });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSlug]);

  const uploadFile = async (f: File, prefix: string) => {
    const ext = f.name.split(".").pop();
    const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("applications").upload(path, f);
    if (error) throw error;
    return path;
  };

  const onSubmit = async (values: FormValues) => {
    if (!selectedComp) return;
    setSubmitting(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user.id ?? null;

      let attachment_path: string | null = null;
      let payment_receipt_path: string | null = null;
      if (file) attachment_path = await uploadFile(file, "attachments");
      if (receipt) payment_receipt_path = await uploadFile(receipt, "receipts");

      const { error } = await supabase.from("applications").insert({
        competition_id: selectedComp.id,
        user_id: userId,
        leader_full_name: values.leader_full_name,
        email: values.email,
        phone: values.phone,
        country: values.country || null,
        city: values.city || null,
        organization: values.organization || null,
        participant_name: values.participant_name,
        age_category: values.age_category || null,
        nomination: values.nomination || null,
        performance_title: values.performance_title || null,
        duration_minutes: values.duration_minutes ? Number(values.duration_minutes) : null,
        participants_count: values.participants_count ? Number(values.participants_count) : null,
        video_url: values.video_url || null,
        notes: values.notes || null,
        attachment_path,
        payment_receipt_path,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Заявка отправлена!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      console.error(e);
      toast.error(e.message ?? "Ошибка при отправке");
    } finally {
      setSubmitting(false);
    }
  };

  const onInvalid = (errs: any) => {
    console.warn("Validation errors", errs);
    const first = Object.values(errs)[0] as any;
    toast.error(first?.message ?? "Заполните обязательные поля");
  };

  if (submitted) {
    return (
      <>
        <PageHero eyebrow="Готово" title="Заявка отправлена" />
        <section className="py-20">
          <div className="container max-w-2xl">
            <Card className="p-12 text-center">
              <CheckCircle2 className="h-16 w-16 text-gold mx-auto mb-6" />
              <h2 className="font-serif text-3xl mb-4">Спасибо!</h2>
              <p className="text-muted-foreground mb-8">
                Ваша заявка получена и зарегистрирована. Оргкомитет свяжется
                с вами по указанному email после проверки.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate("/")} variant="wine">На главную</Button>
                <Button onClick={() => { setSubmitted(false); form.reset(); }} variant="outline">
                  Подать ещё одну заявку
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Заявка на участие"
        title="Подать заявку"
        description="Заполните форму ниже. Поля со звёздочкой обязательны для заполнения."
      />
      <section className="py-16">
        <div className="container max-w-3xl">
          <Card className="p-8 md:p-10">
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
              {/* Конкурс */}
              <Section title={lockedToSlug && selectedComp ? `Конкурс: ${selectedComp.name}` : "Выбор конкурса"}>
                {!lockedToSlug && (
                  <Field label="Конкурс *" error={form.formState.errors.competition_id?.message}>
                    <Select value={competitionId} onValueChange={(v) => form.setValue("competition_id", v, { shouldValidate: true })}>
                      <SelectTrigger><SelectValue placeholder="Выберите конкурс" /></SelectTrigger>
                      <SelectContent>
                        {competitions.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}

                {selectedComp && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Возрастная категория">
                      <Select
                        value={form.watch("age_category") ?? ""}
                        onValueChange={(v) => form.setValue("age_category", v, { shouldValidate: true })}
                      >
                        <SelectTrigger><SelectValue placeholder="Выберите" /></SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          {(selectedComp.age_categories ?? []).map((a: string) => (
                            <SelectItem key={a} value={a}>{a}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Номинация">
                      <Select
                        value={form.watch("nomination") ?? ""}
                        onValueChange={(v) => form.setValue("nomination", v, { shouldValidate: true })}
                      >
                        <SelectTrigger><SelectValue placeholder="Выберите" /></SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          {(selectedComp.nominations ?? []).map((n: string) => (
                            <SelectItem key={n} value={n}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                )}
              </Section>

              <Section title="Контактное лицо (руководитель)">
                <Field label="ФИО руководителя *" error={form.formState.errors.leader_full_name?.message}>
                  <Input {...form.register("leader_full_name")} />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Email *" error={form.formState.errors.email?.message}>
                    <Input type="email" {...form.register("email")} />
                  </Field>
                  <Field label="Телефон *" error={form.formState.errors.phone?.message}>
                    <Input {...form.register("phone")} placeholder="+7 ..." />
                  </Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Страна"><Input {...form.register("country")} /></Field>
                  <Field label="Город"><Input {...form.register("city")} /></Field>
                </div>
                <Field label="Организация / коллектив">
                  <Input {...form.register("organization")} />
                </Field>
              </Section>

              <Section title="Об участнике / номере">
                <Field label="Участник / коллектив *" error={form.formState.errors.participant_name?.message}>
                  <Input {...form.register("participant_name")} placeholder="ФИО или название коллектива" />
                </Field>
                <Field label="Название номера / работы">
                  <Input {...form.register("performance_title")} />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Длительность (мин)">
                    <Input type="number" step="0.5" {...form.register("duration_minutes")} />
                  </Field>
                  <Field label="Количество участников">
                    <Input type="number" {...form.register("participants_count")} />
                  </Field>
                </div>
                <Field label="Ссылка на видео-визитку (YouTube, VK Видео, Rutube)" error={form.formState.errors.video_url?.message}>
                  <Input {...form.register("video_url")} placeholder="https://..." />
                </Field>
              </Section>

              <Section title="Файлы">
                <FileInput
                  label="Файл-приложение (партитура, фото работы, сценарий и т.п.)"
                  file={file}
                  onChange={setFile}
                />
                <FileInput
                  label="Чек об оплате оргвзноса (если уже оплачен)"
                  file={receipt}
                  onChange={setReceipt}
                />
                <Field label="Дополнительная информация">
                  <Textarea rows={4} {...form.register("notes")} />
                </Field>
              </Section>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/40">
                <Checkbox
                  id="consent"
                  checked={form.watch("consent_given") as any}
                  onCheckedChange={(v) => form.setValue("consent_given", !!v as any, { shouldValidate: true })}
                />
                <Label htmlFor="consent" className="text-sm leading-snug cursor-pointer">
                  Я даю согласие на обработку персональных данных в соответствии
                  с Федеральным законом № 152-ФЗ и подтверждаю достоверность
                  указанных сведений. *
                </Label>
              </div>
              {form.formState.errors.consent_given && (
                <p className="text-sm text-destructive -mt-4">{form.formState.errors.consent_given.message as any}</p>
              )}

              <Button type="submit" variant="festival" size="xl" className="w-full" disabled={submitting}>
                {submitting ? "Отправка..." : "Отправить заявку"}
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <h3 className="font-serif text-xl pb-2 border-b border-border">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-sm">{label}</Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

const FileInput = ({ label, file, onChange }: { label: string; file: File | null; onChange: (f: File | null) => void }) => (
  <div className="space-y-1.5">
    <Label className="text-sm">{label}</Label>
    <label className="flex items-center gap-3 px-4 py-3 border border-dashed border-border rounded-md cursor-pointer hover:border-gold transition-silk">
      <Upload className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground flex-1 truncate">
        {file ? file.name : "Выберите файл"}
      </span>
      <input
        type="file"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  </div>
);

export default Apply;
