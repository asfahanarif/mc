"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../shared/theme-toggle";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="flex flex-col h-full">
            <Link href="/" className="mb-8" onClick={() => setIsOpen(false)}>
                <span className="font-bold font-headline text-2xl">MuslimahSphere</span>
            </Link>
            <nav className="flex flex-col gap-4 flex-grow">
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                    "text-lg font-medium",
                    pathname === link.href ? "text-primary" : "text-foreground/70 hover:text-foreground"
                )}
                >
                {link.label}
                </Link>
            ))}
            </nav>
            <div className="mt-auto">
                <ThemeToggle />
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
