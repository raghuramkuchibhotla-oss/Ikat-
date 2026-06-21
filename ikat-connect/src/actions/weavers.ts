"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

function serialize(v: unknown) { return JSON.parse(JSON.stringify(v)); }

export async function registerWeaver(data: {
  aadhaarNumber: string;
  location: string;
  bio?: string;
  cooperativeMember?: boolean;
}) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const existingWeaver = await db.weaver.findUnique({ where: { userId: session.id } });
  if (existingWeaver) throw new Error("Weaver profile already exists");

  const count = await db.weaver.count();
  const weaverId = `WVR-${String(count + 1).padStart(4, "0")}`;

  const weaver = await db.weaver.create({
    data: {
      userId: session.id,
      aadhaarNumber: data.aadhaarNumber,
      weaverId,
      location: data.location,
      bio: data.bio,
      cooperativeMember: data.cooperativeMember ?? false,
      status: "PENDING",
    },
  });

  await db.user.update({ where: { id: session.id }, data: { role: "WEAVER" } });

  revalidatePath("/weaver");
  revalidatePath("/admin/weavers");
  return weaver;
}

export async function getMyWeaverProfile() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const data = await db.weaver.findUnique({
    where: { userId: session.id },
    include: { user: true, products: true },
  });
  return serialize(data);
}

export async function getAllWeavers() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const data = await db.weaver.findMany({
    include: { user: true, products: true },
    orderBy: { createdAt: "desc" },
  });
  return serialize(data);
}

export async function getPublicWeavers() {
  const data = await db.weaver.findMany({
    where: { status: "VERIFIED" },
    include: { user: true, products: { select: { id: true } } },
    orderBy: { verifiedAt: "desc" },
    take: 8,
  });
  return serialize(data);
}

export async function getPendingWeavers() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  return db.weaver.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function verifyWeaver(weaverId: string, status: "VERIFIED" | "REJECTED") {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const updated = await db.weaver.update({
    where: { id: weaverId },
    data: {
      status,
      verifiedAt: status === "VERIFIED" ? new Date() : null,
    },
  });

  revalidatePath("/admin/weavers");
  revalidatePath("/weaver");
  return updated;
}
