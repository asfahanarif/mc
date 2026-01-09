import Link from "next/link";
import { navLinks } from "@/lib/data";
import { Logo } from "../shared/logo";
import { InstagramIcon } from "../icons/instagram";
import { YoutubeIcon } from "../icons/youtube";
import { WhatsAppIcon } from "../icons/whatsapp";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerLinks = navLinks.filter(l => !['Home', 'Donate'].includes(l.label));
  const socialLinks = [
    { name: "WhatsApp", href: "https://chat.whatsapp.com/ErUV6XUaWyq6xml6k6eKfE", icon: WhatsAppIcon },
    { name: "Instagram", href: "https://www.instagram.com/muslimahsclub", icon: InstagramIcon },
    { name: "YouTube", href: "https://www.youtube.com/@muslimahsclub", icon: YoutubeIcon },
  ]

  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <Link href="/" className="mb-4">
                    <Logo className="!h-24 !w-24" />
                </Link>
                <p className="text-muted-foreground text-sm">Empowering Muslimahs Through Qur'an & Sunnah!</p>
            </div>
             <div className="md:col-span-2">
                <h3 className="font-headline text-lg font-semibold text-primary mb-4 text-center md:text-left">Quick Links</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center md:text-left">
                    {footerLinks.map(link => (
                        <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-headline text-lg font-semibold text-primary mb-4 text-center md:text-left">Follow Us</h3>
                <div className="flex justify-center md:justify-start items-center gap-4">
                    {socialLinks.map(link => (
                        <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name} className="group">
                           <link.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:scale-110" />
                        </a>
                    ))}
                </div>
            </div>
        </div>
      </div>
      <div className="bg-background/50 border-t">
        <div className="container py-4 text-center text-sm text-muted-foreground">
            <p>&copy; {currentYear} Muslimahs Club | All rights reserved.</p>
            <p>
                Powered by <a href="https://asfahanarif.vercel.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AxN</a>
            </p>
        </div>
      </div>
    </footer>
  );
}
