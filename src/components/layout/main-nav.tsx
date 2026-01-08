"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/data";
import { ThemeToggle } from "../shared/theme-toggle";

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-1 lg:space-x-2">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "px-3 py-2 text-sm font-medium rounded-full transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === link.href ? "bg-accent text-accent-foreground" : "text-foreground/70"
          )}
        >
          {link.label}
        </Link>
      ))}
      <ThemeToggle />
    </nav>
  );
}
