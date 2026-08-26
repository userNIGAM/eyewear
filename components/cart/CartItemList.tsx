"use client";

import { AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import CartItem from "./CartItem";

export default function CartItemList() {
    const { cartItems } = useCart();

    return (
        <div className="lg:col-span-8 space-y-4">
            <AnimatePresence initial={false}>
                {cartItems.map(({ product, quantity }) => (
                    <CartItem
                        key={product.id}
                        product={product}
                        quantity={quantity}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}