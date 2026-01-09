
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";

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
        className="bg-transparent backdrop-blur-md border-0 shadow-none p-0 transition-all duration-500 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        showCloseButton={false}
      >
        <div className="mx-6 mt-20 p-4 bg-background/70 border rounded-xl shadow-lg transition-all duration-300 ease-in-out relative">
            <SheetClose className="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </SheetClose>
            <nav className="flex flex-col gap-4 flex-grow items-center text-center">
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                        "text-lg font-medium relative py-2 px-4 rounded-full",
                        "text-foreground/70 hover:text-primary",
                        pathname === link.href && "text-primary"
                    )}
                    >
                    {link.label}
                    </Link>
                ))}
            </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
