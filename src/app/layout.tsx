
import type { Metadata } from "next";
import { FirebaseClientProvider } from "@/firebase";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { FloatingDonateButton } from "@/components/shared/floating-donate-button";
import "./globals.css";
import { DialogProvider } from "@/components/providers/dialog-provider";

export const metadata: Metadata = {
  title: "Muslimahs Club",
  description: "Empowering Women Through Qur'an & Sunnah!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=WindSong:wght@400&display=swap" rel="stylesheet" />
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
                <Footer />
              </div>
              <Toaster />
              <ScrollToTop />
              <FloatingDonateButton />
            </DialogProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
