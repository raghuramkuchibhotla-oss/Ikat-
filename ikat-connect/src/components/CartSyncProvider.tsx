"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useSession } from "@/providers/session-provider";
import { syncCartToDb } from "@/actions/cart";

export function CartSyncProvider() {
  const { user } = useSession();
  const items = useCartStore((s) => s.items);
  const mountedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (!user) return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      syncCartToDb(
        items.map((i) => ({ productId: i.product.id, quantity: i.quantity }))
      ).catch(console.error);
    }, 600);

    return () => clearTimeout(timerRef.current);
  }, [items, user?.id]);

  return null;
}
