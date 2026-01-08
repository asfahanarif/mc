import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-32 w-32 md:h-40 md:w-40 transition-transform duration-300 hover:scale-105 rounded-full overflow-hidden", className)}>
      <Image
        src="https://i.ibb.co/5g03Zq7C/MC-logo.png"
        alt="Muslimahs Club Logo"
        layout="fill"
        className="object-cover"
        priority
      />
    </div>
  );
}
