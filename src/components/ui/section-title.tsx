import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Ornament } from "./ornament";

interface SectionTitleProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export const SectionTitle = ({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionTitleProps) => {
  return (
    <div
      className={cn(
        "max-w-3xl mb-14",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <div className={cn("mb-5", align === "left" && "flex items-center justify-start")}>
          {align === "center" ? (
            <>
              <Ornament />
              <span className="block mt-3 font-marcellus text-xs uppercase tracking-[0.3em] text-gold">
                {eyebrow}
              </span>
            </>
          ) : (
            <span className="font-marcellus text-xs uppercase tracking-[0.3em] text-gold flex items-center gap-3">
              <span className="h-px w-10 bg-gold/60" />
              {eyebrow}
            </span>
          )}
        </div>
      )}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-balance leading-[1.05] text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-lg text-muted-foreground text-balance">{description}</p>
      )}
    </div>
  );
};
