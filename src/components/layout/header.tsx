import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { Instagram, Youtube } from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp";
import { Logo } from "../shared/logo";

const TopBar = () => (
  <div className="bg-black text-white h-10 flex items-center">
    <div className="container flex justify-between items-center">
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium">Join Sister Community!</p>
        <a href="https://chat.whatsapp.com/ErUV6XUaWyq6xml6k6eKfE" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="bg-green-600 hover:bg-green-700 text-white rounded-full p-1.5">
          <WhatsAppIcon className="h-4 w-4" />
        </a>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3">
          <a href="https://www.instagram.com/muslimahsclub" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors">
             <Instagram className="h-5 w-5" />
          </a>
          <a href="https://www.youtube.com/@muslimahsclub" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-primary transition-colors">
            <Youtube className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <TopBar />
      <div className="container flex h-20 items-center justify-center">
        <div className="w-full md:w-[80%] lg:w-[70%] bg-background/80 backdrop-blur-sm rounded-full border shadow-sm px-6 flex items-center justify-between">
           <Link href="/" className="flex items-center">
                <Logo className="!h-12 !w-auto" />
            </Link>
          <div className="hidden md:block">
            <MainNav />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
