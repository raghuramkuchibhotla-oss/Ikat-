import { Webhook } from "svix";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let evt: any;

  try {
    evt = wh.verify(payload, headers);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (evt.type === "user.created") {
    await db.user.create({
      data: {
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0]?.email_address ?? null,
        phone: evt.data.phone_numbers[0]?.phone_number ?? null,
        name: `${evt.data.first_name ?? ""} ${evt.data.last_name ?? ""}`.trim() || "User",
        role: evt.data.public_metadata?.role ?? "CUSTOMER",
      },
    });
  }

  if (evt.type === "user.updated") {
    await db.user.update({
      where: { clerkId: evt.data.id },
      data: {
        email: evt.data.email_addresses[0]?.email_address ?? null,
        phone: evt.data.phone_numbers[0]?.phone_number ?? null,
        name: `${evt.data.first_name ?? ""} ${evt.data.last_name ?? ""}`.trim() || "User",
        role: evt.data.public_metadata?.role ?? "CUSTOMER",
      },
    });
  }

  return NextResponse.json({ received: true });
}
