import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface LogoProps {
  onClick?: () => void;
}

export default function Logo({ onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="group flex items-center gap-2"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 transition-colors group-hover:bg-zinc-700">
        <ShoppingBag className="h-5 w-5 text-green-500" />
      </div>

      <span className="text-lg font-bold tracking-wide text-zinc-100">
        GLASS<span className="text-green-500">IFY</span>
      </span>
    </Link>
  );
}