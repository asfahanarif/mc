
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { InstagramIcon } from "@/components/icons/instagram";
import { YoutubeIcon } from "@/components/icons/youtube";
import { ArrowUpRight } from "lucide-react";

const socialLinks = [
    {
      name: "WhatsApp",
      href: "https://wa.me/923194468547",
      icon: WhatsAppIcon,
      handle: "+92 319 4468547",
      cta: "Message Us",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/muslimahsclub",
      icon: InstagramIcon,
      handle: "@muslimahsclub",
      cta: "Follow Us",
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@muslimahsclub",
      icon: YoutubeIcon,
      handle: "Muslimahs Club",
      cta: "Subscribe",
    },
];

export function SocialCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {socialLinks.map((link) => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="group">
                    <Card className="h-full text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                        <CardContent className="pt-8">
                           <link.icon className="h-16 w-16 mx-auto text-primary transition-transform duration-300 group-hover:scale-110" />
                            <h3 className="mt-4 text-2xl font-headline font-semibold text-primary">{link.name}</h3>
                            <p className="mt-1 text-muted-foreground">{link.handle}</p>
                            <p className="mt-4 font-semibold text-foreground/80 flex items-center justify-center gap-1 group-hover:text-primary">
                                {link.cta} <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </p>
                        </CardContent>
                    </Card>
                </a>
            ))}
        </div>
    );
}
