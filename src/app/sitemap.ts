import { db } from "@/server/db"

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const posts = await db.post.findMany({
        where: {
            published: true,
            OR: [
                { isScheduled: false },
                {
                    isScheduled: true,
                    publishDate: {
                        lte: new Date()
                    }
                }
            ]
        },
        select: {
            slug: true,
            updatedAt: true,
            tags: true,
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })

    const allTags = posts.reduce((tags: string[], post) => {
        post.tags.forEach(tag => {
            if (!tags.includes(tag)) {
                tags.push(tag)
            }
        })
        return tags
    }, [])

    const sitemap  = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...posts.map((post) => ({
            url: `${baseUrl}/posts/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })),
        ...allTags.map((tag) => ({
            url: `${baseUrl}/tags/${encodeURIComponent(tag.toLocaleLowerCase())}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        })),
    ]
    return sitemap
}