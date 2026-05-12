import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, LogOut, Upload, FileText, MessageSquare } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { toast } from "sonner";
import { translateError } from "@/lib/translate-error";
import { BackButton } from "@/components/ui/back-button";

const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/;
const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

const Profile = () => {
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [busy, setBusy] = useState(false);
  const [supportsPasswordActions, setSupportsPasswordActions] = useState(true);

  // credentials block
  const [curPw, setCurPw] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPw, setNewPw] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data: sess, error: sErr } = await supabase.auth.getSession();
        if (sErr) console.error("getSession error", sErr);
        if (!sess?.session) { nav("/auth"); return; }
        const user = sess.session.user;
        setMe(user);
        const provider = user.app_metadata?.provider;
        setSupportsPasswordActions(provider !== "google");
        const { data: p, error: pErr } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (pErr) {
          console.error("profile load error", pErr);
          toast.error(translateError(pErr, "Не удалось загрузить профиль"));
        }
        setProfile(p);
        const fallbackName = (user.user_metadata?.full_name as string | undefined)
          || (user.user_metadata?.name as string | undefined)
          || p?.display_name
          || user.email
          || "";
        let fallbackUsername = (p?.username
          || ((user.user_metadata?.preferred_username as string | undefined)?.toLowerCase())
          || ((user.email?.split("@")[0] ?? "").toLowerCase().replace(/[^a-z0-9_]/g, "")))
          || "user";
        if (fallbackUsername.length < 3) {
          fallbackUsername = (fallbackUsername + "_" + user.id.slice(0, 6)).toLowerCase();
        }
        setDisplayName(fallbackName);
        setUsername(fallbackUsername);
        setBio(p?.bio ?? "");
      } catch (e: any) {
        console.error("Profile load failed", e);
        toast.error(translateError(e, "Ошибка загрузки кабинета"));
      } finally {
        setLoading(false);
      }
    })();
  }, [nav]);

  const messageIdError = useMemo(() => {
    if (!username.trim()) return "Укажите ID для сообщений.";
    if (!USERNAME_RE.test(username)) return "ID: a-z, 0-9, _, 3–30 символов.";
    return "";
  }, [username]);

  const saveProfile = async () => {
    if (messageIdError) { toast.error(messageIdError); return; }
    if (displayName.trim().length < 2) { toast.error("Имя слишком короткое"); return; }
    setBusy(true);
    const normalizedUsername = username.trim().toLowerCase();
    const { data: clash } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("username", normalizedUsername)
      .neq("user_id", me.id)
      .maybeSingle();
    if (clash) {
      setBusy(false);
      toast.error("Этот ID уже занят");
      return;
    }

    const payload = {
      display_name: displayName.trim(),
      username: normalizedUsername,
      bio: bio.trim() || null,
      avatar_url: profile?.avatar_url ?? me.user_metadata?.avatar_url ?? me.user_metadata?.picture ?? null,
    };

    const { error } = await supabase.from("profiles").upsert({ user_id: me.id, email: me.email, ...payload }, { onConflict: "user_id" });
    setBusy(false);
    if (error) toast.error(translateError(error));
    else {
      setProfile((prev: any) => ({ ...prev, ...payload, user_id: me.id, email: me.email }));
      toast.success("Профиль сохранён");
    }
  };

  const uploadAvatar = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { toast.error("Файл больше 5 МБ"); return; }
    setBusy(true);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${me.id}/avatar.${ext}`;
    await supabase.storage.from("avatars").remove([path]);
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { setBusy(false); toast.error(translateError(error)); return; }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: e2 } = await supabase.from("profiles").upsert({
      user_id: me.id,
      email: me.email,
      display_name: displayName.trim() || profile?.display_name || me.email,
      username: username.trim().toLowerCase(),
      bio: bio.trim() || null,
      avatar_url: pub.publicUrl,
    }, { onConflict: "user_id" });
    setBusy(false);
    if (e2) toast.error(translateError(e2));
    else {
      setProfile((prev: any) => ({ ...prev, avatar_url: `${pub.publicUrl}?t=${Date.now()}` }));
      toast.success("Аватар обновлён");
    }
  };

  const reauth = async () => {
    if (!supportsPasswordActions) {
      toast.error("Для Google-аккаунта смена почты и пароля управляется через Google");
      return false;
    }
    if (!curPw) { toast.error("Введите текущий пароль"); return false; }
    const { error } = await supabase.auth.signInWithPassword({ email: me.email, password: curPw });
    if (error) { toast.error("Текущий пароль неверный"); return false; }
    return true;
  };

  const changeEmail = async () => {
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) { toast.error("Некорректный email"); return; }
    setBusy(true);
    if (!(await reauth())) { setBusy(false); return; }
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setBusy(false);
    if (error) toast.error(translateError(error));
    else { toast.success("Письмо для подтверждения отправлено на новый адрес"); setNewEmail(""); setCurPw(""); }
  };

  const changePassword = async () => {
    if (!PASSWORD_RE.test(newPw)) { toast.error("Пароль: 8–72 символа, буква и цифра"); return; }
    setBusy(true);
    if (!(await reauth())) { setBusy(false); return; }
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setBusy(false);
    if (error) toast.error(translateError(error));
    else { toast.success("Пароль обновлён"); setNewPw(""); setCurPw(""); }
  };

  const copyId = async () => {
    await navigator.clipboard.writeText(username.trim().toLowerCase());
    toast.success("ID для сообщений скопирован");
  };

  const logout = async () => { await supabase.auth.signOut(); nav("/"); };

  if (loading) return <div className="container py-32 text-center text-muted-foreground">Загрузка...</div>;

  const initials = (displayName || me.email).slice(0, 2).toUpperCase();
  const avatarSrc = profile?.avatar_url || me.user_metadata?.avatar_url || me.user_metadata?.picture || undefined;

  return (
    <>
      <PageHero eyebrow="Личный кабинет" title="Мой профиль" />
      <section className="py-12">
        <div className="container max-w-3xl space-y-6">
          <BackButton fallbackTo="/" />
          <Card className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="flex w-full flex-col items-center gap-2 sm:w-auto">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
                <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={busy}>
                  <Upload className="h-3 w-3" /> Загрузить
                </Button>
              </div>
              <div className="flex-1 space-y-3 w-full">
                <div className="text-sm">
                  <Label>ID для сообщений</Label>
                  <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                    <Input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} className="font-mono text-sm" maxLength={30} />
                    <Button size="icon" variant="outline" onClick={copyId}><Copy className="h-4 w-4" /></Button>
                  </div>
                  <p className="mt-1 break-words text-xs text-muted-foreground">{messageIdError || "Этот ID пользователь указывает сам. По нему его можно найти в сообщениях."}</p>
                </div>
                <div><Label>Имя</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={80} /></div>
                <div><Label>О себе</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} rows={3} /></div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={saveProfile} disabled={busy} variant="wine">Сохранить</Button>
                  <Button asChild variant="outline"><Link to="/messages"><MessageSquare className="h-4 w-4" /> Сообщения</Link></Button>
                  <Button asChild variant="outline"><Link to="/my-applications"><FileText className="h-4 w-4" /> Заявки</Link></Button>
                  <Button onClick={logout} variant="ghost"><LogOut className="h-4 w-4" /> Выйти</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="font-display text-xl">Безопасность</h2>
            <p className="text-sm text-muted-foreground">Email: <strong className="text-foreground">{me.email}</strong></p>
            {!supportsPasswordActions ? (
              <p className="text-sm text-muted-foreground">Вы вошли через Google. Почта и пароль управляются в аккаунте Google, а на сайте вы уже считаетесь зарегистрированным пользователем.</p>
            ) : (
              <>
                <div>
                  <Label>Текущий пароль (требуется для смены)</Label>
                  <Input type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Новый email</Label>
                    <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@example.com" />
                    <Button size="sm" onClick={changeEmail} disabled={busy}>Сменить email</Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Новый пароль</Label>
                    <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                    <Button size="sm" onClick={changePassword} disabled={busy}>Сменить пароль</Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </section>
    </>
  );
};
export default Profile;
