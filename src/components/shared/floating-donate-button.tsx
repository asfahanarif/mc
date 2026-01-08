"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function FloatingDonateButton() {
    const isMobile = useIsMobile();

    if (!isMobile) {
        return null;
    }

    return (
        <div className="fixed bottom-2 right-4 z-50 md:hidden">
            <Button asChild size="lg" className="rounded-full shadow-lg group transition-all duration-300 ease-in-out hover:scale-105">
                <Link href="/donate">
                    Donate
                </Link>
            </Button>
        </div>
    );
}
