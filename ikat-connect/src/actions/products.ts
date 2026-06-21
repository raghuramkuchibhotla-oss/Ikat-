"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ProductCategory } from "@/generated/prisma";

function serialize(v: unknown) { return JSON.parse(JSON.stringify(v)); }

export async function createProduct(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const weaver = await db.weaver.findFirst({
    where: { userId: session.id, status: "VERIFIED" },
  });
  if (!weaver) throw new Error("Not a verified weaver");

  const title = (formData.get("title") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim();
  const priceRaw = formData.get("price");
  const stockRaw = formData.get("stock");
  const category = formData.get("category") as ProductCategory | null;

  if (!title) throw new Error("Product title is required");
  if (!description) throw new Error("Product description is required");
  if (!category) throw new Error("Category is required");

  const price = Number(priceRaw);
  const stock = Number(stockRaw);
  if (!priceRaw || isNaN(price) || price <= 0) throw new Error("A valid price greater than 0 is required");
  if (stockRaw === null || isNaN(stock) || stock < 0) throw new Error("Stock quantity must be 0 or more");

  const imageFiles = formData.getAll("images") as File[];
  let imageUrls: string[] = [];
  if (imageFiles.length > 0 && imageFiles[0].size > 0) {
    try {
      imageUrls = await Promise.all(imageFiles.map((f) => uploadToCloudinary(f, "products")));
    } catch {
      throw new Error("Image upload failed. Please try again.");
    }
  }

  const count = await db.product.count();
  const productCode = `POC-IKAT-${String(count + 1).padStart(4, "0")}`;

  const product = await db.product.create({
    data: {
      productCode,
      title,
      description,
      price,
      stock,
      category,
      images: imageUrls,
      weaverId: weaver.id,
    },
  });

  revalidatePath("/weaver/products");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  return serialize(product);
}

export async function getProducts(category?: ProductCategory) {
  const data = await db.product.findMany({
    where: {
      isActive: true,
      weaver: { status: "VERIFIED" },
      ...(category ? { category } : {}),
    },
    include: { weaver: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  return serialize(data);
}

export async function getProductById(id: string) {
  const data = await db.product.findUnique({
    where: { id },
    include: { weaver: { include: { user: true } } },
  });
  return serialize(data);
}

export async function getProductByCode(productCode: string) {
  const data = await db.product.findUnique({
    where: { productCode },
    include: { weaver: { include: { user: true } } },
  });
  return serialize(data);
}

export async function getWeaverProducts() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const weaver = await db.weaver.findFirst({ where: { userId: session.id } });
  if (!weaver) return [];

  const data = await db.product.findMany({
    where: { weaverId: weaver.id },
    orderBy: { createdAt: "desc" },
  });
  return serialize(data);
}

export async function toggleProductActive(productId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const product = await db.product.findUnique({
    where: { id: productId },
    include: { weaver: { include: { user: true } } },
  });
  if (!product) throw new Error("Product not found");
  if (product.weaver.userId !== session.id && session.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const updated = await db.product.update({
    where: { id: productId },
    data: { isActive: !product.isActive },
  });

  revalidatePath("/weaver/products");
  return serialize(updated);
}
