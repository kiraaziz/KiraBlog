import { db } from "@/server/db"
import Link from "next/link"
import PostTimer from "@/components/PostTimer"
import MarkdownRenderer from "@/components/MarkdownRender"
import NewLetter from "@/components/Newletter"

interface BlogPageProps {
    params: { slug: string }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<any> {
    const post = await db.post.findUnique({
        where: { slug: params.slug },
        select: { title: true, excerpt: true }
    })
    if (!post) {
        return {
            title: "Blog Post Not Found",
        }
    }
    return {
        title: `Kira Blog - ${post.title}`,
        description: post.excerpt,
    }
}

function formatWatchTime(seconds: number): string {
    if (!seconds || seconds <= 0) return ""
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    const parts = []
    if (h > 0) parts.push(`${h} h`)
    if (m > 0) parts.push(`${m} min`)
    if (s > 0) parts.push(`${s} second`)
    return parts.join(" ")
}

export default async function BlogPage({ params }: BlogPageProps) {
    const post = await db.post.findUnique({
        where: { slug: params.slug },
    })

    if (!post || !post.published) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <h1 className="text-5xl font-bold mb-4 text-destructive">404</h1>
                <p className="text-lg mb-6 text-muted-foreground">Sorry, this blog post was not found or is not published.</p>
                <Link
                    href="/"
                    className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition"
                >
                    Back to Blog
                </Link>
            </div>
        )
    }

    await db.post.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
    })

    const updatedPost = await db.post.findUnique({
        where: { id: post.id },
    })

    const displayPost = updatedPost ?? post

    let spotLightPosts: any[] = []

    if (Array.isArray(displayPost.tags) && displayPost.tags.length > 0) {
        spotLightPosts = await db.post.findMany({
            where: {
                published: true,
                id: { not: displayPost.id },
                tags: {
                    hasSome: displayPost.tags,
                },
                bannerUrl: {
                    not: null
                }
            },
            orderBy: { createdAt: "desc" },
            take: 4,
        })
    }

    if (spotLightPosts.length < 4) {
        const alreadyIds = [displayPost.id, ...spotLightPosts.map(p => p.id)]
        const fillPosts = await db.post.findMany({
            where: {
                published: true,
                id: { notIn: alreadyIds },
                bannerUrl: {
                    not: null
                }
            },
            orderBy: { createdAt: "desc" },
            take: 4 - spotLightPosts.length,
        })
        spotLightPosts = [...spotLightPosts, ...fillPosts]
    }


    function truncateText(text: string, maxSize: number): string {
        if (text.length <= maxSize) return text
        return text.slice(0, maxSize) + "..."
    }

    return (
        <div className="flex w-full mx-auto lg:flex-row flex-col lg:justify-center gap-5 lg:gap-10">
            <article className="max-w-3xl py-10 px-4 text-foreground transition-colors duration-300">
                <PostTimer postId={displayPost.id} />
                {displayPost.bannerUrl && (
                    <div className="mb-6">
                        <img
                            src={displayPost.bannerUrl}
                            alt={displayPost.title}
                            width={900}
                            height={400}
                            className="rounded-lg w-full object-cover max-h-80"
                        />
                    </div>
                )}
                <h1 className="text-2xl lg:text-4xl font-bold mb-2 text-foreground">
                    <span className="text-primary mr-4">#{displayPost.id}</span>
                    {displayPost.title}</h1>
                <div className="text-muted-foreground text-sm mb-6 flex flex-wrap gap-4 items-center">
                    <span>
                        {displayPost.publishDate
                            ? new Date(displayPost.publishDate).toLocaleDateString()
                            : new Date(displayPost.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{displayPost.views} views</span>
                    {displayPost.watchTime > 0 && <span>•</span>}
                    <span>
                        {displayPost.watchTime > 0
                            ? formatWatchTime(displayPost.watchTime)
                            : ""}
                    </span>
                    {displayPost.tags.length > 0 && (
                        <>
                            <span>•</span>
                            <span className="flex gap-2 flex-wrap">
                                {displayPost.tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/tag/${encodeURIComponent(tag)}`}
                                        className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-xs hover:underline"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </span>
                        </>
                    )}
                </div>
                <div
                    className="hidden"
                    dangerouslySetInnerHTML={{ __html: displayPost.content }}
                />
                <MarkdownRenderer markdown={displayPost.content} />
            </article>
            <div className="w-full lg:max-w-lg px-4 py-10 sticky">
                <h1 className="text-3xl  font-comic mb-4">Newsletter</h1>
                <NewLetter />
                <div className="pt-6 mb-6 border-b w-full" />
                <h1 className="text-3xl  font-comic mb-6">spotlights</h1>
                <div className="flex flex-col gap-6">
                    {spotLightPosts.length === 0 && (
                        <div className="text-muted-foreground">No related posts found.</div>
                    )}
                    {spotLightPosts.map((spot) => (
                        <Link
                            key={spot.id}
                            href={`/blog/${encodeURIComponent(spot.slug)}`}
                            className="flex gap-5 border-b pb-5">
                            <div>
                                <div className="text-xs text-muted-foreground mb-2">
                                    {spot.publishDate
                                        ? new Date(spot.publishDate).toLocaleDateString()
                                        : new Date(spot.createdAt).toLocaleDateString()}
                                </div>
                                {spot.tags && spot.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {spot.tags.map((tag: string) => (
                                            <Link
                                                key={tag}
                                                href={`/tag/${encodeURIComponent(tag)}`}
                                                className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-xs hover:underline"
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                <div className="font-semibold text-lg mb-1">{truncateText(spot.title, 50)}</div>
                                <div className="text-sm mt-2 line-clamp-2 text-foreground/60">{truncateText(spot.excerpt, 80)}</div>
                            </div>
                            {spot.bannerUrl && (
                                <img
                                    src={spot.bannerUrl}
                                    alt={spot.title}
                                    className="lg:block hidden w-40 h-32 object-cover object-left-top rounded mb-3"
                                />
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
