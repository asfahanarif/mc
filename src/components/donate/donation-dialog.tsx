"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/components/providers/dialog-provider";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    PayPal?: any;
  }
}

export function DonationDialog() {
  const { isOpen, setOpen } = useDialog();

  useEffect(() => {
    if (isOpen) {
      const script = document.createElement("script");
      script.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js";
      script.charset = "UTF-8";
      script.async = true;

      script.onload = () => {
        if (window.PayPal) {
          const buttonContainer = document.getElementById("donate-button");
          if (buttonContainer && buttonContainer.childElementCount === 0) {
             window.PayPal.Donation.Button({
              env: "production",
              hosted_button_id: "PJA9BBS5T79AU",
              image: {
                src: "https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif",
                alt: "Donate with PayPal button",
                title: "PayPal - The safer, easier way to pay online!",
              },
            }).render("#donate-button");
          }
        }
      };
      
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
        const buttonContainer = document.getElementById("donate-button");
        if (buttonContainer) {
            buttonContainer.innerHTML = "";
        }
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className={cn(
        "sm:max-w-[425px]",
        "bg-transparent border-0 shadow-none",
        "sm:bg-background sm:border sm:shadow-lg"
      )}>
        <div className="bg-background/90 backdrop-blur-lg rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="font-headline text-3xl text-primary text-center">
              Support Our Mission
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Sadaqah Jariyah (Continuous Charity)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-sm text-foreground/80 mb-6">
              Your contribution helps us continue to provide valuable resources and
              a supportive community for women worldwide. May Allah reward you.
            </p>
            <div id="donate-button-container" className="flex justify-center">
              <div id="donate-button"></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
