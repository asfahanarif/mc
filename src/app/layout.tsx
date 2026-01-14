
'use client';

import { FirebaseClientProvider } from "@/firebase";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { FloatingDonateButton } from "@/components/shared/floating-donate-button";
import "./globals.css";
import { DialogProvider } from "@/components/providers/dialog-provider";
import { PwaInstallBanner } from "@/components/pwa/pwa-install-banner";
import { QuranSettingsProvider } from "@/components/quran/quran-settings-provider";
import { ConditionalFooter } from "@/components/layout/conditional-footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Muslimahs Club</title>
        <meta name="description" content="Empowering Women Through Qur'an & Sunnah!" />
        <link rel="icon" href="https://i.ibb.co/5g03Zq7C/MC-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cairo:wght@400;700&family=Cormorant+Garamond:wght@300;400;500;600;700&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Lato:ital,wght@0,400;0,700;1,400&family=Lateef:wght@400;700&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Qalam:wght@300;400;700&family=Roboto:wght@400;500;700&family=Scheherazade+New:wght@400;700&family=Tajawal:wght@400;700&family=WindSong:wght@400&display=swap" rel="stylesheet" />
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
              <QuranSettingsProvider>
                <div id="root-container" className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <ConditionalFooter />
                </div>
                <Toaster />
                
                <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
                  <ScrollToTop />
                  <FloatingDonateButton />
                </div>

                <PwaInstallBanner />
              </QuranSettingsProvider>
            </DialogProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
