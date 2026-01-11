import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-40 w-40 md:h-48 md:w-48 transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-full overflow-hidden", className)}>
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

export default Logo;
