"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDialog } from "../providers/dialog-provider";

export function FloatingDonateButton() {
    const isMobile = useIsMobile();
    const { setOpen } = useDialog();

    if (!isMobile) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 md:hidden">
            <Button size="lg" className="rounded-full shadow-lg group transition-all duration-300 ease-in-out hover:scale-105" onClick={() => setOpen(true)}>
                Donate
            </Button>
        </div>
    );
}
