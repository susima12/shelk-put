import { Link, NavLink, useNavigate } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { LogOut, FileText, Users, MessageSquare, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";

const ITEMS = [
  { to: "/admin", label: "Заявки", icon: FileText, end: true },
  { to: "/admin/users", label: "Пользователи", icon: Users, end: false },
  { to: "/admin/chat", label: "Чат", icon: MessageSquare, end: false },
  { to: "/messages", label: "Сообщения", icon: Mail, end: false },
];

export const AdminTopbar = () => {
  const nav = useNavigate();
  const logout = async () => {
    await supabase.auth.signOut();
    nav("/auth");
  };
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/admin" className="flex items-center gap-2">
          <img src={logo} className="h-8 w-8" alt="" />
          <span className="font-display text-lg">Админ-панель</span>
        </Link>
        <nav className="flex items-center gap-1">
          {ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-secondary"
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" /><span className="hidden sm:inline">Выйти</span>
        </Button>
      </div>
    </header>
  );
};
