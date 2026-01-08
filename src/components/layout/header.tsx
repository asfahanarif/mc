"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { Logo } from "../shared/logo";
import { Button } from "../ui/button";
import { InstagramIcon } from "../icons/instagram";
import { YoutubeIcon } from "../icons/youtube";
import { WhatsAppIcon } from "../icons/whatsapp";
import { ThemeToggle } from "../shared/theme-toggle";

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/muslimahsclub", icon: InstagramIcon },
  { name: "YouTube", href: "https://www.youtube.com/@muslimahsclub", icon: YoutubeIcon },
]

const TopHeader = () => (
    <div className="bg-black text-white">
        <div className="container flex h-10 items-center justify-center sm:justify-between">
            <div className="flex items-center gap-4">
                <p className="text-sm font-medium">
                    Join our global sisterhood!
                </p>
                <Button asChild variant="ghost" className="h-auto p-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm gap-2 px-3">
                    <a href="https://chat.whatsapp.com/ErUV6XUaWyq6xml6k6eKfE" target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                </Button>
            </div>
            <div className="hidden sm:flex items-center gap-2">
                {socialLinks.map(link => (
                    <Button asChild key={link.name} variant="ghost" size="icon" className="hover:bg-white/20">
                        <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name} className="group">
                            <link.icon className="h-5 w-5 text-white transition-all" />
                        </a>
                    </Button>
                ))}
            </div>
        </div>
    </div>
)

const NavBar = () => (
    <div className="container flex h-16 items-center justify-center">
        <div className="w-full md:w-[80%] lg:w-[70%] bg-background/95 backdrop-blur-sm rounded-full border shadow-sm px-6 flex items-center justify-between h-full">
            <Link href="/" className="flex items-center">
                <Logo className="!h-12 !w-auto" />
            </Link>
            <div className="hidden md:block">
                <MainNav />
            </div>
            <div className="hidden md:flex items-center gap-1">
                 {socialLinks.map(link => (
                    <Button asChild key={link.name} variant="ghost" size="icon">
                        <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                           <link.icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-all" />
                        </a>
                    </Button>
                ))}
                <ThemeToggle />
            </div>
            <div className="md:hidden">
                <MobileNav />
            </div>
        </div>
    </div>
);

export default function Header() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 200) {
          setShow(false);
        } else {
          setShow(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <header className={cn("w-full transition-transform duration-300", !show && "-translate-y-full")}>
      <TopHeader />
      <div className="sticky top-0 z-50 py-2">
        <NavBar />
      </div>
    </header>
  );
}
