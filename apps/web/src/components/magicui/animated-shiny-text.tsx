import { ComponentPropsWithoutRef, CSSProperties, FC } from "react";

import { cn } from "@/web/lib/utils";

export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "mx-auto max-w-md text-purple-700/70 dark:text-purple-400/70",

        // Shine effect
        "bg-clip-text bg-no-repeat [background-size:var(--shiny-width)_100%] [animation:shiny-text_4s_linear_infinite]",

        // Shine gradient
        "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80",

        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
