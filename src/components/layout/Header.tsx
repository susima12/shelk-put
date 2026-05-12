import { Link, NavLink, useLocation, useNavigate } from "@/lib/router-compat";
import { useEffect, useState } from "react";
import { Menu, X, LogIn, LogOut, User, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";

const NAV = [
  { to: "/", label: "Главная" },
  { to: "/about", label: "О фестивале" },
  { to: "/history", label: "История" },
  { to: "/competitions", label: "Конкурсы" },
  { to: "/master-classes", label: "Мастер-классы" },
  { to: "/jury", label: "Жюри" },
  { to: "/partners", label: "Партнёры" },
  { to: "/payment", label: "Реквизиты" },
  { to: "/contacts", label: "Контакты" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { pathname } = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const load = async (uid: string | null, mail: string | null) => {
      setEmail(mail);
      if (!uid) { setIsAdmin(false); return; }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    };
    supabase.auth.getSession().then(({ data }) => {
      load(data.session?.user?.id ?? null, data.session?.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      load(sess?.user?.id ?? null, sess?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-silk",
        scrolled
          ? "bg-background/85 backdrop-blur-lg border-b border-border/60 shadow-card"
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Шёлковый путь" className="h-11 w-11 object-contain" />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-xl font-semibold tracking-tight">
              Шёлковый <span className="italic text-gradient-gold">путь</span>
            </span>
            <span className="font-marcellus text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Фестиваль-конкурс · 2026
            </span>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-silk",
                  scrolled
                    ? "text-foreground/75 hover:text-foreground hover:bg-secondary/60"
                    : "text-[hsl(40_30%_90%)] hover:text-[hsl(40_75%_70%)] hover:bg-[hsl(40_20%_90%/0.12)]",
                  isActive &&
                    (scrolled
                      ? "text-primary bg-secondary"
                      : "text-[hsl(345_55%_30%)] bg-[hsl(40_25%_92%)]")
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-3">
          {email ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/messages"><MessageSquare className="h-4 w-4" /> Сообщения</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to={isAdmin ? "/admin" : "/profile"}>
                  <User className="h-4 w-4" /> Кабинет
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" /> Выйти
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/auth"><LogIn className="h-4 w-4" /> Войти</Link>
            </Button>
          )}
          <Button asChild variant="festival" size="sm">
            <Link to="/apply">Подать заявку</Link>
          </Button>
        </div>

        <button
          className="xl:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="xl:hidden bg-[hsl(340_40%_9%/0.96)] backdrop-blur-xl border-t border-gold/20 shadow-elegant">
          <nav className="container flex flex-col py-4 gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2.5 text-base rounded-md font-medium transition-silk",
                    isActive
                      ? "bg-[hsl(40_25%_92%)] text-[hsl(345_55%_30%)]"
                      : "text-[hsl(40_35%_92%)] hover:bg-[hsl(40_20%_90%/0.12)]"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-gold/20 pt-3">
              {email ? (
                <>
                  <Button asChild variant="outline">
                    <Link to="/messages"><MessageSquare className="h-4 w-4" /> Сообщения</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to={isAdmin ? "/admin" : "/profile"}>
                      <User className="h-4 w-4" /> Кабинет
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={logout} className="text-[hsl(40_35%_92%)]">
                    <LogOut className="h-4 w-4" /> Выйти
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline">
                  <Link to="/auth"><LogIn className="h-4 w-4" /> Войти</Link>
                </Button>
              )}
              <Button asChild variant="festival">
                <Link to="/apply">Подать заявку</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
