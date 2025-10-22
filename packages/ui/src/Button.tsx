"use client";
import * as React from "react";

type Variant = "default" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

function variantClasses(variant: Variant = "default") {
  switch (variant) {
    case "outline":
      return "border bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800";
    case "ghost":
      return "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800";
    case "destructive":
      return "border-rose-500 bg-rose-600 text-white hover:bg-rose-700 dark:border-rose-600";
    default:
      return "border border-gray-300 bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800";
  }
}

function sizeClasses(size: Size = "md") {
  switch (size) {
    case "sm":
      return "px-3 py-1.5 text-sm rounded-lg";
    case "lg":
      return "px-5 py-3 text-base rounded-2xl";
    default:
      return "px-4 py-2 text-sm rounded-xl";
  }
}

export function Button({
  className = "",
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-700";
  return (
    <button
      className={`${base} ${variantClasses(variant)} ${sizeClasses(size)} ${className}`}
      {...props}
    />
  );
}
