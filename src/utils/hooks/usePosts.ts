"use server";

import { db } from "@/server/db";
import slugify from "slugify";

function randomString(length = 5) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; ++i) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function ensureUniqueSlug(baseTitle: string): Promise<string> {
  const base = slugify(baseTitle, { lower: true, strict: true }) || "post";
  let candidate = base;
  let exists = await db.post.findUnique({ where: { slug: candidate } });
  if (!exists) return candidate;

  while (true) {
    const rand = randomString(5);
    candidate = `${base}-${rand}`;
    exists = await db.post.findUnique({ where: { slug: candidate } });
    if (!exists) return candidate;
  }
}

export type CreatePostInput = {
  title: string;
  excerpt: string;
  content: string;
  bannerUrl?: string | null;
  tags?: string[];
  published?: boolean;
  isScheduled?: boolean;
  publishDate?: string | null;  
};

export async function useCreatePost(data: CreatePostInput) {
  const title = data.title?.trim();
  if (!title) throw new Error("Title is required");
  const excerpt = (data.excerpt ?? "").trim();
  if (!excerpt) throw new Error("Excerpt is required");
  const content = (data.content ?? "").trim();
  if (!content) throw new Error("Content is required");

  const slug = await ensureUniqueSlug(title);
  const tagsArray = (data.tags ?? []).map((t) => t.trim()).filter(Boolean);

  const publishDate = data.publishDate ? new Date(data.publishDate) : null;
  const isScheduled = Boolean(data.isScheduled && publishDate);
  const published = Boolean(data.published) && !isScheduled;

  const created = await db.post.create({
    data: {
      slug,
      title,
      excerpt,
      content,
      bannerUrl: data.bannerUrl ?? null,
      tags: tagsArray,
      published,
      isScheduled,
      publishDate: isScheduled ? publishDate : null,
    },
  });
  return created;
}

export type UpdatePostInput = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  bannerUrl?: string | null;
  tags?: string[];
  published?: boolean;
  isScheduled?: boolean;
  publishDate?: string | null;
};

export async function useGetPostById(id: number) {
  const post = await db.post.findUnique({ where: { id } });
  return post;
}

export async function useUpdatePost(data: UpdatePostInput) {
  const { id } = data;
  if (!id) throw new Error("Post id is required");
  const title = data.title?.trim();
  if (!title) throw new Error("Title is required");
  const excerpt = (data.excerpt ?? "").trim();
  if (!excerpt) throw new Error("Excerpt is required");
  const content = (data.content ?? "").trim();
  if (!content) throw new Error("Content is required");

  const tagsArray = (data.tags ?? []).map((t) => t.trim()).filter(Boolean);
  const publishDate = data.publishDate ? new Date(data.publishDate) : null;
  const isScheduled = Boolean(data.isScheduled && publishDate);
  const published = Boolean(data.published) && !isScheduled;

  const updated = await db.post.update({
    where: { id },
    data: {
      title,
      excerpt,
      content,
      bannerUrl: data.bannerUrl ?? null,
      tags: tagsArray,
      published,
      isScheduled,
      publishDate: isScheduled ? publishDate : null,
    },
  });
  return updated;
}

export async function useDeletePost(id: number) {
  if (!id) throw new Error("Post id is required");
  const deleted = await db.post.delete({ where: { id } });
  return deleted;
}
 
export async function incrementPostTotalTimeRead(id: number, seconds: number) {
  if (!id) throw new Error("Post id is required");
  if (typeof seconds !== "number" || seconds <= 0) throw new Error("Seconds must be a positive number");

  const updated = await db.post.update({
    where: { id },
    data: {
      watchTime: {
        increment: seconds,
      },
    },
  });
  return updated;
}
