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

export default async function AdminNewsletterPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } } = {}) {
  const page = getPageParam(searchParams || {});
  const skip = (page - 1) * PAGE_SIZE;

  const totalLetters = await db.letter.count();
  const totalPages = Math.ceil(totalLetters / PAGE_SIZE);

  if (page < 1 || (totalPages > 0 && page > totalPages)) {
    redirect(`/admin/newsletter?page=1`);
  }

  const letters = await db.letter.findMany({
    orderBy: { date: "desc" },
    skip,
    take: PAGE_SIZE,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Newsletter Subscribers</h1>
      </div>
      <div className="overflow-hidden rounded border bg-white">
        {letters.length === 0 ? (
          <div className="p-6 text-center text-neutral-500">
            No subscribers yet.
          </div>
        ) : (
          <>
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="p-2">Email</th>
                  <th className="p-2">Subscribed At</th>
                </tr>
              </thead>
              <tbody>
                {letters.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="p-2">{l.email}</td>
                    <td className="p-2">{new Date(l.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4">
                <Link
                  href={`/admin/newsletter?page=${page - 1}`}
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
                  href={`/admin/newsletter?page=${page + 1}`}
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
