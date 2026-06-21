"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, clearSession } from "@/lib/session";
import { redirect } from "next/navigation";
import type { Role } from "@/generated/prisma";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "WEAVER";
}) {
  const existing = await db.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) throw new Error("Email already registered. Please sign in.");

  const hashed = await bcrypt.hash(data.password, 12);
  const user = await db.user.create({
    data: {
      name: data.name.trim(),
      email: data.email.toLowerCase(),
      password: hashed,
      role: (data.role ?? "CUSTOMER") as Role,
    },
  });

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "CUSTOMER" | "WEAVER" | "ADMIN",
  });

  return { success: true, role: user.role };
}

export async function loginUser(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) throw new Error("Invalid email or password");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password");

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "CUSTOMER" | "WEAVER" | "ADMIN",
  });

  return { success: true, role: user.role };
}

export async function logoutUser() {
  await clearSession();
  redirect("/sign-in");
}
