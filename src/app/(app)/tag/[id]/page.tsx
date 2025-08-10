import { db } from "@/server/db"
import Link from "next/link"

export async function generateMetadata({ params }: any): Promise<any> {
  try {
    const tagId = decodeURIComponent(params.id)
    const totalPost = await db.post.count({
      where: {
        bannerUrl: { not: null },
        tags: { hasSome: [tagId] }
      }
    })
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    return {
      title: `Posts tagged with "${tagId}"`,
      description: totalPost > 0
        ? `Browse ${totalPost} blog post${totalPost > 1 ? "s" : ""} tagged with "${tagId}".`
        : `No blog posts found for the tag "${tagId}".`,
      alternates: {
        canonical: `${baseUrl}/tag/${encodeURIComponent(tagId)}`
      },
      openGraph: {
        title: `Posts tagged with "${tagId}"`,
        description: totalPost > 0
          ? `Browse ${totalPost} blog post${totalPost > 1 ? "s" : ""} tagged with "${tagId}".`
          : `No blog posts found for the tag "${tagId}".`,
        url: `${baseUrl}/tag/${encodeURIComponent(tagId)}`,
        type: "website"
      }
    }
  } catch (error) {
    console.error("Error generating tag metadata:", error)
    const tagId = params?.id ? decodeURIComponent(params.id) : "unknown"
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    return {
      title: `Posts tagged with "${tagId}"`,
      description: `No blog posts found for the tag "${tagId}".`,
      alternates: {
        canonical: `${baseUrl}/tag/${encodeURIComponent(tagId)}`
      },
      openGraph: {
        title: `Posts tagged with "${tagId}"`,
        description: `No blog posts found for the tag "${tagId}".`,
        url: `${baseUrl}/tag/${encodeURIComponent(tagId)}`,
        type: "website"
      }
    }
  }
}

const Page = async ({ params, searchParams }: any) => {
  const tagId = decodeURIComponent(params.id)
  const currentPage = parseInt(searchParams.page || '1')
  const postsPerPage = 20
  const skip = (currentPage - 1) * postsPerPage

  const where = {
    where: {
      bannerUrl: {
        not: null,
      },
      tags: {
        hasSome: [tagId]
      }
    }
  }

  const totalPost = await db.post.count({ ...where })
  const totalPages = Math.ceil(totalPost / postsPerPage)
  const posts = await db.post.findMany({
    ...where,
    take: postsPerPage,
    skip: skip,
    orderBy: {
      createdAt: 'desc'
    }
  })


  const dateTransformer = (publishDate: any) => new Date(publishDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  function truncateText(text: string, maxSize: number): string {
    if (text.length <= maxSize) return text
    return text.slice(0, maxSize) + "..."
  }

  return (
    <>
      <div className="w-full max-w-6xl lg:mx-auto my-10 px-5">
        {posts.length > 0 && <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Posts tagged with "<span className="capitalize">{tagId}</span>"</h1>
          <p className="text-muted-foreground">
            Showing {currentPage} of {totalPages} pages
          </p>
        </div>}

        {posts.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={post.bannerUrl || ""}
                  alt={post.title}
                  className="object-cover object-top-left h-max lg:h-44 w-full"
                />
                <div className="w-full lg:border-l-2 border-primary h-full bg-secondary/30">
                  <div className="flex flex-col p-5">
                    <div className="flex flex-wrap gap-2 my-2">
                      {post.tags?.slice(0, 3).map((tag: string) => (
                        <Link
                          key={tag}
                          href={`/tag/${tag}`}
                          className="bg-accent/30 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium hover:bg-accent/50 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                    <h2 className="text-2xl font-bold">{truncateText(post.title, 35)}</h2>
                    <p className="text-foreground/60 text-base">{truncateText(post.excerpt, 60)}</p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <span>
                        {dateTransformer(post.createdAt)}
                      </span>
                      <span>• {post.views} views</span>
                      <span>• {post.watchTime} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold mb-2">No posts found</h2>
            <p className="text-muted-foreground">
              No posts were found with the tag "{tagId}"
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Back to Home
            </Link>
          </div>
        )}

        <Pagination totalPages={totalPages} currentPage={currentPage} tagId={tagId} />
      </div>
    </>
  )
}

const Pagination = ({ totalPages, currentPage, tagId }: any) => {
  if (totalPages <= 1) return null

  const pages = []
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
      {currentPage > 1 && (
        <Link
          href={`/tag/${tagId}?page=${currentPage - 1}`}
          className="px-3 py-2 text-sm border rounded-md hover:bg-secondary"
        >
          Previous
        </Link>
      )}

      {startPage > 1 && (
        <>
          <Link
            href={`/tag/${tagId}?page=1`}
            className="px-3 py-2 text-sm border rounded-md hover:bg-secondary"
          >
            1
          </Link>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map(page => (
        <Link
          key={page}
          href={`/tag/${tagId}?page=${page}`}
          className={`px-3 py-2 text-sm border rounded-md hover:bg-secondary ${page === currentPage ? 'bg-primary text-primary-foreground' : ''
            }`}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Link
            href={`/tag/${tagId}?page=${totalPages}`}
            className="px-3 py-2 text-sm border rounded-md hover:bg-secondary"
          >
            {totalPages}
          </Link>
        </>
      )}

      {currentPage < totalPages && (
        <Link
          href={`/tag/${tagId}?page=${currentPage + 1}`}
          className="px-3 py-2 text-sm border rounded-md hover:bg-secondary"
        >
          Next
        </Link>
      )}
    </div>
  )
}

export default Page
