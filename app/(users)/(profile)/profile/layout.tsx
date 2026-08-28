import { ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">{children}</main>
  );
}
