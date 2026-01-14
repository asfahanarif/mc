
"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "../providers/dialog-provider";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function FloatingDonateButton() {
    const { setOpen } = useDialog();
    const pathname = usePathname();

    const isAdminPage = pathname.startsWith('/admin');
    const isQuranPage = pathname.startsWith('/quran');

    if (isAdminPage || isQuranPage) {
        return null;
    }

    return (
        <Button 
            size="lg" 
            className={cn(
                "rounded-full shadow-lg group transition-all duration-300 ease-in-out hover:scale-105",
                "lg:hidden" // Hide on large screens and up
            )} 
            onClick={() => setOpen(true)}
        >
            Donate
        </Button>
    );
}
