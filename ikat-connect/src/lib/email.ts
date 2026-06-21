import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

interface OrderEmailData {
  id: string;
  customer: { name: string; email: string };
  items: Array<{
    product: { title: string };
    quantity: number;
    unitPrice: { toString(): string };
  }>;
  totalAmount: { toString(): string };
  paymentStatus: string;
}

export async function sendOrderConfirmationEmail(order: OrderEmailData): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const fromName = "IKAT CONNECT";
  const fromAddr = process.env.SMTP_USER!;
  const orderRef = order.id.slice(0, 16).toUpperCase();

  const itemRows = order.items
    .map((i) => {
      const subtotal = Number(i.unitPrice.toString()) * i.quantity;
      return `<tr style="border-bottom:1px solid #292524;">
        <td style="padding:8px 4px;color:#e7e5e4;">${i.product.title}</td>
        <td style="padding:8px 4px;text-align:center;color:#a8a29e;">×${i.quantity}</td>
        <td style="padding:8px 4px;text-align:right;color:#C9883A;">₹${subtotal.toLocaleString("en-IN")}</td>
      </tr>`;
    })
    .join("");

  const textBody = `
Hi ${order.customer.name},

Your order has been confirmed!

Order ID: ${orderRef}
Payment: ${order.paymentStatus}

Items:
${order.items.map((i) => `  • ${i.product.title} ×${i.quantity}  ₹${(Number(i.unitPrice.toString()) * i.quantity).toLocaleString("en-IN")}`).join("\n")}

Total: ₹${Number(order.totalAmount.toString()).toLocaleString("en-IN")}

Estimated delivery: 7–14 business days.
Track your order at ikatconnect.in/orders

Thank you for supporting authentic Ikat weavers!
— IKAT CONNECT Team
  `.trim();

  const htmlBody = `
<div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:600px;margin:0 auto;background:#0c0a09;color:#F2E8D5;padding:36px 28px;border-radius:16px;">
  <p style="color:#C9883A;font-size:13px;font-weight:600;letter-spacing:.08em;margin:0 0 12px;">IKAT CONNECT</p>
  <h1 style="color:#ffffff;font-size:26px;margin:0 0 8px;">Order Confirmed!</h1>
  <p style="color:#a8a29e;margin:0 0 28px;">Hi ${order.customer.name}, your order is confirmed and will be dispatched soon.</p>

  <div style="background:#1c1917;border-radius:10px;padding:16px;margin-bottom:24px;">
    <p style="color:#78716c;font-size:11px;text-transform:uppercase;letter-spacing:.08em;margin:0 0 4px;">Order ID</p>
    <p style="color:#C9883A;font-family:monospace;font-size:14px;margin:0;">${orderRef}</p>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    <thead>
      <tr style="border-bottom:1px solid #292524;">
        <th style="text-align:left;padding:8px 4px;color:#78716c;font-size:11px;text-transform:uppercase;letter-spacing:.05em;font-weight:500;">Product</th>
        <th style="text-align:center;padding:8px 4px;color:#78716c;font-size:11px;text-transform:uppercase;letter-spacing:.05em;font-weight:500;">Qty</th>
        <th style="text-align:right;padding:8px 4px;color:#78716c;font-size:11px;text-transform:uppercase;letter-spacing:.05em;font-weight:500;">Price</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <div style="border-top:2px solid #292524;padding-top:16px;text-align:right;margin-bottom:28px;">
    <span style="color:#a8a29e;font-size:14px;">Total: </span>
    <strong style="color:#C9883A;font-size:20px;">₹${Number(order.totalAmount.toString()).toLocaleString("en-IN")}</strong>
  </div>

  <div style="background:#1c1917;border-radius:10px;padding:16px;margin-bottom:24px;">
    <p style="color:#78716c;font-size:12px;margin:0 0 4px;">Estimated Delivery</p>
    <p style="color:#e7e5e4;font-size:14px;margin:0;">7–14 business days</p>
  </div>

  <p style="color:#57534e;font-size:12px;line-height:1.6;margin:0;">
    Every purchase directly supports a verified Pochampally weaver. Thank you for choosing authentic handloom Ikat.
  </p>
</div>
  `.trim();

  await transporter.sendMail({
    from: `${fromName} <${fromAddr}>`,
    to: order.customer.email,
    subject: `Order Confirmed — ${orderRef} | IKAT CONNECT`,
    text: textBody,
    html: htmlBody,
  });
}
