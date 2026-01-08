
import Link from "next/link";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { InstagramIcon } from "../icons/instagram";
import { YoutubeIcon } from "../icons/youtube";
import { WhatsAppIcon } from "../icons/whatsapp";
import { Logo } from "../shared/logo";
import { Button } from "../ui/button";

const TopBar = () => (
  <div className="bg-black text-white h-10 items-center hidden md:flex">
    <div className="container flex justify-between items-center">
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium">Join Sister Community!</p>
        <Button asChild variant="ghost" className="h-auto p-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm gap-2 px-3">
          <a href="https://chat.whatsapp.com/ErUV6XUaWyq6xml6k6eKfE" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <WhatsAppIcon className="h-5 w-5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </Button>
      </div>
      <div className="flex items-center gap-2">
         <a href="https://www.instagram.com/muslimahsclub" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-80 transition-opacity">
            <InstagramIcon className="h-7 w-7" />
         </a>
         <a href="https://www.youtube.com/@muslimahsclub" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:opacity-80 transition-opacity">
           <YoutubeIcon className="h-7 w-7" />
         </a>
      </div>
    </div>
  </div>
);

export default function Header() {
  return (
    <header className="w-full">
      <TopBar />
      <div className="sticky top-0 z-50 py-2 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-center">
          <div className="w-full md:w-[80%] lg:w-[70%] bg-background/95 backdrop-blur-sm rounded-full border shadow-sm px-6 flex items-center justify-between h-full">
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
      </div>
    </header>
  );
}
