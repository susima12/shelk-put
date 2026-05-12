import { ReactNode } from "react";
import { Ornament, SealMark } from "./ornament";

export const PageHero = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
}) => (
  <section
    className="relative bg-gradient-dark text-foreground py-24 md:py-32 -mt-20 pt-44 overflow-hidden"
    style={{ color: "hsl(40 30% 95%)" }}
  >
    <div className="absolute inset-0 opacity-25 bg-gradient-silk" />
    <SealMark className="absolute -right-16 -top-10 w-72 h-72 opacity-15 animate-spin-slow hidden md:block" />
    <SealMark className="absolute -left-20 bottom-0 w-64 h-64 opacity-10 animate-spin-slow hidden md:block" />

    <div className="container relative text-center max-w-3xl">
      {eyebrow && (
        <div className="mb-6">
          <Ornament />
          <span className="block mt-3 font-marcellus text-xs uppercase tracking-[0.32em] text-gold">
            {eyebrow}
          </span>
        </div>
      )}
      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-balance leading-[1.05]">
        {title}
      </h1>
      {description && (
        <p className="mt-6 text-lg md:text-xl opacity-85 text-balance font-light">
          {description}
        </p>
      )}
    </div>
  </section>
);
