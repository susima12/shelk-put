import { Link } from "@/lib/router-compat";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo.png";
import { Ornament } from "@/components/ui/ornament";

export const Footer = () => {
  return (
    <footer
      className="relative mt-24 text-[hsl(40_30%_92%)] bg-gradient-dark"
    >
      {/* Декоративная верхняя полоса */}
      <div className="h-1 bg-gradient-gold" />
      <div className="container pt-10">
        <Ornament />
      </div>

      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Шёлковый путь" className="h-11 w-11" />
            <div className="leading-tight">
              <div className="font-display text-xl text-[hsl(40_75%_70%)]">
                Шёлковый путь
              </div>
              <div className="font-marcellus text-[10px] uppercase tracking-[0.22em] text-[hsl(40_30%_75%)]">
                Фестиваль-конкурс · 2026
              </div>
            </div>
          </div>
          <p className="text-sm text-[hsl(40_25%_85%)] leading-relaxed">
            Международный фестиваль детского и юношеского творчества.
            АНО «Шёлковый путь», г. Оренбург. Основан в 2010 году.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg text-[hsl(40_75%_70%)] mb-4">
            Фестиваль
          </h4>
          <ul className="space-y-2.5 text-sm text-[hsl(40_25%_88%)]">
            <li><Link to="/about" className="hover:text-[hsl(40_75%_70%)] transition-silk">О фестивале</Link></li>
            <li><Link to="/history" className="hover:text-[hsl(40_75%_70%)] transition-silk">История</Link></li>
            <li><Link to="/competitions" className="hover:text-[hsl(40_75%_70%)] transition-silk">Конкурсы</Link></li>
            <li><Link to="/master-classes" className="hover:text-[hsl(40_75%_70%)] transition-silk">Мастер-классы</Link></li>
            <li><Link to="/jury" className="hover:text-[hsl(40_75%_70%)] transition-silk">Жюри</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-[hsl(40_75%_70%)] mb-4">
            Участникам
          </h4>
          <ul className="space-y-2.5 text-sm text-[hsl(40_25%_88%)]">
            <li><Link to="/apply" className="hover:text-[hsl(40_75%_70%)] transition-silk">Подать заявку</Link></li>
            <li><Link to="/payment" className="hover:text-[hsl(40_75%_70%)] transition-silk">Оплата и реквизиты</Link></li>
            <li><Link to="/partners" className="hover:text-[hsl(40_75%_70%)] transition-silk">Партнёры</Link></li>
            <li><Link to="/contacts" className="hover:text-[hsl(40_75%_70%)] transition-silk">Контакты</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-[hsl(40_75%_70%)] mb-4">
            Контакты
          </h4>
          <ul className="space-y-3 text-sm text-[hsl(40_25%_88%)]">
            <li className="flex gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-[hsl(40_75%_70%)] shrink-0" />
              <span>460035, г. Оренбург,<br />ул. Мичурина, 4</span>
            </li>
            <li className="flex gap-2">
              <Mail className="h-4 w-4 mt-0.5 text-[hsl(40_75%_70%)] shrink-0" />
              <a href="mailto:zayavka@shelk-put.com" className="hover:text-[hsl(40_75%_70%)] transition-silk">
                zayavka@shelk-put.com
              </a>
            </li>
            <li className="flex gap-2">
              <Phone className="h-4 w-4 mt-0.5 text-[hsl(40_75%_70%)] shrink-0" />
              <a href="tel:+73532703162" className="hover:text-[hsl(40_75%_70%)] transition-silk">
                +7 (3532) 70-31-62
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[hsl(40_30%_92%/0.12)]">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[hsl(40_25%_75%)]">
          <span>© {new Date().getFullYear()} АНО «Шёлковый путь». Все права защищены.</span>
          <span className="font-marcellus uppercase tracking-[0.22em]">Международный фестиваль · 2026</span>
        </div>
      </div>
    </footer>
  );
};
