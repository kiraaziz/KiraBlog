"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useCreatePost } from "@/utils/hooks/usePosts";
import dynamic from "next/dynamic";
const MDeditor = dynamic(() => import("@/components/Settings/MDeditor"), { ssr: false });

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for checkboxes and publish date
  const [published, setPublished] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [publishDate, setPublishDate] = useState<string>("");

  const [content, setContent] = useState<string>("");

  // Refs for form fields
  const titleRef = useRef<HTMLInputElement>(null);
  const bannerUrlRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);
  const excerptRef = useRef<HTMLTextAreaElement>(null);

  const handleCreate = async () => {
    const title = titleRef.current?.value ?? "";
    const excerpt = excerptRef.current?.value ?? "";
    const contentValue = content;
    const bannerUrl = bannerUrlRef.current?.value.trim() || undefined;
    const tags = (tagsRef.current?.value ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Validation: must select at least one, and if scheduled, publishDate is required
    if (!published && !isScheduled) {
      setError("You must select at least 'Publish now' or 'Schedule'.");
      return;
    }
    if (isScheduled && !publishDate) {
      setError("Publish date is required when scheduling.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const created = await useCreatePost({
        title,
        excerpt,
        content: contentValue,
        bannerUrl,
        tags,
        published: published && !isScheduled,
        isScheduled,
        publishDate: isScheduled ? publishDate : null,
      });
      router.push(`/blog/${created.slug}`);
    } catch (err: any) {
      setError(err?.message ?? "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setPublished(checked);
    if (checked) {
      setIsScheduled(false);
      setPublishDate("");
    }
  };

  const handleIsScheduledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsScheduled(checked);
    if (checked) {
      setPublished(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New Post</h1>
      <form className="space-y-4" autoComplete="off">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm" htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              className="w-full rounded border px-3 py-2"
              required
              ref={titleRef}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm" htmlFor="bannerUrl">Banner URL</label>
            <input
              id="bannerUrl"
              name="bannerUrl"
              className="w-full rounded border px-3 py-2"
              ref={bannerUrlRef}
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm" htmlFor="tags">Tags (comma separated)</label>
          <input
            id="tags"
            name="tags"
            className="w-full rounded border px-3 py-2"
            placeholder="nextjs, prisma, tutorial"
            ref={tagsRef}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm" htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            className="w-full rounded border px-3 py-2"
            required
            ref={excerptRef}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm" htmlFor="content">Content (Markdown)</label>
          <MDeditor value={content} onChange={(e: any) => setContent(e)} />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <label className="flex items-center gap-2">
            <input
              id="published"
              name="published"
              type="checkbox"
              checked={published}
              onChange={handlePublishedChange}
            />
            <span>Publish now</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              id="isScheduled"
              name="isScheduled"
              type="checkbox"
              checked={isScheduled}
              onChange={handleIsScheduledChange}
            />
            <span>Schedule</span>
          </label>
        </div>
        {isScheduled && <div>
          <label className="text-sm" htmlFor="publishDate">Publish date</label>
          <input
            id="publishDate"
            name="publishDate"
            type="datetime-local"
            className="w-full rounded border px-3 py-2"
            value={publishDate}
            onChange={e => setPublishDate(e.target.value)}
            required={isScheduled}
            disabled={!isScheduled}
          />
        </div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          type="button"
          disabled={loading}
          className="rounded bg-primary px-3 py-2 text-white disabled:opacity-60"
          onClick={handleCreate}
        >
          {loading ? "Creating…" : "Create"}
        </button>
      </form>
    </div>
  );
}
