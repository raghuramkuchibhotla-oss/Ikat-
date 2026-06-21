"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

function serialize(v: unknown) { return JSON.parse(JSON.stringify(v)); }

export async function submitYarnRequest(data: {
  yarnType: string;
  quantityKg: number;
  notes?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const weaver = await db.weaver.findFirst({
    where: { userId: session.id, status: "VERIFIED" },
  });
  if (!weaver) throw new Error("Not a verified weaver");

  const request = await db.yarnRequest.create({
    data: {
      yarnType: data.yarnType,
      quantityKg: data.quantityKg,
      notes: data.notes,
      weaverId: weaver.id,
    },
  });

  revalidatePath("/weaver/yarn-board");
  revalidatePath("/admin/yarn-board");
  return serialize(request);
}

export async function getYarnRequests() {
  const data = await db.yarnRequest.findMany({
    where: { status: "OPEN" },
    include: { weaver: { include: { user: true } } },
    orderBy: { yarnType: "asc" },
  });
  return serialize(data);
}

export async function getAllYarnRequests() {
  const data = await db.yarnRequest.findMany({
    include: { weaver: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  return serialize(data);
}

export async function getMyYarnRequests() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const weaver = await db.weaver.findFirst({ where: { userId: session.id } });
  if (!weaver) return [];

  const data = await db.yarnRequest.findMany({
    where: { weaverId: weaver.id },
    orderBy: { createdAt: "desc" },
  });
  return serialize(data);
}

export async function poolYarnRequests(yarnType: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const updated = await db.yarnRequest.updateMany({
    where: { yarnType, status: "OPEN" },
    data: { status: "POOLED" },
  });

  revalidatePath("/admin/yarn-board");
  revalidatePath("/weaver/yarn-board");
  return updated;
}

export async function updateYarnRequestStatus(
  requestId: string,
  status: "OPEN" | "POOLED" | "ORDERED" | "DELIVERED"
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const updated = await db.yarnRequest.update({
    where: { id: requestId },
    data: { status },
  });

  revalidatePath("/admin/yarn-board");
  revalidatePath("/weaver/yarn-board");
  return updated;
}
