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
      <SheetContent 
        side="top" 
        className="bg-transparent backdrop-blur-md border-0 shadow-none p-0"
      >
        <div className="mx-6 mt-20 p-4 bg-background/70 border rounded-xl shadow-lg">
            <nav className="flex flex-col gap-4 flex-grow items-center text-center">
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                        "text-lg font-medium relative py-1",
                        pathname === link.href ? "text-primary" : "text-foreground/70 hover:text-primary",
                        "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300",
                        pathname === link.href && "after:w-5"
                    )}
                    >
                    {link.label}
                    </Link>
                ))}
            </nav>
            <div className="mt-6 flex justify-center">
                <ThemeToggle />
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
