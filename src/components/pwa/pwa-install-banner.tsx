
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { Logo } from '../shared/logo';
import { cn } from '@/lib/utils';

// Define the event type for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallBanner() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(event as BeforeInstallPromptEvent);
      // Show the banner
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }
    // Show the install prompt
    await installPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    // We've used the prompt, and can't use it again, so clear it
    setInstallPrompt(null);
    // Hide the banner
    setIsVisible(false);
  };

  const handleDismissClick = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 w-full p-4 transition-transform duration-500",
        isVisible ? "translate-y-0" : "translate-y-full"
    )}>
        <div className="container mx-auto max-w-4xl">
            <div className="bg-background/80 backdrop-blur-lg border border-border rounded-xl shadow-2xl flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                    <Logo className="!h-12 !w-12" />
                    <div>
                        <h3 className="font-bold font-headline text-primary">Install Muslimahs Club</h3>
                        <p className="text-sm text-muted-foreground">Add our app to your homescreen for quick access.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleInstallClick}>
                        <Download className="mr-2 h-4 w-4" />
                        Install
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleDismissClick}>
                        <X className="h-5 w-5" />
                        <span className="sr-only">Dismiss</span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
