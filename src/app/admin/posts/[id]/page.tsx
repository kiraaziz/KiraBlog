"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDeletePost, useGetPostById, useUpdatePost } from "@/utils/hooks/usePosts";
import MDeditor from "@/components/Settings/MDeditor";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [tags, setTags] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [publishDate, setPublishDate] = useState<string>("");
  const [slug, setSlug] = useState("")

  useEffect(() => {
    (async () => {
      try {
        const post = await useGetPostById(id);
        if (!post) {
          router.replace("/admin/posts");
          return;
        }
        setTitle(post.title);
        setBannerUrl(post.bannerUrl ?? "");
        setTags(post.tags.join(", "));
        setExcerpt(post.excerpt);
        setContent(post.content);
        setPublished(post.published);
        setIsScheduled(post.isScheduled);
        setSlug(post.slug)
        setPublishDate(post.publishDate ? new Date(post.publishDate).toISOString().slice(0, 16) : "");
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await useUpdatePost({
        id,
        title,
        excerpt,
        content,
        bannerUrl: bannerUrl || null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        published: published && !isScheduled,
        isScheduled,
        publishDate: isScheduled ? publishDate : null,
      });
      router.push("/admin/posts");
    } catch (err: any) {
      setError(err?.message ?? "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this post?")) return;
    await useDeletePost(id);
    router.push("/admin/posts");
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold">Edit Post</h1>
        {slug && (
          <a
            href={`/blog/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline hover:text-primary/80"
          >
            Preview
          </a>
        )}
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm" htmlFor="title">Title</label>
            <input id="title" className="w-full rounded border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-sm" htmlFor="bannerUrl">Banner URL</label>
            <input id="bannerUrl" className="w-full rounded border px-3 py-2" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm" htmlFor="tags">Tags (comma separated)</label>
          <input id="tags" className="w-full rounded border px-3 py-2" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm" htmlFor="excerpt">Excerpt</label>
          <textarea id="excerpt" rows={3} className="w-full rounded border px-3 py-2" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <label className="text-sm" htmlFor="content">Content (Markdown)</label>
          <MDeditor value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={published} onChange={(e) => {
              setPublished(e.target.checked);
              if (e.target.checked) {
                setIsScheduled(false);
                setPublishDate("");
              }
            }} />
            <span>Publish now</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isScheduled} onChange={(e) => {
              setIsScheduled(e.target.checked);
              if (e.target.checked) setPublished(false);
            }} />
            <span>Schedule</span>
          </label>
        </div>
        {isScheduled && (
          <div>
            <label className="text-sm" htmlFor="publishDate">Publish date</label>
            <input id="publishDate" type="datetime-local" className="w-full rounded border px-3 py-2" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} required={isScheduled} />
          </div>
        )}
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="rounded bg-primary px-3 py-2 text-white disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
          <button type="button" onClick={onDelete} className="rounded border border-red-600 px-3 py-2 text-red-600">Delete</button>
        </div>
      </form>
    </div>
  );
}


