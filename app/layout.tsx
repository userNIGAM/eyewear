import Navbar from "@/components/layout/navbar/navbar";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            {children}
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
