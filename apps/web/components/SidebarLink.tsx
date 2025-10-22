"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function SidebarLink({ href, children, className = "" }: Props) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      data-active={active ? "true" : "false"}
      className={[
        "block rounded-xl px-3 py-2 text-sm transition",
        "text-gray-700 hover:bg-gray-100",
        "dark:text-gray-300 dark:hover:bg-gray-800",
        "data-[active=true]:bg-gray-100 data-[active=true]:font-semibold",
        "data-[active=true]:dark:bg-gray-800",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
