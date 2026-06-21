export async function sendSMSNotification(order: {
  id: string;
  customer: { name: string; phone?: string | null };
  items: Array<{ product: { title: string; weaver: { user: { phone?: string | null } } } }>;
  totalAmount: { toString(): string };
}): Promise<void> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || !templateId) return;

  // Collect unique weaver phone numbers from the order items
  const weaverPhones = [
    ...new Set(
      order.items
        .map((i) => i.product.weaver.user.phone)
        .filter(Boolean) as string[]
    ),
  ];

  const message = `New order #${order.id} received on IKAT CONNECT. Customer: ${order.customer.name}. Amount: ₹${order.totalAmount.toString()}. Login to your dashboard to process the order.`;

  await Promise.allSettled(
    weaverPhones.map((phone) =>
      fetch("https://api.msg91.com/api/v5/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authkey: authKey,
        },
        body: JSON.stringify({
          template_id: templateId,
          mobile: phone.replace(/\D/g, ""),
          message,
        }),
      })
    )
  );
}
