import * as React from "react";

export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        // glass / border that respects dark mode
        "rounded-2xl border shadow-sm card-text",
        "border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70",
        "dark:border-gray-800 dark:bg-gray-900/60 supports-[backdrop-filter]:dark:bg-gray-900/50",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
