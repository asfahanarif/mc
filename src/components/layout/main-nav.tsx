
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/data";

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-1 lg:space-x-2">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "relative py-2 text-sm font-medium rounded-full transition-colors",
            link.label === 'Donate' 
                ? "btn-primary-gradient hover:opacity-90 px-5" 
                : "hover:text-primary px-3",
            pathname === link.href && link.label !== 'Donate' ? "text-primary" : link.label !== 'Donate' ? "text-foreground/70" : "",
            "after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300",
            pathname === link.href && link.label !== 'Donate' && "after:w-4"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
