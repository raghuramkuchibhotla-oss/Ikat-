"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { appendOrderToSheets } from "@/lib/sheets";
import { sendSMSNotification } from "@/lib/notifications";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

function serialize(v: unknown) { return JSON.parse(JSON.stringify(v)); }

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Address {
  line1: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export async function createOrder(
  cartItems: CartItem[],
  address: Address,
  razorpayOrderId: string,
  paymentStatus: "PENDING" | "PAID" = "PENDING"
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await db.order.create({
    data: {
      customerId: session.id,
      razorpayOrderId,
      totalAmount,
      paymentStatus,
      shippingAddress: address as any,
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      },
    },
    include: {
      customer: true,
      items: { include: { product: { include: { weaver: { include: { user: true } } } } } },
    },
  });

  await Promise.all(
    cartItems.map((item) =>
      db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    )
  );

  await db.cartItem.deleteMany({ where: { userId: session.id } });

  appendOrderToSheets(order as any)
    .then((sheetsRowId) =>
      db.order.update({ where: { id: order.id }, data: { sheetsRowId } })
    )
    .catch(console.error);

  sendSMSNotification(order as any).catch(console.error);
  sendOrderConfirmationEmail({
    id: order.id,
    customer: { name: order.customer.name, email: order.customer.email },
    items: order.items.map((i: any) => ({
      product: { title: i.product.title },
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
    totalAmount: order.totalAmount,
    paymentStatus: order.paymentStatus,
  }).catch(console.error);

  revalidatePath("/orders");
  revalidatePath("/checkout");
  return { orderId: order.id };
}

export async function getMyOrders() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const data = await db.order.findMany({
    where: { customerId: session.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return serialize(data);
}

export async function getWeaverOrders() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const weaver = await db.weaver.findFirst({ where: { userId: session.id } });
  if (!weaver) return [];

  const data = await db.order.findMany({
    where: { items: { some: { product: { weaverId: weaver.id } } } },
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return serialize(data);
}

export async function getAllOrders() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const data = await db.order.findMany({
    include: {
      customer: true,
      items: { include: { product: { include: { weaver: { include: { user: true } } } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return serialize(data);
}

export async function updateOrderStatus(
  orderId: string,
  status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const updated = await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/sheets-sim");
  revalidatePath("/weaver/orders");
  revalidatePath("/orders");
  return serialize(updated);
}
