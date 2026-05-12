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
import { Link } from "@/lib/router-compat";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/;

const routeAfterLogin = async (uid: string, nav: (p: string) => void) => {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", uid)
    .eq("role", "admin")
    .maybeSingle();
  nav(data ? "/admin" : "/my-applications");
};

const Auth = () => {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) routeAfterLogin(data.session.user.id, nav);
    });
  }, [nav]);

  const validate = () => {
    if (email.length > 255 || !EMAIL_RE.test(email)) {
      toast.error("Некорректный email (до 255 символов)");
      return false;
    }
    if (mode === "signup") {
      if (!PASSWORD_RE.test(password)) {
        toast.error("Пароль: 8–72 символа, минимум одна буква и одна цифра");
        return false;
      }
      if (name.trim().length < 2 || name.length > 80) {
        toast.error("Имя: от 2 до 80 символов");
        return false;
      }
    } else {
      if (password.length < 6 || password.length > 72) {
        toast.error("Введите корректный пароль");
        return false;
      }
    }
    return true;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) await routeAfterLogin(data.user.id, nav);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name.trim() },
          },
        });
        if (error) throw error;
        if (data.user) {
          // auto-confirm включён — сразу логиним
          if (!data.session) {
            const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
            if (signErr) throw signErr;
          }
          toast.success("Регистрация успешна");
          // новые пользователи всегда попадают в личный кабинет, не в админку
          nav("/profile");
        }
      }
    } catch (err: any) {
      toast.error(translateError(err, "Ошибка"));
    } finally {
      setBusy(false);
    }
  };


  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(resetEmail)) { toast.error("Некорректный email"); return; }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setBusy(false);
    if (error) toast.error(translateError(error));
    else { toast.success("Письмо со ссылкой отправлено"); setShowReset(false); }
  };

  return (
    <>
      <PageHero eyebrow="Личный кабинет" title={mode === "signin" ? "Вход" : "Регистрация"} />
      <section className="py-20">
        <div className="container max-w-md">
          <Card className="p-8">
            {showReset ? (
              <form onSubmit={sendReset} className="space-y-4">
                <div>
                  <Label>Email для восстановления</Label>
                  <Input type="email" required maxLength={255} value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                </div>
                <Button type="submit" variant="wine" className="w-full" disabled={busy}>Отправить ссылку</Button>
                <button type="button" onClick={() => setShowReset(false)} className="text-sm text-muted-foreground hover:text-primary w-full text-center">Назад</button>
              </form>
            ) : (
            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <Label>Имя</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    minLength={2}
                    maxLength={80}
                    required
                  />
                </div>
              )}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  required
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>Пароль</Label>
                <Input
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  8–72 символа, минимум одна буква и одна цифра
                </p>
              </div>
              <Button type="submit" variant="wine" className="w-full" disabled={busy}>
                {busy ? "..." : mode === "signin" ? "Войти" : "Зарегистрироваться"}
              </Button>
              {mode === "signin" && (
                <button type="button" onClick={() => { setResetEmail(email); setShowReset(true); }} className="text-sm text-muted-foreground hover:text-primary w-full text-center">
                  Забыли пароль?
                </button>
              )}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-sm text-muted-foreground hover:text-primary w-full text-center"
              >
                {mode === "signin" ? "Создать аккаунт" : "Уже есть аккаунт? Войти"}
              </button>
            </form>
            )}
          </Card>
        </div>
      </section>
    </>
  );
};

export default Auth;
