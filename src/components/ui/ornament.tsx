import { cn } from "@/lib/utils";

/** Восточный орнаментальный разделитель — ромб с лучами и точками */
export const Ornament = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center gap-3 text-gold", className)}>
    <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold/70" />
    <svg width="44" height="22" viewBox="0 0 44 22" fill="none" aria-hidden>
      <circle cx="4" cy="11" r="2" fill="currentColor" />
      <path
        d="M14 11 L22 3 L30 11 L22 19 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="22" cy="11" r="2.2" fill="currentColor" />
      <circle cx="40" cy="11" r="2" fill="currentColor" />
    </svg>
    <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold/70" />
  </div>
);

/** Угловой штамп / печать */
export const SealMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={cn("text-gold", className)}
    fill="none"
    aria-hidden
  >
    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" />
    <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="0.6" />
    <path
      d="M50 18 L60 40 L84 44 L66 60 L72 84 L50 72 L28 84 L34 60 L16 44 L40 40 Z"
      stroke="currentColor"
      strokeWidth="0.8"
      fill="none"
    />
    <circle cx="50" cy="50" r="3" fill="currentColor" />
  </svg>
);

/** Тонкая горизонтальная нить с узором по центру */
export const SilkThread = ({ className }: { className?: string }) => (
  <div className={cn("relative h-6 w-full text-gold", className)} aria-hidden>
    <svg
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-6"
      viewBox="0 0 600 24"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M0 12 Q150 2 300 12 T600 12"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M0 12 Q150 22 300 12 T600 12"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="0.6"
        fill="none"
      />
    </svg>
  </div>
);
