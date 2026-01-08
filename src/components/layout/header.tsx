"use client";

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
  { name: "Instagram", href: "https://www.instagram.com/muslimahsclub", icon: InstagramIcon, color: "bg-[#E1306C]" },
  { name: "YouTube", href: "https://www.youtube.com/@muslimahsclub", icon: YoutubeIcon, color: "bg-[#FF0000]" },
]

const TopHeader = () => (
    <div className="bg-black text-white hidden sm:block">
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
                    <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name} className={cn("flex items-center justify-center h-7 w-7 rounded-full", link.color)}>
                        <link.icon className="h-4 w-4 text-white" />
                    </a>
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
                <ThemeToggle />
            </div>
            <div className="md:hidden">
                <MobileNav />
            </div>
        </div>
    </div>
);

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50">
      <TopHeader />
      <div className="py-2">
        <NavBar />
      </div>
    </header>
  );
}
