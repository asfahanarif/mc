
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/data";
import { useDialog } from "../providers/dialog-provider";

export function MainNav() {
  const pathname = usePathname();
  const { setOpen } = useDialog();

  return (
    <nav className="flex items-center space-x-1 lg:space-x-2">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "relative py-2 text-sm font-medium rounded-full transition-colors",
            "hover:text-primary px-3",
            pathname === link.href ? "text-primary" : "text-foreground/70",
            "after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300",
            pathname === link.href && "after:w-4"
          )}
        >
          {link.label}
        </Link>
      ))}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "relative py-2 text-sm font-medium rounded-full transition-colors",
          "bg-primary text-primary-foreground hover:opacity-90 px-5"
        )}
      >
        Donate
      </button>
    </nav>
  );
}
