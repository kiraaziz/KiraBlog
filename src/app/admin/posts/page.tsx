import Link from "next/link";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

const PAGE_SIZE = 25;

function getPageParam(searchParams: { [key: string]: string | string[] | undefined }): number {
  const page = searchParams?.page;
  if (!page) return 1;
  if (Array.isArray(page)) return parseInt(page[0] || "1", 10) || 1;
  return parseInt(page, 10) || 1;
}

export default async function AdminPostsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } } = {}) {
  const page = getPageParam(searchParams || {});
  const skip = (page - 1) * PAGE_SIZE;

  const totalPosts = await db.post.count();
  const totalPages = Math.ceil(totalPosts / PAGE_SIZE);

  if (page < 1 || (totalPages > 0 && page > totalPages)) {
    redirect(`/admin/posts?page=1`);
  }

  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take: PAGE_SIZE,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link href="/admin/posts/new" className="rounded bg-primary px-3 py-1 text-white">New Post</Link>
      </div>
      <div className="overflow-hidden rounded border bg-white">
        {posts.length === 0 ? (
          <div className="p-6 text-center text-neutral-500">
            No posts yet. <Link href="/admin/posts/new" className="underline text-primary">Create your first post.</Link>
          </div>
        ) : (
          <>
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">Slug</th>
                  <th className="p-2">Published</th>
                  <th className="p-2">Scheduled</th>
                  <th className="p-2">Tags</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{p.title}</td>
                    <td className="p-2">{p.slug}</td>
                    <td className="p-2">{p.published ? "Yes" : "No"}</td>
                    <td className="p-2">{p.isScheduled ? p.publishDate?.toISOString() : "-"}</td>
                    <td className="p-2">{p.tags.join(", ")}</td>
                    <td className="p-2">
                      <Link href={`/admin/posts/${p.id}`} className="rounded border px-2 py-1">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4">
                <Link
                  href={`/admin/posts?page=${page - 1}`}
                  className={`px-3 py-1 rounded border ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                  aria-disabled={page <= 1}
                  tabIndex={page <= 1 ? -1 : 0}
                >
                  Previous
                </Link>
                <span className="px-2">
                  Page {page} of {totalPages}
                </span>
                <Link
                  href={`/admin/posts?page=${page + 1}`}
                  className={`px-3 py-1 rounded border ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                  aria-disabled={page >= totalPages}
                  tabIndex={page >= totalPages ? -1 : 0}
                >
                  Next
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
