"use server";
import { db } from "@/server/db";

export async function useGetAllSettings() {
  return await db.setting.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export async function useUpsertSetting(formData: FormData) {
  const key = String(formData.get("key") ?? "").trim();
  const value = String(formData.get("value") ?? "");
  if (!key) throw new Error("Name is required");

  await db.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function useDeleteSetting(formData: FormData) {
  const idRaw = formData.get("id");
  const id = Number(idRaw);
  if (!id) throw new Error("Invalid id");

  await db.setting.delete({ where: { id } });
}
