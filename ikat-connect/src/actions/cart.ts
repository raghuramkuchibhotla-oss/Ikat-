"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getCart() {
  const session = await getSession();
  if (!session) return [];

  return db.cartItem.findMany({
    where: { userId: session.id },
    include: {
      product: {
        include: { weaver: { include: { user: true } } },
      },
    },
    orderBy: { addedAt: "asc" },
  });
}

export async function addToCart(productId: string, quantity: number = 1) {
  const session = await getSession();
  if (!session) throw new Error("Please sign in to add items to cart");

  await db.cartItem.upsert({
    where: { userId_productId: { userId: session.id, productId } },
    create: { userId: session.id, productId, quantity },
    update: { quantity: { increment: quantity } },
  });

  revalidatePath("/checkout");
  revalidatePath("/products");
}

export async function removeFromCart(productId: string) {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");

  await db.cartItem.deleteMany({ where: { userId: session.id, productId } });
  revalidatePath("/checkout");
}

export async function updateCartQuantity(productId: string, quantity: number) {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");

  if (quantity <= 0) {
    await removeFromCart(productId);
    return;
  }

  await db.cartItem.update({
    where: { userId_productId: { userId: session.id, productId } },
    data: { quantity },
  });

  revalidatePath("/checkout");
}

export async function clearCart() {
  const session = await getSession();
  if (!session) return;
  await db.cartItem.deleteMany({ where: { userId: session.id } });
  revalidatePath("/checkout");
}

export async function getCartCount(userId: string): Promise<number> {
  const result = await db.cartItem.aggregate({
    where: { userId },
    _sum: { quantity: true },
  });
  return result._sum.quantity ?? 0;
}

export async function syncCartToDb(items: { productId: string; quantity: number }[]) {
  const session = await getSession();
  if (!session) return;

  await db.cartItem.deleteMany({ where: { userId: session.id } });
  if (items.length > 0) {
    await db.cartItem.createMany({
      data: items.map(({ productId, quantity }) => ({
        userId: session.id,
        productId,
        quantity,
      })),
    });
  }
  revalidatePath("/");
}
