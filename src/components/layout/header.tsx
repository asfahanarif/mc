
import Link from "next/link";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { Logo } from "../shared/logo";
import { Button } from "../ui/button";
import { InstagramIcon } from "../icons/instagram";
import { YoutubeIcon } from "../icons/youtube";
import { WhatsAppIcon } from "../icons/whatsapp";
import { ThemeToggle } from "../shared/theme-toggle";

const socialLinks = [
  { name: "WhatsApp", href: "https://chat.whatsapp.com/ErUV6XUaWyq6xml6k6eKfE", icon: WhatsAppIcon },
  { name: "Instagram", href: "https://www.instagram.com/muslimahsclub", icon: InstagramIcon },
  { name: "YouTube", href: "https://www.youtube.com/@muslimahsclub", icon: YoutubeIcon },
]

const NavBar = () => (
  <div className="container flex h-20 items-center justify-between">
      <Link href="/" className="flex items-center">
          <Logo className="!h-16 !w-auto" />
      </Link>
      <div className="hidden md:block">
        <MainNav />
      </div>
      <div className="hidden md:flex items-center gap-2">
        {socialLinks.map(link => (
          <Button asChild key={link.name} variant="ghost" size="icon">
            <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name} className="group">
              <link.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all" />
            </a>
          </Button>
        ))}
        <ThemeToggle />
      </div>
      <div className="md:hidden">
        <MobileNav />
      </div>
  </div>
);


export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <NavBar />
    </header>
  );
}
