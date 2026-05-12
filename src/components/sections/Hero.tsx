import { Link } from "@/lib/router-compat";
import { ArrowRight, Calendar, MapPin, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ornament, SealMark } from "@/components/ui/ornament";

export const Hero = () => {
  return (
    <section className="relative min-h-[94vh] flex items-center -mt-20 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="absolute inset-0 bg-gradient-overlay" />
        {/* soft vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(20,8,12,0.55)_100%)]" />
      </div>

      {/* floating decorative seals */}
      <SealMark className="absolute right-[6%] top-[18%] w-40 h-40 opacity-25 animate-float-slow hidden lg:block" />
      <div className="absolute left-[5%] bottom-[12%] hidden lg:block animate-float-slow" style={{ animationDelay: "2s" }}>
        <SealMark className="w-28 h-28 opacity-20" />
      </div>

      <div className="container relative z-10 pt-28 pb-16 text-center">
        {/* eyebrow */}
        <div className="animate-fade-in-up">
          <Ornament className="!text-gold" />
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="font-script text-2xl text-gold-soft">Сезон 2026</span>
            <span className="h-1 w-1 rounded-full bg-gold/60" />
            <span className="font-marcellus text-[11px] uppercase tracking-[0.32em] text-gold">
              Приём заявок открыт
            </span>
          </div>
        </div>

        <h1
          className="mt-8 font-display text-balance leading-[0.95] animate-fade-in-up"
          style={{ animationDelay: "0.1s", color: "hsl(40 60% 96%)" }}
        >
          <span className="block font-marcellus text-base md:text-lg uppercase tracking-[0.4em] text-gold-soft mb-6">
            XV международный фестиваль-конкурс
          </span>
          <span className="block text-6xl md:text-8xl lg:text-[9rem] font-medium">
            Шёлковый
          </span>
          <span className="block text-6xl md:text-8xl lg:text-[9rem] italic text-gradient-gold -mt-2">
            путь
          </span>
        </h1>

        <p
          className="mt-10 max-w-xl mx-auto text-base md:text-lg leading-relaxed animate-fade-in-up font-light"
          style={{ animationDelay: "0.2s", color: "hsl(40 30% 88%)" }}
        >
          Международный фестиваль детского и юношеского творчества.
          <br />
          <span className="font-script text-xl text-gold-soft">
            музыка · танец · театр · искусство
          </span>
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Button asChild size="xl" variant="festival">
            <Link to="/apply">
              Подать заявку <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outlineGold">
            <Link to="/competitions">10 конкурсов</Link>
          </Button>
        </div>

        <div
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          {[
            { icon: Calendar, label: "Сезон", value: "2026" },
            { icon: Trophy, label: "Номинаций", value: "10 направлений" },
            { icon: MapPin, label: "Финал", value: "Оренбург" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="group flex items-center justify-center gap-3 px-5 py-4 rounded-lg bg-background/10 backdrop-blur-md border border-gold/25 hover:border-gold/50 transition-silk"
            >
              <Icon className="h-5 w-5 text-gold" />
              <div className="text-left" style={{ color: "hsl(40 30% 92%)" }}>
                <div className="font-marcellus text-[10px] uppercase tracking-[0.22em] opacity-70">
                  {label}
                </div>
                <div className="font-display text-lg leading-tight">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center z-10">
        <div className="font-marcellus text-[10px] uppercase tracking-[0.4em] text-gold-soft/70 animate-pulse">
          ↓ Прокрутите ниже
        </div>
      </div>
    </section>
  );
};
