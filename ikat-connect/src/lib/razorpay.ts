import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export function initiatePayment(options: {
  orderId: string;
  amount: number;
  name: string;
  email: string;
  phone?: string;
}) {
  if (typeof window === "undefined") return;

  const rp = new (window as any).Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    order_id: options.orderId,
    amount: options.amount,
    currency: "INR",
    name: "IKAT CONNECT",
    description: "Authentic Pochampally Ikat",
    prefill: {
      name: options.name,
      email: options.email,
      contact: options.phone ?? "",
    },
    theme: { color: "#1A3A5C" },
  });

  rp.open();
}
