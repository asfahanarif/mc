import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container py-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} MuslimahSphere. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="https://chat.whatsapp.com/ErUV6XUaWyq6xml6k6eKfE" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <WhatsAppIcon className="h-6 w-6 text-green-600 hover:text-green-700 transition-colors" />
          </a>
          <a href="https://www.instagram.com/muslimahsclub" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
          </a>
          <a href="https://www.youtube.com/@muslimahsclub" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <Youtube className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  );
}
