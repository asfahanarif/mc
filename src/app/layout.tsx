'use client';

import { FirebaseClientProvider } from "@/firebase";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { FloatingDonateButton } from "@/components/shared/floating-donate-button";
import "./globals.css";
import { DialogProvider } from "@/components/providers/dialog-provider";
import { usePathname } from "next/navigation";
import { PwaInstallBanner } from "@/components/pwa/pwa-install-banner";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Muslimahs Club</title>
        <meta name="description" content="Empowering Women Through Qur'an & Sunnah!" />
        <link rel="icon" href="https://i.ibb.co/5g03Zq7C/MC-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=WindSong:wght@400&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FAF8F5" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <DialogProvider>
              <div id="root-container" className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                {!isAdminPage && <Footer />}
              </div>
              <Toaster />
              
              <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
                <ScrollToTop />
                <FloatingDonateButton />
              </div>

              <PwaInstallBanner />
            </DialogProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
