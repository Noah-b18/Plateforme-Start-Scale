"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function Nav() {
  const pathname = usePathname();
  const base = "font-medium transition-colors p-2 rounded-lg";
  const active = "text-blue-600";
  const inactive = "text-black hover:text-blue-600 hover:bg-black/5";

  return (
    <nav className="flex gap-9">
      <Link href="/dashboard" className={clsx(base, pathname === "/dashboard" ? active : inactive)}>Dashboard</Link>

      <Link href="/modules" className={clsx(base, pathname === "/modules" ? active : inactive)}>Modules</Link>

      <Link href="/calls" className={clsx(base, pathname === "/call" ? active : inactive)}>Call</Link>

      <Link href="/packs" className={clsx(base, pathname === "/packs" ? active : inactive)}>Packs</Link>
    </nav>
  );
}