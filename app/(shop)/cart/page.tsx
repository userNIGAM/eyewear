"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";

import CartEmpty from "@/components/cart/CartEmpty";
import CartItemList from "@/components/cart/CartItemList";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const {
    cartItems,
    cartTotal,
    cartCount,
  } = useCart();

  const router = useRouter();

  const shippingThreshold = 150;

  const shippingCost =
    cartTotal >= shippingThreshold || cartTotal === 0 ? 0 : 15;

  const estimatedTaxRate = 0.08;
  const estimatedTax = cartTotal * estimatedTaxRate;

  const orderTotal =
    cartTotal + shippingCost + estimatedTax;



  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-zinc-950 min-h-screen text-zinc-100">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-green-500 transition-colors mb-8"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
        Shopping Cart
      </h1>

      <p className="text-zinc-400 text-sm mb-10">
        You have {cartCount} item{cartCount !== 1 && "s"} in your cart.
      </p>

      {cartItems.length === 0 ? (
        <CartEmpty />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <CartItemList />

          <CartSummary
            cartTotal={cartTotal}
            shippingCost={shippingCost}
            estimatedTax={estimatedTax}
            orderTotal={orderTotal}
            shippingThreshold={shippingThreshold}
          />
        </div>
      )}
    </div>
  );
}