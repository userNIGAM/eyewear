import { ReactNode } from "react";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100">
      {children}
    </div>
  );
}
