import { useEffect, useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { translateError } from "@/lib/translate-error";

const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/;

const ResetPassword = () => {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase auto-handles the recovery token in the URL hash via detectSessionInUrl
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!PASSWORD_RE.test(pw)) { toast.error("Пароль: 8–72 символа, буква и цифра"); return; }
    if (pw !== pw2) { toast.error("Пароли не совпадают"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) toast.error(translateError(error));
    else { toast.success("Пароль обновлён"); nav("/profile"); }
  };

  return (
    <>
      <PageHero eyebrow="Безопасность" title="Новый пароль" />
      <section className="py-20">
        <div className="container max-w-md">
          <Card className="p-8">
            {!ready ? (
              <p className="text-sm text-muted-foreground text-center">Откройте ссылку из письма, чтобы продолжить.</p>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div><Label>Новый пароль</Label><Input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} required minLength={8} maxLength={72} /></div>
                <div><Label>Повторите</Label><Input type="password" value={pw2} onChange={(e)=>setPw2(e.target.value)} required minLength={8} maxLength={72} /></div>
                <Button type="submit" variant="wine" className="w-full" disabled={busy}>Сохранить</Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </>
  );
};
export default ResetPassword;
